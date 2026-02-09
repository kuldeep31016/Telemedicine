const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const ASHAWorker = require('../models/ASHAWorker');
const { ValidationError, UnauthorizedError, ConflictError } = require('../utils/error.util');
const logger = require('../config/logger');

const roleModelMap = {
  admin: Admin,
  doctor: Doctor,
  patient: Patient,
  asha_worker: ASHAWorker
};

class AuthService {
  // Helper to find user across all role-based collections
  async findUserAcrossModels(query) {
    const models = Object.values(roleModelMap);
    const results = await Promise.all(models.map(Model => Model.findOne(query)));
    return results.find(user => user !== null) || null;
  }

  // Register new user based on role
  async register(firebaseUid, userData) {
    try {
      if (!firebaseUid) throw new ValidationError('Firebase UID is required');
      if (!userData.role || !roleModelMap[userData.role]) {
        throw new ValidationError('Invalid or missing role');
      }

      const Model = roleModelMap[userData.role];

      // Check if user already exists in ANY collection
      const existingUser = await this.findUserAcrossModels({ firebaseUid });
      if (existingUser) {
        throw new ConflictError('User already registered');
      }

      // Check if email already exists in ANY collection
      const emailExists = await this.findUserAcrossModels({ email: userData.email });
      if (emailExists) {
        throw new ConflictError('Email already in use');
      }

      // Create new user in the specific collection
      const user = await Model.create({
        firebaseUid,
        ...userData
      });

      logger.info(`New ${user.role} registered: ${user.email}`);

      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Login user (verify and get/update user data)
  async login(firebaseUid) {
    try {
      // Find user across all collections
      const user = await this.findUserAcrossModels({ firebaseUid });

      if (!user) {
        throw new UnauthorizedError('User not found. Please register first');
      }

      if (!user.isActive) {
        throw new UnauthorizedError('Account is deactivated. Please contact support');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in: ${user.email} (${user.role})`);

      return user;
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Get user by Firebase UID
  async getUserByFirebaseUid(firebaseUid) {
    const user = await this.findUserAcrossModels({ firebaseUid, isActive: true });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, updates, role) {
    if (!role || !roleModelMap[role]) {
      throw new ValidationError('Role is required to update profile');
    }

    const Model = roleModelMap[role];
    const user = await Model.findByIdAndUpdate(
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
