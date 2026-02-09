const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);

// Protected routes (require Firebase token)
router.post('/login', authenticate, authController.login);
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
