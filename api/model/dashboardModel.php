<?php
class DashboardModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getMetrics()
    {
        $metrics = [
            'clientsTotal' => 0,
            'techniciansActive' => 0,
            'formsTotal' => 0,
            'satisfactionRate' => 0,
            'avgResponseTime' => '0ms', // ← aquí guardaremos el tiempo total
            'resolutionRate' => 0
        ];

        // ===== MEDIR TIEMPO TOTAL DEL SERVIDOR =====
        $serverStart = microtime(true);

        // Total clientes
        $res = $this->conn->query("SELECT COUNT(*) as total FROM clients");
        if ($res && $row = $res->fetch_assoc())
            $metrics['clientsTotal'] = (int) $row['total'];

        // Técnicos activos
        $res = $this->conn->query("SELECT COUNT(*) as total FROM users WHERE status='disponible' AND rol_id=2");
        if ($res && $row = $res->fetch_assoc())
            $metrics['techniciansActive'] = (int) $row['total'];

        // Formularios totales (respuestas registradas)
        $res = $this->conn->query("SELECT COUNT(*) as total FROM answers");
        if ($res && $row = $res->fetch_assoc())
            $metrics['formsTotal'] = (int) $row['total'];

        // Satisfacción promedio
        $res = $this->conn->query("SELECT AVG(value) as avgScore FROM answers");
        if ($res && $row = $res->fetch_assoc())
            $metrics['satisfactionRate'] = round((float) $row['avgScore'], 1);

        // Resolution Rate (separado en su propia función)
        $metrics['resolutionRate'] = $this->calculateResolutionRate();

        // ===== FIN DE CONSULTAS =====
        $serverEnd = microtime(true);

        // Tiempo total de ejecución del método en ms
        $metrics['avgResponseTime'] = round(($serverEnd - $serverStart) * 1000, 2) . 'ms';

        return $metrics;
    }

    private function calculateResolutionRate()
    {
        // Total de preguntas definidas
        $res = $this->conn->query("SELECT COUNT(*) as total_fields FROM fields_equipment");
        $totalFields = ($res && $row = $res->fetch_assoc()) ? (int) $row['total_fields'] : 0;

        if ($totalFields === 0) {
            return 0;
        }

        // Respuestas agrupadas por formulario
        $res = $this->conn->query("
        SELECT equipments_id, COUNT(*) as answered
        FROM answers
        GROUP BY equipments_id
    ");

        $sumPercent = 0;
        $formCount = 0;

        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $completion = ($row['answered'] / $totalFields) * 100;
                $sumPercent += $completion;
                $formCount++;
            }
        }

        return $formCount > 0 ? round($sumPercent / $formCount, 1) : 0;
    }

    public function getRecentActivities($limit = 10)
    {
        $activities = [];

        $query = "
            (SELECT 
                'audit' as type,
                audit_id as id,
                user_id,
                action,
                date,
                status_action as status,
                NULL as equipment_id,
                CONCAT('Auditoría: ', action) as title,
                CASE 
                    WHEN action LIKE '%login%' THEN '👤'
                    WHEN action LIKE '%crear%' OR action LIKE '%nuevo%' THEN '📝'
                    WHEN action LIKE '%actualizar%' OR action LIKE '%modificar%' THEN '✏️'
                    WHEN action LIKE '%eliminar%' THEN '🗑️'
                    WHEN action LIKE '%completar%' THEN '✅'
                    WHEN action LIKE '%revisar%' THEN '🔍'
                    ELSE '📋'
                END as icon,
                CASE status_action
                    WHEN 'completado' THEN '#06d6a0'
                    WHEN 'en_progreso' THEN '#f8961e'
                    WHEN 'pendiente' THEN '#4cc9f0'
                    WHEN 'error' THEN '#f72585'
                    ELSE '#4361ee'
                END as color
            FROM audit 
            WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY))
            
            UNION ALL
            
            (SELECT 
                'equipment' as type,
                history_equip_id as id,
                user_id,
                action,
                date,
                NULL as status,
                equipment_id,
                CONCAT('Equipo: ', action) as title,
                CASE 
                    WHEN action LIKE '%instalar%' THEN '🔧'
                    WHEN action LIKE '%mantenimiento%' THEN '⚙️'
                    WHEN action LIKE '%reparar%' THEN '🛠️'
                    WHEN action LIKE '%revisar%' THEN '🔍'
                    WHEN action LIKE '%reemplazar%' THEN '🔄'
                    ELSE '❄️'
                END as icon,
                CASE 
                    WHEN action LIKE '%instalar%' THEN '#7209b7'
                    WHEN action LIKE '%mantenimiento%' THEN '#4cc9f0'
                    WHEN action LIKE '%reparar%' THEN '#f8961e'
                    WHEN action LIKE '%revisar%' THEN '#06d6a0'
                    ELSE '#4361ee'
                END as color
            FROM equipments_history 
            WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY))
            
            ORDER BY date DESC 
            LIMIT ?
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            // Obtener nombre de usuario
            $userName = $this->getUserName($row['user_id']);

            // Formatear descripción según el tipo
            if ($row['type'] === 'equipment') {
                $equipmentName = $this->getEquipmentName($row['equipment_id']);
                $description = $equipmentName ? "Equipo: " . $equipmentName : "Acción en equipo";
            } else {
                $description = "Usuario: " . $userName;
                if ($row['status']) {
                    $description .= " - Estado: " . $row['status'];
                }
            }

            // Formatear fecha relativa
            $relativeTime = $this->getRelativeTime($row['date']);

            $activities[] = [
                'id' => $row['id'],
                'type' => $row['type'],
                'icon' => $row['icon'],
                'title' => $row['title'],
                'description' => $description,
                'time' => $relativeTime,
                'color' => $row['color'],
                'fullDate' => $row['date']
            ];
        }

        return $activities;
    }
    private function getUserName($userId)
    {
        $stmt = $this->conn->prepare("SELECT name FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $row = $result->fetch_assoc()) {
            return $row['name'];
        }

        return "Usuario #" . $userId;
    }

    private function getEquipmentName($equipmentId)
    {
        if (!$equipmentId)
            return null;

        $stmt = $this->conn->prepare("SELECT name FROM equipments WHERE equipment_id = ?");
        $stmt->bind_param("i", $equipmentId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $row = $result->fetch_assoc()) {
            return $row['name'];
        }

        return "Equipo #" . $equipmentId;
    }

    private function getRelativeTime($date)
    {
        // Forzar zona horaria de Argentina
        $tz = new DateTimeZone('America/Argentina/Buenos_Aires');

        $now = new DateTime('now', $tz);
        $activityDate = new DateTime($date, $tz);

        $diff = $now->diff($activityDate);

        if ($diff->days > 7) {
            return $activityDate->format('d M');
        } elseif ($diff->days > 1) {
            return "Hace " . $diff->days . " días";
        } elseif ($diff->days == 1) {
            return "Ayer";
        } elseif ($diff->h > 1) {
            return "Hace " . $diff->h . " horas";
        } elseif ($diff->h == 1) {
            return "Hace 1 hora";
        } elseif ($diff->i > 1) {
            return "Hace " . $diff->i . " minutos";
        } else {
            return "Hace un momento";
        }
    }

    public function getWeeklyFormsData()
    {
        $formsData = [];

        $query = "
            SELECT 
                YEARWEEK(date, 1) as week_number,
                COUNT(*) as formularios,
                CONCAT('Semana ', WEEK(date)) as week_label
            FROM answers 
            WHERE date >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
            GROUP BY YEARWEEK(date, 1)
            ORDER BY week_number DESC
            LIMIT 4
        ";

        $result = $this->conn->query($query);

        while ($row = $result->fetch_assoc()) {
            $formsData[] = [
                'week' => $row['week_label'],
                'formularios' => (int) $row['formularios']
            ];
        }

        // Asegurar que siempre tengamos 4 semanas
        while (count($formsData) < 4) {
            $weekNumber = 4 - count($formsData);
            $formsData[] = [
                'week' => "Semana " . $weekNumber,
                'formularios' => 0
            ];
        }

        return array_reverse($formsData);
    }

    public function getCategoriesWithQuestionCount()
    {
        $categories = [];

        $query = "
            SELECT 
                fc.field_category_id as id,
                fc.name,
                fc.description,
                COUNT(fe.field_equip_id) as question_count
            FROM fields_category fc
            LEFT JOIN fields_equipment fe 
                ON fc.field_category_id = fe.field_category_id
            GROUP BY fc.field_category_id, fc.name, fc.description
            ORDER BY fc.ord ASC, fc.name ASC
        ";

        $result = $this->conn->query($query);

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $categories[] = [
                    'id' => (int) $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'count' => (int) $row['question_count'],
                    'order' => (int) $row['ord'] // Si necesitas el orden
                ];
            }
        }

        return $categories;
    }

    // Método para obtener estadísticas detalladas de categorías
    public function getCategoriesStats()
    {
        $stats = [];

        $query = "
            SELECT 
                fc.field_category_id,
                fc.name as category_name,
                fc.ord as category_order,
                COUNT(fe.field_equip_id) as total_questions,
                COUNT(DISTINCT fe.fields_type) as different_types,
                GROUP_CONCAT(DISTINCT fe.fields_type) as question_types
            FROM fields_category fc
            LEFT JOIN fields_equipment fe 
                ON fc.field_category_id = fe.field_category_id
            GROUP BY fc.field_category_id, fc.name, fc.ord
            ORDER BY fc.ord ASC
        ";

        $result = $this->conn->query($query);

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $stats[] = [
                    'id' => (int) $row['field_category_id'],
                    'name' => $row['category_name'],
                    'order' => (int) $row['category_order'],
                    'total_questions' => (int) $row['total_questions'],
                    'different_types' => (int) $row['different_types'],
                    'question_types' => $row['question_types'] ? explode(',', $row['question_types']) : []
                ];
            }
        }

        return $stats;
    }

    public function getWeeklyForms()
    {
        $data = [];

        $res = $this->conn->query("
        SELECT 
            YEARWEEK(date, 1) as week, 
            COUNT(DISTINCT equipment_id) as total
        FROM equipments_history
        WHERE action = 'Llenado de formulario'
        GROUP BY YEARWEEK(date, 1)
        ORDER BY week DESC
        LIMIT 4
    ");

        if ($res) {
            $rows = [];
            while ($row = $res->fetch_assoc()) {
                $rows[] = $row;
            }

            $rows = array_reverse($rows); // ordenar cronológicamente

            $counter = 1;
            foreach ($rows as $row) {
                $data[] = [
                    'week' => "Semana " . $counter++,
                    'total' => (int) $row['total']
                ];
            }
        }

        return $data;
    }
}