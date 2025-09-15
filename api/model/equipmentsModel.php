<?php
class EquipmentsModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
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
}
?>