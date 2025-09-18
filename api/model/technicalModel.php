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

    public function getTechnicians()
    {
        $stmt = $this->conn->prepare("
            SELECT u.user_id, u.name, u.email
            FROM users u
            INNER JOIN roles r ON u.rol_id = r.rol_id
            WHERE r.name = 'tecnico'
        ");

        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            if (empty($data)) {
                return ['error' => 'ERR_TECHNICIANS_NOT_FOUND'];
            }
            return ['success' => true, 'technicians' => $data];
        } else {
            return ['error' => 'ERR_DB_CONN'];
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