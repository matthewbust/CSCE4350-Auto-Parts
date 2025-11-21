const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest, buildUpdateQuery } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/stores
router.get('/', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT * FROM stores ORDER BY created_at DESC');
  res.json(r.rows);
}));

// GET /api/stores/:id
router.get('/:id', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT * FROM stores WHERE store_id = $1', [req.params.id]);
  if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(r.rows[0]);
}));

// POST /api/stores
router.post('/', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
  const { store_name, address, phone, email } = req.body;
  const r = await db.query('INSERT INTO stores (store_name, address, phone, email) VALUES ($1,$2,$3,$4) RETURNING *', [store_name, address, phone || null, email || null]);
  res.status(201).json(r.rows[0]);
}));

// PUT /api/stores/:id
router.put('/:id', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
  const allowed = ['store_name','address','phone','email'];
  const q = buildUpdateQuery('stores', 'store_id', req.params.id, allowed, req.body);
  if (!q) return res.status(400).json({ error: 'No fields to update' });
  const r = await db.query(q.sql, q.values);
  res.json(r.rows[0]);
}));

module.exports = router;
