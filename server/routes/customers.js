import express from 'express';
import { query, validationResult } from 'express-validator';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all customers (Admin only)
router.get('/', authenticate, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim().isLength({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'inactive'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      status
    } = req.query;

    // Build filter
    const filter = { role: 'customer' };
    
    if (status) {
      filter.isActive = status === 'active';
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get customers with order statistics
    const [customers, total] = await Promise.all([
      User.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            totalOrders: { $size: '$orders' },
            totalSpent: {
              $sum: {
                $map: {
                  input: '$orders',
                  as: 'order',
                  in: '$$order.totalAmount'
                }
              }
            },
            lastOrderDate: {
              $max: '$orders.createdAt'
            }
          }
        },
        {
          $project: {
            password: 0,
            orders: 0
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
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

// Get single customer details (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const customer = await User.findOne({ 
      _id: req.params.id, 
      role: 'customer' 
    }).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer's order history
    const orders = await Order.find({ customer: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('items.menuItem', 'name price');

    // Calculate statistics
    const stats = await Order.aggregate([
      { $match: { customer: customer._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          lastOrderDate: { $max: '$createdAt' }
        }
      }
    ]);

    const customerStats = stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      lastOrderDate: null
    };

    res.json({
      success: true,
      data: {
        customer,
        orders,
        stats: customerStats
      }
    });
  } catch (error) {
    console.error('Customer fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details',
      error: error.message
    });
  }
});

// Update customer status (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const customer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'customer' },
      { isActive },
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { customer }
    });
  } catch (error) {
    console.error('Customer status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer status',
      error: error.message
    });
  }
});

// Get customer analytics (Admin only)
router.get('/analytics/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      topCustomers
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', isActive: true }),
      User.countDocuments({
        role: 'customer',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      User.aggregate([
        { $match: { role: 'customer' } },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            totalSpent: {
              $sum: {
                $map: {
                  input: '$orders',
                  as: 'order',
                  in: '$$order.totalAmount'
                }
              }
            },
            totalOrders: { $size: '$orders' }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: 1,
            email: 1,
            totalSpent: 1,
            totalOrders: 1
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          activeCustomers,
          inactiveCustomers: totalCustomers - activeCustomers,
          newCustomersThisMonth
        },
        topCustomers
      }
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