const db = require('../config/db');

// 썸네일 추출 유틸
const extractThumbnail = (type, url) => {
  if (type === 'image') return url;
  if (type === 'video') return null;
  if (type === 'youtube') {
    const id = url?.match(/[?&]v=([^&]+)/)?.[1] ||
               url?.match(/youtu\.be\/([^?]+)/)?.[1];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
};

// 전체 글 목록
// GET /posts
// GET /posts?user_id=me  (내 글)
const getPosts = async (req, res, next) => {
  try {
    const { user_id, category, sort } = req.query;
    const userId = req.user?.id;

    let query = `
      SELECT p.id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at,
             u.id AS user_id, u.nickname, u.profile_url,
             COUNT(DISTINCT l.user_id) AS like_count,
             COUNT(DISTINCT c.id) AS comment_count,
             EXISTS(
               SELECT 1 FROM likes
               WHERE likes.post_id = p.id AND likes.user_id = ?
             ) AS is_liked
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN comments c ON c.post_id = p.id
    `;

    const params = [userId ?? null];
    const conditions = [];

    if (user_id === 'me' && userId) conditions.push({ sql: 'p.user_id = ?', val: userId });
    if (category) {
      conditions.push({
        sql: 'p.workflow_id IN (SELECT workflow_id FROM workflow_tags WHERE category_name = ?)',
        val: category
      });
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.map(c => c.sql).join(' AND ');
      conditions.forEach(c => params.push(c.val));
    }

    query += sort === 'likes'
      ? ' GROUP BY p.id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at, u.id, u.nickname, u.profile_url ORDER BY like_count DESC, p.created_at DESC'
      : ' GROUP BY p.id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at, u.id, u.nickname, u.profile_url ORDER BY p.created_at DESC';

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
    const { category } = req.query;

    let query = `
      SELECT p.id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at,
             u.id AS user_id, u.nickname, u.profile_url,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
             COUNT(DISTINCT c.id) AS comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      JOIN likes l ON l.post_id = p.id
      LEFT JOIN comments c ON c.post_id = p.id
      WHERE l.user_id = ?
    `;

    const params = [userId];

    if (category) {
      query += ' AND p.workflow_id IN (SELECT workflow_id FROM workflow_tags WHERE category_name = ?)';
      params.push(category);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const [posts] = await db.promise().query(query, params);
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
    const userId = req.user?.id;
    await db.promise().query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [id]);

    // 게시글 + 작성자
    const [posts] = await db.promise().query(
      `SELECT p.id, p.user_id, p.workflow_id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at, p.updated_at,
          u.nickname, u.profile_url,
          COUNT(DISTINCT l.user_id) AS like_count,
          COUNT(DISTINCT c.id) AS comment_count,
          EXISTS(
            SELECT 1 FROM likes
            WHERE likes.post_id = p.id AND likes.user_id = ?
          ) AS is_liked
   FROM posts p
   JOIN users u ON u.id = p.user_id
   LEFT JOIN likes l ON l.post_id = p.id
   LEFT JOIN comments c ON c.post_id = p.id
   WHERE p.id = ?
   GROUP BY p.id, p.user_id, p.workflow_id, p.title, p.thumbnail_url, p.media_url, p.view_count, p.created_at, p.updated_at, u.nickname, u.profile_url`,
      [userId ?? null, id]
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

    if (workflow_id) {
      // 내 북마크 복사본 먼저 확인
      const [bookmarkRows] = await db.promise().query(
        'SELECT custom_result_json FROM workflow_bookmarks WHERE user_id = ? AND workflow_id = ?',
        [userId, workflow_id]
      );

      let resultJson;
      if (bookmarkRows.length > 0) {
        resultJson = typeof bookmarkRows[0].custom_result_json === 'string'
          ? JSON.parse(bookmarkRows[0].custom_result_json)
          : bookmarkRows[0].custom_result_json;
      } else {
        const [wfRows] = await db.promise().query(
          'SELECT result_json FROM workflows WHERE id = ?', [workflow_id]
        );
        if (wfRows.length > 0) {
          resultJson = typeof wfRows[0].result_json === 'string'
            ? JSON.parse(wfRows[0].result_json)
            : wfRows[0].result_json;
        }
      }

      if (resultJson) {
        const steps = resultJson?.steps ?? [];
        const tags = [...new Set(steps.map(s => s.category))];
        console.log('📌 추출된 tags:', tags);
        if (tags.length > 0) {
          await db.promise().query(
            'INSERT INTO workflow_tags (workflow_id, category_name) VALUES ?',
            [tags.map(tag => [workflow_id, tag])]
          );
          console.log('✅ workflow_tags insert 완료');
        }
      }
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

module.exports = { getPosts, getLikedPosts, getPost, createPost, updatePost, deletePost };