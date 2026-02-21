const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const ChatMessage = require('./src/models/ChatMessage');


process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Connect to database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://telemedicine.kuldeepraj.xyz',
      config.frontendUrl
    ],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Join appointment chat room
  socket.on('join_chat', (appointmentId) => {
    socket.join(`appointment_${appointmentId}`);
    logger.info(`Socket ${socket.id} joined appointment_${appointmentId}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const { appointmentId, senderId, senderModel, receiverId, receiverModel, message } = data;
      
      logger.info(`[Socket] Received message for appointment ${appointmentId} from ${senderModel}:`, { message: message.substring(0, 50) });

      // Save message to database
      const chatMessage = await ChatMessage.create({
        appointmentId,
        senderId,
        senderModel,
        receiverId,
        receiverModel,
        message
      });

      // Populate sender info
      await chatMessage.populate('senderId', 'name profileImage');

      logger.info(`[Socket] Broadcasting message to appointment_${appointmentId}`, { messageId: chatMessage._id });

      // Broadcast to appointment room
      io.to(`appointment_${appointmentId}`).emit('receive_message', chatMessage);

      logger.info(`Message sent in appointment ${appointmentId}`);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { appointmentId, userName } = data;
    socket.to(`appointment_${appointmentId}`).emit('user_typing', { userName });
  });

  socket.on('stop_typing', (data) => {
    const { appointmentId } = data;
    socket.to(`appointment_${appointmentId}`).emit('user_stop_typing');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start server
server.listen(config.port, () => {
  logger.info(`Server running in ${config.env} mode on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = server;
