<?php
define('DB_PATH', __DIR__ . '/../php-server/database.sqlite');
require_once __DIR__ . '/../php-server/database.php';
$db = getDB();
$db->exec("UPDATE bookings SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL");
echo "Updated " . $db->query("SELECT changes()")->fetchColumn() . " rows.\n";
