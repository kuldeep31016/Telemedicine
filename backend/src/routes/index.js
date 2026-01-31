const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');

// API v1 routes
router.use('/v1/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
