import express from 'express';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all customers (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    // Mock customer data for now
    const customers = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        role: 'customer',
        isActive: true,
        totalOrders: 5,
        totalSpent: 1250,
        lastOrderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        role: 'customer',
        isActive: true,
        totalOrders: 3,
        totalSpent: 890,
        lastOrderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const total = customers.length;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        customers,
        total,
        page: parseInt(page),
        totalPages
      }
    });
  } catch (error) {
    console.error('Customers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
});

// Get customer analytics
router.get('/analytics/overview', adminAuth, async (req, res) => {
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