import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Contact from '../models/Contact.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalCustomers,
      totalOrders,
      totalRevenue,
      todayOrders,
      todayRevenue,
      monthlyRevenue,
      yearlyRevenue,
      pendingOrders,
      popularItems,
      recentOrders,
      orderStatusDistribution,
      monthlyOrderTrends
    ] = await Promise.all([
      // Total customers
      User.countDocuments({ role: 'customer' }),
      
      // Total orders
      Order.countDocuments(),
      
      // Total revenue
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Today's orders
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      
      // Today's revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfDay },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Monthly revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfMonth },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Yearly revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfYear },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Pending orders
      Order.countDocuments({ 
        status: { $in: ['pending', 'confirmed', 'preparing'] } 
      }),
      
      // Popular items
      MenuItem.find({ isPopular: true, isAvailable: true })
        .select('name image price category')
        .limit(5),
      
      // Recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('customer', 'name')
        .populate('items.menuItem', 'name price')
        .select('orderNumber customer totalAmount status createdAt orderType'),
      
      // Order status distribution
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Monthly order trends (last 12 months)
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(today.getFullYear() - 1, today.getMonth(), 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            orders: { $sum: 1 },
            revenue: { 
              $sum: { 
                $cond: [
                  { $eq: ['$paymentStatus', 'paid'] },
                  '$totalAmount',
                  0
                ]
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    // Format order status distribution
    const statusDistribution = orderStatusDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          totalOrders,
          totalRevenue,
          todayOrders,
          todayRevenue,
          monthlyRevenue,
          yearlyRevenue,
          pendingOrders
        },
        popularItems,
        recentOrders,
        charts: {
          orderStatusDistribution: statusDistribution,
          monthlyTrends: monthlyOrderTrends
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// Get sales analytics
router.get('/analytics/sales', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const today = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const [
      salesByCategory,
      salesByOrderType,
      topSellingItems,
      hourlyDistribution
    ] = await Promise.all([
      // Sales by category
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'menuitems',
            localField: 'items.menuItem',
            foreignField: '_id',
            as: 'menuItem'
          }
        },
        { $unwind: '$menuItem' },
        {
          $group: {
            _id: '$menuItem.category',
            totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            totalQuantity: { $sum: '$items.quantity' }
          }
        },
        { $sort: { totalSales: -1 } }
      ]),
      
      // Sales by order type
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
        {
          $group: {
            _id: '$orderType',
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        }
      ]),
      
      // Top selling items
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.menuItem',
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        {
          $lookup: {
            from: 'menuitems',
            localField: '_id',
            foreignField: '_id',
            as: 'menuItem'
          }
        },
        { $unwind: '$menuItem' },
        {
          $project: {
            name: '$menuItem.name',
            image: '$menuItem.image.url',
            category: '$menuItem.category',
            totalQuantity: 1,
            totalRevenue: 1
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
      ]),
      
      // Hourly order distribution
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            orderCount: { $sum: 1 },
            revenue: { 
              $sum: { 
                $cond: [
                  { $eq: ['$paymentStatus', 'paid'] },
                  '$totalAmount',
                  0
                ]
              }
            }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        salesByCategory,
        salesByOrderType,
        topSellingItems,
        hourlyDistribution
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics',
      error: error.message
    });
  }
});

// Get system settings
router.get('/settings', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This would typically come from a settings collection
    // For now, returning default settings
    const settings = {
      restaurant: {
        name: 'Srimatha Restaurant',
        address: '123 Food Street, Gourmet District, Culinary City, CC 560001',
        phone: '+91 98765 43210',
        email: 'info@srimatha.com',
        operatingHours: {
          monday: { open: '11:00', close: '23:00', closed: false },
          tuesday: { open: '11:00', close: '23:00', closed: false },
          wednesday: { open: '11:00', close: '23:00', closed: false },
          thursday: { open: '11:00', close: '23:00', closed: false },
          friday: { open: '11:00', close: '23:00', closed: false },
          saturday: { open: '11:00', close: '23:00', closed: false },
          sunday: { open: '11:00', close: '23:00', closed: false }
        }
      },
      delivery: {
        enabled: true,
        fee: 50,
        freeDeliveryThreshold: 500,
        radius: 10,
        estimatedTime: 45
      },
      payment: {
        methods: ['cash', 'card', 'upi', 'online'],
        tax: 18,
        serviceCharge: 0
      },
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    };

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

export default router;