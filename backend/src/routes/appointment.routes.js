const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Get booked slots for a doctor on a specific date (no auth required for checking availability)
router.get(
  '/booked-slots',
  appointmentController.getBookedSlots
);

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

// Doctor reschedule appointment
router.put(
  '/:id/reschedule',
  authenticate,
  authorize('doctor'),
  appointmentController.doctorRescheduleAppointment
);

// Patient accept reschedule
router.put(
  '/:id/accept-reschedule',
  authenticate,
  authorize('patient'),
  appointmentController.patientAcceptReschedule
);

// Patient reject reschedule
router.put(
  '/:id/reject-reschedule',
  authenticate,
  authorize('patient'),
  appointmentController.patientRejectReschedule
);

module.exports = router;
