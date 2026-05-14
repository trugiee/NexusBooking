<?php
// ============================================================
//  config.php — Environment & Global Settings
// ============================================================

// Load .env manually (no framework needed)
function loadEnv(string $path): void {
    if (!file_exists($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $val] = array_map('trim', explode('=', $line, 2));
        $_ENV[$key] = $val;
    }
}

if (file_exists(__DIR__ . '/../.env')) {
    loadEnv(__DIR__ . '/../.env');
} else {
    loadEnv(__DIR__ . '/../../.env');
}

define('JWT_SECRET',         $_ENV['JWT_SECRET']         ?? 'your-very-secret-key');
define('PAYMONGO_SECRET_KEY',  $_ENV['PAYMONGO_SECRET_KEY']  ?? 'sk_test_placeholder');
define('EMAIL_USER',         $_ENV['EMAIL_USER']         ?? '');
define('EMAIL_PASS',         $_ENV['EMAIL_PASS']         ?? '');
define('DB_PATH',            realpath(__DIR__) . '/database.sqlite');
define('IS_MOCK_MODE',       PAYMONGO_SECRET_KEY === 'sk_test_placeholder');

// CORS — allow Vite dev server
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
