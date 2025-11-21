const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest } = require('../utils/dbHelpers');
const { createOrder } = require('../models/ordersModel');

const router = express.Router();

// POST /api/orders
router.post('/', authenticate, handleRequest(async (req, res) => {
  // Frontend sends camelCase: customerId, items (with partId, quantity, unitPrice), totalAmount
  const { customerId, items, paymentMethodId, totalAmount } = req.body;
  if (!customerId || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Missing fields' });

  const order = await createOrder({ customerId, items, paymentMethodId, totalAmount });
  res.status(201).json({ order_id: order.order_id });
}));

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', authenticate, handleRequest(async (req, res) => {
  const orders = await db.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC', [req.params.customerId]);
  // return array directly
  res.json(orders.rows);
}));

// GET /api/orders/:orderId
router.get('/:orderId', authenticate, handleRequest(async (req, res) => {
  const o = await db.query('SELECT * FROM orders WHERE order_id = $1', [req.params.orderId]);
  if (!o.rows[0]) return res.status(404).json({ error: 'Not found' });
  const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.orderId]);
  // merge order fields with items so frontend can reference order_id directly
  const orderObj = { ...o.rows[0], items: items.rows };
  res.json(orderObj);
}));

// PUT /api/orders/:orderId/status
router.put('/:orderId/status', authenticate, handleRequest(async (req, res) => {
  const { status } = req.body;
  const r = await db.query('UPDATE orders SET status = $1, completed_date = CASE WHEN $1 = $2 THEN CURRENT_TIMESTAMP ELSE completed_date END WHERE order_id = $3 RETURNING *', [status, 'completed', req.params.orderId]);
  res.json({ order: r.rows[0] });
}));

module.exports = router;
