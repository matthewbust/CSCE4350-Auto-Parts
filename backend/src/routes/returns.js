const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest } = require('../utils/dbHelpers');

const router = express.Router();

// POST /api/returns
router.post('/', authenticate, handleRequest(async (req, res) => {
  const { order_id, order_item_id, reason, quantity, refund_amount } = req.body;
  const r = await db.query('INSERT INTO returns (order_id, order_item_id, reason, quantity, refund_amount) VALUES ($1,$2,$3,$4,$5) RETURNING *', [order_id, order_item_id, reason || null, quantity, refund_amount]);
  res.status(201).json(r.rows[0]);
}));

// GET /api/returns/customer/:customerId
router.get('/customer/:customerId', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT re.* FROM returns re JOIN orders o ON re.order_id = o.order_id WHERE o.customer_id = $1 ORDER BY re.requested_date DESC', [req.params.customerId]);
  res.json(r.rows);
}));

// PUT /api/returns/:returnId/status
router.put('/:returnId/status', authenticate, handleRequest(async (req, res) => {
  const { status } = req.body;
  const sql = 'UPDATE returns SET status = $1, processed_date = CASE WHEN $1 != $2 THEN CURRENT_TIMESTAMP ELSE processed_date END WHERE return_id = $3 RETURNING *';
  const r = await db.query(sql, [status, 'pending', req.params.returnId]);
  res.json(r.rows[0]);
}));

// GET /api/returns
router.get('/', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT * FROM returns ORDER BY requested_date DESC');
  res.json(r.rows);
}));

module.exports = router;
