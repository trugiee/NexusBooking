<?php
// ============================================================
//  api/users.php — User management (admin only)
//  GET  /api/users
//  POST /api/admin/users
//  PATCH /api/admin/users/:id/status
// ============================================================

function sendStatusEmail(string $toEmail, string $name, string $status): void {
    $isApproved = $status === 'approved';
    $subject    = $isApproved ? 'Account Approved - Resort Booking' : 'Account Update - Resort Booking';
    $message    = $isApproved
        ? "Hi {$name},\n\nGood news! Your account has been approved. You can now log in and book your favorite cottages.\n\nBest regards,\nResort Team"
        : "Hi {$name},\n\nWe regret to inform you that your account registration was not approved at this time.\n\nBest regards,\nResort Team";

    // Use our new SMTP mailer for reliability
    sendSMTPEmail($toEmail, $subject, $message);
}

function sendStaffWelcomeEmail(string $toEmail, string $name, string $role, string $password): void {
    $roleName = ucfirst($role);
    $subject  = "Welcome to NEXUS7101 — Your Staff Account is Ready";
    $message  = "Hi {$name},\n\n"
              . "You have been added as a {$roleName} on the NEXUS7101 Website Booking System.\n\n"
              . "Here are your login credentials:\n"
              . "----------------------------------------\n"
              . "  Login URL : http://localhost:5180\n"
              . "  Email     : {$toEmail}\n"
              . "  Password  : {$password}\n"
              . "----------------------------------------\n\n"
              . "Please log in and change your password immediately for security.\n\n"
              . "If you have any questions, contact the administrator.\n\n"
              . "Best regards,\n"
              . "NEXUS7101 Admin Team";

    sendSMTPEmail($toEmail, $subject, $message);
}

function handleUsers(string $method, array $segments): void {
    $db   = getDB();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // GET /api/users — list all users (admin only)
    if ($method === 'GET' && empty($segments)) {
        requireRole('admin');
        $users = $db->query('SELECT id,name,email,role,phone,avatar,birthday,address,status,id_photo FROM users')->fetchAll();
        echo json_encode($users);
        return;
    }

    // POST /api/admin/users — create staff account
    if ($method === 'POST' && empty($segments)) {
        requireRole('admin');
        $name     = trim($body['name']     ?? '');
        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');
        $role     = trim($body['role']     ?? 'inspector');
        $phone    = trim($body['phone']    ?? '');
        $avatar   = "https://i.pravatar.cc/150?u={$name}";
        $hash     = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $db->prepare('INSERT INTO users (name,email,password,role,phone,avatar) VALUES (?,?,?,?,?,?)');
            $stmt->execute([$name, $email, $hash, $role, $phone, $avatar]);
            $id = $db->lastInsertId();

            // Send welcome email with credentials
            sendStaffWelcomeEmail($email, $name, $role, $password);

            echo json_encode(['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role, 'phone' => $phone]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already exists']);
        }
        return;
    }

    // PATCH /api/admin/users/:id/status
    if ($method === 'PATCH' && count($segments) === 2 && $segments[1] === 'status') {
        requireRole('admin');
        $id     = (int) $segments[0];
        $status = trim($body['status'] ?? '');

        $stmt = $db->prepare('SELECT email,name,id_photo FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        $db->prepare('UPDATE users SET status = ? WHERE id = ?')->execute([$status, $id]);
        sendStatusEmail($user['email'], $user['name'], $status);
        echo json_encode(['message' => 'Status updated']);
        return;
    }

    // PUT /api/users/profile — update own profile
    if ($method === 'PUT' && count($segments) === 1 && $segments[0] === 'profile') {
        $user = requireAuth();
        $id = $user['id'];
        $email = trim($body['email'] ?? '');
        $name = trim($body['name'] ?? '');
        $phone = trim($body['phone'] ?? '');
        $password = trim($body['password'] ?? '');

        if (empty($email) || empty($name)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and Name are required']);
            return;
        }

        try {
            if (!empty($password)) {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $db->prepare('UPDATE users SET email = ?, name = ?, phone = ?, password = ? WHERE id = ?');
                $stmt->execute([$email, $name, $phone, $hash, $id]);
            } else {
                $stmt = $db->prepare('UPDATE users SET email = ?, name = ?, phone = ? WHERE id = ?');
                $stmt->execute([$email, $name, $phone, $id]);
            }
            echo json_encode(['message' => 'Profile updated successfully']);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already exists or update failed']);
        }
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'User route not found']);
}
