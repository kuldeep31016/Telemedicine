const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Payment routes (patient only)
router.post(
  '/create-order',
  authenticate,
  authorize('patient'),
  appointmentController.createAppointmentOrder
);

router.post(
  '/verify-payment',
  authenticate,
  authorize('patient'),
  appointmentController.verifyPayment
);

// Get user appointments (patient or doctor)
router.get(
  '/',
  authenticate,
  authorize('patient', 'doctor', 'admin'),
  appointmentController.getUserAppointments
);

// Get specific appointment
router.get(
  '/:id',
  authenticate,
  authorize('patient', 'doctor', 'admin'),
  appointmentController.getAppointmentById
);

// Cancel appointment
router.put(
  '/:id/cancel',
  authenticate,
  authorize('patient', 'doctor', 'admin'),
  appointmentController.cancelAppointment
);

module.exports = router;
