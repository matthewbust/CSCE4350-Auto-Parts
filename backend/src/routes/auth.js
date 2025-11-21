const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { createToken, formatUserWithToken } = require('../services/authService');
const { handleRequest } = require('../utils/dbHelpers');

const router = express.Router();

// POST /api/auth/register
router.post('/register', handleRequest(async (req, res) => {
  // Accept either snake_case or camelCase from frontend
  const first_name = req.body.first_name || req.body.firstName;
  const last_name = req.body.last_name || req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const address = req.body.address;

  if (!first_name || !last_name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hashed = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO customers (first_name, last_name, email, password_hash, phone, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING customer_id, first_name, last_name, email, created_at`,
    [first_name, last_name, email, hashed, phone || null, address || null]
  );
  const dbUser = result.rows[0];
  const token = createToken({ id: dbUser.customer_id, role: 'customer' });
  // return camelCase fields expected by the frontend
  const user = formatUserWithToken({ customerId: dbUser.customer_id, firstName: dbUser.first_name, lastName: dbUser.last_name, email: dbUser.email, role: 'customer' }, token);
  res.status(201).json({ user });
}));

// POST /api/auth/login
router.post('/login', handleRequest(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  // Try customers table first (include name fields)
  const result = await db.query('SELECT customer_id AS id, first_name, last_name, email, password_hash FROM customers WHERE email = $1', [email]);
  let dbUser = result.rows[0];
  let userRole = 'customer';

  // If not found in customers and role requested is staff, try employees
  if (!dbUser && role === 'staff') {
    const r2 = await db.query('SELECT employee_id AS id, first_name, last_name, email, password_hash FROM employees WHERE email = $1', [email]);
    dbUser = r2.rows[0];
    userRole = 'staff';
  }

  if (!dbUser) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, dbUser.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = createToken({ id: dbUser.id, role: userRole });
  const userObj = userRole === 'customer'
    ? formatUserWithToken({ customerId: dbUser.id, firstName: dbUser.first_name, lastName: dbUser.last_name, email: dbUser.email, role: 'customer' }, token)
    : formatUserWithToken({ employeeId: dbUser.id, firstName: dbUser.first_name, lastName: dbUser.last_name, email: dbUser.email, role: 'staff' }, token);

  res.json({ user: userObj });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // For JWTs, client can just discard the token. Optionally implement a blacklist.
  res.json({ ok: true });
});

module.exports = router;
