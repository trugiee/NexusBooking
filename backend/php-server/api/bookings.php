<?php
// ============================================================
//  api/bookings.php
//  GET    /api/bookings
//  POST   /api/bookings
//  PATCH  /api/bookings/:id
//  POST   /api/bookings/:id/verify-payment
// ============================================================

function handleBookings(string $method, array $segments): void {
    $db   = getDB();
    $user = requireAuth();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // GET /api/bookings
    if ($method === 'GET' && empty($segments)) {
        if ($user['role'] === 'admin' || $user['role'] === 'inspector') {
            $stmt = $db->query('SELECT b.*, u.name as userName FROM bookings b LEFT JOIN users u ON b.userId = u.id ORDER BY b.created_at DESC');
            $rows = $stmt->fetchAll();
        } else {
            $stmt = $db->prepare('SELECT b.*, u.name as userName FROM bookings b LEFT JOIN users u ON b.userId = u.id WHERE b.userId = ? ORDER BY b.created_at DESC');
            $stmt->execute([$user['id']]);
            $rows = $stmt->fetchAll();
        }
        $result = array_map(fn($b) => [
            ...$b,
            'addons' => $b['addons'] ? explode(',', $b['addons']) : [],
        ], $rows);
        echo json_encode($result);
        return;
    }

    // POST /api/bookings — create booking
    if ($method === 'POST' && empty($segments)) {
        $cottageId     = (int)   ($body['cottageId']     ?? 0);
        $date          = trim(    $body['date']           ?? '');
        $addons        =          $body['addons']         ?? [];
        $total         = (int)   ($body['total']          ?? 0);
        $paymentMethod = trim(    $body['paymentMethod']  ?? '');
        $gcashRef      = trim(    $body['gcashRef']       ?? '');
        $walkinName    = trim(    $body['walkinName']     ?? '');

        // Conflict check — block if NOT Cancelled or Expired (Hold Pending & Confirmed)
        $conflict = $db->prepare("SELECT id FROM bookings WHERE cottageId = ? AND date = ? AND status NOT IN ('Cancelled', 'Expired')");
        $conflict->execute([$cottageId, $date]);
        if ($conflict->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Cottage is already booked/confirmed for this date']);
            return;
        }

        $id = 'TRX-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 7));
        $status = $walkinName ? 'Confirmed' : 'Pending';
        
        $stmt = $db->prepare('INSERT INTO bookings (id,userId,cottageId,date,addons,total,paymentMethod,gcashRef,walkin_name,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
            $id, 
            $user['id'], 
            $cottageId, 
            $date, 
            implode(',', $addons), 
            $total, 
            $paymentMethod, 
            $gcashRef ?: null,
            $walkinName ?: null,
            $status,
            date('Y-m-d H:i:s')
        ]);
        
        echo json_encode(['id' => $id, 'status' => $status]);
        return;
    }

    // POST /api/bookings/:id/verify-payment
    if ($method === 'POST' && count($segments) === 2 && $segments[1] === 'verify-payment') {
        $id      = $segments[0];
        $booking = $db->prepare('SELECT * FROM bookings WHERE id = ?');
        $booking->execute([$id]);
        $booking = $booking->fetch();

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
            return;
        }

        if ($booking['status'] === 'Expired') {
            http_response_code(400);
            echo json_encode(['error' => 'This reservation has expired (3-day limit exceeded) and cannot be confirmed.']);
            return;
        }

        // ONLY ALLOW ADMIN (City Hall) to verify cash payments
        if ($user['role'] !== 'admin' && $booking['userId'] != $user['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Only administrators can confirm cash payments']);
            return;
        }

        // Final conflict check before confirming (Ensure no other CONFIRMED booking exists)
        $conflict = $db->prepare('SELECT id FROM bookings WHERE cottageId = ? AND date = ? AND status = ? AND id != ?');
        $conflict->execute([$booking['cottageId'], $booking['date'], 'Confirmed', $id]);
        if ($conflict->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Sorry, this cottage was just confirmed by someone else. Please contact support for a refund.']);
            return;
        }

        $db->prepare('UPDATE bookings SET status = ? WHERE id = ?')->execute(['Confirmed', $id]);
        echo json_encode(['success' => true, 'status' => 'Confirmed']);
        return;
    }

    // PATCH /api/bookings/:id — update status
    if ($method === 'PATCH' && count($segments) === 1) {
        $id     = $segments[0];
        $status = trim($body['status'] ?? '');

        $booking = $db->prepare('SELECT * FROM bookings WHERE id = ?');
        $booking->execute([$id]);
        $booking = $booking->fetch();

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
            return;
        }

        // Admin can change to anything; customer can only cancel their own
        if ($user['role'] === 'admin') {
            $db->prepare('UPDATE bookings SET status = ? WHERE id = ?')->execute([$status, $id]);
            echo json_encode(['success' => true, 'message' => "Status updated to {$status}"]);
            return;
        }

        if ($booking['userId'] == $user['id'] && $status === 'Cancelled') {
            $db->prepare('UPDATE bookings SET status = ? WHERE id = ?')->execute(['Cancelled', $id]);
            echo json_encode(['success' => true, 'message' => 'Booking cancelled']);
            return;
        }

        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized status change']);
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Booking route not found']);
}
