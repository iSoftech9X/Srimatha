import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import pool from '../services/postgres.js';

const router = express.Router();

 // Submit contact form
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, phone, subject, message } = req.body;

//     // Mock contact submission
//     const contact = {
//       _id: Date.now().toString(),
//       name,
//       email,
//       phone,
//       subject,
//       message,
//       status: 'new',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     res.status(201).json({
//       success: true,
//       message: 'Contact form submitted successfully. We will get back to you soon!',
//       data: { contact }
//     });
//   } catch (error) {
//     console.error('Contact form submission error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit contact form',
//       error: error.message
//     });
//   }
// });

// Get all contacts (Admin only)
// router.get('/', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status } = req.query;

//     // Mock contacts data
//     const contacts = [];
//     const total = contacts.length;
//     const totalPages = Math.ceil(total / parseInt(limit));

//     res.json({
//       success: true,
//       data: {
//         contacts,
//         total,
//         page: parseInt(page),
//         totalPages
//       }
//     });
//   } catch (error) {
//     console.error('Contacts fetch error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch contacts',
//       error: error.message
//     });
//   }
// });

// const pool = require('./db');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, phone, subject, message]
    );

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      data: { contact: result.rows[0] }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
});

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const baseQuery = status
      ? 'SELECT * FROM contacts WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3'
      : 'SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2';

    const countQuery = status
      ? 'SELECT COUNT(*) FROM contacts WHERE status = $1'
      : 'SELECT COUNT(*) FROM contacts';

    const values = status
      ? [status, limit, offset]
      : [limit, offset];

    const countValues = status ? [status] : [];

    const contactsResult = await pool.query(baseQuery, values);
    const countResult = await pool.query(countQuery, countValues);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        contacts: contactsResult.rows,
        total,
        page: parseInt(page),
        totalPages
      }
    });
  } catch (error) {
    console.error('Contacts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
});



export default router;