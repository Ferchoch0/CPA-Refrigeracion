<?php
class EquipmentsModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function addEquipments($clientId, $typeEquipId)
    {
        // Obtener la inicial del tipo de equipo
        $sqlInitial = "SELECT initial, requires_unit FROM type_equipments WHERE type_equip_id = ?";
        $stmtInitial = $this->conn->prepare($sqlInitial);
        $stmtInitial->bind_param("i", $typeEquipId);
        $stmtInitial->execute();
        $result = $stmtInitial->get_result();
        $typeData = $result->fetch_assoc();
        $stmtInitial->close();

        if (!$typeData) {
            return ['error' => 'Tipo de equipo no encontrado'];
        }

        $initial = $typeData['initial'];
        $requiresUnit = intval($typeData['requires_unit']); // 1 = sí, 0 = no

        // Obtener el último número del code para este tipo
        $sqlLastCode = "SELECT code FROM equipments WHERE type_equip_id = ? ORDER BY equipment_id DESC LIMIT 1";
        $stmtLastCode = $this->conn->prepare($sqlLastCode);
        $stmtLastCode->bind_param("i", $typeEquipId);
        $stmtLastCode->execute();
        $result = $stmtLastCode->get_result();
        $lastEquipment = $result->fetch_assoc();
        $stmtLastCode->close();

        $nextNumber = 1;
        if ($lastEquipment) {
            preg_match('/\d+$/', $lastEquipment['code'], $matches);
            if (!empty($matches)) {
                $nextNumber = intval($matches[0]) + 1;
            }
        }

        // Generar nuevo código
        $newCode = $initial . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);

        $createdEquipments = [];

        if ($requiresUnit) {
            $placements = ['interior', 'exterior'];

            foreach ($placements as $placement) {
                $sqlInsert = "INSERT INTO equipments (client_id, type_equip_id, placement, code) VALUES (?, ?, ?, ?)";
                $stmtInsert = $this->conn->prepare($sqlInsert);
                $stmtInsert->bind_param("iiss", $clientId, $typeEquipId, $placement, $newCode);

                if ($stmtInsert->execute()) {
                    $createdEquipments[] = [
                        'equipment_id' => $stmtInsert->insert_id,
                        'placement' => $placement
                    ];
                } else {
                    $error = $stmtInsert->error;
                    $stmtInsert->close();
                    return ['error' => 'ERR_DB_INSERT', 'details' => $error];
                }
                $stmtInsert->close();
            }
        } else {
            // Un solo equipo
            $sqlInsert = "INSERT INTO equipments (client_id, type_equip_id, placement, code) VALUES (?, ?, NULL, ?)";
            $stmtInsert = $this->conn->prepare($sqlInsert);
            $stmtInsert->bind_param("iis", $clientId, $typeEquipId, $newCode);

            if ($stmtInsert->execute()) {
                $createdEquipments[] = [
                    'equipment_id' => $stmtInsert->insert_id,
                    'placement' => null
                ];
            } else {
                $error = $stmtInsert->error;
                $stmtInsert->close();
                return ['error' => 'ERR_DB_INSERT', 'details' => $error];
            }
            $stmtInsert->close();
        }

        return [
            'success' => true,
            'code' => $newCode,
            'equipments' => $createdEquipments
        ];
    }

    public function getEquipmentsByClientId($clientId)
    {
        $sql = "
            SELECT 
                e.equipment_id,
                e.client_id,
                e.type_equip_id,
                e.status,
                e.placement,
                te.name,
                e.code
            FROM equipments e
            INNER JOIN type_equipments te 
                ON e.type_equip_id = te.type_equip_id
            WHERE e.client_id = ?
        ";

        $stmt = $this->conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("i", $clientId);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($data)) {
                return ['error' => 'ERR_CLIENT_NOT_FOUND'];
            }
            return $data;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }

    public function getEquipmentsByClientCompleted($clientId)
    {
        $sql = "
        SELECT 
            e.equipment_id,
            e.client_id,
            c.company_name AS client_name,
            e.type_equip_id,
            e.status,
            e.code,
            e.placement,
            te.name AS type_name,
            u.name AS tecnico,
            eh.date AS ultima_intervencion,
            eh.action AS tipo_intervencion,
            q.field_equip_id AS pregunta_id,
            q.name AS pregunta_nombre,
            q.description AS pregunta_descripcion,
            a.answers_id,
            a.value AS respuesta_valor
        FROM equipments e
        INNER JOIN type_equipments te 
            ON e.type_equip_id = te.type_equip_id
        INNER JOIN clients c
            ON e.client_id = c.client_id
        LEFT JOIN (
            SELECT equipment_id, MAX(date) AS ultima_fecha
            FROM equipments_history
            GROUP BY equipment_id
        ) ult
            ON e.equipment_id = ult.equipment_id
        LEFT JOIN equipments_history eh
            ON e.equipment_id = eh.equipment_id 
            AND eh.date = ult.ultima_fecha
        LEFT JOIN users u
            ON eh.user_id = u.user_id
        LEFT JOIN fields_equipment q
            ON q.field_equip_id = 105
        LEFT JOIN answers a
            ON a.field_equip_id = q.field_equip_id
            AND a.equipments_id = e.equipment_id
        WHERE e.client_id = ?
    ";

        $stmt = $this->conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("i", $clientId);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($data)) {
                return ['error' => 'ERR_CLIENT_NOT_FOUND'];
            }
            return $data;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }

    public function getQuestionsCategory($equipmentId)
    {
        $sql = "
        SELECT 
            c.field_category_id,
            c.name,
            c.description,
            c.ord,
            COUNT(DISTINCT q.field_equip_id) AS questions_total,
            COUNT(DISTINCT a.field_equip_id) AS questions_answered
        FROM fields_category c
        INNER JOIN equipments e
            ON e.equipment_id = ?
        LEFT JOIN fields_equipment q
            ON q.field_category_id = c.field_category_id
        INNER JOIN data_equipments de
            ON de.type_fields = q.field_equip_id
           AND de.type_equip_id = e.type_equip_id
        LEFT JOIN answers a
            ON a.field_equip_id = q.field_equip_id
           AND a.equipments_id = e.equipment_id
        GROUP BY c.field_category_id
        ORDER BY c.ord ASC
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $equipmentId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        if (empty($result)) {
            return ['error' => 'ERR_CATEGORY_NOT_FOUND'];
        }
        return $result;
    }


    public function getAllQuestionsCategories()
    {
        $sql = "
        SELECT 
            c.field_category_id,
            c.name,
            c.description,
            c.ord,
            COUNT(DISTINCT q.field_equip_id) AS questions_total
        FROM fields_category c
        LEFT JOIN fields_equipment q
            ON q.field_category_id = c.field_category_id
        GROUP BY c.field_category_id
        ORDER BY c.ord ASC
    ";

        $result = $this->conn->query($sql);

        if (!$result) {
            return ['error' => 'ERR_DB_CONN'];
        }

        $rows = $result->fetch_all(MYSQLI_ASSOC);

        if (empty($rows)) {
            return ['error' => 'ERR_CATEGORY_NOT_FOUND'];
        }

        foreach ($rows as &$row) {
            $row['questions_answered'] = 0;
        }

        return $rows;
    }

    public function getAllQuestionsCategoriesWithAnswers($equipmentId)
    {
        $sql = "
        SELECT 
            c.field_category_id,
            c.name AS category_name,
            c.description AS category_description,
            c.ord,
            q.field_equip_id,
            q.name AS question_name,
            q.description AS question_description,
            a.answers_id,
            a.value AS answer_value
        FROM fields_category c
        LEFT JOIN fields_equipment q
            ON q.field_category_id = c.field_category_id
        LEFT JOIN answers a
            ON a.field_equip_id = q.field_equip_id
            AND a.equipments_id = ?
        GROUP BY c.field_category_id, q.field_equip_id, a.answers_id
        ORDER BY c.ord ASC, q.field_equip_id ASC
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $equipmentId);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!$result) {
            return ['error' => 'ERR_DB_CONN'];
        }

        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        if (empty($rows)) {
            return ['error' => 'ERR_CATEGORY_NOT_FOUND'];
        }

        // Agrupamos por categoría
        $categories = [];
        foreach ($rows as $row) {
            $catId = $row['field_category_id'];

            if (!isset($categories[$catId])) {
                $categories[$catId] = [
                    'field_category_id' => $catId,
                    'name' => $row['category_name'],
                    'description' => $row['category_description'],
                    'ord' => $row['ord'],
                    'questions' => []
                ];
            }

            if ($row['field_equip_id']) {
                $categories[$catId]['questions'][] = [
                    'field_equip_id' => $row['field_equip_id'],
                    'name' => $row['question_name'],
                    'description' => $row['question_description'],
                    'answer_id' => $row['answers_id'],
                    'answer_value' => $row['answer_value']
                ];
            }
        }

        return array_values($categories);
    }


    public function getByCode($code)
    {
        $sql = "
        SELECT 
            e.equipment_id,
            e.client_id,
            e.type_equip_id,
            t.name AS type_name,
            t.initial AS type_initial,
            e.code,
            e.status,
            e.placement,
            a.field_equip_id,
            a.value AS answer_value
        FROM equipments e
        INNER JOIN type_equipments t 
            ON e.type_equip_id = t.type_equip_id
        LEFT JOIN answers a 
            ON a.equipments_id = e.equipment_id
            AND a.field_equip_id IN (1,2,3,4,19,20,101,102,103,104,105)
        WHERE e.code = ?
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $code);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            return ['error' => 'ERR_EQUIP_NOT_FOUND'];
        }

        // Reestructuramos para que las respuestas queden en un array asociativo
        $row = null;
        $answers = [];
        while ($r = $result->fetch_assoc()) {
            if ($row === null) {
                $row = [
                    'equipment_id' => $r['equipment_id'],
                    'client_id' => $r['client_id'],
                    'type_equip_id' => $r['type_equip_id'],
                    'type_name' => $r['type_name'],
                    'type_initial' => $r['type_initial'],
                    'code' => $r['code'],
                    'status' => $r['status'],
                    'placement' => $r['placement'],
                    'answers' => []
                ];
            }
            if ($r['field_equip_id']) {
                $answers[$r['field_equip_id']] = $r['answer_value'];
            }
        }
        $row['answers'] = $answers;

        return $row;
    }


    public function getQuestionsByType($categoryId, $typeEquipId, $equipmentId = null)
    {
        $sql = "
        SELECT 
            fe.field_equip_id,
            fe.field_category_id,
            fe.name,
            fe.description,
            fe.fields_type,
            fo.option_id,
            fo.value AS option_value,
            fo.label AS option_label,
            de.mandatory
        FROM fields_equipment fe
        INNER JOIN data_equipments de
            ON de.type_fields = fe.field_equip_id
           AND de.type_equip_id = ?
        LEFT JOIN field_options fo
            ON fe.field_equip_id = fo.field_equip_id
        WHERE fe.field_category_id = ?
        ORDER BY fe.field_equip_id, fo.option_id
    ";

        $stmt = $this->conn->prepare($sql);
        if (!$stmt)
            return ['error' => 'ERR_DB_CONN'];

        $stmt->bind_param("ii", $typeEquipId, $categoryId);
        $stmt->execute();
        $result = $stmt->get_result();
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        if (empty($rows)) {
            return ['error' => 'ERR_NO_QUESTIONS_FOUND'];
        }

        // Armar preguntas
        $data = [];
        foreach ($rows as $row) {
            $fieldId = $row['field_equip_id'];
            if (!isset($data[$fieldId])) {
                $data[$fieldId] = [
                    'field_equip_id' => $row['field_equip_id'],
                    'field_category_id' => $row['field_category_id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'fields_type' => $row['fields_type'],
                    'mandatory' => (int) $row['mandatory'],
                    'options' => []
                ];
            }

            if (!empty($row['option_id'])) {
                $data[$fieldId]['options'][] = [
                    'option_id' => $row['option_id'],
                    'value' => $row['option_value'],
                    'label' => $row['option_label']
                ];
            }
        }

        // Si se pasa equipmentId, traer respuestas
        $answers = [];
        if ($equipmentId) {
            $sqlAns = "SELECT field_equip_id, value FROM answers WHERE equipments_id = ?";
            $stmtAns = $this->conn->prepare($sqlAns);
            $stmtAns->bind_param("i", $equipmentId);
            $stmtAns->execute();
            $resAns = $stmtAns->get_result();
            while ($row = $resAns->fetch_assoc()) {
                $answers[$row['field_equip_id']] = $row['value'];
            }
            $stmtAns->close();
        }

        return [
            'questions' => array_values($data),
            'answers' => $answers
        ];
    }

    public function getHistoryByEquipmentId($equipmentId)
    {
        $sql = "
        SELECT 
            h.history_equip_id,
            h.user_id,
            u.name AS user_name,
            h.equipment_id,
            h.action,
            h.date
        FROM equipments_history h
        LEFT JOIN users u ON u.user_id = h.user_id
        WHERE h.equipment_id = ?
        ORDER BY h.date DESC
    ";

        $stmt = $this->conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("i", $equipmentId);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($rows)) {
                return ['error' => 'ERR_HISTORY_NOT_FOUND'];
            }

            return $rows;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }


    public function getQuestionsByCategory($categoryId)
    {
        $sql = "
    SELECT 
        fe.field_equip_id,
        fe.field_category_id,
        fe.name,
        fe.description,
        fe.fields_type,
        fo.option_id,
        fo.value AS option_value,
        fo.label AS option_label
    FROM fields_equipment fe
    LEFT JOIN field_options fo
        ON fe.field_equip_id = fo.field_equip_id
    WHERE fe.field_category_id = ?
    ORDER BY fe.field_equip_id, fo.option_id
        ";
        $stmt = $this->conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("i", $categoryId);
            $stmt->execute();
            $result = $stmt->get_result();
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($rows)) {
                return ['error' => 'ERR_CATEGORY_NOT_FOUND'];
            }

            $data = [];
            foreach ($rows as $row) {
                $fieldId = $row['field_equip_id'];
                if (!isset($data[$fieldId])) {
                    $data[$fieldId] = [
                        'field_equip_id' => $row['field_equip_id'],
                        'field_category_id' => $row['field_category_id'],
                        'name' => $row['name'],
                        'description' => $row['description'],
                        'fields_type' => $row['fields_type'],
                        'options' => []
                    ];
                }

                if ($row['option_id']) {
                    $data[$fieldId]['options'][] = [
                        'option_id' => $row['option_id'],
                        'value' => $row['option_value'],
                        'label' => $row['option_label']
                    ];
                }
            }

            return array_values($data);

        } else {
            return ['error' => 'ERR_DB_CONN'];
        }

    }

    public function saveAnswers($equipmentId, $answers, $userId)
    {
        $this->conn->begin_transaction();

        try {
            // Guardar respuestas
            $sql = "INSERT INTO answers (equipments_id, field_equip_id, value) 
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE value = VALUES(value)";
            $stmt = $this->conn->prepare($sql);

            if (!$stmt) {
                throw new Exception("Error preparando consulta: " . $this->conn->error);
            }

            foreach ($answers as $fieldId => $value) {
                $stmt->bind_param("iis", $equipmentId, $fieldId, $value);
                $stmt->execute();
            }

            $stmt->close();

            // --- Obtener categoría del primer field ---
            $firstFieldId = array_key_first($answers);
            $categoryName = "Categoría desconocida";

            if ($firstFieldId) {
                $sqlCat = "SELECT c.name 
                       FROM fields_category c
                       JOIN fields_equipment f 
                         ON f.field_category_id = c.field_category_id
                       WHERE f.field_equip_id = ?";
                $stmtCat = $this->conn->prepare($sqlCat);
                $stmtCat->bind_param("i", $firstFieldId);
                $stmtCat->execute();
                $resultCat = $stmtCat->get_result();

                if ($row = $resultCat->fetch_assoc()) {
                    $categoryName = $row['name'];
                }

                $stmtCat->close();
            }

            // --- Insertar acción en historial ---
            $action = "Cargo " . count($answers) . " respuestas en la categoría: " . $categoryName;

            $sqlHist = "INSERT INTO equipments_history (user_id, equipment_id, action) 
                    VALUES (?, ?, ?)";
            $stmtHist = $this->conn->prepare($sqlHist);
            $stmtHist->bind_param("iis", $userId, $equipmentId, $action);
            $stmtHist->execute();
            $stmtHist->close();

            $this->conn->commit();

            return ['success' => true];

        } catch (Exception $e) {
            $this->conn->rollback();
            return ['error' => $e->getMessage()];
        }
    }



    public function getQuestionsById($id)
    {
        try {
            // Traer la pregunta
            $sql = "SELECT * FROM fields_equipment WHERE field_equip_id = ?";
            $stmt = $this->conn->prepare($sql);
            if (!$stmt) {
                return ['error' => 'ERR_DB_CONN'];
            }

            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $question = $result->fetch_assoc();
            $stmt->close();

            if (!$question) {
                return ['error' => 'ERR_QUESTION_NOT_FOUND'];
            }

            // Si es tipo select, traer opciones
            if ($question['fields_type'] === 'select') {
                $sqlOpts = "SELECT value, label FROM field_options WHERE field_equip_id = ?";
                $stmtOpts = $this->conn->prepare($sqlOpts);
                $stmtOpts->bind_param("i", $id);
                $stmtOpts->execute();
                $resOpts = $stmtOpts->get_result();
                $options = $resOpts->fetch_all(MYSQLI_ASSOC);
                $stmtOpts->close();

                $question['options'] = $options;
            } else {
                $question['options'] = [];
            }

            // Traer equipos asociados
            $sqlEq = "SELECT type_equip_id FROM data_equipments WHERE type_fields = ?";
            $stmtEq = $this->conn->prepare($sqlEq);
            $stmtEq->bind_param("i", $id);
            $stmtEq->execute();
            $resEq = $stmtEq->get_result();
            $equipTypes = [];
            while ($row = $resEq->fetch_assoc()) {
                $equipTypes[] = (int) $row['type_equip_id'];
            }
            $stmtEq->close();

            $question['equipTypes'] = $equipTypes;

            return $question;
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function updateQuestions($fieldId, $name, $type, $description, $options = "", $user_id = null, $equipTypes = [], $mandatory = 0)
    {
        try {
            if (empty($fieldId) || empty($name) || empty($type) || !$user_id) {
                return ['error' => 'ERR_MISSING_FIELDS'];
            }

            // 1. Actualizar fields_equipment
            $sql = "UPDATE fields_equipment
                SET name = ?, fields_type = ?, description = ? 
                WHERE field_equip_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sssi", $name, $type, $description, $fieldId);

            if (!$stmt->execute()) {
                return ['error' => 'ERR_UPDATE_FAILED'];
            }
            $stmt->close();

            // 2. Opciones si es SELECT
            if ($type === "select") {
                $del = $this->conn->prepare("DELETE FROM field_options WHERE field_equip_id = ?");
                $del->bind_param("i", $fieldId);
                $del->execute();
                $del->close();

                $optsArray = array_map('trim', explode(",", $options));
                $ins = $this->conn->prepare("INSERT INTO field_options (field_equip_id, value, label) VALUES (?, ?, ?)");
                foreach ($optsArray as $opt) {
                    $value = $opt;
                    $label = ucfirst($opt);
                    $ins->bind_param("iss", $fieldId, $value, $label);
                    $ins->execute();
                }
                $ins->close();
            }

            // 3. Actualizar data_equipments (asociación con tipos de equipos)
            // Borrar relaciones anteriores
            $del2 = $this->conn->prepare("DELETE FROM data_equipments WHERE type_fields = ?");
            $del2->bind_param("i", $fieldId);
            $del2->execute();
            $del2->close();

            // Insertar nuevas relaciones
            if (!empty($equipTypes)) {
                $ins2 = $this->conn->prepare("INSERT INTO data_equipments (type_equip_id, type_fields, mandatory) VALUES (?, ?, ?)");
                foreach ($equipTypes as $etId) {
                    $ins2->bind_param("iii", $etId, $fieldId, $mandatory);
                    $ins2->execute();
                }
                $ins2->close();
            }

            // 4. Insertar en auditoría
            $action = "Actualización de pregunta ID: " . $fieldId;
            $statusAction = "success";
            $stmt2 = $this->conn->prepare("
            INSERT INTO audit (user_id, action, status_action, date)
            VALUES (?, ?, ?, NOW())
        ");
            if ($stmt2) {
                $stmt2->bind_param("iss", $user_id, $action, $statusAction);
                $stmt2->execute();
                $stmt2->close();
            }

            return ['success' => true];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function updateStatus($equipment_id, $status)
    {
        $stmt = $this->conn->prepare("UPDATE equipments SET status = ? WHERE equipment_id = ?");
        $stmt->bind_param("si", $status, $equipment_id);

        if (!$stmt->execute()) {
            return ['error' => 'ERR_UPDATE_FAILED'];
        }
        $stmt->close();
        return ['success' => true];
    }

    public function addQuestions($fieldCategoryId, $name, $type, $description, $options = "", $user_id = null, $equipTypes = [], $mandatory = 0)
    {
        try {
            // Validación mínima
            if (empty($fieldCategoryId) || empty($name) || empty($type) || !$user_id) {
                return ['error' => 'ERR_MISSING_FIELDS'];
            }

            // 1. Insertar en fields_equipment
            $stmt = $this->conn->prepare("
            INSERT INTO fields_equipment (field_category_id, name, fields_type, description) 
            VALUES (?, ?, ?, ?)
        ");

            if (!$stmt) {
                return ['error' => 'ERR_DB_PREPARE'];
            }

            $stmt->bind_param("isss", $fieldCategoryId, $name, $type, $description);

            if (!$stmt->execute()) {
                $error = $stmt->error;
                $stmt->close();
                return ['error' => $error];
            }

            $insertedId = $this->conn->insert_id;
            $stmt->close();

            // 2. Si el tipo es "select", insertar opciones
            if ($type === "select" && !empty($options)) {
                $optsArray = array_map('trim', explode(",", $options));

                $ins = $this->conn->prepare("
                INSERT INTO field_options (field_equip_id, value, label) VALUES (?, ?, ?)
            ");

                foreach ($optsArray as $opt) {
                    $value = $opt;
                    $label = ucfirst($opt);
                    $ins->bind_param("iss", $insertedId, $value, $label);
                    $ins->execute();
                }

                $ins->close();
            }

            // 3. Insertar en data_equipments (asociación con equipos + mandatory)
            if (!empty($equipTypes)) {
                $ins2 = $this->conn->prepare("
                INSERT INTO data_equipments (type_equip_id, type_fields, mandatory) 
                VALUES (?, ?, ?)
            ");

                foreach ($equipTypes as $etId) {
                    $ins2->bind_param("iii", $etId, $insertedId, $mandatory);
                    $ins2->execute();
                }

                $ins2->close();
            }

            // 4. Insertar en auditoría
            $action = "Alta de pregunta: " . $name;
            $statusAction = "success";

            $stmt2 = $this->conn->prepare("
            INSERT INTO audit (user_id, action, status_action, date)
            VALUES (?, ?, ?, NOW())
        ");
            if ($stmt2) {
                $stmt2->bind_param("iss", $user_id, $action, $statusAction);
                $stmt2->execute();
                $stmt2->close();
            }

            return ['success' => true, 'id' => $insertedId];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function getEquipTypes()
    {
        $sql = "SELECT * FROM type_equipments ORDER BY name ASC";
        $result = $this->conn->query($sql);

        if (!$result) {
            return ["error" => "Error en la consulta: " . $this->conn->error];
        }

        $equipTypes = [];
        while ($row = $result->fetch_assoc()) {
            $equipTypes[] = $row;
        }

        return $equipTypes;
    }


}
?>