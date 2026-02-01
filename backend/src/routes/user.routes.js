const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Protect all user routes
router.use(authenticate);

// Get users (supports ?role=admin or ?role=doctor)
router.get('/', userController.getUsers);

// Get specific user
router.get('/:id', userController.getUserById);

module.exports = router;
