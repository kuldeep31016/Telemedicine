const ChatMessage = require('../models/ChatMessage');
const Appointment = require('../models/Appointment');
const { successResponse } = require('../utils/response.util');
const { NotFoundError, ValidationError } = require('../utils/error.util');
const logger = require('../config/logger');

class ChatController {
    /**
     * Get chat messages for an appointment
     */
    async getChatMessages(req, res, next) {
        try {
            const { appointmentId } = req.params;
            const userId = req.user._id;
            const userRole = req.user.role;

            // Verify appointment exists and user is part of it
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                throw new NotFoundError('Appointment not found');
            }

            // Check if user is either doctor or patient of this appointment
            const isDoctorOrPatient = 
                (userRole === 'doctor' && appointment.doctorId && appointment.doctorId.toString() === userId.toString()) ||
                ((userRole === 'patient' || userRole === 'user') && appointment.patientId && appointment.patientId.toString() === userId.toString());

            if (!isDoctorOrPatient) {
                throw new ValidationError('You are not authorized to view this chat');
            }

            // Fetch messages
            const messages = await ChatMessage.find({ appointmentId })
                .populate('senderId', 'name profileImage')
                .populate('receiverId', 'name profileImage')
                .sort({ createdAt: 1 });

            // Mark messages as read
            await ChatMessage.updateMany(
                { 
                    appointmentId,
                    receiverId: userId,
                    isRead: false
                },
                { 
                    isRead: true,
                    readAt: new Date()
                }
            );

            logger.info(`Fetched ${messages.length} messages for appointment ${appointmentId}`);
            return successResponse(res, messages, 'Chat messages retrieved successfully');
        } catch (error) {
            logger.error('Error fetching chat messages:', error);
            next(error);
        }
    }

    /**
     * Send a chat message
     */
    async sendMessage(req, res, next) {
        try {
            const { appointmentId } = req.params;
            const { message } = req.body;
            const userId = req.user._id;
            const userRole = req.user.role;

            if (!message || message.trim().length === 0) {
                throw new ValidationError('Message cannot be empty');
            }

            // Verify appointment exists
            const appointment = await Appointment.findById(appointmentId)
                .populate('doctorId', 'name')
                .populate('patientId', 'name');

            if (!appointment) {
                throw new NotFoundError('Appointment not found');
            }

            // Determine sender and receiver
            let senderId, senderModel, receiverId, receiverModel;

            if (userRole === 'doctor' && appointment.doctorId && appointment.doctorId._id.toString() === userId.toString()) {
                senderId = userId;
                senderModel = 'Doctor';
                receiverId = appointment.patientId._id;
                receiverModel = 'Patient';
            } else if ((userRole === 'patient' || userRole === 'user') && appointment.patientId && appointment.patientId._id.toString() === userId.toString()) {
                senderId = userId;
                senderModel = 'Patient';
                receiverId = appointment.doctorId._id;
                receiverModel = 'Doctor';
            } else {
                throw new ValidationError('You are not authorized to send messages in this chat');
            }

            // Create message
            const chatMessage = await ChatMessage.create({
                appointmentId,
                senderId,
                senderModel,
                receiverId,
                receiverModel,
                message: message.trim()
            });

            // Populate sender info
            await chatMessage.populate('senderId', 'name profileImage');

            logger.info(`Message sent in appointment ${appointmentId} by ${senderModel}`);
            return successResponse(res, chatMessage, 'Message sent successfully', 201);
        } catch (error) {
            logger.error('Error sending message:', error);
            next(error);
        }
    }

    /**
     * Get unread message count
     */
    async getUnreadCount(req, res, next) {
        try {
            const userId = req.user._id;

            const unreadCount = await ChatMessage.countDocuments({
                receiverId: userId,
                isRead: false
            });

            return successResponse(res, { count: unreadCount }, 'Unread count retrieved');
        } catch (error) {
            logger.error('Error getting unread count:', error);
            next(error);
        }
    }

    /**
     * Get unread message count for an appointment
     */
    async getUnreadCountForAppointment(req, res, next) {
        try {
            const { appointmentId } = req.params;
            const userId = req.user._id;
            const userRole = req.user.role;

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                throw new NotFoundError('Appointment not found');
            }

            const isDoctorOrPatient = 
                (userRole === 'doctor' && appointment.doctorId && appointment.doctorId.toString() === userId.toString()) ||
                ((userRole === 'patient' || userRole === 'user') && appointment.patientId && appointment.patientId.toString() === userId.toString());

            if (!isDoctorOrPatient) {
                throw new ValidationError('You are not authorized to view this chat');
            }

            const unreadCount = await ChatMessage.countDocuments({
                appointmentId,
                receiverId: userId,
                isRead: false
            });

            return successResponse(res, { count: unreadCount }, 'Unread count retrieved');
        } catch (error) {
            logger.error('Error getting unread count for appointment:', error);
            next(error);
        }
    }

    /**
     * Get latest message for an appointment
     */
    async getLatestMessage(req, res, next) {
        try {
            const { appointmentId } = req.params;
            const userId = req.user._id;
            const userRole = req.user.role;

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                throw new NotFoundError('Appointment not found');
            }

            const isDoctorOrPatient = 
                (userRole === 'doctor' && appointment.doctorId && appointment.doctorId.toString() === userId.toString()) ||
                ((userRole === 'patient' || userRole === 'user') && appointment.patientId && appointment.patientId.toString() === userId.toString());

            if (!isDoctorOrPatient) {
                throw new ValidationError('You are not authorized to view this chat');
            }

            const latestMessage = await ChatMessage.findOne({ appointmentId })
                .populate('senderId', 'name profileImage')
                .sort({ createdAt: -1 })
                .limit(1);

            return successResponse(res, latestMessage, 'Latest message retrieved');
        } catch (error) {
            logger.error('Error getting latest message:', error);
            next(error);
        }
    }
}

module.exports = new ChatController();
