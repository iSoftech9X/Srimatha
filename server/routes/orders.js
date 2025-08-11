
// import express from 'express';
// import { authenticate, authorize } from '../middleware/auth.js';
// import {
//   findOrders,
//   createOrder,
//   updateOrder
// } from '../models/orderQueries.js';
// import {
//  sendEmail,
//   sendDeliverySuccessEmail,
//   sendOrderCancellationEmail
// } from '../services/emailService.js';

// const router = express.Router();

// // In-memory catering orders (for dev/demo)
// let cateringOrders = [];
// let orderCounter = 1000;

// // SSE connections
// let sseConnections = [];

// // === 1. Get user's orders ===
// router.get('/my-orders', authenticate, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status } = req.query;

//     const orders = await findOrders({
//       customerId: req.user.id,
//       status,
//       limit: parseInt(limit),
//       skip: (parseInt(page) - 1) * parseInt(limit)
//     });

//     const ordersWithItems = await Promise.all(orders.map(async (order) => {
//       if (order.orderType === 'catering') {
//         const cateringOrder = cateringOrders.find(co => co.id === order.id);
//         return {
//           ...order,
//           items: cateringOrder?.items || []
//         };
//       } else {
//         const itemsResult = await req.db.query(
//           `SELECT oi.*, mi.name, mi.description 
//            FROM order_items oi
//            JOIN menu_items mi ON oi.menu_item_id = mi.id
//            WHERE oi.order_id = $1`,
//           [order.id]
//         );
//         return {
//           ...order,
//           items: itemsResult.rows
//         };
//       }
//     }));

//     res.json({
//       success: true,
//       data: {
//         orders: ordersWithItems,
//         total: orders.length,
//         page: parseInt(page),
//         totalPages: Math.ceil(orders.length / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('User orders fetch error:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
//   }
// });

// // === 2. Get all orders (Admin only) ===
// router.get('/', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, customerId, orderType } = req.query;

//     const dbOrders = await findOrders({
//       customerId,
//       status,
//       orderType,
//       limit: parseInt(limit),
//       skip: (parseInt(page) - 1) * parseInt(limit)
//     });

//     const orderIds = dbOrders.map(order => order.id);
//     const itemsResult = await req.db.query(`
//       SELECT order_id, menu_item_id, item_name, quantity, price, special_instructions
//       FROM order_items
//       WHERE order_id = ANY($1)
//     `, [orderIds]);

//     const itemsByOrder = {};
//     itemsResult.rows.forEach(item => {
//       if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
//       itemsByOrder[item.order_id].push({
//         menuItemId: item.menu_item_id,
//         name: item.item_name,
//         quantity: item.quantity,
//         price: item.price,
//         specialInstructions: item.special_instructions
//       });
//     });

//     const ordersWithItems = dbOrders.map(order => ({
//       ...order,
//       items: itemsByOrder[order.id] || []
//     }));

//     res.json({
//       success: true,
//       data: {
//         orders: ordersWithItems,
//         total: ordersWithItems.length,
//         page: parseInt(page),
//         totalPages: Math.ceil(ordersWithItems.length / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('Orders fetch error:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
//   }
// });

// // === 3. Create Catering Order ===
// router.post('/catering', async (req, res) => {
//   try {
//     const orderData = {
//       id: `CATERING-${orderCounter++}`,
//       ...req.body,
//       orderType: 'catering',
//       status: 'pending',
//       paymentStatus: 'pending',
//       orderDate: new Date().toISOString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     cateringOrders.unshift(orderData);

//     const notification = {
//       type: 'new_catering_order',
//       order: orderData,
//       timestamp: new Date().toISOString()
//     };
//     sseConnections.forEach(conn => {
//       try {
//         conn.write(`data: ${JSON.stringify(notification)}\n\n`);
//       } catch (err) {
//         console.error('SSE error:', err);
//       }
//     });

//     // 📩 Send email
//     sendEmail(orderData.customerEmail, orderData.customerName, orderData.id);

//     res.status(201).json({
//       success: true,
//       message: 'Catering order placed successfully',
//       data: { order: orderData }
//     });
//   } catch (error) {
//     console.error('Catering order error:', error);
//     res.status(500).json({ success: false, message: 'Failed to create catering order', error: error.message });
//   }
// });

// // === 4. Create Regular Order ===
// router.post('/', authenticate, async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user || !user.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

//     const {
//       userName, userEmail, userPhone,
//       address = {}, items, subtotal, total,
//       orderType = 'regular', paymentStatus = 'pending'
//     } = req.body;

//     if (!Array.isArray(items) || items.length === 0)
//       return res.status(400).json({ success: false, message: 'No items provided' });

//     const orderNumber = `ORDER-${Date.now()}`;
//     const orderInsertQuery = `
//       INSERT INTO orders 
//       (order_number, customer_id, user_name, user_email, user_phone,
//        user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country,
//        status, subtotal, total, payment_status, order_type, created_at, updated_at) 
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),NOW())
//       RETURNING *`;

//     const orderResult = await req.db.query(orderInsertQuery, [
//       orderNumber, user.id, userName, userEmail, userPhone,
//       address.street || null, address.city || null, address.state || null,
//       address.zipcode || null, address.country || null,
//       'pending', subtotal, total, paymentStatus, orderType
//     ]);

//     const orderRow = orderResult.rows[0];
//     const orderId = orderRow.id;

//     for (const item of items) {
//       await req.db.query(`
//         INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
//         VALUES ($1, $2, $3, $4, $5, $6)
//       `, [
//         orderId,
//         item.menuItemId,
//         item.name || null,
//         item.quantity,
//         item.price,
//         item.specialInstructions || null
//       ]);
//     }

//     // 📩 Send order confirmation
//     sendEmail(userEmail, userName, orderNumber);

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
//           userAddress: address
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Order place error:', error);
//     res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
//   }
// });

// // === 5. Cancel Order ===
// router.patch('/:id/cancel', authenticate, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
//     if (!reason) return res.status(400).json({ success: false, message: 'Cancellation reason is required' });

//     const cleanId = id.split('/')[0];
//     let cancelledOrder = null;

//     if (cleanId.startsWith('CATERING-')) {
//       const index = cateringOrders.findIndex(o => o.id === cleanId);
//       if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });

//       cateringOrders[index] = {
//         ...cateringOrders[index],
//         status: 'cancelled',
//         cancellationReason: reason,
//         updatedAt: new Date().toISOString()
//       };
//       cancelledOrder = cateringOrders[index];
//     } else {
//       const result = await req.db.query(`
//         UPDATE orders SET status='cancelled', cancellation_reason=$1, updated_at=NOW()
//         WHERE id=$2 RETURNING *`, [reason, cleanId]);

//       if (result.rows.length === 0)
//         return res.status(404).json({ success: false, message: 'Order not found' });

//       cancelledOrder = result.rows[0];
//     }

//     // 📩 Email
//     sendOrderCancellationEmail(
//       cancelledOrder.user_email || cancelledOrder.customerEmail,
//       cancelledOrder.user_name || cancelledOrder.customerName,
//       cancelledOrder.order_number || cancelledOrder.id,
//       reason
//     );

//     const notification = {
//       type: 'order_cancelled',
//       order: cancelledOrder,
//       timestamp: new Date().toISOString()
//     };
//     sseConnections.forEach(conn => conn.write(`data: ${JSON.stringify(notification)}\n\n`));

//     res.json({ success: true, message: 'Order cancelled successfully', data: { order: cancelledOrder } });
//   } catch (error) {
//     console.error('Cancel error:', error);
//     res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
//   }
// });

// // === 6. Update Order Status (Admin) ===
// router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const { status } = req.body;
//     const orderId = req.params.id;

//     let updatedOrder = null;

//     if (orderId.startsWith('CATERING-')) {
//       const index = cateringOrders.findIndex(order => order.id === orderId);
//       if (index !== -1) {
//         cateringOrders[index] = {
//           ...cateringOrders[index],
//           status,
//           updatedBy: req.user.id,
//           updatedAt: new Date()
//         };
//         updatedOrder = cateringOrders[index];
//       }
//     } else {
//       updatedOrder = await updateOrder(orderId, {
//         status,
//         updated_at: new Date()
//       });
//     }

//     if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });

//     // 📩 Send delivery success email if applicable
//     if (status === 'delivered') {
//       sendDeliverySuccessEmail(
//         updatedOrder.user_email || updatedOrder.customerEmail,
//         updatedOrder.user_name || updatedOrder.customerName,
//         updatedOrder.order_number || updatedOrder.id
//       );
//     }

//     res.json({ success: true, message: 'Order status updated', data: { order: updatedOrder } });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
//   }
// });

// // === 7. SSE endpoint for admins ===
// router.get('/stream', authenticate, authorize('admin'), (req, res) => {
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive'
//   });

//   sseConnections.push(res);
//   res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connected' })}\n\n`);

//   const keepAlive = setInterval(() => {
//     res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`);
//   }, 30000);

//   req.on('close', () => {
//     clearInterval(keepAlive);
//     sseConnections = sseConnections.filter(c => c !== res);
//   });
// });

// // === 8. Admin catering orders ===
// router.get('/catering', authenticate, authorize('admin'), (req, res) => {
//   try {
//     const { page = 1, limit = 1000, status } = req.query;

//     let filtered = [...cateringOrders];
//     if (status) filtered = filtered.filter(order => order.status === status);

//     const start = (parseInt(page) - 1) * parseInt(limit);
//     const paginated = filtered.slice(start, start + parseInt(limit));

//     res.json({
//       success: true,
//       data: {
//         orders: paginated,
//         total: filtered.length,
//         page: parseInt(page),
//         totalPages: Math.ceil(filtered.length / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('Fetch catering orders error:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch catering orders', error: error.message });
//   }
// });

// export default router;





import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  findOrders,
  createOrder,
  updateOrder
} from '../models/orderQueries.js';

import {
  sendOrderPlacedEmail,
  sendOrderCancelledEmail,
  sendOrderDeliveredEmail
} from '../services/emailService.js';

const router = express.Router();

// In-memory catering orders
let cateringOrders = [];
let orderCounter = 1000;

// SSE
let sseConnections = [];

// === 1. Get user's orders ===
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const orders = await findOrders({
      customerId: req.user.id,
      status,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      if (order.orderType === 'catering') {
        const cateringOrder = cateringOrders.find(co => co.id === order.id);
        return {
          ...order,
          items: cateringOrder?.items || []
        };
      } else {
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
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// === 2. Get all orders (Admin only) ===
// router.get('/', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, customerId, orderType } = req.query;

//     const dbOrders = await findOrders({
//       customerId,
//       status,
//       orderType,
//       limit: parseInt(limit),
//       skip: (parseInt(page) - 1) * parseInt(limit)
//     });

//     const orderIds = dbOrders.map(order => order.id);
//     const itemsResult = await req.db.query(`
//       SELECT order_id, menu_item_id, item_name, quantity, price, special_instructions
//       FROM order_items
//       WHERE order_id = ANY($1)
//     `, [orderIds]);

//     const itemsByOrder = {};
//     itemsResult.rows.forEach(item => {
//       if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
//       itemsByOrder[item.order_id].push({
//         menuItemId: item.menu_item_id,
//         name: item.item_name,
//         quantity: item.quantity,
//         price: item.price,
//         specialInstructions: item.special_instructions
//       });
//     });

//     const ordersWithItems = dbOrders.map(order => ({
//       ...order,
//       items: itemsByOrder[order.id] || []
//     }));

//     res.json({
//       success: true,
//       data: {
//         orders: ordersWithItems,
//         total: ordersWithItems.length,
//         page: parseInt(page),
//         totalPages: Math.ceil(ordersWithItems.length / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('Orders fetch error:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
//   }
// });

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, orderType } = req.query;

    const dbOrders = await findOrders({
      customerId,
      status,
      orderType,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const orderIds = dbOrders.map(order => order.id);

    // Fetch all items for these orders
    const itemsResult = await req.db.query(`
      SELECT order_id, menu_item_id, item_name, quantity, price, special_instructions
      FROM order_items
      WHERE order_id = ANY($1)
    `, [orderIds]);

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

    // Build orders with items + event details
    const ordersWithItems = dbOrders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_id: order.customer_id,
      status: order.status,
      subtotal: order.subtotal,
      total: order.total,
      payment_status: order.payment_status,
      order_type: order.order_type,
      created_at: order.created_at,
      updated_at: order.updated_at,
      cancellation_reason: order.cancellation_reason,
      user_name: order.user_name,
      user_email: order.user_email,
      user_phone: order.user_phone,
      user_address_street: order.user_address_street,
      user_address_city: order.user_address_city,
      user_address_state: order.user_address_state,
      user_address_zipcode: order.user_address_zipcode,
      user_address_country: order.user_address_country,
      // ✅ Include event details explicitly
      eventDetails: {
        numberOfPersons: order.event_number_of_persons,
        eventDate: order.event_date,
        eventType: order.event_type
      },
      items: itemsByOrder[order.id] || []
    }));

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
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});


// === 3. Create Catering Order ===
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

    cateringOrders.unshift(orderData);

    const notification = {
      type: 'new_catering_order',
      order: orderData,
      timestamp: new Date().toISOString()
    };
    sseConnections.forEach(conn => conn.write(`data: ${JSON.stringify(notification)}\n\n`));

    // 📩 Email
    await sendOrderPlacedEmail(orderData.customerEmail, orderData.customerName, orderData.id);

    res.status(201).json({
      success: true,
      message: 'Catering order placed successfully',
      data: { order: orderData }
    });
  } catch (error) {
    console.error('Catering order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create catering order', error: error.message });
  }
});

// === 4. Create Regular Order ===
// router.post('/', authenticate, async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user || !user.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

//     const {
//       userName, userEmail, userPhone,
//       address = {}, items, subtotal, total,
//       orderType = 'regular', paymentStatus = 'pending'
//     } = req.body;

//     if (!Array.isArray(items) || items.length === 0)
//       return res.status(400).json({ success: false, message: 'No items provided' });

//     const orderNumber = `ORDER-${Date.now()}`;
//     const orderResult = await req.db.query(`
//       INSERT INTO orders 
//       (order_number, customer_id, user_name, user_email, user_phone,
//        user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country,
//        status, subtotal, total, payment_status, order_type, created_at, updated_at) 
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),NOW())
//       RETURNING *`, [
//       orderNumber, user.id, userName, userEmail, userPhone,
//       address.street || null, address.city || null, address.state || null,
//       address.zipcode || null, address.country || null,
//       'pending', subtotal, total, paymentStatus, orderType
//     ]);

//     const orderRow = orderResult.rows[0];

//     for (const item of items) {
//       await req.db.query(`
//         INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
//         VALUES ($1, $2, $3, $4, $5, $6)
//       `, [
//         orderRow.id,
//         item.menuItemId,
//         item.name || null,
//         item.quantity,
//         item.price,
//         item.specialInstructions || null
//       ]);
//     }

//     // 📩 Email
//     await sendOrderPlacedEmail(userEmail, userName, orderNumber);

//     res.status(200).json({
//       success: true,
//       message: 'Order placed successfully',
//       data: {
//         order: {
//           id: orderRow.id,
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
//           userAddress: address
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Order place error:', error);
//     res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
//   }
// });

router.post('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {
      userName, userEmail, userPhone,
      address = {}, items, subtotal, total,
      orderType = 'regular', paymentStatus = 'pending',
      eventDetails = {}  // Added eventDetails with default empty object
    } = req.body;

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items provided' });

    // Extract event details with fallbacks for camelCase and snake_case
    const eventNumberOfPersons = eventDetails.numberOfPersons || eventDetails.event_number_of_persons || null;
    const eventDate = eventDetails.eventDate || eventDetails.event_date || null;
    const eventType = eventDetails.eventType || eventDetails.event_type || null;

    const orderNumber = `ORDER-${Date.now()}`;
    const orderResult = await req.db.query(`
      INSERT INTO orders 
      (order_number, customer_id, user_name, user_email, user_phone,
       user_address_street, user_address_city, user_address_state, user_address_zipcode, user_address_country,
       status, subtotal, total, payment_status, order_type, 
       event_number_of_persons, event_date, event_type,
       created_at, updated_at) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW(),NOW())
      RETURNING *`, [
      orderNumber, user.id, userName, userEmail, userPhone,
      address.street || null, address.city || null, address.state || null,
      address.zipcode || null, address.country || null,
      'pending', subtotal, total, paymentStatus, orderType,
      eventNumberOfPersons, eventDate, eventType  // Added event details
    ]);

    const orderRow = orderResult.rows[0];

    for (const item of items) {
      await req.db.query(`
        INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price, special_instructions)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        orderRow.id,
        item.menuItemId,
        item.name || null,
        item.quantity,
        item.price,
        item.specialInstructions || null
      ]);
    }

    // Send confirmation email
    await sendOrderPlacedEmail(userEmail, userName, orderNumber);

    res.status(200).json({
  success: true,
  message: 'Order placed successfully',
  data: {
    order: {
      id: orderRow.id,
      order_number: orderNumber,
      items,
      subtotal: orderRow.subtotal,
      total: orderRow.total,
      orderType: orderRow.order_type,
      paymentStatus: orderRow.payment_status,
      status: orderRow.status,
      userName: orderRow.user_name,
      userEmail: orderRow.user_email,
      userPhone: orderRow.user_phone,
      userAddress: {
        street: orderRow.user_address_street,
        city: orderRow.user_address_city,
        state: orderRow.user_address_state,
        zipcode: orderRow.user_address_zipcode,
        country: orderRow.user_address_country
      },
      // ✅ Explicitly include eventDetails
      eventDetails: {
        numberOfPersons: orderRow.event_number_of_persons,
        eventDate: orderRow.event_date,
        eventType: orderRow.event_type
      }
    }
  }
});
  } catch (error) {
    console.error('Order place error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
});


// === 5. Cancel Order ===
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Cancellation reason is required' });

    const cleanId = id.split('/')[0];
    let cancelledOrder = null;

    if (cleanId.startsWith('CATERING-')) {
      const index = cateringOrders.findIndex(o => o.id === cleanId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });

      cateringOrders[index] = {
        ...cateringOrders[index],
        status: 'cancelled',
        cancellationReason: reason,
        updatedAt: new Date().toISOString()
      };
      cancelledOrder = cateringOrders[index];
    } else {
      const result = await req.db.query(`
        UPDATE orders SET status='cancelled', cancellation_reason=$1, updated_at=NOW()
        WHERE id=$2 RETURNING *`, [reason, cleanId]);

      if (result.rows.length === 0)
        return res.status(404).json({ success: false, message: 'Order not found' });

      cancelledOrder = result.rows[0];
    }

    // 📩 Email
    await sendOrderCancelledEmail(
      cancelledOrder.user_email || cancelledOrder.customerEmail,
      cancelledOrder.user_name || cancelledOrder.customerName,
      cancelledOrder.order_number || cancelledOrder.id,
      'user'
    );

    const notification = {
      type: 'order_cancelled',
      order: cancelledOrder,
      timestamp: new Date().toISOString()
    };
    sseConnections.forEach(conn => conn.write(`data: ${JSON.stringify(notification)}\n\n`));

    res.json({ success: true, message: 'Order cancelled successfully', data: { order: cancelledOrder } });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
  }
});

// === 6. Update Order Status (Admin) ===
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    let updatedOrder = null;

    if (orderId.startsWith('CATERING-')) {
      const index = cateringOrders.findIndex(order => order.id === orderId);
      if (index !== -1) {
        cateringOrders[index] = {
          ...cateringOrders[index],
          status,
          updatedBy: req.user.id,
          updatedAt: new Date()
        };
        updatedOrder = cateringOrders[index];
      }
    } else {
      updatedOrder = await updateOrder(orderId, {
        status,
        updated_at: new Date()
      });
    }

    if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status === 'delivered') {
      await sendOrderDeliveredEmail(
        updatedOrder.user_email || updatedOrder.customerEmail,
        updatedOrder.user_name || updatedOrder.customerName,
        updatedOrder.order_number || updatedOrder.id
      );
    }

    res.json({ success: true, message: 'Order status updated', data: { order: updatedOrder } });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
});

// === 7. SSE for Admin Dashboard ===
router.get('/stream', authenticate, authorize('admin'), (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  sseConnections.push(res);
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connected' })}\n\n`);

  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseConnections = sseConnections.filter(c => c !== res);
  });
});

// === 8. Admin catering orders ===
router.get('/catering', authenticate, authorize('admin'), (req, res) => {
  try {
    const { page = 1, limit = 1000, status } = req.query;

    let filtered = [...cateringOrders];
    if (status) filtered = filtered.filter(order => order.status === status);

    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = filtered.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: {
        orders: paginated,
        total: filtered.length,
        page: parseInt(page),
        totalPages: Math.ceil(filtered.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Fetch catering orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch catering orders', error: error.message });
  }
});

export default router;
