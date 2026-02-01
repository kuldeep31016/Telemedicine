const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const ASHAWorker = require('../models/ASHAWorker');
const { successResponse } = require('../utils/response.util');
const { ValidationError } = require('../utils/error.util');

const roleModelMap = {
    admin: Admin,
    doctor: Doctor,
    patient: Patient,
    asha_worker: ASHAWorker
};

class UserController {
    // Get all users with optional role filtering
    async getUsers(req, res, next) {
        try {
            const { role } = req.query;

            if (role) {
                if (!roleModelMap[role]) {
                    throw new ValidationError('Invalid role');
                }
                const users = await roleModelMap[role].find({ isActive: true });
                return successResponse(res, users, `${role}s retrieved successfully`);
            }

            // If no role, get from all (though this might be expensive/rare)
            const [admins, doctors, patients, ashaWorkers] = await Promise.all([
                Admin.find({ isActive: true }),
                Doctor.find({ isActive: true }),
                Patient.find({ isActive: true }),
                ASHAWorker.find({ isActive: true })
            ]);

            const allUsers = [...admins, ...doctors, ...patients, ...ashaWorkers];
            return successResponse(res, allUsers, 'All users retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID and role (role is needed now to know which collection)
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.query;

            if (role) {
                if (!roleModelMap[role]) throw new ValidationError('Invalid role');
                const user = await roleModelMap[role].findById(id);
                if (!user) throw new Error('User not found');
                return successResponse(res, user, 'User retrieved successfully');
            }

            // If no role provided, search all (helper in authService might be better, but we can do it here)
            const models = Object.values(roleModelMap);
            for (const Model of models) {
                const user = await Model.findById(id);
                if (user) return successResponse(res, user, 'User retrieved successfully');
            }

            throw new Error('User not found');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
