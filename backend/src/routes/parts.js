const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest, buildUpdateQuery } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/parts
router.get('/', handleRequest(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const q = 'SELECT * FROM parts ORDER BY created_at DESC LIMIT $1 OFFSET $2';
  const result = await db.query(q, [Number(limit), offset]);
  res.json(result.rows);
}));

// GET /api/parts/search?q=...
router.get('/search', handleRequest(async (req, res) => {
  const q = req.query.q || '';
  const sql = `SELECT * FROM parts WHERE name ILIKE $1 OR part_number ILIKE $1 OR description ILIKE $1 LIMIT 100`;
  const result = await db.query(sql, [`%${q}%`]);
  res.json(result.rows);
}));

// GET /api/parts/:id
router.get('/:id', handleRequest(async (req, res) => {
  const result = await db.query('SELECT * FROM parts WHERE part_id = $1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
}));

// Protected create/update/delete for employees
router.post('/', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ error: 'Forbidden' });
  const { part_number, name, description, manufacturer, category, price, status } = req.body;
  const result = await db.query(
    `INSERT INTO parts (part_number, name, description, manufacturer, category, price, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [part_number, name, description || null, manufacturer || null, category || null, price, status || 'available']
  );
  res.status(201).json({ part: result.rows[0] });
}));

router.put('/:id', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ error: 'Forbidden' });
  const fields = ['part_number','name','description','manufacturer','category','price','status'];
  const q = buildUpdateQuery('parts', 'part_id', req.params.id, fields, req.body);
  if (!q) return res.status(400).json({ error: 'No fields to update' });
  const result = await db.query(q.sql, q.values);
  res.json({ part: result.rows[0] });
}));

router.delete('/:id', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ error: 'Forbidden' });
  await db.query('DELETE FROM parts WHERE part_id = $1', [req.params.id]);
  res.json({ ok: true });
}));

module.exports = router;
