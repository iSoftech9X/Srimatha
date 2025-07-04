import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const stats = await req.db.getDashboardStats();

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

    // Mock sales data for now
    const salesData = {
      totalSales: 15000,
      totalOrders: 45,
      averageOrderValue: 333,
      growthRate: 12.5,
      dailySales: [
        { date: '2024-01-01', sales: 2500, orders: 8 },
        { date: '2024-01-02', sales: 3200, orders: 12 },
        { date: '2024-01-03', sales: 2800, orders: 9 },
        { date: '2024-01-04', sales: 3500, orders: 11 },
        { date: '2024-01-05', sales: 2900, orders: 10 },
        { date: '2024-01-06', sales: 4100, orders: 15 },
        { date: '2024-01-07', sales: 3600, orders: 13 }
      ]
    };

    res.json({
      success: true,
      data: salesData
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