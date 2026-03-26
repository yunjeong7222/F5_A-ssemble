const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {authMiddleware} = require('../middleware/auth');

// 게시글
router.get('/', postController.getPosts);                        
router.get('/liked', authMiddleware, postController.getLikedPosts);
router.get('/:id', authMiddleware, postController.getPost);                      
router.post('/', authMiddleware, postController.createPost);     
router.patch('/:id', authMiddleware, postController.updatePost); 
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;