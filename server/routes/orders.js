import express from 'express';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { customer: req.user.id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.menuItem')
      .populate('customer', 'name email phone')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        total,
        page: parseInt(page),
        totalPages
      }
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
    if (customerId) query.customer = customerId;

    const orders = await Order.find(query)
      .populate('items.menuItem')
      .populate('customer', 'name email phone')
      .populate('assignedStaff', 'name')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        total,
        page: parseInt(page),
        totalPages
      }
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
    const {
      items,
      orderType,
      deliveryAddress,
      contactInfo,
      paymentMethod,
      specialInstructions
    } = req.body;

    // Validate menu items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${menuItem?.name || 'unknown'} is not available`
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions
      });
    }

    // Calculate tax and delivery fee
    const tax = subtotal * 0.18; // 18% tax
    const deliveryFee = orderType === 'delivery' ? 30 : 0;
    const totalAmount = subtotal + tax + deliveryFee;

    const orderData = {
      customer: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      orderType,
      deliveryAddress,
      contactInfo: {
        phone: contactInfo.phone,
        email: req.user.email,
        alternatePhone: contactInfo.alternatePhone
      },
      paymentMethod,
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending'
    };

    const newOrder = await Order.create(orderData);
    await newOrder.populate('items.menuItem');
    await newOrder.populate('customer', 'name email phone');

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
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'delivered' && { actualDeliveryTime: new Date() })
      },
      { new: true, runValidators: true }
    )
      .populate('items.menuItem')
      .populate('customer', 'name email phone');

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