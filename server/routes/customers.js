// import express from 'express';
// import { authenticate, authorize } from '../middleware/auth.js';
// import db from '../services/postgres.js';

// const router = express.Router();

// // Get all customers (Admin only)
// router.get('/', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
//     const customers = (await db.query(
//       "SELECT * FROM users WHERE role = 'customer' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
//       [limit, offset]
//     )).rows;
//     const [{ count: total }] = (await db.query("SELECT COUNT(*) FROM users WHERE role = 'customer' ")).rows;
//     res.json({
//       success: true,
//       data: {
//         customers,
//         total: Number(total),
//         page: Number(page),
//         totalPages: Math.ceil(Number(total) / limit)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
//   }
// });


// // Get customer analytics
// router.get('/analytics/overview', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const analytics = {
//       totalCustomers: 150,
//       activeCustomers: 142,
//       newCustomersThisMonth: 23,
//       customerGrowthRate: 15.3,
//       averageOrderValue: 325,
//       customerRetentionRate: 78.5
//     };

//     res.json({
//       success: true,
//       data: analytics
//     });
//   } catch (error) {
//     console.error('Customer analytics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch customer analytics',
//       error: error.message
//     });
//   }
// });

// export default router;
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import db from '../services/postgres.js';
const router = express.Router();

// GET all customers with pagination
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const customers = (await db.query(
      "SELECT * FROM users WHERE role = 'customer' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    )).rows;
    const [{ count: total }] = (await db.query("SELECT COUNT(*) FROM users WHERE role = 'customer'")).rows;
    res.json({
      success: true,
      data: {
        customers,
        total: Number(total),
        page: Number(page),
        totalPages: Math.ceil(Number(total) / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
  }
});

// POST - create a new customer
// POST /api/customers
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, address_street, address_city, address_state, address_zipcode, address_country } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    // Check if email already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Customer with this email already exists.' });
    }

    const insertQuery = `
      INSERT INTO users (name, email, phone, address_street, address_city, address_state, address_zipcode, address_country, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'customer', true)
      RETURNING *;
    `;
    const values = [name, email, phone, address_street, address_city, address_state, address_zipcode, address_country];

    const { rows } = await db.query(insertQuery, values);

    res.status(201).json({ success: true, data: rows[0] });

  } catch (error) {
    console.error('POST /customers error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create customer', error: error.message });
  }
});

// PUT - update entire customer
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updated = await db.query(
      "UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 AND role = 'customer' RETURNING *",
      [name, email, phone, id]
    );
    if (updated.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
  }
});

// PATCH - partial update (e.g., just email or name)
router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    values.push(id); // for WHERE clause

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} AND role = 'customer' RETURNING *`;
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found or no changes' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to patch customer', error: error.message });
  }
});

// DELETE - delete customer
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.query("DELETE FROM users WHERE id = $1 AND role = 'customer' RETURNING *", [id]);
    if (deleted.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete customer', error: error.message });
  }
});

export default router;
