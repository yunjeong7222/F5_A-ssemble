const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// 댓글
router.get('/:id/comments', postController.getComments);                              
router.post('/:id/comments', authMiddleware, postController.createComment);            
router.patch('/:id/comments/:commentId', authMiddleware, postController.updateComment);
router.delete('/:id/comments/:commentId', authMiddleware, postController.deleteComment);

module.exports = router;