require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db.cjs');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendStatusEmail = async (toEmail, name, status) => {
  const isApproved = status === 'approved';
  const subject = isApproved ? 'Account Approved - Resort Booking' : 'Account Update - Resort Booking';
  const message = isApproved 
    ? `Hi ${name},\n\nGood news! Your account has been approved. You can now log in and book your favorite cottages.\n\nBest regards,\nResort Team`
    : `Hi ${name},\n\nWe regret to inform you that your account registration was not approved at this time.\n\nBest regards,\nResort Team`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      text: message
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
    console.log('--- MOCK NOTIFICATION (Email failed) ---');
    console.log(`To: ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------------');
  }
};

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || 'sk_test_placeholder';
const IS_MOCK_MODE = PAYMONGO_SECRET_KEY === 'sk_test_placeholder';

// Middleware for Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (user && bcrypt.compareSync(password, user.password)) {
    if (user.role === 'customer' && user.status === 'pending') {
      return res.status(403).json({ error: 'PENDING_APPROVAL' });
    }
    if (user.role === 'customer' && user.status === 'rejected') {
      return res.status(403).json({ error: 'ACCOUNT_REJECTED' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, status: user.status }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, birthday, address, avatar } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const status = 'pending';

  try {
    const info = db.prepare('INSERT INTO users (name, email, password, phone, birthday, address, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(name, email, hashedPassword, phone, birthday, address, status, avatar || `https://i.pravatar.cc/150?u=${name}`);
    
    res.json({ message: 'Registration successful. Pending approval.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(400).json({ error: err.message || 'Registration failed!' });
  }
});

// --- COTTAGE ROUTES ---

app.post('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const { name, email, password, role, phone } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const avatar = `https://i.pravatar.cc/150?u=${name}`;

  try {
    const info = db.prepare('INSERT INTO users (name, email, password, role, phone, avatar) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, email, hashedPassword, role || 'inspector', phone, avatar);
    res.json({ id: info.lastInsertRowid, name, email, role, phone });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.patch('/api/admin/users/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const { status } = req.body;
  try {
    const user = db.prepare('SELECT email, name FROM users WHERE id = ?').get(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
    
    // Send email notification in background
    sendStatusEmail(user.email, user.name, status);
    
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const users = db.prepare('SELECT id, name, email, role, phone, avatar, birthday, address, status FROM users').all();
  res.json(users);
});

// --- ADMIN COTTAGE MANAGEMENT ---

app.post('/api/admin/cottages', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { category, price, amenities } = req.body;
  try {
    const info = db.prepare('INSERT INTO cottages (category, price, amenities) VALUES (?, ?, ?)')
      .run(category, price, amenities || '');
    res.json({ id: info.lastInsertRowid, category, price, amenities, active: 1 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/admin/cottages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const { category, price, active, amenities } = req.body;
  
  try {
    const sets = [];
    const vals = [];
    if (category !== undefined) { sets.push('category = ?'); vals.push(category); }
    if (price !== undefined) { sets.push('price = ?'); vals.push(price); }
    if (active !== undefined) { sets.push('active = ?'); vals.push(active ? 1 : 0); }
    if (amenities !== undefined) { sets.push('amenities = ?'); vals.push(amenities); }
    
    vals.push(id);
    db.prepare(`UPDATE cottages SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/cottages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { id } = req.params;
  try {
    // Note: In a production app, you might want to check for active bookings before deleting
    db.prepare('DELETE FROM cottages WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- ADMIN ADD-ON MANAGEMENT ---

app.get('/api/addons', (req, res) => {
  const addons = db.prepare('SELECT * FROM addons').all();
  res.json(addons);
});

app.post('/api/admin/addons', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { name, price } = req.body;
  try {
    const info = db.prepare('INSERT INTO addons (name, price) VALUES (?, ?)').run(name, price);
    res.json({ id: info.lastInsertRowid, name, price });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/admin/addons/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const sets = [];
    const vals = [];
    if (name !== undefined) { sets.push('name = ?'); vals.push(name); }
    if (price !== undefined) { sets.push('price = ?'); vals.push(price); }
    vals.push(id);
    db.prepare(`UPDATE addons SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/addons/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM addons WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/cottages', (req, res) => {
  const cottages = db.prepare('SELECT * FROM cottages').all();
  res.json(cottages.map(c => ({
    ...c,
    amenities: c.amenities ? c.amenities.split(',') : [],
    active: !!c.active
  })));
});

// --- BOOKING ROUTES ---

app.get('/api/bookings', authenticateToken, (req, res) => {
  let bookings;
  if (req.user.role === 'admin') {
    bookings = db.prepare('SELECT * FROM bookings').all();
  } else {
    bookings = db.prepare('SELECT * FROM bookings WHERE userId = ?').all(req.user.id);
  }
  res.json(bookings.map(b => ({
    ...b,
    addons: b.addons ? b.addons.split(',') : []
  })));
});

app.post('/api/bookings', authenticateToken, (req, res) => {
  const { cottageId, date, addons, total, paymentMethod, gcashRef } = req.body;

  // Only block if there is already a CONFIRMED booking for this cottage and date
  const existing = db.prepare('SELECT id FROM bookings WHERE cottageId = ? AND date = ? AND status = ?')
    .get(cottageId, date, 'Confirmed');
  if (existing) return res.status(400).json({ error: 'Cottage is already booked/confirmed for this date' });

  const id = `TRX-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;

  db.prepare('INSERT INTO bookings (id, userId, cottageId, date, addons, total, paymentMethod, gcashRef) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, req.user.id, cottageId, date, addons.join(','), total, paymentMethod, gcashRef || null);

  res.json({ id, status: 'Pending' });
});

app.patch('/api/bookings/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  // SECURITY: Only ADMIN can manually change status to anything.
  // Customers can ONLY change status to 'Cancelled'.
  if (req.user.role === 'admin') {
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    return res.json({ success: true, message: `Status updated to ${status}` });
  } 
  
  if (booking.userId === req.user.id && status === 'Cancelled') {
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('Cancelled', id);
    return res.json({ success: true, message: 'Booking cancelled' });
  }

  res.status(403).json({ error: 'Unauthorized status change' });
});

// New Endpoint to verify and confirm payment automatically
app.post('/api/bookings/:id/verify-payment', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

  if (!booking || booking.userId !== req.user.id) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  try {
    // FINAL CHECK: Make sure nobody else confirmed this cottage/date while we were paying
    const conflict = db.prepare('SELECT id FROM bookings WHERE cottageId = ? AND date = ? AND status = ? AND id != ?')
      .get(booking.cottageId, booking.date, 'Confirmed', id);
    if (conflict) return res.status(400).json({ error: 'Sorry, this cottage was just confirmed by someone else. Please contact support for a refund.' });

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('Confirmed', id);
    console.log(`✅ Booking ${id} automatically confirmed via verification endpoint.`);
    
    res.json({ success: true, status: 'Confirmed' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// --- PAYMONGO ROUTES (Modified to integrate with DB) ---

app.post('/api/create-checkout', authenticateToken, async (req, res) => {
  const { amount, description, bookingId, origin } = req.body;
  const baseUri = origin || 'http://localhost:5173';

  try {
    if (IS_MOCK_MODE) {
      return res.json({ checkout_url: `${baseUri}/?status=success&id=${bookingId}` });
    }

    const response = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: description,
          line_items: [{ amount: amount * 100, currency: 'PHP', name: description, quantity: 1 }],
          payment_method_types: ['gcash'],
          success_url: `${baseUri}/?status=success&id=${bookingId}`,
          cancel_url: `${baseUri}/?status=cancelled`
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`
      }
    });

    res.json({ checkout_url: response.data.data.attributes.checkout_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = process.env.PORT || 3005;
const server = app.listen(PORT, () => {
  console.log(`🚀 Full-stack Backend running on http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
});
