const admin = require('../config/firebase');
const { UnauthorizedError } = require('../utils/error.util');
const authService = require('../services/auth.service');
const logger = require('../config/logger');

// Firebase Authentication Middleware
const authenticate = async (req, res, next) => {
  const startTime = Date.now();
  try {
    logger.info(`[Auth] Processing ${req.method} ${req.path}`);
    
    // Get Firebase token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    logger.debug('[Auth] Token extracted, verifying...');

    let decodedToken;
    try {
      // Verify Firebase token with timeout
      const verifyPromise = admin.auth().verifyIdToken(token);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase token verification timeout')), 10000)
      );
      decodedToken = await Promise.race([verifyPromise, timeoutPromise]);
    } catch (firebaseError) {
      // Fallback for development without Service Account
      if (process.env.NODE_ENV === 'development' || !process.env.FIREBASE_PRIVATE_KEY) {
        logger.warn('Firebase verification failed (likely missing creds). FALLING BACK TO INSECURE DECODING for dev.');
        try {
          // Insecurely decode the JWT payload
          const payload = token.split('.')[1];
          const buffer = Buffer.from(payload, 'base64');
          decodedToken = JSON.parse(buffer.toString());
          // Ensure it has the uid
          if (!decodedToken.user_id && !decodedToken.uid) throw new Error('Invalid token structure');
          decodedToken.uid = decodedToken.user_id || decodedToken.uid;
        } catch (decodeError) {
          throw firebaseError; // Throw original error if decoding fails
        }
      } else {
        throw firebaseError;
      }
    }

    // Get user using the cross-model finder in authService with timeout
    logger.debug('[Auth] Firebase token verified, fetching user...');
    const userPromise = authService.getUserByFirebaseUid(decodedToken.uid);
    const userTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout in auth')), 10000)
    );
    const user = await Promise.race([userPromise, userTimeoutPromise]);

    if (!user) {
      throw new UnauthorizedError('User not found or inactive');
    }

    logger.info(`[Auth] User authenticated: ${user.email} (${user.role}) in ${Date.now() - startTime}ms`);

    // Attach user and firebase data to request
    req.user = user;
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    logger.error(`[Auth] Authentication failed after ${Date.now() - startTime}ms:`, error.message);
    if (error.code === 'auth/id-token-expired') {
      return next(new UnauthorizedError('Token expired. Please login again'));
    }
    if (error.code === 'auth/argument-error') {
      return next(new UnauthorizedError('Invalid token format'));
    }
    logger.error('Authentication error:', error);
    next(new UnauthorizedError(error.message || 'Invalid or expired token'));
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await authService.findUserAcrossModels({ firebaseUid: decodedToken.uid, isActive: true });

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
