<?php
// Lista blanca con los orígenes permitidos
$allowedOrigins = [
    
];

// Comprobar si el origen de la petición está permitido
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true"); // Solo si usas credenciales
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Access-Control-Allow-Origin");
} else {
    header("Access-Control-Allow-Origin: null");
}

// Responder a las peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>