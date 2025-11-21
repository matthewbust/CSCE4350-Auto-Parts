const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone, address } = req.body;
    if (!first_name || !last_name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO customers (first_name, last_name, email, password_hash, phone, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING customer_id, first_name, last_name, email, created_at`,
      [first_name, last_name, email, hashed, phone || null, address || null]
    );
    const dbUser = result.rows[0];
    // create token and return user object expected by frontend
    const payload = { id: dbUser.customer_id, role: 'customer' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });
    const user = {
      customerId: dbUser.customer_id,
      first_name: dbUser.first_name,
      last_name: dbUser.last_name,
      email: dbUser.email,
      role: 'customer',
      token
    };
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    // Try customers table first
    const result = await db.query('SELECT customer_id AS id, email, password_hash FROM customers WHERE email = $1', [email]);
    let dbUser = result.rows[0];
    let userRole = 'customer';
    let userObj = null;

    // If not found in customers and role requested is staff, try employees
    if (!dbUser && role === 'staff') {
      const r2 = await db.query('SELECT employee_id AS id, email, password_hash, role FROM employees WHERE email = $1', [email]);
      dbUser = r2.rows[0];
      userRole = 'staff';
    }

    if (!dbUser) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, dbUser.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: dbUser.id, role: userRole };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });

    if (userRole === 'customer') {
      userObj = { customerId: dbUser.id, email: dbUser.email, role: 'customer', token };
    } else {
      userObj = { employeeId: dbUser.id, email: dbUser.email, role: 'staff', token };
    }

    res.json({ user: userObj });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // For JWTs, client can just discard the token. Optionally implement a blacklist.
  res.json({ ok: true });
});

module.exports = router;
