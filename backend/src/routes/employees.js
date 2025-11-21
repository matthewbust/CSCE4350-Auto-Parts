const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { authenticate } = require('../middleware/auth');
const { handleRequest, buildUpdateQuery } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/employees
router.get('/', authenticate, handleRequest(async (req, res) => {
  const { page = 1, limit = 100 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const r = await db.query('SELECT employee_id, first_name, last_name, email, role, hire_date, salary, is_active, created_at, store_id FROM employees ORDER BY created_at DESC LIMIT $1 OFFSET $2', [Number(limit), offset]);
  res.json(r.rows);
}));

// GET /api/employees/:id
router.get('/:id', authenticate, handleRequest(async (req, res) => {
  const r = await db.query('SELECT employee_id, first_name, last_name, email, role, hire_date, salary, is_active, created_at, store_id FROM employees WHERE employee_id = $1', [req.params.id]);
  if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(r.rows[0]);
}));

// POST /api/employees
router.post('/', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
  const { first_name, last_name, email, password, role, salary, store_id } = req.body;
  const hash = await bcrypt.hash(password || 'changeme', 10);
  const r = await db.query('INSERT INTO employees (first_name, last_name, email, password_hash, role, salary, store_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING employee_id, first_name, last_name, email, role, hire_date, salary, is_active, created_at, store_id', [first_name, last_name, email, hash, role || null, salary || null, store_id || null]);
  res.status(201).json(r.rows[0]);
}));

// PUT /api/employees/:id
router.put('/:id', authenticate, handleRequest(async (req, res) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
  const allowed = ['first_name','last_name','email','role','salary','is_active','store_id'];
  // build update for allowed fields
  const q = buildUpdateQuery('employees', 'employee_id', req.params.id, allowed, req.body);
  let finalQ = q;
  // handle password separately (hash)
  if (req.body.password) {
    const h = await bcrypt.hash(req.body.password, 10);
    if (finalQ) {
      // append password_hash to sql/values
      // replace the RETURNING placeholder push id then insert password_hash before id
      const insertPos = finalQ.values.length; // last is id
      finalQ.values.splice(insertPos, 0, h);
      // we need to inject `password_hash = $<n>` before WHERE; rebuild sql
      const idx = finalQ.values.length - 1; // position of id after splice
      const sqlPrefix = finalQ.sql.replace(' RETURNING *', '');
      const updatedSql = sqlPrefix.replace(/WHERE .*$/, (m) => `, password_hash = $${idx} ${m}`) + ' RETURNING *';
      finalQ.sql = updatedSql;
    } else {
      // only password
      finalQ = { sql: 'UPDATE employees SET password_hash = $1 WHERE employee_id = $2 RETURNING *', values: [h, req.params.id] };
    }
  }
  if (!finalQ) return res.status(400).json({ error: 'No fields to update' });
  const r = await db.query(finalQ.sql, finalQ.values);
  res.json(r.rows[0]);
}));

// DELETE /api/employees/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'staff') return res.status(403).json({ error: 'Forbidden' });
    await db.query('DELETE FROM employees WHERE employee_id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
