const db = require('../config/db');

// 댓글 목록 (대댓글 중첩 포함)
// GET /posts/:id/comments
const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 부모 댓글만 조회
    const [comments] = await db.promise().query(
      `SELECT c.id, c.content, c.created_at, c.updated_at, c.parent_id,
              u.id AS user_id, u.nickname, u.profile_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at ASC`,
      [id]
    );

    // 대댓글 조회
    const [replies] = await db.promise().query(
      `SELECT c.id, c.content, c.created_at, c.updated_at, c.parent_id,
              u.id AS user_id, u.nickname, u.profile_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ? AND c.parent_id IS NOT NULL
       ORDER BY c.created_at ASC`,
      [id]
    );

    // 부모 댓글에 replies 배열 중첩
    const result = comments.map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parent_id === comment.id),
    }));

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// 댓글 작성
// POST /posts/:id/comments
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      const err = new Error('댓글 내용을 입력해주세요.');
      err.status = 400;
      throw err;
    }

    const [result] = await db.promise().query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [id, userId, content]
    );

    return res.status(201).json({
      success: true,
      message: '댓글이 작성되었습니다.',
      data: { commentId: result.insertId },
    });
  } catch (err) {
    next(err);
  }
};

// 대댓글 작성
// POST /posts/:id/comments/:commentId/replies
const createReply = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      const err = new Error('댓글 내용을 입력해주세요.');
      err.status = 400;
      throw err;
    }

    // 부모 댓글 존재 여부 확인
    const [parent] = await db.promise().query(
      'SELECT id, parent_id FROM comments WHERE id = ? AND post_id = ?',
      [commentId, id]
    );
    if (parent.length === 0) {
      const err = new Error('댓글을 찾을 수 없습니다.');
      err.status = 404;
      throw err;
    }
    // 대댓글에 대댓글 방지 (2depth 고정)
    if (parent[0].parent_id !== null) {
      const err = new Error('대댓글에는 답글을 달 수 없습니다.');
      err.status = 400;
      throw err;
    }

    const [result] = await db.promise().query(
      'INSERT INTO comments (post_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [id, userId, content, commentId]
    );

    return res.status(201).json({
      success: true,
      message: '답글이 작성되었습니다.',
      data: { commentId: result.insertId },
    });
  } catch (err) {
    next(err);
  }
};

// 댓글/대댓글 수정
// PATCH /posts/:id/comments/:commentId
const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const [comments] = await db.promise().query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );
    if (comments.length === 0) {
      const err = new Error('댓글을 찾을 수 없습니다.');
      err.status = 404;
      throw err;
    }
    if (comments[0].user_id !== userId) {
      const err = new Error('수정 권한이 없습니다.');
      err.status = 403;
      throw err;
    }

    await db.promise().query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, commentId]
    );

    return res.status(200).json({ success: true, message: '댓글이 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// 댓글/대댓글 삭제
// DELETE /posts/:id/comments/:commentId
// 부모 댓글 삭제 시 CASCADE로 대댓글도 자동 삭제
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const [comments] = await db.promise().query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );
    if (comments.length === 0) {
      const err = new Error('댓글을 찾을 수 없습니다.');
      err.status = 404;
      throw err;
    }
    if (comments[0].user_id !== userId) {
      const err = new Error('삭제 권한이 없습니다.');
      err.status = 403;
      throw err;
    }

    await db.promise().query('DELETE FROM comments WHERE id = ?', [commentId]);

    return res.status(200).json({ success: true, message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, createComment, createReply, updateComment, deleteComment };