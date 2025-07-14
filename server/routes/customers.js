import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import db from '../services/postgres.js';

const router = express.Router();

// Get all customers (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const customers = (await db.query(
      "SELECT * FROM users WHERE role = 'customer' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    )).rows;
    const [{ count: total }] = (await db.query("SELECT COUNT(*) FROM users WHERE role = 'customer' ")).rows;
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

// Get customer analytics
router.get('/analytics/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const analytics = {
      totalCustomers: 150,
      activeCustomers: 142,
      newCustomersThisMonth: 23,
      customerGrowthRate: 15.3,
      averageOrderValue: 325,
      customerRetentionRate: 78.5
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer analytics',
      error: error.message
    });
  }
});

export default router;