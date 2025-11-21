const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest, buildUpdateQuery } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/payment-methods/:customerId
router.get('/:customerId', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT * FROM payment_methods WHERE customer_id = $1 ORDER BY added_at DESC', [req.params.customerId]);
  res.json(r.rows);
}));

// POST /api/payment-methods
router.post('/', authenticate, handleRequest(async (req, res) => {
  const { customer_id, card_type, masked_card_number, card_holder_name, expiry_date, is_default } = req.body;
  const r = await db.query('INSERT INTO payment_methods (customer_id, card_type, masked_card_number, card_holder_name, expiry_date, is_default) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [customer_id, card_type || null, masked_card_number || null, card_holder_name || null, expiry_date || null, is_default || false]);
  res.status(201).json(r.rows[0]);
}));

// PUT /api/payment-methods/:id
router.put('/:id', authenticate, handleRequest(async (req, res) => {
  const allowed = ['card_type','masked_card_number','card_holder_name','expiry_date','is_default'];
  const q = buildUpdateQuery('payment_methods', 'payment_method_id', req.params.id, allowed, req.body);
  if (!q) return res.status(400).json({ error: 'No fields to update' });
  const r = await db.query(q.sql, q.values);
  res.json(r.rows[0]);
}));

// DELETE /api/payment-methods/:id
router.delete('/:id', authenticate, handleRequest(async (req, res) => {
  await db.query('DELETE FROM payment_methods WHERE payment_method_id = $1', [req.params.id]);
  res.json({ ok: true });
}));

// PUT /api/payment-methods/:id/set-default
router.put('/:id/set-default', authenticate, handleRequest(async (req, res) => {
  // find the payment method to get customer_id
  const pm = await db.query('SELECT * FROM payment_methods WHERE payment_method_id = $1', [req.params.id]);
  if (!pm.rows[0]) return res.status(404).json({ error: 'Not found' });
  const customerId = pm.rows[0].customer_id;
  try {
    await db.query('BEGIN');
    await db.query('UPDATE payment_methods SET is_default = false WHERE customer_id = $1', [customerId]);
    const r = await db.query('UPDATE payment_methods SET is_default = true WHERE payment_method_id = $1 RETURNING *', [req.params.id]);
    await db.query('COMMIT');
    res.json(r.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
}));

module.exports = router;
