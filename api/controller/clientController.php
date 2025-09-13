<?php
require_once __DIR__ . '/cors.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once '../model/connection.php';
require_once '../model/clientModel.php';

header('Content-Type: application/json; charset=utf-8');

$clientModel = new ClientModel($conn);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        $data = $_POST;

        // Si viene como string JSON en estateData, lo decodificamos
        if (isset($data['estateData']) && is_string($data['estateData'])) {
            $data['estateData'] = json_decode($data['estateData'], true);
        }
    }

    $action = $data['action'] ?? '';

    switch ($action) {
        case 'getClients':
            $userId = $data['userId'] ?? '';
            if (empty($userId)) {
                echo json_encode(['error' => 'ERR_MISSING_USER_ID']);
                exit;
            }

            $clients = $clientModel->getClientsByUserId($userId);

            if (isset($clients['error'])) {
                echo json_encode(['error' => $clients['error']]);
            } else {
                echo json_encode([
                    'success' => true,
                    'clients' => $clients
                ]);
            }
            break;

    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : (isset($_GET['action']) ? $_GET['action'] : '');
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

?>