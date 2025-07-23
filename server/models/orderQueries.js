import db from '../services/postgres.js';

export async function createOrder({ orderNumber, customerId, status, subtotal, total, paymentStatus, orderType, items }) {
  const orderResult = await db.query(
    `INSERT INTO orders (order_number, customer_id, status, subtotal, total, payment_status, order_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [orderNumber, customerId, status, subtotal, total, paymentStatus, orderType]
  );
  const order = orderResult.rows[0];

  // Insert order items
  for (const item of items) {
    await db.query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, item.menuItemId, item.quantity, item.price, item.specialInstructions || null]
    );
  }
  return order;
}

export async function findOrders({ customerId, status, orderType, limit = 100, skip = 0 }) {
  let where = [];
  let params = [];
  let idx = 1;
  if (customerId) { where.push(`customer_id = $${idx++}`); params.push(customerId); }
  if (status) { where.push(`status = $${idx++}`); params.push(status); }
  if (orderType) { where.push(`order_type = $${idx++}`); params.push(orderType); }
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const ordersResult = await db.query(
    `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, skip]
  );
  return ordersResult.rows;
}

export async function updateOrder(orderId, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  // Prevent double update if updated_at is included
  const hasUpdatedAt = keys.includes('updated_at');

  const setClauseParts = keys.map((k, i) => `${k} = $${i + 2}`);

  // Add `updated_at = CURRENT_TIMESTAMP` only if not already included
  if (!hasUpdatedAt) {
    setClauseParts.push(`updated_at = CURRENT_TIMESTAMP`);
  }

  const setClause = setClauseParts.join(', ');
  const values = [orderId, ...keys.map(k => fields[k])];

  const result = await db.query(
    `UPDATE orders SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
}

