<?php
require_once __DIR__ . '/cors.php';
error_log("POST: " . print_r($_POST, true));
error_log("FILES: " . print_r($_FILES, true));

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once '../model/connection.php';
require_once '../model/dashboardModel.php';

header('Content-Type: application/json; charset=utf-8');

$dashboardModel = new DashboardModel($conn);

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

    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'getMetrics':
            $metrics = $dashboardModel->getMetrics();
            echo json_encode([
                'success' => true,
                'data' => $metrics
            ]);
            break;

        case 'getRecentActivities':
            $activities = $dashboardModel->getRecentActivities();
            echo json_encode([
                'success' => true,
                'data' => $activities
            ]);
            break;

        case 'getCategoriesWithQuestionCount':
            $categories = $dashboardModel->getCategoriesWithQuestionCount();
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
            break;
        
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
            break;
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}