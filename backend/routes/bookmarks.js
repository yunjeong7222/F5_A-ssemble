const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const bookmarkController = require('../controllers/bookmarkController');

router.post('/:id/bookmarks', authMiddleware, bookmarkController.addBookmark);
router.delete('/:id/bookmarks', authMiddleware, bookmarkController.removeBookmark);
router.get('/my', authMiddleware, bookmarkController.getMyBookmarks);

module.exports = router;