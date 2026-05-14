<?php
// ============================================================
//  api/cottages.php
//  GET    /api/cottages
//  POST   /api/admin/cottages
//  PATCH  /api/admin/cottages/:id
//  DELETE /api/admin/cottages/:id
// ============================================================

function handleCottages(string $method, array $segments, bool $isAdmin): void {
    $db   = getDB();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // GET /api/cottages — public
    if ($method === 'GET' && !$isAdmin && empty($segments)) {
        $rows = $db->query('SELECT * FROM cottages')->fetchAll();
        $result = array_map(fn($c) => [
            ...$c,
            'amenities' => $c['amenities'] ? explode(',', $c['amenities']) : [],
            'active'    => (bool) $c['active'],
        ], $rows);
        echo json_encode($result);
        return;
    }

    // POST /api/admin/cottages
    if ($method === 'POST' && $isAdmin && empty($segments)) {
        requireRole('admin');
        $category  = trim($body['category']  ?? '');
        $price     = (int) ($body['price']   ?? 0);
        $amenities = trim($body['amenities'] ?? '');
        try {
            $stmt = $db->prepare('INSERT INTO cottages (category,price,amenities) VALUES (?,?,?)');
            $stmt->execute([$category, $price, $amenities]);
            $id = $db->lastInsertId();
            echo json_encode(['id' => $id, 'category' => $category, 'price' => $price, 'amenities' => $amenities, 'active' => 1]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        return;
    }

    // PATCH /api/admin/cottages/:id
    if ($method === 'PATCH' && $isAdmin && count($segments) === 1) {
        requireRole('admin');
        $id   = (int) $segments[0];
        $sets = []; $vals = [];
        if (isset($body['category']))  { $sets[] = 'category = ?';  $vals[] = $body['category']; }
        if (isset($body['price']))     { $sets[] = 'price = ?';     $vals[] = (int) $body['price']; }
        if (isset($body['active']))    { $sets[] = 'active = ?';    $vals[] = $body['active'] ? 1 : 0; }
        if (isset($body['amenities'])) { $sets[] = 'amenities = ?'; $vals[] = $body['amenities']; }
        if (empty($sets)) { http_response_code(400); echo json_encode(['error' => 'Nothing to update']); return; }
        $vals[] = $id;
        $db->prepare('UPDATE cottages SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
        echo json_encode(['success' => true]);
        return;
    }

    // DELETE /api/admin/cottages/:id
    if ($method === 'DELETE' && $isAdmin && count($segments) === 1) {
        requireRole('admin');
        $id = (int) $segments[0];
        $db->prepare('DELETE FROM cottages WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Cottage route not found']);
}
