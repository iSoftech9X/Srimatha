import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all customers (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    // Build query
    const query = { role: 'customer' };
    if (status) query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get customers with pagination
    const customers = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Transform data to match frontend expectations
    const transformedCustomers = customers.map(customer => ({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      isActive: customer.isActive,
      totalOrders: 0, // This would come from Order aggregation
      totalSpent: 0, // This would come from Order aggregation
      lastOrderDate: new Date(),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }));

    res.json({
      success: true,
      data: {
        customers: transformedCustomers,
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
router.get('/analytics/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({ role: 'customer', isActive: true });
    
    // Get new customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startOfMonth }
    });

    const analytics = {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      customerGrowthRate: totalCustomers > 0 ? (newCustomersThisMonth / totalCustomers) * 100 : 0,
      averageOrderValue: 325, // This would come from Order aggregation
      customerRetentionRate: 78.5 // This would be calculated from Order data
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