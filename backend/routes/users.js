const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

router.patch('/me', authMiddleware, userController.updateProfile);
router.patch('/me/password', authMiddleware, userController.updatePassword);
router.delete('/me', authMiddleware, userController.deleteAccount);

module.exports = router;