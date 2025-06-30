import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/my-orders', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'])
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
      limit = 10,
      status
    } = req.query;

    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('items.menuItem', 'name image price')
        .populate('customer', 'name email phone'),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
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

// Get all orders (Admin/Staff only)
router.get('/', authenticate, authorize('admin', 'staff'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled']),
  query('orderType').optional().isIn(['dine-in', 'takeaway', 'delivery']),
  query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded'])
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
      status,
      orderType,
      paymentStatus,
      search
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('items.menuItem', 'name image price')
        .populate('customer', 'name email phone')
        .populate('assignedStaff', 'name'),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
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

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name image price description')
      .populate('customer', 'name email phone')
      .populate('assignedStaff', 'name')
      .populate('statusHistory.updatedBy', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Create new order
router.post('/', authenticate, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItem').isMongoId().withMessage('Valid menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('orderType').isIn(['dine-in', 'takeaway', 'delivery']).withMessage('Invalid order type'),
  body('paymentMethod').isIn(['cash', 'card', 'upi', 'online', 'wallet']).withMessage('Invalid payment method'),
  body('contactInfo.phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid phone number is required')
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

    const { items, orderType, paymentMethod, contactInfo, deliveryAddress, specialInstructions } = req.body;

    // Validate menu items and calculate totals
    const menuItemIds = items.map(item => item.menuItem);
    const menuItems = await MenuItem.find({ 
      _id: { $in: menuItemIds }, 
      isAvailable: true 
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some menu items are not available'
      });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItem);
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;
      
      return {
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions
      };
    });

    const tax = subtotal * 0.18; // 18% GST
    const deliveryFee = orderType === 'delivery' ? 50 : 0;
    const totalAmount = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      orderType,
      paymentMethod,
      contactInfo,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + (orderType === 'delivery' ? 45 : 30) * 60000)
    });

    await order.save();

    // Populate the order for response
    await order.populate([
      { path: 'items.menuItem', select: 'name image price' },
      { path: 'customer', select: 'name email phone' }
    ]);

    // Update user's loyalty points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { loyaltyPoints: Math.floor(totalAmount / 100) }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
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

// Update order status (Admin/Staff only)
router.patch('/:id/status', authenticate, authorize('admin', 'staff'), [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 })
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

    const { status, notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status and add to history
    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: req.user._id,
      notes
    });

    // Set delivery time if delivered
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    await order.populate([
      { path: 'items.menuItem', select: 'name image price' },
      { path: 'customer', select: 'name email phone' },
      { path: 'assignedStaff', select: 'name' }
    ]);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
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

// Assign staff to order (Admin only)
router.patch('/:id/assign', authenticate, authorize('admin'), [
  body('staffId').isMongoId().withMessage('Valid staff ID is required')
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

    const { staffId } = req.body;
    
    // Verify staff exists
    const staff = await User.findOne({ 
      _id: staffId, 
      role: { $in: ['admin', 'staff'] },
      isActive: true 
    });
    
    if (!staff) {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff member'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedStaff: staffId },
      { new: true }
    ).populate([
      { path: 'items.menuItem', select: 'name image price' },
      { path: 'customer', select: 'name email phone' },
      { path: 'assignedStaff', select: 'name' }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff assigned successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Staff assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign staff',
      error: error.message
    });
  }
});

// Cancel order
router.patch('/:id/cancel', authenticate, [
  body('reason').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (req.user.role === 'customer' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      updatedBy: req.user._id,
      notes: reason || 'Order cancelled by user'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// Add rating and review
router.post('/:id/review', authenticate, [
  body('rating.food').isInt({ min: 1, max: 5 }).withMessage('Food rating must be between 1 and 5'),
  body('rating.service').isInt({ min: 1, max: 5 }).withMessage('Service rating must be between 1 and 5'),
  body('rating.overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5'),
  body('rating.review').optional().trim().isLength({ max: 1000 })
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

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can review this order
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only review delivered orders'
      });
    }

    // Check if already reviewed
    if (order.rating && order.rating.reviewDate) {
      return res.status(400).json({
        success: false,
        message: 'Order already reviewed'
      });
    }

    order.rating = {
      ...req.body.rating,
      reviewDate: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Review addition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
});

export default router;