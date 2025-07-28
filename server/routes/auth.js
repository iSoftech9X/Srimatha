import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authenticate } from '../middleware/auth.js';
import { createUser, getUserByEmail, getUserById, updateUserById ,updateUser } from '../models/userQueries.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (hashing is handled in userQueries.js)
    const newUser = await createUser({ name, email, password, phone, address });

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
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
});

// Login user (SECURE: checks password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('LOGIN DEBUG:', { email, password }); // DEBUG
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }
    const user = await getUserByEmail(email);
    console.log('LOGIN DEBUG:', { email, user }); // DEBUG
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('BCRYPT COMPARE:', { password, hash: user.password, isMatch }); // DEBUG
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    // Remove password from response
    const { password: _, ...userResponse } = user;
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
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
        message: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});
// Update user profile
// Update user profile (same fields as getProfile)
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
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});



router.patch('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      address = {}  // This handles cases where address isn't provided
    } = req.body;

    // Prepare fields to update
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
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Profile patch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to patch profile',
      error: error.message
    });
  }
});


// Logout (client-side token removal)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;