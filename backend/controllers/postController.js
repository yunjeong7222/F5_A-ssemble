const db = require('../config/db');

// 썸네일 추출 유틸
const extractThumbnail = (type, url) => {
  if (type === 'image') return url;
  if (type === 'video') return url?.replace(/\.(mp4|mov|avi)$/, '.jpg');
  if (type === 'youtube') {
    // 원본 URL에서 ID 추출
    const id = url?.match(/[?&]v=([^&]+)/)?.[1];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
};

// 전체 글 목록
// GET /posts
// GET /posts?user_id=me  (내 글)
const getPosts = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const userId = req.user?.id;

    let query = `
      SELECT p.id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at,
             u.id AS user_id, u.nickname, u.profile_url,
             COUNT(DISTINCT l.user_id) AS like_count,
             COUNT(DISTINCT c.id) AS comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN comments c ON c.post_id = p.id
    `;

    const params = [];

    // 내 글 필터
    if (user_id === 'me' && userId) {
      query += ' WHERE p.user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';
    const [posts] = await db.promise().query(query, params);
    return res.status(200).json({ success: true, data: posts });

  } catch (err) {
    next(err);
  }
};

// 내가 좋아요한 글
// GET /posts/liked 
  const getLikedPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [posts] = await db.promise().query(
      `SELECT p.id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at,
              u.id AS user_id, u.nickname, u.profile_url,
              COUNT(DISTINCT l.user_id) AS like_count,
              COUNT(DISTINCT c.id) AS comment_count
       FROM posts p
       JOIN users u ON u.id = p.user_id
       JOIN likes l ON l.post_id = p.id
       LEFT JOIN comments c ON c.post_id = p.id
       WHERE l.user_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

// 게시글 상세 조회
// GET /posts/:id
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    // 조회수 증가
    await db.promise().query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [id]);

    // 게시글 + 작성자
    const [posts] = await db.promise().query(
      `SELECT p.*, u.nickname, u.profile_url,
              COUNT(DISTINCT l.user_id) AS like_count,
              COUNT(DISTINCT c.id) AS comment_count
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN likes l ON l.post_id = p.id
       LEFT JOIN comments c ON c.post_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
    }

    // 첨부파일
    const [attachments] = await db.promise().query(
      'SELECT * FROM post_attachments WHERE post_id = ? ORDER BY sort_order ASC',
      [id]
    );

    return res.status(200).json({
      success: true,
      data: { ...posts[0], attachments },
    });
  } catch (err) {
    next(err);
  }
};

// 게시글 작성
// POST /posts 
const createPost = async (req, res, next) => {
  try {
    const { title, workflow_id, attachments } = req.body;
    const userId = req.user.id;

    if (!title) {
      const err = new Error('제목은 필수입니다.');
      err.status = 400;
      throw err;
    }

    // 첫 번째 image/video attachment에서 thumbnail_url, media_url 추출
    let thumbnail_url = null;
    let media_url = null;

    if (attachments?.length > 0) {
      const mediaAtt = attachments.find(a => ['image', 'video', 'youtube'].includes(a.type));
      if (mediaAtt) {
        thumbnail_url = extractThumbnail(mediaAtt.type, mediaAtt.url);
        media_url = mediaAtt.url;
      }
    }

    // 게시글 저장
    const [result] = await db.promise().query(
      'INSERT INTO posts (user_id, workflow_id, title, thumbnail_url, media_url) VALUES (?, ?, ?, ?, ?)',
      [userId, workflow_id ?? null, title, thumbnail_url, media_url]
    );

    const postId = result.insertId;

    // 첨부파일 저장
    if (attachments?.length > 0) {
      const values = attachments.map((a, i) => [
        postId, a.type, a.content ?? null, a.url ?? null, i
      ]);
      await db.promise().query(
        'INSERT INTO post_attachments (post_id, type, content, url, sort_order) VALUES ?',
        [values]
      );
    }

    return res.status(201).json({ success: true, message: '게시글이 작성되었습니다.', data: { postId } });
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
// PATCH /posts/:id 
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, attachments } = req.body;
    const userId = req.user.id;

    // 작성자 확인
    const [posts] = await db.promise().query('SELECT user_id FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) {
      const err = new Error('게시글을 찾을 수 없습니다.');
      err.status = 404;
      throw err;
    }
    if (posts[0].user_id !== userId) {
      const err = new Error('수정 권한이 없습니다.');
      err.status = 403;
      throw err;
    }

    // thumbnail_url, media_url 재추출
    let thumbnail_url = null;
    let media_url = null;

    if (attachments?.length > 0) {
      const mediaAtt = attachments.find(a => ['image', 'video', 'youtube'].includes(a.type));
      if (mediaAtt) {
        thumbnail_url = extractThumbnail(mediaAtt.type, mediaAtt.url);
        media_url = mediaAtt.url;
      }
    }

    await db.promise().query(
      'UPDATE posts SET title = COALESCE(?, title), thumbnail_url = ?, media_url = ? WHERE id = ?',
      [title ?? null, thumbnail_url, media_url, id]
    );

    // 기존 첨부파일 삭제 후 재삽입
    if (attachments?.length > 0) {
      await db.promise().query('DELETE FROM post_attachments WHERE post_id = ?', [id]);
      const values = attachments.map((a, i) => [
        id, a.type, a.content ?? null, a.url ?? null, i
      ]);
      await db.promise().query(
        'INSERT INTO post_attachments (post_id, type, content, url, sort_order) VALUES ?',
        [values]
      );
    }

    return res.status(200).json({ success: true, message: '게시글이 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
};


// 게시글 삭제
// DELETE /posts/:id
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [posts] = await db.promise().query('SELECT user_id FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) {
      const err = new Error('게시글을 찾을 수 없습니다.');
      err.status = 404;
      throw err;
    }
    if (posts[0].user_id !== userId) {
      const err = new Error('삭제 권한이 없습니다.');
      err.status = 403;
      throw err;
    }

    await db.promise().query('DELETE FROM posts WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};


// 좋아요
// POST /posts/:id/likes 
const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      'INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)',
      [userId, id]
    );

    return res.status(200).json({ success: true, message: '좋아요를 눌렀습니다.' });
  } catch (err) {
    next(err);
  }
};

// 좋아요 취소
// DELETE /posts/:id/likes 
const unlikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
      [userId, id]
    );

    return res.status(200).json({ success: true, message: '좋아요를 취소했습니다.' });
  } catch (err) {
    next(err);
  }
};


// 댓글 목록
// GET /posts/:id/comments
const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [comments] = await db.promise().query(
      `SELECT c.id, c.content, c.created_at, c.updated_at,
              u.id AS user_id, u.nickname, u.profile_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );

    return res.status(200).json({ success: true, data: comments });
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

    return res.status(201).json({ success: true, message: '댓글이 작성되었습니다.', data: { commentId: result.insertId } });
  } catch (err) {
    next(err);
  }
};

// 댓글 수정
// PATCH /posts/:id/comments/:commentId
const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const [comments] = await db.promise().query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
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

    await db.promise().query('UPDATE comments SET content = ? WHERE id = ?', [content, commentId]);

    return res.status(200).json({ success: true, message: '댓글이 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// 댓글 삭제
// DELETE /posts/:id/comments/:commentId 
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const [comments] = await db.promise().query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
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

module.exports = {
  getPosts, getLikedPosts, getPost, createPost, updatePost, deletePost,
  likePost, unlikePost,
  getComments, createComment, updateComment, deleteComment,
};