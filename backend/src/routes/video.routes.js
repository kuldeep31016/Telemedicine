const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/v1/video/token
 * @desc    Generate Agora token for video consultation
 * @access  Private (Patient/Doctor)
 */
router.post('/token', authenticate, videoController.generateToken);

/**
 * @route   GET /api/v1/video/validate/:appointmentId
 * @desc    Validate if user can join consultation
 * @access  Private (Patient/Doctor)
 */
router.get('/validate/:appointmentId', authenticate, videoController.validateConsultation);

/**
 * @route   POST /api/v1/video/start/:appointmentId
 * @desc    Start consultation (doctor initiates)
 * @access  Private (Doctor/Patient)
 */
router.post('/start/:appointmentId', authenticate, videoController.startConsultation);

/**
 * @route   POST /api/v1/video/end/:appointmentId
 * @desc    End consultation
 * @access  Private (Doctor/Patient)
 */
router.post('/end/:appointmentId', authenticate, videoController.endConsultation);

/**
 * @route   GET /api/v1/video/status/:appointmentId
 * @desc    Get call status (for patient waiting room)
 * @access  Private (Patient/Doctor)
 */
router.get('/status/:appointmentId', authenticate, videoController.getCallStatus);

module.exports = router;
