const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { handleRequest } = require('../utils/dbHelpers');

const router = express.Router();

// GET /api/reports/daily-sales?date=YYYY-MM-DD
router.get('/daily-sales', authenticate, handleRequest(async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0,10);
  const r = await db.query("SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE CAST(order_date AS date) = $1", [date]);
  res.json({ total: parseFloat(r.rows[0].total) });
}));

// GET /api/reports/weekly-sales?startDate=YYYY-MM-DD
router.get('/weekly-sales', authenticate, handleRequest(async (req, res) => {
  const start = req.query.startDate;
  if (!start) return res.status(400).json({ error: 'startDate required' });
  const r = await db.query("SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE CAST(order_date AS date) >= $1 AND CAST(order_date AS date) < ($1::date + INTERVAL '7 days')", [start]);
  res.json({ total: parseFloat(r.rows[0].total) });
}));

// GET /api/reports/monthly-sales?year=YYYY&month=MM
router.get('/monthly-sales', authenticate, handleRequest(async (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) return res.status(400).json({ error: 'year and month required' });
  const r = await db.query("SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE EXTRACT(YEAR FROM order_date) = $1::int AND EXTRACT(MONTH FROM order_date) = $2::int", [year, month]);
  res.json({ total: parseFloat(r.rows[0].total) });
}));

// GET /api/reports/employee-activity/:employeeId?startDate&endDate
router.get('/employee-activity/:employeeId', authenticate, handleRequest(async (req, res) => {
  const { startDate, endDate } = req.query;
  const emp = req.params.employeeId;
  const sql = `SELECT COUNT(*) AS orders_handled, COALESCE(SUM(total_amount),0) AS total_sales FROM orders WHERE employee_id = $1` + (startDate && endDate ? ' AND CAST(order_date AS date) BETWEEN $2 AND $3' : '');
  const params = startDate && endDate ? [emp, startDate, endDate] : [emp];
  const r = await db.query(sql, params);
  res.json({ orders_handled: Number(r.rows[0].orders_handled), total_sales: parseFloat(r.rows[0].total_sales) });
}));

module.exports = router;
