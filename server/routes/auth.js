
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authenticate } from '../middleware/auth.js';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  updateUser,
} from '../models/userQueries.js';

import {
  createPasswordReset,
  findPasswordReset,
  deletePasswordReset,
  updateUserByIdPass,
} from '../models/passwordResetQueries.js'; 

import { sendNewUserSignupEmail } from '../services/emailService.js'; // ✅ IMPORT EMAIL SENDER
import { sendOtpEmail } from '../services/emailService.js'; // ✅ IMPORT OTP SENDER
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, isRestaurant = false } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const newUser = await createUser({ name, email, password, phone, address });

    // ✅ Send welcome email
    await sendNewUserSignupEmail(email, name, isRestaurant);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message,
    });
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: { user: userResponse },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address } = req.body;

    const updatedUser = await updateUserById(userId, { name, email, phone, address });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no fields provided',
      });
    }

    const { password: _, ...userResponse } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userResponse },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
});

// Patch user profile
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      address = {}, // Optional address
    } = req.body;

    const fieldsToUpdate = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address.street && { address_street: address.street }),
      ...(address.city && { address_city: address.city }),
      ...(address.state && { address_state: address.state }),
      ...(address.zipcode && { address_zipcode: address.zipcode }),
      ...(address.country && { address_country: address.country }),
    };

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided to update',
      });
    }

    const updatedUser = await updateUser(userId, fieldsToUpdate);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { password: _, ...userResponse } = updatedUser;

    res.json({
      success: true,
      message: 'Profile patched successfully',
      data: { user: userResponse },
    });
  } catch (error) {
    console.error('Profile patch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to patch profile',
      error: error.message,
    });
  }
});

// Logout user
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});
// 1️⃣ Forgot Password – Request OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save OTP to DB
    await createPasswordReset(user.id, otp, expiresAt);

    // Send OTP via email
    await sendOtpEmail(user.email, otp);

    res.json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});


// 2️⃣ Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const record = await findPasswordReset(user.id, otp);
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (record.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Generate temporary token for password reset
    // const resetToken = jwt.sign(
    //   { id: user.id, action: 'reset-password' },
    //   process.env.JWT_SECRET || 'fallback-secret',
    //   { expiresIn: '15m' }
    // );

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: { userId: user.id, email: user.email }
      // data: { resetToken },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});


// 3️⃣ Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password in DB
    await updateUserByIdPass(user.id, { password: hashedPassword });

    // Remove any OTP records for this user
    await deletePasswordReset(user.id);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});


export default router;
