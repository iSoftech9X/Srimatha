import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Get total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    // Get pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Get popular items
    const popularItems = await MenuItem.find({ 
      isPopular: true, 
      isAvailable: true 
    }).limit(5);

    const stats = {
      totalCustomers,
      totalOrders,
      totalRevenue,
      todayOrders,
      pendingOrders,
      popularItems
    };

    res.json({
      success: true,
      data: {
        overview: stats,
        popularItems: stats.popularItems
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
    const { period = '7d', startDate, endDate } = req.query;

    // Calculate date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const days = parseInt(period.replace('d', ''));
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      dateFilter = {
        createdAt: { $gte: fromDate }
      };
    }

    // Get sales data
    const salesData = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        averageOrderValue,
        growthRate: 12.5, // This would be calculated based on previous period
        dailySales: salesData.map(day => ({
          date: day._id,
          sales: day.sales,
          orders: day.orders
        }))
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
    const settings = {
      restaurant: {
        name: 'Srimatha Restaurant',
        address: '123 Main Street, City, State 12345',
        phone: '+91 9876543210',
        email: 'info@srimatha.com',
        openingHours: {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '23:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '10:00', close: '22:00' }
        }
      },
      ordering: {
        minimumOrderAmount: 100,
        deliveryFee: 30,
        freeDeliveryThreshold: 500,
        maxDeliveryDistance: 10,
        estimatedDeliveryTime: 30
      },
      payment: {
        acceptCash: true,
        acceptCard: true,
        acceptUPI: true,
        taxRate: 18
      }
    };

    res.json({
      success: true,
      data: settings
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