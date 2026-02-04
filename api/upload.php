<?php
require_once __DIR__ . '/cors.php';
header('Content-Type: application/json; charset=utf-8');

$uploadDir = __DIR__ . '/uploads/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_FILES['file'])) {
        echo json_encode(['success' => false, 'error' => 'No se recibió ningún archivo']);
        exit;
    }

    $file = $_FILES['file'];
    $filename = basename($file['name']);
    $targetFile = $uploadDir . $filename;

    // Validar tipo de archivo (opcional)
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Tipo de archivo no permitido']);
        exit;
    }

    // Mover archivo
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        // URL relativa que vas a guardar en la BD
        $fileUrl = 'uploads/' . $filename;
        echo json_encode(['success' => true, 'url' => $fileUrl]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al mover el archivo']);
    }

} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
