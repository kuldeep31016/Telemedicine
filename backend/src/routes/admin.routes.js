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
 * @route   GET /api/v1/admin/doctors/pending
 * @desc    Get pending doctors for approval
 * @access  Private (Admin)
 */
router.get('/doctors/pending', adminController.getPendingDoctors);

/**
 * @route   GET /api/v1/admin/doctors/approved
 * @desc    Get approved doctors
 * @access  Private (Admin)
 */
router.get('/doctors/approved', adminController.getApprovedDoctors);

/**
 * @route   PUT /api/v1/admin/doctors/:doctorId/approve
 * @desc    Approve a doctor
 * @access  Private (Admin)
 */
router.put('/doctors/:doctorId/approve', adminController.approveDoctor);

/**
 * @route   PUT /api/v1/admin/doctors/:doctorId/reject
 * @desc    Reject a doctor
 * @access  Private (Admin)
 */
router.put('/doctors/:doctorId/reject', adminController.rejectDoctor);

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
 * @route   GET /api/v1/admin/patients/:id
 * @desc    Get patient details by ID
 * @access  Private (Admin)
 */
router.get('/patients/:id', (req, res, next) => {
    req.query.role = 'patient';
    userController.getUserById(req, res, next);
});

/**
 * @route   GET /api/v1/admin/appointments
 * @desc    Get all appointments
 * @access  Private (Admin)
 */
router.get('/appointments', adminController.getAllAppointments);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users (with optional role filtering)
 * @access  Private (Admin)
 */
router.get('/users', userController.getUsers);

/**
 * @route   GET /api/v1/admin/analytics/appointments-trend
 * @desc    Get appointments trend over time
 * @access  Private (Admin)
 */
router.get('/analytics/appointments-trend', adminController.getAppointmentsTrend);

/**
 * @route   GET /api/v1/admin/analytics/status-distribution
 * @desc    Get appointment status distribution
 * @access  Private (Admin)
 */
router.get('/analytics/status-distribution', adminController.getStatusDistribution);

/**
 * @route   GET /api/v1/admin/analytics/top-doctors
 * @desc    Get top performing doctors
 * @access  Private (Admin)
 */
router.get('/analytics/top-doctors', adminController.getTopDoctors);

/**
 * @route   GET /api/v1/admin/analytics/peak-hours
 * @desc    Get peak appointment hours
 * @access  Private (Admin)
 */
router.get('/analytics/peak-hours', adminController.getPeakHours);

/**
 * @route   GET /api/v1/admin/analytics/specialty-distribution
 * @desc    Get specialty-wise appointment distribution
 * @access  Private (Admin)
 */
router.get('/analytics/specialty-distribution', adminController.getSpecialtyDistribution);

/**
 * @route   GET /api/v1/admin/analytics/revenue
 * @desc    Get revenue analytics
 * @access  Private (Admin)
 */
router.get('/analytics/revenue', adminController.getRevenueAnalytics);

module.exports = router;
