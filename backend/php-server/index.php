<?php
// ============================================================
//  index.php — Main Router / Entry Point
//  Run with: php -S localhost:3005 index.php
// ============================================================

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/api/auth.php';
require_once __DIR__ . '/api/users.php';
require_once __DIR__ . '/api/cottages.php';
require_once __DIR__ . '/api/addons.php';
require_once __DIR__ . '/api/bookings.php';
require_once __DIR__ . '/api/payments.php';

$method = $_SERVER['REQUEST_METHOD'];

// Strip query string and /api prefix from path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$path = rtrim($path, '/');

// Split into segments: e.g. "/bookings/TRX-ABC/verify-payment" → ['bookings','TRX-ABC','verify-payment']
$segments = array_values(array_filter(explode('/', ltrim($path, '/'))));

$resource = $segments[0] ?? '';
$rest     = array_slice($segments, 1);  // everything after the resource name

// ---- ROUTE TABLE ----

// /api/auth/login  |  /api/auth/register
if ($resource === 'auth') {
    $action = $rest[0] ?? '';
    handleAuth($method, $action);
    exit;
}

// /api/users  |  /api/admin/users[/:id/status]
if ($resource === 'users') {
    handleUsers($method, $rest);
    exit;
}

// /api/admin/... (admin-specific sub-routes)
if ($resource === 'admin') {
    $subResource = $rest[0] ?? '';
    $subRest     = array_slice($rest, 1);

    if ($subResource === 'users') {
        handleUsers($method, $subRest);
        exit;
    }
    if ($subResource === 'cottages') {
        handleCottages($method, $subRest, true);
        exit;
    }
    if ($subResource === 'addons') {
        handleAddons($method, $subRest, true);
        exit;
    }
}

// /api/cottages
if ($resource === 'cottages') {
    handleCottages($method, $rest, false);
    exit;
}

// /api/addons
if ($resource === 'addons') {
    handleAddons($method, $rest, false);
    exit;
}

// /api/bookings  |  /api/bookings/:id  |  /api/bookings/:id/verify-payment
if ($resource === 'bookings') {
    handleBookings($method, $rest);
    exit;
}

// /api/create-checkout
if ($resource === 'create-checkout') {
    handlePayments($method);
    exit;
}

// 404 fallback
http_response_code(404);
echo json_encode(['error' => "Route not found: {$path}"]);
