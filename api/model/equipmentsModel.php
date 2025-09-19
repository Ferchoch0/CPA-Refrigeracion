<?php
class EquipmentsModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function addEquipments($clientId, $typeEquipId, $placement)
    {
        // Obtener la inicial del tipo de equipo
        $sqlInitial = "SELECT initial FROM type_equipments WHERE type_equip_id = ?";
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

        // Obtener el último número del code para este tipo
        $sqlLastCode = "SELECT code FROM equipments WHERE type_equip_id = ? ORDER BY equipment_id DESC LIMIT 1";
        $stmtLastCode = $this->conn->prepare($sqlLastCode);
        $stmtLastCode->bind_param("i", $typeEquipId);
        $stmtLastCode->execute();
        $result = $stmtLastCode->get_result();
        $lastEquipment = $result->fetch_assoc();
        $stmtLastCode->close();

        $nextNumber = 1; // por defecto si no hay equipos
        if ($lastEquipment) {
            preg_match('/\d+$/', $lastEquipment['code'], $matches);
            if (!empty($matches)) {
                $nextNumber = intval($matches[0]) + 1;
            }
        }

        // Generar el nuevo código (ej: "A001")
        $newCode = $initial . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);

        // Insertar el nuevo equipo
        $sqlInsert = "INSERT INTO equipments (client_id, type_equip_id, placement, code) VALUES (?, ?, ?, ?)";
        $stmtInsert = $this->conn->prepare($sqlInsert);
        $stmtInsert->bind_param("iiss", $clientId, $typeEquipId, $placement, $newCode);

        if ($stmtInsert->execute()) {
            $newId = $stmtInsert->insert_id;
            $stmtInsert->close();
            return [
                'success' => true,
                'equipment_id' => $newId,
                'code' => $newCode
            ];
        } else {
            $error = $stmtInsert->error;
            $stmtInsert->close();
            return ['error' => 'ERR_DB_INSERT', 'details' => $error];
        }
    }


    public function getEquipmentsByClientId($clientId)
    {
        $sql = "
            SELECT 
                e.equipment_id,
                e.client_id,
                e.type_equip_id,
                e.status,
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

    public function getQuestionsCategory()
    {
        $sql = "SELECT * FROM fields_category";
        $stmt = $this->conn->prepare($sql);
        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($data)) {
                return ['error' => 'ERR_CATEGORY_NOT_FOUND'];
            }
            return $data;
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

            // Insertar acción en historial (una sola vez)
            $action = "Llenado de formulario";
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


    public function saveImage($equipmentId, $fileUrl)
    {
        $sql = "INSERT INTO images (equipment_id, name) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("is", $equipmentId, $fileUrl);
            if ($stmt->execute()) {
                $stmt->close();
                return ['success' => true];
            } else {
                $stmt->close();
                return ['success' => false, 'error' => 'ERR_DB_INSERT'];
            }
        } else {
            return ['success' => false, 'error' => 'ERR_DB_CONN'];
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

                // Agregar las opciones al resultado
                $question['options'] = $options;
            }

            return $question;
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function updateQuestions($fieldId, $name, $type, $description, $options = "", $user_id = null)
    {
        try {
            if (empty($fieldId) || empty($name) || empty($type) || !$user_id) {
                return ['error' => 'ERR_MISSING_FIELDS'];
            }

            //Actualizar fields_equipment
            $sql = "UPDATE fields_equipment
                SET name = ?, fields_type = ?, description = ? 
                WHERE field_equip_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sssi", $name, $type, $description, $fieldId);

            if (!$stmt->execute()) {
                return ['error' => 'ERR_UPDATE_FAILED'];
            }
            $stmt->close();

            //Si es tipo select, actualizar opciones
            if ($type === "select") {
                // Borrar opciones antiguas
                $del = $this->conn->prepare("DELETE FROM field_options WHERE field_equip_id = ?");
                $del->bind_param("i", $fieldId);
                $del->execute();
                $del->close();

                // Insertar nuevas opciones
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

            // Insertar en auditoría
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

    public function addQuestions($fieldCategoryId, $name, $type, $description, $options = "", $user_id = null)
    {
        try {
            // Validación mínima
            if (empty($fieldCategoryId) || empty($name) || empty($type) || !$user_id) {
                return ['error' => 'ERR_MISSING_FIELDS'];
            }

            // Insertar en fields_equipment
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

            // Si el tipo es "select", insertar opciones
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

            // Insertar en auditoría
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


}
?>