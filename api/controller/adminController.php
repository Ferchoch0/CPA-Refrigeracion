<?php
require_once __DIR__ . '/cors.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once '../model/connection.php';
require_once '../model/adminModel.php';

header('Content-Type: application/json; charset=utf-8');

$adminModel = new AdminModel($conn);

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
        case 'verifyAdmin':
            $email = $data['email'] ?? '';
            $password = $data['pass'] ?? '';

            if (empty($email) || empty($password)) {
                echo json_encode(['error' => 'ERR_MISSING_FIELDS']);
                exit;
            }

            $userData = $adminModel->getAdminDataByEmail($email);

            if (isset($userData['error'])) {
                echo json_encode($userData);
                exit;
            }

            $user = $userData[0];

            if (!password_verify($password, $user['password'])) {
                echo json_encode(['error' => 'ERR_INVALID_PASSWORD']);
                exit;
            }

            if ((int)$user['rol_id'] !== 1) {
                echo json_encode(['error' => 'ERR_NOT_ADMIN']);
                exit;
            }

            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['rol_id'] = $user['rol_id'];

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['user_id'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'rol_id' => $user['rol_id']
                ]
            ]);
            break;
    }
}
