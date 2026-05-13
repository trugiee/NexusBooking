<?php
define('DB_PATH', __DIR__ . '/../php-server/bookings.sqlite');
require_once __DIR__ . '/../php-server/database.php';
$db = getDB();
$alice = $db->query("SELECT id FROM users WHERE email = 'customer@example.com'")->fetchColumn();
echo "Alice ID: " . $alice . "\n";
$bookings = $db->prepare("SELECT * FROM bookings WHERE userId = ?");
$bookings->execute([$alice]);
print_r($bookings->fetchAll());
