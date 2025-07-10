// Get all unique categories from menu_items
export async function getMenuCategories() {
  const result = await db.query('SELECT DISTINCT category FROM menu_items ORDER BY category');
  // Return as array of { id: category, name: formattedName }
  return result.rows.map(row => ({
    id: row.category,
    name: row.category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  }));
}
// Service to fetch menu items from PostgreSQL
import db from './postgres.js';

export async function findMenuItems(query = {}, options = {}) {
  let sql = 'SELECT * FROM menu_items WHERE 1=1';
  const params = [];

  if (query.id) {
    sql += ' AND id = $' + (params.length + 1);
    params.push(query.id);
  }
  if (query.category) {
    sql += ' AND category = $' + (params.length + 1);
    params.push(query.category);
  }
  if (query.isVegetarian !== undefined) {
    sql += ' AND is_vegetarian = $' + (params.length + 1);
    params.push(query.isVegetarian);
  }
  if (query.isAvailable !== undefined) {
    sql += ' AND is_available = $' + (params.length + 1);
    params.push(query.isAvailable);
  }

  // Pagination
  const limit = options.limit || 100;
  const offset = options.skip || 0;
  sql += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await db.query(sql, params);
  // Map DB fields to API fields
  const items = result.rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    available: row.is_available,
    isVegetarian: row.is_vegetarian,
    image: row.image,
    preparationTime: row.preparation_time,
    spiceLevel: row.spice_level,
    // add more fields as needed
  }));
  return {
    items,
    total: result.rowCount,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(result.rowCount / limit)
  };
}

export async function getDashboardStats() {
  // Get total customers
  const [{ count: totalCustomers }] = (await db.query('SELECT COUNT(*) FROM users')).rows;
  // Get total orders
  const [{ count: totalOrders }] = (await db.query('SELECT COUNT(*) FROM orders')).rows;
  // Get total revenue
  //const [{ sum: totalRevenue }] = (await db.query('SELECT SUM(total) FROM orders')).rows;
  // Get today's orders
  const [{ count: todayOrders }] = (await db.query("SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE")).rows;
  // Get pending orders
  const [{ count: pendingOrders }] = (await db.query("SELECT COUNT(*) FROM orders WHERE status = 'pending' ")).rows;
  // Get popular items
  const popularItems = (await db.query(
    `SELECT menu_item_id, COUNT(*) as order_count
     FROM order_items
     GROUP BY menu_item_id
     ORDER BY order_count DESC
     LIMIT 5`
  )).rows;

  return {
    totalCustomers: parseInt(totalCustomers, 10) || 0,
    totalOrders: parseInt(totalOrders, 10) || 0,
    //totalRevenue: parseFloat(totalRevenue) || 0,
    todayOrders: parseInt(todayOrders, 10) || 0,
    pendingOrders: parseInt(pendingOrders, 10) || 0,
    popularItems
  };
}
