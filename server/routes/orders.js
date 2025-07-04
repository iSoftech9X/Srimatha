import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { customerId: req.user.id };
    if (status) query.status = status;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const result = await req.db.findOrders(query, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('User orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get all orders (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const result = await req.db.findOrders(query, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Create new order
router.post('/', authenticate, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.user.id,
      status: 'pending',
      orderNumber: `ORD${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newOrder = await req.db.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order: newOrder }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedOrder = await req.db.updateOrder(req.params.id, {
      status,
      updatedBy: req.user.id
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

export default router;