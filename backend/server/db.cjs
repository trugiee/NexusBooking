const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    birthday TEXT,
    address TEXT,
    status TEXT DEFAULT 'approved',
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS cottages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    active BOOLEAN DEFAULT 1,
    amenities TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    cottageId INTEGER,
    date TEXT,
    status TEXT DEFAULT 'Pending',
    addons TEXT,
    total INTEGER,
    paymentMethod TEXT,
    gcashRef TEXT,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(cottageId) REFERENCES cottages(id)
  );

  CREATE TABLE IF NOT EXISTS addons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
if (userCount === 0) {
  const hash = bcrypt.hashSync('password', 10);
  db.prepare('INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)')
    .run('Alice Smith', 'customer@example.com', hash, 'customer', 'https://i.pravatar.cc/150?u=alice');
  db.prepare('INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)')
    .run('Bob Wilson', 'admin@example.com', hash, 'admin', 'https://i.pravatar.cc/150?u=bob');
  db.prepare('INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)')
    .run('Guard Juan', 'inspector@example.com', hash, 'inspector', 'https://i.pravatar.cc/150?u=juan');
}

const addonCount = db.prepare('SELECT count(*) as count FROM addons').get().count;
if (addonCount === 0) {
  db.prepare('INSERT INTO addons (name, price) VALUES (?, ?)').run('Grill', 150);
  db.prepare('INSERT INTO addons (name, price) VALUES (?, ?)').run('Videoke', 500);
}

const cottageCount = db.prepare('SELECT count(*) as count FROM cottages').get().count;
if (cottageCount === 0) {
  const insertCottage = db.prepare('INSERT INTO cottages (category, price, amenities) VALUES (?, ?, ?)');
  for (let i = 0; i < 30; i++) {
    const category = i < 10 ? 'Premium Seafront' : (i < 20 ? 'Deluxe Garden' : 'Standard Cozy');
    const price = i < 10 ? 2500 : (i < 20 ? 1800 : 1500);
    const amenities = i < 10 ? 'wifi,ac,pool' : 'wifi,ac';
    insertCottage.run(category, price, amenities);
  }
}

module.exports = db;
