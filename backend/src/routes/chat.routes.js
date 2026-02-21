const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/chat/:appointmentId/messages
 * @desc    Get all messages for an appointment
 * @access  Private (Doctor/Patient)
 */
router.get('/:appointmentId/messages', chatController.getChatMessages);

/**
 * @route   POST /api/v1/chat/:appointmentId/messages
 * @desc    Send a message in appointment chat
 * @access  Private (Doctor/Patient)
 */
router.post('/:appointmentId/messages', chatController.sendMessage);

/**
 * @route   GET /api/v1/chat/unread-count
 * @desc    Get unread message count
 * @access  Private
 */
router.get('/unread-count', chatController.getUnreadCount);

/**
 * @route   GET /api/v1/chat/:appointmentId/unread
 * @desc    Get unread message count for an appointment
 * @access  Private (Doctor/Patient)
 */
router.get('/:appointmentId/unread', chatController.getUnreadCountForAppointment);

/**
 * @route   GET /api/v1/chat/:appointmentId/latest
 * @desc    Get latest message for an appointment
 * @access  Private (Doctor/Patient)
 */
router.get('/:appointmentId/latest', chatController.getLatestMessage);

module.exports = router;
