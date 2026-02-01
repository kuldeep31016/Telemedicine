const admin = require('../config/firebase');
const User = require('../models/User');
const { ValidationError, UnauthorizedError, ConflictError } = require('../utils/error.util');
const logger = require('../config/logger');

class AuthService {
  // Register new user
  async register(firebaseUid, userData) {
    try {
      // Verify Firebase UID exists
      // TODO: Restore this check when Firebase Admin SDK credentials are provided
      // const firebaseUser = await admin.auth().getUser(firebaseUid);

      // if (!firebaseUser) {
      //   throw new ValidationError('Invalid Firebase user');
      // }
      // Mock validation success for development
      if (!firebaseUid) throw new ValidationError('Firebase UID is required');

      // Check if user already exists
      const existingUser = await User.findOne({ firebaseUid });
      if (existingUser) {
        throw new ConflictError('User already registered');
      }

      // Check if email already exists
      const emailExists = await User.findOne({ email: userData.email });
      if (emailExists) {
        throw new ConflictError('Email already in use');
      }

      // Create new user
      const user = await User.create({
        firebaseUid,
        ...userData
      });

      logger.info(`New user registered: ${user.email} (${user.role})`);

      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Login user (verify and get/update user data)
  async login(firebaseUid) {
    try {
      // Find user by Firebase UID
      const user = await User.findOne({ firebaseUid });

      if (!user) {
        throw new UnauthorizedError('User not found. Please register first');
      }

      if (!user.isActive) {
        throw new UnauthorizedError('Account is deactivated. Please contact support');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in: ${user.email}`);

      return user;
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Get user by Firebase UID
  async getUserByFirebaseUid(firebaseUid) {
    const user = await User.findOne({ firebaseUid, isActive: true });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, updates) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ValidationError('User not found');
    }

    return user;
  }
}

module.exports = new AuthService();
