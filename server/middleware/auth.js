import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userQueries.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // For demo purposes, we'll accept any token that starts with 'demo_'
    if (token.startsWith('demo_')) {
      // Extract user info from token
      if (token.includes('admin')) {
        req.user = {
          id: 'admin_1',
          email: 'admin@srimatha.com',
          role: 'admin',
          name: 'Srimatha Admin'
        };
      } else {
        req.user = {
          id: 'user_1',
          email: 'user@example.com',
          role: 'customer',
          name: 'Demo User'
        };
      }
      return next();
    }

    // For production, use JWT verification
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      
      // Find user in database (for production)
      const user = await getUserById(decoded.id);
      if (!user && !token.startsWith('demo_')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

    req.user = {
  id: user?.id || decoded.id,
  name: user?.name || decoded.name,
  email: user?.email || decoded.email,
  phone: user?.phone || decoded.phone,
  role: user?.role || decoded.role,
};



      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient privileges.'
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      if (token.startsWith('demo_')) {
        // Handle demo tokens
        if (token.includes('admin')) {
          req.user = {
            id: 'admin_1',
            email: 'admin@srimatha.com',
            role: 'admin',
            name: 'Srimatha Admin'
          };
        } else {
          req.user = {
            id: 'user_1',
            email: 'user@example.com',
            role: 'customer',
            name: 'Demo User'
          };
        }
      } else {
        // Handle JWT tokens
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await getUserById(decoded.id);
        
        if (user) {
          req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Legacy support - keeping the old function names as aliases
export const auth = authenticate;
export const adminAuth = (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorize('admin')(req, res, next);
  });
};