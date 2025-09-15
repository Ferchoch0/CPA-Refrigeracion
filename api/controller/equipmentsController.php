<?php
require_once __DIR__ . '/cors.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once '../model/connection.php';
require_once '../model/equipmentsModel.php';

header('Content-Type: application/json; charset=utf-8');

$equipmentsModel = new EquipmentsModel($conn);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        $data = $_POST;

        if (isset($data['estateData']) && is_string($data['estateData'])) {
            $data['estateData'] = json_decode($data['estateData'], true);
        }
    }

    $action = $data['action'] ?? '';

    switch ($action) {
        case 'getEquipmentsByClient':
            if (isset($data['client_id'])) {
                $clientId = intval($data['client_id']);
                $result = $equipmentsModel->getEquipmentsByClientId($clientId);
                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_CLIENT_ID']);
            }
            break;

        default:
            echo json_encode(['error' => 'ERR_UNKNOWN_ACTION']);
            break;
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'getEquipmentsByClient':
            if (isset($_GET['client_id'])) {
                $clientId = intval($_GET['client_id']);
                $result = $equipmentsModel->getEquipmentsByClientId($clientId);
                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_CLIENT_ID']);
            }
            break;

        default:
            echo json_encode(['error' => 'ERR_UNKNOWN_ACTION']);
            break;
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
