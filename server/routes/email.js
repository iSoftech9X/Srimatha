

import express from 'express';
import {
  sendOrderPlacedEmail,
  sendPaymentStatusEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
  sendNewUserSignupEmail,
} from '../services/emailService.js';

const router = express.Router();

// ✅ Order Placed
router.post('/order-placed', async (req, res) => {
  try {
    const { to, name, orderId } = req.body;
    await sendOrderPlacedEmail(to, name, orderId);
    res.json({ success: true, message: 'Order placed email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send order placed email', error: error.message });
  }
});

// ✅ Payment Status
router.post('/payment-status', async (req, res) => {
  try {
    const { to, name, orderId, status } = req.body;
    await sendPaymentStatusEmail(to, name, orderId, status);
    res.json({ success: true, message: `Payment ${status} email sent` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send payment status email', error: error.message });
  }
});

// ✅ Order Delivered
router.post('/order-delivered', async (req, res) => {
  try {
    const { to, name, orderId } = req.body;
    await sendOrderDeliveredEmail(to, name, orderId);
    res.json({ success: true, message: 'Order delivered email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send order delivered email', error: error.message });
  }
});

// ✅ Order Cancelled
router.post('/order-cancelled', async (req, res) => {
  try {
    const { to, name, orderId, cancelledBy } = req.body;
    await sendOrderCancelledEmail(to, name, orderId, cancelledBy);
    res.json({ success: true, message: 'Order cancelled email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send order cancelled email', error: error.message });
  }
});

// ✅ New User Signup
router.post('/user-signup', async (req, res) => {
  try {
    const { userEmail, userName, isRestaurant } = req.body;

    if (!userEmail || !userName) {
      return res.status(400).json({ success: false, message: 'userEmail and userName are required' });
    }

    await sendNewUserSignupEmail(userEmail, userName, isRestaurant);
    res.json({ success: true, message: 'Signup email sent' });
  } catch (error) {
    console.error('❌ Signup email error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send signup email', error: error.message });
  }
});


export default router;
