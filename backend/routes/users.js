const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

router.put('/me/profile', authMiddleware, userController.updateProfile);
router.put('/me/password', authMiddleware, userController.updatePassword);
router.delete('/me', authMiddleware, userController.deleteAccount);

module.exports = router;