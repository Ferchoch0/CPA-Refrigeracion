<?php
require_once __DIR__ . '/cors.php';
error_log("POST: " . print_r($_POST, true));
error_log("FILES: " . print_r($_FILES, true));

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

                $result = $equipmentsModel->addEquipments($clientId, $typeEquipId);

                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_PARAMETERS']);
            }
            break;

        case 'updateEquipmentStatus':
            $equipment_id = $data['equipment_id'] ?? null;
            $status = $data['status'] ?? null;

            if ($equipment_id && $status) {
                $result = $equipmentsModel->updateStatus($equipment_id, $status);
                echo json_encode($result);
            } else {
                echo json_encode([
                    "success" => false,
                    "error" => "Faltan parámetros (equipment_id o status)"
                ]);
            }
            break;

        case 'saveAnswers':
            header('Content-Type: application/json; charset=utf-8');

            // Verifico si vino como formulario con imagen
            if (!empty($_POST) || !empty($_FILES)) {
                if (!isset($_POST['equipment_id'], $_POST['user_id'])) {
                    echo json_encode(['error' => 'ERR_MISSING_PARAMETERS']);
                    exit;
                }

                $equipmentId = intval($_POST['equipment_id']);
                $userId = intval($_POST['user_id']);
                $answers = [];

                // Procesar respuestas normales
                foreach ($_POST as $key => $val) {
                    if (strpos($key, "answer_") === 0) {
                        $fieldId = str_replace("answer_", "", $key);
                        $answers[$fieldId] = $val;
                    }
                }

                // Procesar archivos como respuestas también
                if (!empty($_FILES)) {
                    foreach ($_FILES as $key => $file) {
                        if ($file['error'] === UPLOAD_ERR_OK) {
                            $uploadDir = __DIR__ . "/upload/equip/";
                            if (!file_exists($uploadDir)) {
                                mkdir($uploadDir, 0777, true);
                            }

                            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                            $filename = "equip{$equipmentId}." . strtolower($ext);
                            $targetPath = $uploadDir . $filename;

                            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                                $fieldId = str_replace("file_", "", $key); // ej: file_12 → fieldId=12
                                $answers[$fieldId] = $filename;
                            } else {
                                echo json_encode(['error' => 'ERR_UPLOAD_FAILED']);
                                exit;
                            }
                        }
                    }
                }

                $result = $equipmentsModel->saveAnswers($equipmentId, $answers, $userId);
                echo json_encode($result);
                exit;
            }

            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                echo json_encode(['error' => 'ERR_NO_DATA']);
                exit;
            }
            break;

        case 'updateQuestion':
            if (isset($data['id'], $data['name'], $data['type'], $data['description'], $data['user_id'])) {
                $fieldId = intval($data['id']);
                $name = $data['name'];
                $type = $data['type'];
                $description = $data['description'];
                $options = isset($data['options']) ? $data['options'] : null;
                $user_id = intval($data['user_id']);

                $equipTypes = isset($data['equipTypes']) ? json_decode($data['equipTypes'], true) : [];
                $mandatory = isset($data['mandatory']) ? intval($data['mandatory']) : 1;

                $result = $equipmentsModel->updateQuestions(
                    $fieldId,
                    $name,
                    $type,
                    $description,
                    $options,
                    $user_id,
                    $equipTypes,
                    $mandatory
                );

                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_PARAMETERS']);
            }
            break;

        case 'addQuestion':
            if (isset($data['categoryId'], $data['name'], $data['type'], $data['description'], $data['user_id'])) {
                $fieldCategoryId = intval($data['categoryId']);
                $name = $data['name'];
                $type = $data['type'];
                $description = $data['description'];
                $options = isset($data['options']) ? $data['options'] : null;
                $user_id = intval($data['user_id']);

                $equipTypes = isset($data['equipTypes']) ? json_decode($data['equipTypes'], true) : [];
                $mandatory = isset($data['mandatory']) ? intval($data['mandatory']) : 1;

                $result = $equipmentsModel->addQuestions(
                    $fieldCategoryId,
                    $name,
                    $type,
                    $description,
                    $options,
                    $user_id,
                    $equipTypes,
                    $mandatory
                );

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

        case 'getEquipmentsByClientCompleted':
            if (isset($_GET['client_id'])) {
                $clientId = intval($_GET['client_id']);
                $result = $equipmentsModel->getEquipmentsByClientCompleted($clientId);
                echo json_encode($result);
            } else {
                echo json_encode(['error' => 'ERR_MISSING_CLIENT_ID']);
            }
            break;

        case 'getQuestionsCategory':
            try {
                if (isset($_GET['equipment_id'])) {
                    $equipmentId = intval($_GET['equipment_id']);
                    $result = $equipmentsModel->getQuestionsCategory($equipmentId);
                    echo json_encode($result);
                } else {
                    $result = $equipmentsModel->getAllQuestionsCategories();
                    echo json_encode($result);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;


        case 'getByCode':
            try {
                if (isset($_GET['code'])) {
                    $code = $_GET['code'];
                    $result = $equipmentsModel->getByCode($code);
                    echo json_encode($result);
                } else {
                    echo json_encode(['error' => 'ERR_CODE_REQUIRED']);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;

        case 'getQuestionsAnswersCategories':
            try {
                if (isset($_GET['equipment_id'])) {
                    $equipmentId = intval($_GET['equipment_id']);
                    $result = $equipmentsModel->getAllQuestionsCategoriesWithAnswers($equipmentId);
                    echo json_encode($result);
                } else {
                    echo json_encode(['error' => 'ERR_EQUIP_ID_REQUIRED']);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;


        case 'getQuestionsByType':
            try {
                if (isset($_GET['category_id'], $_GET['type_equip_id'])) {
                    $categoryId = intval($_GET['category_id']);
                    $typeEquipId = intval($_GET['type_equip_id']);

                    $equipmentId = isset($_GET['equipment_id']) ? intval($_GET['equipment_id']) : null;

                    $result = $equipmentsModel->getQuestionsByType($categoryId, $typeEquipId, $equipmentId);
                    echo json_encode($result);
                } else {
                    echo json_encode(['error' => 'ERR_MISSING_PARAMETERS']);
                }
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

        case 'getHistory':
            try {
                if (isset($_GET['equipment_id'])) {
                    $equipmentId = intval($_GET['equipment_id']);
                    $result = $equipmentsModel->getHistoryByEquipmentId($equipmentId);
                    echo json_encode($result);
                } else {
                    echo json_encode(['error' => 'ERR_EQUIPMENT_ID_REQUIRED']);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;

        case 'getQuestionById':
            try {
                if (isset($_GET['id'])) {
                    $Id = intval($_GET['id']);
                    $result = $equipmentsModel->getQuestionsById($Id);
                    echo json_encode($result);
                }
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;

        case "getEquipTypes":
            $result = $equipmentsModel->getEquipTypes();
            echo json_encode($result);
            break;


        default:
            echo json_encode(['error' => 'ERR_UNKNOWN_ACTION']);
            break;
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
