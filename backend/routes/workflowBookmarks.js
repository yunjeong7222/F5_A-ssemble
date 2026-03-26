const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { addBookmark, removeBookmark, getMyBookmarks, checkBookmark, updateBookmarkPrompt, getBookmarkByWorkflowId  } = require('../controllers/workflowBookmarkController');

router.post('/', authMiddleware, addBookmark);
router.delete('/:workflow_id', authMiddleware, removeBookmark);
router.get('/my', authMiddleware, getMyBookmarks);
router.get('/check/:workflow_id', authMiddleware, checkBookmark);
router.patch('/:workflow_id', authMiddleware, updateBookmarkPrompt);
router.get('/detail/:workflow_id', authMiddleware, getBookmarkByWorkflowId);

module.exports = router;