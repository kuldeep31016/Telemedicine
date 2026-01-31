const admin = require('../config/firebase');
const { UnauthorizedError } = require('../utils/error.util');
const User = require('../models/User');
const logger = require('../config/logger');

// Firebase Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    // Get Firebase token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get user from MongoDB using Firebase UID
    const user = await User.findOne({ firebaseUid: decodedToken.uid, isActive: true });
    
    if (!user) {
      throw new UnauthorizedError('User not found or inactive');
    }
    
    // Attach user and firebase data to request
    req.user = user;
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return next(new UnauthorizedError('Token expired. Please login again'));
    }
    if (error.code === 'auth/argument-error') {
      return next(new UnauthorizedError('Invalid token format'));
    }
    logger.error('Authentication error:', error);
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid, isActive: true });
      
      if (user) {
        req.user = user;
        req.firebaseUser = decodedToken;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

module.exports = { authenticate, optionalAuth };
