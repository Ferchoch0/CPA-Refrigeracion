<?php
class ClientModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
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
}
?>