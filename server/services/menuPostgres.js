
import pool from './postgres.js';
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

// export async function findMenuItems(query = {}, options = {}) {
//   let sql = 'SELECT * FROM menu_items WHERE 1=1';
//   const result1 = await db.query(sql);
//   console.log('findMenuItems result1:', result1);
//   const params = [];

//   if (query.id) {
//     sql += ' AND id = $' + (params.length + 1);
//     params.push(query.id);
//   }
//   if (query.category) {
//     sql += ' AND category = $' + (params.length + 1);
//     params.push(query.category);
//   }
//  if (query.isVegetarian !== undefined) {
//   const bool = query.isVegetarian === true || query.isVegetarian === 'true';
//   sql += ' AND is_vegetarian = $' + (params.length + 1);
//   params.push(bool);
// }
//  if (query.isAvailable !== undefined) {
//   const bool = query.isAvailable === true || query.isAvailable === 'true';
//   sql += ' AND is_available = $' + (params.length + 1);
//   params.push(bool);
// }

//   // Pagination
//   const limit = options.limit || 100;
//   const offset = options.skip || 0;
//   sql += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
//   params.push(limit, offset);

//   const result = await db.query(sql, params);
//   // Map DB fields to API fields
//   const items = result.rows.map(row => ({
//     id: row.id,
//     name: row.name,
//     description: row.description,
//     price: row.price,
//     category: row.category,
//     available: row.is_available,
//     isVegetarian: row.is_vegetarian,
//     image: row.image,
//     preparationTime: row.preparation_time,
//     spiceLevel: row.spice_level,
//     // add more fields as needed
//   }));
//   return {
//     items,
//     total: result.rowCount,
//     page: Math.floor(offset / limit) + 1,
//     totalPages: Math.ceil(result.rowCount / limit)
//   };
// }
export async function findMenuItems(_, options = {}) {
  const limit = options.limit || 100;
  const offset = options.skip || 0;

  const sql = `
    SELECT * FROM menu_items
    ORDER BY name ASC
    LIMIT $1 OFFSET $2
  `;
  const params = [limit, offset];

  const result = await db.query(sql, params);

  const items = result.rows.map(row => {
    let parsedComboItems = [];

    if (row.is_combo && row.combo_items) {
      console.log('Parsing combo_items for item:', row.id);
      if (typeof row.combo_items === 'string') {
        try {
          parsedComboItems = JSON.parse(row.combo_items);
        } catch (err) {
          console.warn('Failed to parse combo_items for item:', row.id, err);
        }
      } else if (Array.isArray(row.combo_items)) {
        parsedComboItems = row.combo_items;

      }

    }

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      available: row.is_available,
      isVegetarian: row.is_vegetarian,
      isVegan: row.is_vegan,
      isGlutenFree: row.is_gluten_free,
      image: row.image,
      preparationTime: row.preparation_time,
      spiceLevel: row.spice_level,
     comboItems: parsedComboItems  
    };
  });

  const countResult = await db.query('SELECT COUNT(*) FROM menu_items');
  const total = parseInt(countResult.rows[0].count, 10);

  return {
  items: result.rows,
    total,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit)
  };
}


// In your dbService.js (or wherever your DB functions are):

export async function addCateringOrder(order) {
  const { id, items, subtotal, total, orderType, paymentStatus, status, orderDate, createdAt, updatedAt, user_id, customer_id, customer_name, customer_email, customer_phone } = order;

  const result = await pool.query(
    `INSERT INTO catering_orders 
    (id, items, subtotal, total, order_type, payment_status, status, order_date, created_at, updated_at, user_id, customer_id, customer_name, customer_email, customer_phone) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
    [id, items, subtotal, total, orderType, paymentStatus, status, orderDate, createdAt, updatedAt, user_id, customer_id, customer_name, customer_email, customer_phone]
  );

  return result.rows[0];
}


// export async function addMenuItem(menuItem) {
//   const { name, price, category } = menuItem;
//   const result = await pool.query(
//     `INSERT INTO menu_items (name, price, category) VALUES ($1, $2, $3) RETURNING *`,
//     [name, price, category]
//   );
//   return result.rows[0];
// }


export async function addMenuItem(menuItem) {
  const {
    name,
    description,
    price,
    category,
    is_available,
    is_vegetarian,
    is_vegan,
    is_gluten_free,
    image,
    preparation_time,
    spice_level,
    ingredients,
    allergens,
    created_at,
    updated_at,
    is_combo,        // ✅ NEW
    combo_items      // ✅ NEW
  } = menuItem;

  const result = await pool.query(
    `INSERT INTO menu_items 
      (name, description, price, category, is_available, is_vegetarian, is_vegan, is_gluten_free, image, preparation_time, spice_level, ingredients, allergens, created_at, updated_at, is_combo, combo_items)
     VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
     RETURNING *`,
    [
      name,
      description,
      price,
      category,
      is_available,
      is_vegetarian,
      is_vegan,
      is_gluten_free,
      image,
      preparation_time,
      spice_level,
      ingredients,
      allergens,
      created_at,
      updated_at,
      is_combo,
      JSON.stringify(combo_items || [])   // ✅ Make sure it's saved as JSON
    ]
  );

  return result.rows[0];
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

export async function deleteMenuItem(id) {
  const result = await pool.query(
    'DELETE FROM menu_items WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error('Menu item not found');
  }

  return result.rows[0];  // Optional: return deleted row info
}


function camelToSnake(str) {
  return str.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);
}

export async function updateMenuItem(id, updates) {
  const keys = Object.keys(updates);
  if (keys.length === 0) {
    throw new Error('No fields provided for update');
  }

  // Convert keys to snake_case for SQL
  const setClauses = keys.map((key, index) => `${camelToSnake(key)} = $${index + 1}`);
  const values = Object.values(updates);

  const sql = `
    UPDATE menu_items
    SET ${setClauses.join(', ')}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(sql, [...values, id]);
  return result.rows[0];
}




