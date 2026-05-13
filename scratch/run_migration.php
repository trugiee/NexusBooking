<?php
define('DB_PATH', __DIR__ . '/../php-server/database.sqlite');
require_once __DIR__ . '/../php-server/database.php';
$db = getDB();
try {
    $db->exec("ALTER TABLE bookings ADD COLUMN created_at DATETIME");
    echo "Success adding created_at\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
$db->exec("UPDATE bookings SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL");
echo "Timestamps updated.\n";
