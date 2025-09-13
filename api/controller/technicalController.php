<?php
require_once __DIR__ . '/cors.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once '../model/connection.php';
require_once '../model/technicalModel.php';

header('Content-Type: application/json; charset=utf-8');

$technicalModel = new TechnicalModel($conn);

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
        case 'verifyUser':
            $email = $data['email'] ?? '';
            $password = $data['pass'] ?? '';

            if (empty($email) || empty($password)) {
                echo json_encode(['error' => 'ERR_MISSING_FIELDS']);
                exit;
            }

            $userData = $technicalModel->getUserDataByEmail($email);

            if (isset($userData['error'])) {
                echo json_encode($userData);
                exit;
            }

            $user = $userData[0];

            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['name'] = $user['name'];
                $_SESSION['email'] = $user['email'];
                
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['user_id'],
                        'email' => $user['email'],
                        'name' => $user['name']
                    ]
                ]);
            } else {
                echo json_encode(['error' => 'ERR_INVALID_PASSWORD']);
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