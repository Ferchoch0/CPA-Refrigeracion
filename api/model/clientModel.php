<?php
class ClientModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function addClients($data)
    {
        $company_name = $data['company_name'] ?? '';
        $personal_name = $data['personal_name'] ?? '';
        $contact_person = $data['contact_person'] ?? '';
        $address = $data['address'] ?? '';
        $phone = $data['phone'] ?? '';
        $date_visit = $data['date_visit'] ?? '';
        $email = $data['email'] ?? '';
        $user_id = $data['user_id'] ?? null;


        // Validar campos obligatorios
        $required = [$company_name, $contact_person, $address, $phone, $date_visit, $email];
        if (in_array('', $required, true) || !$user_id) {
            return ['error' => 'ERR_MISSING_FIELDS'];
        }

        // Insertar cliente
        $stmt = $this->conn->prepare("
        INSERT INTO clients 
        (company_name, personal_name, contact_person, address, phone, date_visit, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

        if (!$stmt)
            return ['error' => 'ERR_DB_PREPARE'];

        $stmt->bind_param(
            "sssssss",
            $company_name,
            $personal_name,
            $contact_person,
            $address,
            $phone,
            $date_visit,
            $email
        );

        if (!$stmt->execute()) {
            $stmt->close();
            return ['error' => 'ERR_DB_EXECUTE'];
        }

        $client_id = $this->conn->insert_id;
        $stmt->close();

        // Insertar asignación
        if (!empty($data['technician_id'])) {
            $technician_id = $data['technician_id'];
            $stmt2 = $this->conn->prepare("
            INSERT INTO assignment (client_id, user_id)
            VALUES (?, ?)
        ");
            if (!$stmt2)
                return ['error' => 'ERR_DB_ASSIGN_PREPARE'];

            $stmt2->bind_param("ii", $client_id, $technician_id);

            if (!$stmt2->execute()) {
                $stmt2->close();
                return ['error' => 'ERR_DB_ASSIGN_EXECUTE'];
            }
            $stmt2->close();
        }

        // Insertar registro en auditoría
        $action = "Alta de cliente: " . $company_name;
        $statusAction = "success";

        $stmt3 = $this->conn->prepare("
        INSERT INTO audit (user_id, action, status_action, date)
        VALUES (?, ?, ?, NOW())
    ");

        if ($stmt3) {
            $stmt3->bind_param("iss", $user_id, $action, $statusAction);
            $stmt3->execute();
            $stmt3->close();
        }

        return ['success' => true, 'client_id' => $client_id];
    }

    public function updateClients($data)
    {
        $client_id = $data['client_id'] ?? null;
        $company_name = $data['company_name'] ?? '';
        $personal_name = $data['personal_name'] ?? '';
        $contact_person = $data['contact_person'] ?? '';
        $address = $data['address'] ?? '';
        $phone = $data['phone'] ?? '';
        $date_visit = $data['date_visit'] ?? '';
        $email = $data['email'] ?? '';
        $user_id = $data['user_id'] ?? null; // admin que realiza la acción

        // Validar campos obligatorios
        $required = [$client_id, $company_name, $contact_person, $address, $phone, $date_visit, $email];
        if (in_array('', $required, true) || !$user_id) {
            return ['error' => 'ERR_MISSING_FIELDS'];
        }

        // Actualizar cliente
        $stmt = $this->conn->prepare("
        UPDATE clients SET 
            company_name = ?, 
            personal_name = ?, 
            contact_person = ?, 
            address = ?, 
            phone = ?, 
            date_visit = ?, 
            email = ?
        WHERE client_id = ?
    ");
        if (!$stmt)
            return ['error' => 'ERR_DB_PREPARE'];

        $stmt->bind_param(
            "sssssssi",
            $company_name,
            $personal_name,
            $contact_person,
            $address,
            $phone,
            $date_visit,
            $email,
            $client_id
        );

        if (!$stmt->execute()) {
            $stmt->close();
            return ['error' => 'ERR_DB_EXECUTE'];
        }

        $stmt->close();

        // Insertar registro en auditoría
        $action = "Actualización de cliente: " . $company_name;
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


    public function getClientsByUserId($userId)
    {
        $sql = "
        SELECT c.* 
        FROM clients c
        INNER JOIN assignment a ON c.client_id = a.client_id
        WHERE a.user_id = ?
        ";

        $stmt = $this->conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($data)) {
                return ['error' => 'ERR_NO_CLIENTS_FOUND'];
            }

            return $data;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }

    public function getClientsTotal()
    {
        $sql = "
        SELECT 
            c.client_id,
            c.company_name,
            c.personal_name,
            c.contact_person,
            c.address,
            c.phone,
            c.email,
            c.date_visit,
            u.name AS technician_name
        FROM clients c
        INNER JOIN assignment a ON c.client_id = a.client_id
        INNER JOIN users u ON a.user_id = u.user_id
    ";

        $stmt = $this->conn->prepare($sql);

        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($data)) {
                return ['error' => 'ERR_NO_CLIENTS_FOUND'];
            }

            return $data;
        } else {
            return ['error' => 'ERR_DB_CONN'];
        }
    }
}
?>