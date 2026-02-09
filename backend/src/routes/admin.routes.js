const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Protect all admin routes - only admin can access
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @route   GET /api/v1/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin)
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * @route   GET /api/v1/admin/dashboard/recent-registrations
 * @desc    Get recent user registrations
 * @access  Private (Admin)
 */
router.get('/dashboard/recent-registrations', adminController.getRecentRegistrations);

/**
 * @route   GET /api/v1/admin/doctors
 * @desc    Get all registered doctors
 * @access  Private (Admin)
 */
router.get('/doctors', (req, res, next) => {
    req.query.role = 'doctor';
    userController.getUsers(req, res, next);
});

/**
 * @route   GET /api/v1/admin/patients
 * @desc    Get all registered patients
 * @access  Private (Admin)
 */
router.get('/patients', (req, res, next) => {
    req.query.role = 'patient';
    userController.getUsers(req, res, next);
});

/**
 * @route   GET /api/v1/admin/doctors/:id
 * @desc    Get doctor details by ID
 * @access  Private (Admin)
 */
router.get('/doctors/:id', (req, res, next) => {
    req.query.role = 'doctor';
    userController.getUserById(req, res, next);
});

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users (with optional role filtering)
 * @access  Private (Admin)
 */
router.get('/users', userController.getUsers);

module.exports = router;
