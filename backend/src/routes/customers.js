const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest, buildUpdateQuery } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/customers/:customerId
router.get('/:customerId', authenticate, handleRequest(async (req, res) => {
  const result = await db.query('SELECT customer_id, first_name, last_name, email, phone, address, created_at, is_active FROM customers WHERE customer_id = $1', [req.params.customerId]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
}));

// PUT /api/customers/:customerId
router.put('/:customerId', authenticate, handleRequest(async (req, res) => {
  const allowed = ['first_name','last_name','phone','address','is_active'];
  const q = buildUpdateQuery('customers', 'customer_id', req.params.customerId, allowed, req.body);
  if (!q) return res.status(400).json({ error: 'No fields to update' });
  // return specific columns to match earlier behavior
  const r = await db.query(q.sql, q.values);
  // pick fields to return
  const out = (({ customer_id, first_name, last_name, email, phone, address, created_at, is_active }) => ({ customer_id, first_name, last_name, email, phone, address, created_at, is_active }))(r.rows[0]);
  res.json(out);
}));

// POST /api/customers/:customerId/vehicles
router.post('/:customerId/vehicles', authenticate, async (req, res, next) => {
  try {
    const { make, model, year, vin } = req.body;
    const customerId = req.params.customerId;
    const r = await db.query('INSERT INTO vehicles (customer_id, make, model, year, vin) VALUES ($1,$2,$3,$4) RETURNING *', [customerId, make, model, year, vin || null]);
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
});

// GET /api/customers/:customerId/vehicles
router.get('/:customerId/vehicles', authenticate, async (req, res, next) => {
  try {
    const r = await db.query('SELECT * FROM vehicles WHERE customer_id = $1', [req.params.customerId]);
    res.json(r.rows);
  } catch (err) { next(err); }
});

module.exports = router;
