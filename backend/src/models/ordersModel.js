const db = require('../db');

// Create order with items inside a DB transaction to avoid partial writes
async function createOrder({ customerId, items, paymentMethodId, totalAmount }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query(
      'INSERT INTO orders (customer_id, payment_method_id, total_amount, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [customerId, paymentMethodId || null, totalAmount, 'pending']
    );
    const order = orderRes.rows[0];

    for (const it of items) {
      const partId = it.partId || it.part_id;
      const qty = it.quantity;
      const unitPrice = it.unitPrice || it.unit_price;
      const subtotal = Number(unitPrice) * Number(qty || 0);

      await client.query(
        'INSERT INTO order_items (order_id, part_id, quantity, unit_price, subtotal) VALUES ($1,$2,$3,$4,$5)',
        [order.order_id, partId, qty, unitPrice, subtotal]
      );

      // NOTE: consider decrementing inventory here if desired.
    }

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createOrder };
