<?php
define('DB_PATH', __DIR__ . '/../php-server/database.sqlite');
require_once __DIR__ . '/../php-server/database.php';
$db = getDB();
$res = $db->query("PRAGMA table_info(bookings)")->fetchAll();
print_r($res);
