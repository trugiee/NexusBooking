<?php
define('DB_PATH', __DIR__ . '/../php-server/database.sqlite');
require_once __DIR__ . '/../php-server/database.php';
$db = getDB();
echo "--- ALL BOOKINGS ---\n";
print_r($db->query("SELECT * FROM bookings")->fetchAll());
echo "--- ALL USERS ---\n";
print_r($db->query("SELECT id, name, email FROM users")->fetchAll());
