<?php
require_once __DIR__ . '/api/model/connection.php';
$result = $conn->query("SHOW TABLES");
while ($row = $result->fetch_array()) {
    echo $row[0] . "\n";
    if (strpos($row[0], 'task') !== false || strpos($row[0], 'ot') !== false) {
        $cols = $conn->query("SHOW COLUMNS FROM " . $row[0]);
        while ($col = $cols->fetch_assoc()) {
            echo "  - " . $col['Field'] . "\n";
        }
    }
}
