<?php
// ============================================================
//  database.php — SQLite Connection + Schema + Seed
// ============================================================

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // ---------- CREATE TABLES ----------
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT    NOT NULL,
            email    TEXT    UNIQUE NOT NULL,
            password TEXT    NOT NULL,
            role     TEXT    DEFAULT 'customer',
            phone    TEXT,
            birthday TEXT,
            address  TEXT,
            status   TEXT    DEFAULT 'approved',
            avatar   TEXT,
            id_photo TEXT
        );

        CREATE TABLE IF NOT EXISTS cottages (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            category  TEXT    NOT NULL,
            price     INTEGER NOT NULL,
            active    INTEGER DEFAULT 1,
            amenities TEXT
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id            TEXT    PRIMARY KEY,
            userId        INTEGER,
            cottageId     INTEGER,
            date          TEXT,
            status        TEXT    DEFAULT 'Pending',
            addons        TEXT,
            total         INTEGER,
            paymentMethod TEXT,
            gcashRef      TEXT,
            FOREIGN KEY(userId)    REFERENCES users(id),
            FOREIGN KEY(cottageId) REFERENCES cottages(id)
        );

        CREATE TABLE IF NOT EXISTS addons (
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            name  TEXT    NOT NULL,
            price INTEGER NOT NULL
        );
    ");

    // ---------- AUTO-EXPIRY (3 DAYS) ----------
    $pdo->exec("UPDATE bookings SET status = 'Expired' WHERE status = 'Pending' AND created_at < datetime('now', '-3 days')");

    // Migrations
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN id_photo TEXT");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE bookings ADD COLUMN walkin_name TEXT");
    } catch (PDOException $e) {}

    try {
        $pdo->exec("ALTER TABLE bookings ADD COLUMN created_at DATETIME");
    } catch (PDOException $e) {}

    // ---------- SEED USERS ----------
    $userCount = $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $hash = password_hash('password', PASSWORD_BCRYPT);
    if ($userCount == 0) {
        $stmt = $pdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)');
        $stmt->execute(['Alice Smith',  'customer@example.com',  $hash, 'customer']);
        $stmt->execute(['Bob Wilson',   'admin@example.com',     $hash, 'admin']);
        $stmt->execute(['Guard Juan',   'inspector@example.com', $hash, 'inspector']);
    }

    // ---------- SEED ADD-ONS ----------
    $addonCount = $pdo->query('SELECT COUNT(*) FROM addons')->fetchColumn();
    if ($addonCount == 0) {
        $a = $pdo->prepare('INSERT INTO addons (name,price) VALUES (?,?)');
        $a->execute(['Grill',    150]);
        $a->execute(['Videoke',  500]);
    }

    // ---------- SEED COTTAGES ----------
    $cottageCount = $pdo->query('SELECT COUNT(*) FROM cottages')->fetchColumn();
    if ($cottageCount == 0) {
        $c = $pdo->prepare('INSERT INTO cottages (category,price,amenities) VALUES (?,?,?)');
        for ($i = 0; $i < 30; $i++) {
            if ($i < 10)      { $cat = 'Premium Seafront'; $price = 2500; $amenities = 'wifi,ac,pool'; }
            elseif ($i < 20)  { $cat = 'Deluxe Garden';   $price = 1800; $amenities = 'wifi,ac'; }
            else               { $cat = 'Standard Cozy';   $price = 1500; $amenities = 'wifi,ac'; }
            $c->execute([$cat, $price, $amenities]);
        }
    }

    return $pdo;
}
