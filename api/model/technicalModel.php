<?php
class TechnicalModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getUserData()
    {
        $stmt = $this->conn->prepare("SELECT * FROM users");
        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            if (empty($data)) {
                return ['error' => 'ERR_USER_NOT_FOUND'];
            }
            return $data;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }

    public function addTechnician($data)
    {
        $name = $data['name'] ?? '';
        $dni = $data['dni'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $phone = $data['phone'] ?? '';
        $status = $data['status'] ?? 'active';
        $user_id = $data['user_id'] ?? null; // admin que realiza la acción

        // Validar campos obligatorios
        $required = [$name, $dni, $email, $password, $phone];
        if (in_array('', $required, true) || !$user_id) {
            return ['error' => 'ERR_MISSING_FIELDS'];
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insertar técnico (rol_id = 2)
        $stmt = $this->conn->prepare("
        INSERT INTO users (rol_id, name, dni, email, password, phone, status)
        VALUES (2, ?, ?, ?, ?, ?, ?)
    ");
        if (!$stmt)
            return ['error' => 'ERR_DB_PREPARE'];

        $stmt->bind_param("ssssss", $name, $dni, $email, $hashedPassword, $phone, $status);

        if (!$stmt->execute()) {
            $stmt->close();
            return ['error' => 'ERR_DB_EXECUTE'];
        }

        $technician_id = $this->conn->insert_id;
        $stmt->close();

        // Insertar registro en auditoría
        $action = "Alta de técnico: " . $name;
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

        return ['success' => true, 'technician_id' => $technician_id];
    }

    public function updateTechnician($data)
    {
        $id = $data['id'] ?? null;
        $name = $data['name'] ?? '';
        $dni = $data['dni'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $phone = $data['phone'] ?? '';
        $status = $data['status'] ?? 'active';
        $user_id = $data['user_id'] ?? null; // admin que realiza la acción

        // Validar campos obligatorios
        $required = [$id, $name, $dni, $email, $phone];
        if (in_array('', $required, true) || !$user_id) {
            return ['error' => 'ERR_MISSING_FIELDS'];
        }

        if (!empty($password)) {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $this->conn->prepare("
            UPDATE users
            SET name = ?, dni = ?, email = ?, password = ?, phone = ?, status = ?
            WHERE user_id = ?
        ");
            if (!$stmt)
                return ['error' => 'ERR_DB_PREPARE'];
            $stmt->bind_param("ssssssi", $name, $dni, $email, $hashedPassword, $phone, $status, $id);
        } else {
            $stmt = $this->conn->prepare("
            UPDATE users
            SET name = ?, dni = ?, email = ?, phone = ?, status = ?
            WHERE user_id = ?
        ");
            if (!$stmt)
                return ['error' => 'ERR_DB_PREPARE'];
            $stmt->bind_param("sssssi", $name, $dni, $email, $phone, $status, $id);
        }

        if (!$stmt->execute()) {
            $stmt->close();
            return ['error' => 'ERR_DB_EXECUTE'];
        }
        $stmt->close();

        // Insertar registro en auditoría
        $action = "Actualización de técnico ID: " . $id;
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
    }



    public function getTechnicians()
    {
        try {
            $sql = "
    SELECT 
        u.user_id, 
        u.name AS user_name, 
        u.email,
        u.phone,
        u.dni,
        u.password,
        u.profile_image,
        u.status,
        r.name AS role_name,
        h.date,
        h.action,
        a.assignment_id,
        c.client_id,
        c.company_name
    FROM users u
    INNER JOIN roles r ON u.rol_id = r.rol_id
    LEFT JOIN equipments_history h ON u.user_id = h.user_id
    LEFT JOIN assignment a ON u.user_id = a.user_id
    LEFT JOIN clients c ON a.client_id = c.client_id
    WHERE r.name = 'tecnico'
    ORDER BY u.user_id, h.date DESC
";

            $result = $this->conn->query($sql);

            $technicians = [];
            while ($row = $result->fetch_assoc()) {
                $id = $row['user_id'];

                if (!isset($technicians[$id])) {
                    $technicians[$id] = [
                        'user_id' => $row['user_id'],
                        'user_name' => $row['user_name'],
                        'email' => $row['email'],
                        'phone' => $row['phone'],
                        'dni' => $row['dni'],
                        'password' => $row['password'],
                        'profile_image' => $row['profile_image'],
                        'status' => $row['status'],
                        'role_name' => $row['role_name'],
                        'history' => [],
                        'last_task' => null,
                        'clients' => [],
                        'clients_map' => []
                    ];
                }

                // Historial
                if (!empty($row['date']) && !empty($row['action'])) {
                    $technicians[$id]['history'][] = [
                        'date' => $row['date'],
                        'task' => $row['action'],
                    ];

                    if ($technicians[$id]['last_task'] === null) {
                        $technicians[$id]['last_task'] = $row['action'] . " - " . $row['date'];
                    }
                }

                // Clientes (evitar duplicados)
                if (!empty($row['client_id'])) {
                    if (!isset($technicians[$id]['clients_map'][$row['client_id']])) {
                        $technicians[$id]['clients_map'][$row['client_id']] = true;

                        $technicians[$id]['clients'][] = [
                            'client_id' => $row['client_id'],
                            'assignment_id' => $row['assignment_id'],
                            'company_name' => $row['company_name']
                        ];
                    }
                }
            }

            // Limpiar el campo auxiliar antes de retornar
            foreach ($technicians as &$tech) {
                unset($tech['clients_map']);
            }

            return ['success' => true, 'technicians' => array_values($technicians)];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function getUserDataByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            if (empty($data)) {
                return ['error' => 'ERR_USER_NOT_FOUND'];
            }
            return $data;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }

    public function updateProfilePhoto($userId, $filename)
    {
        $stmt = $this->conn->prepare("UPDATE users SET profile_image = ? WHERE user_id = ?");
        $stmt->bind_param("si", $filename, $userId);
        return $stmt->execute();
    }


}
?>