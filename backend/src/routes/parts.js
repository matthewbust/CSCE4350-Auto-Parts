const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/parts
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const q = 'SELECT * FROM parts ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await db.query(q, [Number(limit), offset]);
    // frontend expects an array as response.data
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/parts/search?q=...
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const sql = `SELECT * FROM parts WHERE name ILIKE $1 OR part_number ILIKE $1 OR description ILIKE $1 LIMIT 100`;
    const result = await db.query(sql, [`%${q}%`]);
    // return array directly
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/parts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM parts WHERE part_id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    // return the part object directly
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Protected create/update/delete for employees
router.post('/', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).json({ error: 'Forbidden' });
    const { part_number, name, description, manufacturer, category, price, status } = req.body;
    const result = await db.query(
      `INSERT INTO parts (part_number, name, description, manufacturer, category, price, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [part_number, name, description || null, manufacturer || null, category || null, price, status || 'available']
    );
    res.status(201).json({ part: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).json({ error: 'Forbidden' });
    const fields = ['part_number','name','description','manufacturer','category','price','status'];
    const updates = [];
    const values = [];
    let idx = 1;
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = $${idx}`);
        values.push(req.body[f]);
        idx++;
      }
    }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    const sql = `UPDATE parts SET ${updates.join(', ')} WHERE part_id = $${idx} RETURNING *`;
    const result = await db.query(sql, values);
    res.json({ part: result.rows[0] });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'employee') return res.status(403).json({ error: 'Forbidden' });
    await db.query('DELETE FROM parts WHERE part_id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
