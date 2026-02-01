const User = require('../models/User');
const { successResponse } = require('../utils/response.util');

class UserController {
    // Get all users with optional role filtering
    async getUsers(req, res, next) {
        try {
            const { role } = req.query;
            const query = { isActive: true };

            if (role) {
                query.role = role;
            }

            const users = await User.find(query).select('-password');

            return successResponse(res, users, 'Users retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID
    async getUserById(req, res, next) {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                throw new Error('User not found');
            }

            return successResponse(res, user, 'User retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
