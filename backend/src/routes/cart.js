const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/cart/:customerId
router.get('/:customerId', authenticate, handleRequest(async (req, res) => {
  const requestedId = Number(req.params.customerId);
  const authId = req.user && req.user.id ? Number(req.user.id) : null;
  // only allow customers to read their own cart unless staff
  if (req.user.role !== 'staff' && authId !== requestedId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const result = await db.query(
    `SELECT ci.cart_item_id, ci.quantity, ci.added_at, p.* FROM cart_items ci JOIN parts p ON ci.part_id = p.part_id WHERE ci.customer_id = $1`,
    [requestedId]
  );
  // frontend expects an array as response.data
  res.json(result.rows);
}));

// POST /api/cart  { customerId, partId, quantity }
router.post('/', authenticate, handleRequest(async (req, res) => {
  const { customerId: bodyCustomerId, partId, quantity } = req.body;
  // prefer authenticated id for customers
  const authId = req.user && req.user.id ? Number(req.user.id) : null;
  const customerId = authId || bodyCustomerId;

  if (!customerId || !partId) return res.status(400).json({ error: 'Missing fields' });

  if (req.user.role !== 'staff' && authId && authId !== Number(customerId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Upsert: if exists, update quantity, else insert
  const existing = await db.query('SELECT * FROM cart_items WHERE customer_id = $1 AND part_id = $2', [customerId, partId]);
  if (existing.rows[0]) {
    const newQty = (existing.rows[0].quantity || 0) + (Number(quantity) || 1);
    const r = await db.query('UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2 RETURNING *', [newQty, existing.rows[0].cart_item_id]);
    return res.json(r.rows[0]);
  }

  const r = await db.query('INSERT INTO cart_items (customer_id, part_id, quantity) VALUES ($1,$2,$3) RETURNING *', [customerId, partId, quantity || 1]);
  res.status(201).json(r.rows[0]);
}));

router.put('/:cartItemId', authenticate, handleRequest(async (req, res) => {
  const { quantity } = req.body;
  // Ensure the cart item belongs to the authenticated user (unless staff)
  const cartCheck = await db.query('SELECT * FROM cart_items WHERE cart_item_id = $1', [req.params.cartItemId]);
  if (!cartCheck.rows[0]) return res.status(404).json({ error: 'Not found' });
  const ownerId = cartCheck.rows[0].customer_id;
  const authId = req.user && req.user.id ? Number(req.user.id) : null;
  if (req.user.role !== 'staff' && authId !== ownerId) return res.status(403).json({ error: 'Forbidden' });

  const r = await db.query('UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2 RETURNING *', [quantity, req.params.cartItemId]);
  res.json(r.rows[0]);
}));

router.delete('/:cartItemId', authenticate, handleRequest(async (req, res) => {
  const cartCheck = await db.query('SELECT * FROM cart_items WHERE cart_item_id = $1', [req.params.cartItemId]);
  if (!cartCheck.rows[0]) return res.status(404).json({ error: 'Not found' });
  const ownerId = cartCheck.rows[0].customer_id;
  const authId = req.user && req.user.id ? Number(req.user.id) : null;
  if (req.user.role !== 'staff' && authId !== ownerId) return res.status(403).json({ error: 'Forbidden' });

  await db.query('DELETE FROM cart_items WHERE cart_item_id = $1', [req.params.cartItemId]);
  res.json({ ok: true });
}));

// DELETE /api/cart/clear/:customerId
router.delete('/clear/:customerId', authenticate, handleRequest(async (req, res) => {
  const requestedId = Number(req.params.customerId);
  const authId = req.user && req.user.id ? Number(req.user.id) : null;
  if (req.user.role !== 'staff' && authId !== requestedId) return res.status(403).json({ error: 'Forbidden' });

  await db.query('DELETE FROM cart_items WHERE customer_id = $1', [requestedId]);
  res.json({ ok: true });
}));

module.exports = router;
