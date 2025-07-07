import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for real-time orders (in production, use database)
let cateringOrders = [];
let cateringQuotes = [];
let orderCounter = 1000;

// SSE connections for real-time updates
let sseConnections = [];

// Create new catering order
router.post('/orders', authenticate, async (req, res) => {
  try {
    const orderData = {
      id: `CATERING-${orderCounter++}`,
      ...req.body,
      customerId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
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
      message: 'Catering order placed successfully! Our team will contact you within 2 hours.',
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

// Submit catering quote request
router.post('/quotes', async (req, res) => {
  try {
    const { eventType, guestCount, eventDate, contactName, contactPhone, contactEmail, specialRequirements } = req.body;

    const quoteData = {
      id: `QUOTE-${Date.now()}`,
      eventType,
      guestCount: parseInt(guestCount),
      eventDate,
      contactName,
      contactPhone,
      contactEmail,
      specialRequirements,
      status: 'pending',
      estimatedCost: calculateEstimatedCost(eventType, guestCount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store the quote request
    cateringQuotes.unshift(quoteData);

    // Send real-time notification to admins
    const notification = {
      type: 'new_quote_request',
      quote: quoteData,
      timestamp: new Date().toISOString()
    };

    sseConnections.forEach(connection => {
      try {
        connection.write(`data: ${JSON.stringify(notification)}\n\n`);
      } catch (error) {
        console.error('SSE write error:', error);
      }
    });

    console.log(`New quote request: ${quoteData.id} for ${guestCount} guests`);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully! We will contact you within 24 hours with a detailed quote.',
      data: { quote: quoteData }
    });
  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quote request',
      error: error.message
    });
  }
});

// Get all catering orders (Admin only)
router.get('/orders', authenticate, authorize('admin'), async (req, res) => {
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

// Get all quote requests (Admin only)
router.get('/quotes', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filteredQuotes = [...cateringQuotes];
    
    if (status) {
      filteredQuotes = filteredQuotes.filter(quote => quote.status === status);
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        quotes: paginatedQuotes,
        total: filteredQuotes.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredQuotes.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Quote requests fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote requests',
      error: error.message
    });
  }
});

// Update catering order status (Admin only)
router.patch('/orders/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    const orderIndex = cateringOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Catering order not found'
      });
    }

    cateringOrders[orderIndex] = {
      ...cateringOrders[orderIndex],
      status,
      updatedBy: req.user.id,
      updatedAt: new Date().toISOString()
    };

    // Send real-time update
    const notification = {
      type: 'catering_order_updated',
      order: cateringOrders[orderIndex],
      timestamp: new Date().toISOString()
    };

    sseConnections.forEach(connection => {
      try {
        connection.write(`data: ${JSON.stringify(notification)}\n\n`);
      } catch (error) {
        console.error('SSE write error:', error);
      }
    });

    res.json({
      success: true,
      message: 'Catering order status updated successfully',
      data: { order: cateringOrders[orderIndex] }
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
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time catering updates connected' })}\n\n`);

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

// Helper function to calculate estimated cost
function calculateEstimatedCost(eventType, guestCount) {
  const basePrices = {
    'Wedding': 850,
    'Corporate Event': 450,
    'Birthday Party': 320,
    'Anniversary': 400,
    'Festival Celebration': 380,
    'Conference': 300,
    'Product Launch': 500,
    'Family Gathering': 250,
    'Religious Ceremony': 350,
    'Other': 300
  };

  const basePrice = basePrices[eventType] || 300;
  return basePrice * parseInt(guestCount);
}

export default router;