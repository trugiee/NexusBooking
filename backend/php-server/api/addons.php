<?php
// ============================================================
//  api/addons.php
//  GET    /api/addons           — public
//  POST   /api/admin/addons     — admin
//  PATCH  /api/admin/addons/:id — admin
//  DELETE /api/admin/addons/:id — admin
// ============================================================

function handleAddons(string $method, array $segments, bool $isAdmin): void {
    $db   = getDB();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // GET /api/addons — public
    if ($method === 'GET' && !$isAdmin && empty($segments)) {
        $rows = $db->query('SELECT * FROM addons')->fetchAll();
        echo json_encode($rows);
        return;
    }

    // POST /api/admin/addons
    if ($method === 'POST' && $isAdmin && empty($segments)) {
        requireRole('admin');
        $name  = trim($body['name']  ?? '');
        $price = (int) ($body['price'] ?? 0);
        try {
            $stmt = $db->prepare('INSERT INTO addons (name,price) VALUES (?,?)');
            $stmt->execute([$name, $price]);
            $id = $db->lastInsertId();
            echo json_encode(['id' => $id, 'name' => $name, 'price' => $price]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        return;
    }

    // PATCH /api/admin/addons/:id
    if ($method === 'PATCH' && $isAdmin && count($segments) === 1) {
        requireRole('admin');
        $id   = (int) $segments[0];
        $sets = []; $vals = [];
        if (isset($body['name']))  { $sets[] = 'name = ?';  $vals[] = $body['name']; }
        if (isset($body['price'])) { $sets[] = 'price = ?'; $vals[] = (int) $body['price']; }
        if (empty($sets)) { http_response_code(400); echo json_encode(['error' => 'Nothing to update']); return; }
        $vals[] = $id;
        $db->prepare('UPDATE addons SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
        echo json_encode(['success' => true]);
        return;
    }

    // DELETE /api/admin/addons/:id
    if ($method === 'DELETE' && $isAdmin && count($segments) === 1) {
        requireRole('admin');
        $id = (int) $segments[0];
        $db->prepare('DELETE FROM addons WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Addon route not found']);
}
