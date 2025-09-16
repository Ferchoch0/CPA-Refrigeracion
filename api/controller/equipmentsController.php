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

        case 'addEquipment':
            if (isset($data['client_id'], $data['type_equip_id'])) {
                $clientId = intval($data['client_id']);
                $typeEquipId = intval($data['type_equip_id']);
                $placement = $data['unidad'] ?? null;

                $result = $equipmentsModel->addEquipments($clientId, $typeEquipId, $placement);

                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_PARAMETERS']);
            }
            break;

        case 'saveAnswers':
            if (isset($_POST['equipment_id'])) {
                $equipmentId = intval($_POST['equipment_id']);
                $answers = [];

                foreach ($_POST as $key => $val) {
                    if (strpos($key, "answer_") === 0) {
                        $fieldId = str_replace("answer_", "", $key);
                        $answers[$fieldId] = $val;
                    }
                }

                if (!empty($_FILES)) {
                    foreach ($_FILES as $key => $file) {
                        if ($file['error'] === UPLOAD_ERR_OK) {
                            $uploadDir = __DIR__ . "/../../uploads/"; // ruta a tu carpeta
                            if (!file_exists($uploadDir)) {
                                mkdir($uploadDir, 0777, true);
                            }

                            $fileName = uniqid() . "_" . basename($file["name"]);
                            $filePath = $uploadDir . $fileName;

                            if (move_uploaded_file($file["tmp_name"], $filePath)) {
                                $fileUrl = "uploads/" . $fileName;
                                $equipmentsModel->saveImage($equipmentId, $fileUrl);
                            }
                        }
                    }
                }

                $result = $equipmentsModel->saveAnswers($equipmentId, $answers);
                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_PARAMETERS']);
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

        case 'getTasks':
            try {
                $result = $equipmentsModel->getQuestionsCategory();
                echo json_encode($result);
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;

        case 'getQuestions':
            try {
                if (isset($_GET['category_id'])) {
                    $categoryId = intval($_GET['category_id']);
                    $result = $equipmentsModel->getQuestionsByCategory($categoryId);
                    echo json_encode($result);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
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
