const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email.service');
const logger = require('../config/logger');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const result = await sendContactEmail({ name, email, subject, message });

  if (result.success) {
    return res.json({ success: true, message: 'Message sent successfully' });
  }

  logger.error('Contact email failed:', result.message);
  return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
});

module.exports = router;
