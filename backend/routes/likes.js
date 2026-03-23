const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const {authMiddleware} = require('../middleware/auth');

// 좋아요
router.post('/:id/likes', authMiddleware, likeController.likePost);    
router.delete('/:id/likes', authMiddleware, likeController.unlikePost);

module.exports = router;