import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Store for real-time catering orders (in production, use Redis or database)
let cateringOrders = [];
let orderCounter = 1000;

// SSE connections for real-time updates
let sseConnections = [];

// Get user's orders
import { findOrders, createOrder, updateOrder } from '../models/orderQueries.js';

// ...existing code...

// router.get('/my-orders', authenticate, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status } = req.query;
//     const orders = await findOrders({ customerId: req.user.id, status, limit: parseInt(limit), skip: (parseInt(page) - 1) * parseInt(limit) });
//     res.json({
//       success: true,
//       data: { orders }
//     });
//   } catch (error) {
//     console.error('User orders fetch error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders',
//       error: error.message
//     });
//   }
// });

router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Get orders from database
    const orders = await findOrders({ 
      customerId: req.user.id, 
      status, 
      limit: parseInt(limit), 
      skip: (parseInt(page) - 1) * parseInt(limit) 
    });

    // Get order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      if (order.orderType === 'catering') {
        // For catering orders, get from in-memory storage
        const cateringOrder = cateringOrders.find(co => co.id === order.id);
        return {
          ...order,
          items: cateringOrder?.items || []
        };
      } else {
        // For regular orders, query the database
        const itemsResult = await req.db.query(
          `SELECT oi.*, mi.name, mi.description 
           FROM order_items oi
           JOIN menu_items mi ON oi.menu_item_id = mi.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows
        };
      }
    }));

    res.json({
      success: true,
      data: { 
        orders: ordersWithItems,
        total: orders.length,
        page: parseInt(page),
        totalPages: Math.ceil(orders.length / parseInt(limit))
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
    const { page = 1, limit = 10, status, customerId, orderType } = req.query;

    // Your existing filtering and pagination logic...

    const dbOrders = await findOrders({
      customerId,
      status,
      orderType,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    // Fetch items for all these orders in one go to minimize DB calls
    const orderIds = dbOrders.map(order => order.id);
    const itemsQuery = `
      SELECT order_id, menu_item_id, item_name, quantity, price, special_instructions
      FROM order_items
      WHERE order_id = ANY($1)
    `;
    const itemsResult = await req.db.query(itemsQuery, [orderIds]);

    // Group items by order_id
    const itemsByOrder = {};
    itemsResult.rows.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push({
        menuItemId: item.menu_item_id,
        name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.special_instructions
      });
    });

    // Attach items to each order
    const ordersWithItems = dbOrders.map(order => ({
      ...order,
      items: itemsByOrder[order.id] || []
    }));

    // Add catering orders as you currently do (make sure they have 'items' array too!)

    res.json({
      success: true,
      data: {
        orders: ordersWithItems,
        total: ordersWithItems.length,
        page: parseInt(page),
        totalPages: Math.ceil(ordersWithItems.length / parseInt(limit))
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
router.post('/catering', async (req, res) => {
  try {
    const orderData = {
      id: `CATERING-${orderCounter++}`,
      ...req.body,
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

// router.post('/', authenticate, async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user || !user.id) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     const { items, subtotal, total, orderType = 'regular', paymentStatus = 'pending' } = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ success: false, message: 'No items provided' });
//     }

//     // 1. Insert order summary into 'orders'
//     const orderNumber = `ORDER-${Date.now()}`;

//     const orderInsertQuery = `
//       INSERT INTO orders 
//       (order_number, customer_id, status, subtotal, total, payment_status, order_type, created_at, updated_at) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
//       RETURNING id, order_number, status, subtotal, total, payment_status, order_type, created_at, updated_at
//     `;

//     const orderResult = await req.db.query(orderInsertQuery, [
//       orderNumber,
//       user.id,
//       'pending',
//       subtotal,
//       total,
//       paymentStatus,
//       orderType,
//     ]);

//     const orderId = orderResult.rows[0].id;

//     // 2. Insert each item into 'order_items'
//     const itemInsertQuery = `
//       INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions)
//       VALUES ($1, $2, $3, $4, $5)
//     `;

//     for (const item of items) {
//   if (!item.menuItemId) {
//     return res.status(400).json({ success: false, message: 'One or more items missing id' });
//   }
//   await req.db.query(
//     `INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions) VALUES ($1, $2, $3, $4, $5)`,
//     [orderId, item.menuItemId, item.quantity, item.price, item.special_instructions || null]
//   );
// }


//     res.status(200).json({
//       success: true,
//       message: 'Order placed successfully',
//       data: {
//         order: {
//           id: orderId,
//           order_number: orderNumber,
//           items,
//           subtotal,
//           total,
//           orderType,
//           paymentStatus,
//           status: 'pending',
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Order place error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to place order',
//       error: error.message
//     });
//   }
// });



// router.post('/', authenticate, async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user || !user.id) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     const {
//       userName,
//       userEmail,
//       userPhone,
//       userAddress = {},
//       items,
//       subtotal,
//       total,
//       orderType = 'regular',
//       paymentStatus = 'pending'
//     } = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ success: false, message: 'No items provided' });
//     }

//     // Insert order summary with user details
//     const orderNumber = `ORDER-${Date.now()}`;

//     // const orderInsertQuery = `
//     //   INSERT INTO orders 
//     //   (order_number, customer_id, user_name, user_email, user_phone, status, subtotal, total, payment_status, order_type, created_at, updated_at) 
//     //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
//     //   RETURNING id, order_number, status, subtotal, total, payment_status, order_type, created_at, updated_at, user_name, user_email, user_phone
//     // `;

//     // const orderResult = await req.db.query(orderInsertQuery, [
//     //   orderNumber,
//     //   user.id,
//     //   userName,
//     //   userEmail,
//     //   userPhone,
//     //   userAddress,
//     //   'pending',
//     //   subtotal,
//     //   total,
//     //   paymentStatus,
//     //   orderType,
//     // ]);


//     const orderInsertQuery = `
//   INSERT INTO orders 
//   (order_number, customer_id, user_name, user_email, user_phone, user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country, status, subtotal, total, payment_status, order_type, created_at, updated_at) 
//   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
//   RETURNING id, order_number, status, subtotal, total, payment_status, order_type, created_at, updated_at, user_name, user_email, user_phone, user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country
// `;

// const orderResult = await req.db.query(orderInsertQuery, [
//   orderNumber,
//   user.id,
//   userName,
//   userEmail,
//   userPhone,
//   userAddress?.street || null,
//   userAddress?.city || null,
//   userAddress?.state || null,
//   userAddress?.zipcode || null,
//   userAddress?.country || null,
//   'pending',
//   subtotal,
//   total,
//   paymentStatus,
//   orderType,
// ]);
//     const orderId = orderResult.rows[0].id;

//     // Insert each item with item_name
//     const itemInsertQuery = `
//       INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
//       VALUES ($1, $2, $3, $4, $5, $6)
//     `;

//     for (const item of items) {
//       if (!item.menuItemId) {
//         return res.status(400).json({ success: false, message: 'One or more items missing id' });
//       }
//       await req.db.query(
//         itemInsertQuery,
//         [
//           orderId,
//           item.menuItemId,
//           item.name || null,
//           item.quantity,
//           item.price,
//           item.specialInstructions || null,
//         ]
//       );
//     }

//     // Return the order with user info and full items
//     res.status(200).json({
//       success: true,
//       message: 'Order placed successfully',
//       data: {
//         order: {
//           id: orderId,
//           order_number: orderNumber,
//           items,
//           subtotal,
//           total,
//           orderType,
//           paymentStatus,
//           status: 'pending',
//           userName,
//           userEmail,
//           userPhone,
//           userAddress: {
//         street: orderId.user_address_street,
//         city: orderId.user_address_city,
//         state: orderId.user_address_state,
//         zipcode: orderId.user_address_zipcode,
//         country: orderId.user_address_country
//       }
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Order place error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to place order',
//       error: error.message
//     });
//   }
// });

router.post('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      userName,
      userEmail,
      userPhone,
      address = {}, // Default to empty object to avoid undefined
      items,
      subtotal,
      total,
      orderType = 'regular',
      paymentStatus = 'pending'
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    const orderNumber = `ORDER-${Date.now()}`;

    const orderInsertQuery = `
      INSERT INTO orders 
      (order_number, customer_id, user_name, user_email, user_phone, 
       user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country, 
       status, subtotal, total, payment_status, order_type, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING id, order_number, status, subtotal, total, payment_status, order_type, 
                created_at, updated_at, user_name, user_email, user_phone, 
                user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country
    `;

    const orderResult = await req.db.query(orderInsertQuery, [
      orderNumber,
      user.id,
      userName,
      userEmail,
      userPhone,
      address.street || null,
      address.city || null,
      address.state || null,
      address.zipcode || null,
      address.country || null,
      'pending',
      subtotal,
      total,
      paymentStatus,
      orderType,
    ]);

    const orderRow = orderResult.rows[0];
    const orderId = orderRow.id;

    // Insert order items
    const itemInsertQuery = `
      INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const item of items) {
      if (!item.menuItemId) {
        return res.status(400).json({ success: false, message: 'One or more items missing id' });
      }
      await req.db.query(itemInsertQuery, [
        orderId,
        item.menuItemId,
        item.name || null,
        item.quantity,
        item.price,
        item.specialInstructions || null,
      ]);
    }

    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order: {
          id: orderId,
          order_number: orderRow.order_number,
          items,
          subtotal,
          total,
          orderType,
          paymentStatus,
          status: 'pending',
          userName: orderRow.user_name,
          userEmail: orderRow.user_email,
          userPhone: orderRow.user_phone,
          userAddress: {
            street: orderRow.user_address_street,
            city: orderRow.user_address_city,
            state: orderRow.user_address_state,
            zipcode: orderRow.user_address_zipcode,
            country: orderRow.user_address_country
          }
        }
      }
    });

  } catch (error) {
    console.error('Order place error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});


router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cancellation reason is required' 
      });
    }

    // Remove any invalid characters from ID
    const cleanId = id.split('/')[0]; // Handle malformed URLs like "GORCB-123/j/cancel"

    let cancelledOrder = null;

    if (cleanId.startsWith('CATERING-')) {
      // Catering order cancellation logic
      const orderIndex = cateringOrders.findIndex(o => o.id === cleanId);
      if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      
      cateringOrders[orderIndex] = {
        ...cateringOrders[orderIndex],
        status: 'cancelled',
        cancellationReason: reason,
        updatedAt: new Date().toISOString()
      };
      cancelledOrder = cateringOrders[orderIndex];
    } else {
      // Database order cancellation
      const result = await req.db.query(
        `UPDATE orders 
         SET status = 'cancelled', 
             cancellation_reason = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [reason, cleanId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      cancelledOrder = result.rows[0];
    }

    // Send real-time update
    const notification = {
      type: 'order_cancelled',
      order: cancelledOrder,
      timestamp: new Date().toISOString()
    };
    sseConnections.forEach(conn => conn.write(`data: ${JSON.stringify(notification)}\n\n`));

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: cancelledOrder }
    });

  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
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
          updatedAt: new Date()     
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
      // Regular order - update status and updated_at only, no updated_by (since no such column)
      updatedOrder = await updateOrder(orderId, {
        status,
        updated_at: new Date()
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
    const { page = 1, limit = 1000, status } = req.query;

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