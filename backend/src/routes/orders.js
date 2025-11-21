const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { customer_id, items, payment_method_id } = req.body;
    if (!customer_id || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Missing fields' });

    // Calculate total and insert order
    let total = 0;
    for (const it of items) total += Number(it.unit_price) * Number(it.quantity);

    const orderRes = await db.query(
      'INSERT INTO orders (customer_id, payment_method_id, total_amount, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [customer_id, payment_method_id || null, total, 'pending']
    );
    const order = orderRes.rows[0];

    for (const it of items) {
      await db.query(
        'INSERT INTO order_items (order_id, part_id, quantity, unit_price, subtotal) VALUES ($1,$2,$3,$4,$5)',
        [order.order_id, it.part_id, it.quantity, it.unit_price, Number(it.unit_price) * Number(it.quantity)]
      );
    }

    res.status(201).json({ order_id: order.order_id });
  } catch (err) { next(err); }
});

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', authenticate, async (req, res, next) => {
  try {
    const orders = await db.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC', [req.params.customerId]);
    // return array directly
    res.json(orders.rows);
  } catch (err) { next(err); }
});

// GET /api/orders/:orderId
router.get('/:orderId', authenticate, async (req, res, next) => {
  try {
    const o = await db.query('SELECT * FROM orders WHERE order_id = $1', [req.params.orderId]);
    if (!o.rows[0]) return res.status(404).json({ error: 'Not found' });
    const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.orderId]);
    // merge order fields with items so frontend can reference order_id directly
    const orderObj = { ...o.rows[0], items: items.rows };
    res.json(orderObj);
  } catch (err) { next(err); }
});

// PUT /api/orders/:orderId/status
router.put('/:orderId/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    const r = await db.query('UPDATE orders SET status = $1, completed_date = CASE WHEN $1 = $2 THEN CURRENT_TIMESTAMP ELSE completed_date END WHERE order_id = $3 RETURNING *', [status, 'completed', req.params.orderId]);
    res.json({ order: r.rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;
