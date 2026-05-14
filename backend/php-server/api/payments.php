<?php
// ============================================================
//  api/payments.php
//  POST /api/create-checkout — PayMongo GCash checkout session
// ============================================================

function handlePayments(string $method): void {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    requireAuth();
    $body      = json_decode(file_get_contents('php://input'), true) ?? [];
    $amount    = (int)   ($body['amount']      ?? 0);
    $desc      = trim(    $body['description'] ?? '');
    $bookingId = trim(    $body['bookingId']   ?? '');
    $origin    = trim(    $body['origin']      ?? 'http://localhost:5173');

    // Mock mode — skip real PayMongo call
    if (IS_MOCK_MODE) {
        echo json_encode(['checkout_url' => "{$origin}/?status=success&id={$bookingId}"]);
        return;
    }

    $payload = json_encode([
        'data' => [
            'attributes' => [
                'send_email_receipt' => true,
                'show_description'   => true,
                'show_line_items'    => true,
                'description'        => $desc,
                'line_items'         => [[
                    'amount'   => $amount * 100,
                    'currency' => 'PHP',
                    'name'     => $desc,
                    'quantity' => 1,
                ]],
                'payment_method_types' => ['gcash'],
                'success_url' => "{$origin}/?status=success&id={$bookingId}",
                'cancel_url'  => "{$origin}/?status=cancelled",
            ]
        ]
    ]);

    $auth = base64_encode(PAYMONGO_SECRET_KEY . ':');

    $ch = curl_init('https://api.paymongo.com/v1/checkout_sessions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            "Authorization: Basic {$auth}",
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create checkout session']);
        return;
    }

    $data = json_decode($response, true);
    echo json_encode(['checkout_url' => $data['data']['attributes']['checkout_url']]);
}
