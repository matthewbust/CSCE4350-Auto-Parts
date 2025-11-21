const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/inventory/store/:storeId
router.get('/store/:storeId', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT i.*, p.name, p.part_number FROM inventory i JOIN parts p ON i.part_id = p.part_id WHERE i.store_id = $1', [req.params.storeId]);
  res.json(r.rows);
}));

// PUT /api/inventory/:inventoryId
router.put('/:inventoryId', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
  const { quantity } = req.body;
  const r = await db.query('UPDATE inventory SET quantity = $1, last_updated = CURRENT_TIMESTAMP WHERE inventory_id = $2 RETURNING *', [quantity, req.params.inventoryId]);
  res.json(r.rows[0]);
}));

// GET /api/inventory/store/:storeId/low-stock
router.get('/store/:storeId/low-stock', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT i.*, p.name, p.part_number FROM inventory i JOIN parts p ON i.part_id = p.part_id WHERE i.store_id = $1 AND i.quantity <= COALESCE(i.reorder_level, 10)', [req.params.storeId]);
  res.json(r.rows);
}));

module.exports = router;
