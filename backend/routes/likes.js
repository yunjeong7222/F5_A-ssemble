const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// 좋아요
router.post('/:id/likes', authMiddleware, postController.likePost);    
router.delete('/:id/likes', authMiddleware, postController.unlikePost);

module.exports = router;