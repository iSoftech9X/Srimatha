import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Store for real-time catering orders (in production, use Redis or database)
let cateringOrders = [];
let orderCounter = 1000;

// SSE connections for real-time updates
let sseConnections = [];

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
    const { page = 1, limit = 10, status, customerId, orderType } = req.query;

    const query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (orderType) query.orderType = orderType;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    // Include catering orders in the response
    let allOrders = [];
    
    // Get regular orders from database
    const dbResult = await req.db.findOrders(query, options);
    allOrders = [...dbResult.orders];

    // Add catering orders if no specific filters or if catering is requested
    if (!orderType || orderType === 'catering') {
      const filteredCateringOrders = cateringOrders.filter(order => {
        if (status && order.status !== status) return false;
        if (customerId && order.customerId !== customerId) return false;
        return true;
      });
      allOrders = [...allOrders, ...filteredCateringOrders];
    }

    // Sort by creation date (newest first)
    allOrders.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));

    res.json({
      success: true,
      data: {
        orders: allOrders,
        total: allOrders.length,
        page: parseInt(page),
        totalPages: Math.ceil(allOrders.length / parseInt(limit))
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

// Create new catering order
router.post('/catering', authenticate, async (req, res) => {
  try {
    const orderData = {
      id: `CATERING-${orderCounter++}`,
      ...req.body,
      customerId: req.user.id,
      orderType: 'catering',
      status: 'pending',
      paymentStatus: 'pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store the catering order
    cateringOrders.unshift(orderData);

    // Send real-time notification to all connected admin clients
    const notification = {
      type: 'new_catering_order',
      order: orderData,
      timestamp: new Date().toISOString()
    };

    // Broadcast to all SSE connections
    sseConnections.forEach(connection => {
      try {
        connection.write(`data: ${JSON.stringify(notification)}\n\n`);
      } catch (error) {
        console.error('SSE write error:', error);
      }
    });

    console.log(`New catering order received: ${orderData.id} from ${orderData.customerName}`);

    res.status(201).json({
      success: true,
      message: 'Catering order placed successfully',
      data: { order: orderData }
    });
  } catch (error) {
    console.error('Catering order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create catering order',
      error: error.message
    });
  }
});

// Create new regular order
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
    const orderId = req.params.id;
    
    let updatedOrder = null;

    // Check if it's a catering order
    if (orderId.startsWith('CATERING-')) {
      const orderIndex = cateringOrders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        cateringOrders[orderIndex] = {
          ...cateringOrders[orderIndex],
          status,
          updatedBy: req.user.id,
          updatedAt: new Date().toISOString()
        };
        updatedOrder = cateringOrders[orderIndex];

        // Send real-time update
        const notification = {
          type: 'catering_order_updated',
          order: updatedOrder,
          timestamp: new Date().toISOString()
        };

        sseConnections.forEach(connection => {
          try {
            connection.write(`data: ${JSON.stringify(notification)}\n\n`);
          } catch (error) {
            console.error('SSE write error:', error);
          }
        });
      }
    } else {
      // Regular order
      updatedOrder = await req.db.updateOrder(orderId, {
        status,
        updatedBy: req.user.id
      });
    }

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

// Server-Sent Events endpoint for real-time updates
router.get('/stream', authenticate, authorize('admin'), (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Add this connection to the list
  sseConnections.push(res);

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time order updates connected' })}\n\n`);

  // Remove connection when client disconnects
  req.on('close', () => {
    const index = sseConnections.indexOf(res);
    if (index !== -1) {
      sseConnections.splice(index, 1);
    }
  });

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

// Get catering orders specifically (Admin only)
router.get('/catering', authenticate, authorize('admin'), (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filteredOrders = [...cateringOrders];
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        orders: paginatedOrders,
        total: filteredOrders.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredOrders.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Catering orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch catering orders',
      error: error.message
    });
  }
});

export default router;