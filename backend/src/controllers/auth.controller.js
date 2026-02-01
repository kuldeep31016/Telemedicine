const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');

class AuthController {
  // Register new user
  async register(req, res, next) {
    try {
      const { firebaseUid, name, email, username, role, phone, ...otherData } = req.body;

      const userData = {
        name,
        email,
        username,
        role,
        phone,
        ...otherData
      };

      const user = await authService.register(firebaseUid, userData);

      return successResponse(res, user, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      // User is already verified by Firebase middleware
      // Just get/update user data from MongoDB
      const user = await authService.login(req.firebaseUser.uid);

      return successResponse(res, user, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  async getCurrentUser(req, res, next) {
    try {
      return successResponse(res, req.user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  async updateProfile(req, res, next) {
    try {
      const updates = req.body;

      // Remove fields that shouldn't be updated
      delete updates.firebaseUid;
      delete updates.email;
      delete updates.role;

      const user = await authService.updateProfile(req.user._id, updates, req.user.role);

      return successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Logout (client-side only - Firebase handles this)
  async logout(req, res, next) {
    try {
      // Could implement token blacklisting here if needed
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
