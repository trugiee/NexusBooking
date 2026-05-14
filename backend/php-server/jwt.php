<?php
// ============================================================
//  jwt.php — Lightweight JWT encode / decode (HS256)
//  No external library needed — pure PHP
// ============================================================

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

function jwtEncode(array $payload): string {
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64url_encode(json_encode($payload));
    $sig     = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$sig";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $payload, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return null;

    return json_decode(base64url_decode($payload), true);
}

// Middleware: extract & verify Bearer token → returns user payload or sends 401/403
function requireAuth(): array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized — no token']);
        exit;
    }

    $token = substr($authHeader, 7);
    $user  = jwtDecode($token);
    if (!$user) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden — invalid token']);
        exit;
    }

    return $user;
}

// Shorthand: requireAuth + role check
function requireRole(string $role): array {
    $user = requireAuth();
    if ($user['role'] !== $role) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    return $user;
}
