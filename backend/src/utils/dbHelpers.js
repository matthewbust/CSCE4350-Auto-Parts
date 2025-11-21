const db = require('../db');

// Wrapper to reduce try/catch repetition in routes
const handleRequest = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// Build a dynamic UPDATE query for allowed fields.
// Returns null if no fields to update, otherwise { sql, values }
const buildUpdateQuery = (table, idColumn, idValue, allowedFields, body) => {
  const updates = [];
  const values = [];
  let idx = 1;
  for (const f of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, f)) {
      updates.push(`${f} = $${idx}`);
      values.push(body[f]);
      idx++;
    }
  }
  if (updates.length === 0) return null;
  values.push(idValue);
  const sql = `UPDATE ${table} SET ${updates.join(', ')} WHERE ${idColumn} = $${idx} RETURNING *`;
  return { sql, values };
};

module.exports = { handleRequest, buildUpdateQuery };
