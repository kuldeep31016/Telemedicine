const Razorpay = require('razorpay');
const config = require('./env');
const logger = require('./logger');

// Validate Razorpay credentials
if (!config.razorpay.keyId || !config.razorpay.keySecret) {
  logger.error('Razorpay credentials are missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  throw new Error('Razorpay configuration is incomplete');
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

logger.info('Razorpay initialized successfully');

module.exports = razorpay;
