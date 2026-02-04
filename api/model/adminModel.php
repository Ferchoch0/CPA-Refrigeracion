<?php
class AdminModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getAdminDataByEmail($email)
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

    public function getAudits()
    {
        $sql = "
            SELECT 
                u.name AS user_name,
                r.name AS role_name,
                a.action,
                a.date
            FROM audit a
            INNER JOIN users u ON a.user_id = u.user_id
            INNER JOIN roles r ON u.rol_id = r.rol_id
            ORDER BY a.date DESC
        ";
        $stmt = $this->conn->prepare($sql);
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
}
?>