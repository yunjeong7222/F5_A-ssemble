import { useState, useEffect } from 'react';
import { getComments, createComment, createReply, updateComment, deleteComment } from '../../api/comments';
import useAuthStore from '../../store/authStore';
import '../../styles/Comments.css';

const Avatar = ({ url, nickname, className }) => {
  if (url) {
    return <img src={url} alt={nickname} className={className} style={{ objectFit: 'cover' }} />;
  }
  return <div className={className}>{(nickname || 'U').charAt(0).toUpperCase()}</div>;
};

const CommentList = ({ postId }) => {
  const { user } = useAuthStore();
  const [comments, setComments]     = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [editText, setEditText]     = useState('');
  const [replyingId, setReplyingId] = useState(null);  // 답글 입력창 열린 댓글 id
  const [replyText, setReplyText]   = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  const loadComments = async () => {
    try {
      const res = await getComments(postId);
      setComments(res.data.data || []);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    if (!postId) return;
    loadComments();
  }, [postId]);

  // 댓글 등록
  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsLoading(true);
    try {
      await createComment(postId, newComment.trim());
      await loadComments();
      setNewComment('');
    } catch (err) {
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 답글 등록
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      await createReply(postId, commentId, replyText.trim());
      await loadComments();
      setReplyingId(null);
      setReplyText('');
    } catch (err) {
      alert('답글 등록에 실패했습니다.');
    }
  };

  // 수정 시작
  const handleEditStart = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  // 수정 저장
  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await updateComment(postId, commentId, editText.trim());
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) return { ...c, content: editText.trim() };
          return {
            ...c,
            replies: c.replies?.map(r =>
              r.id === commentId ? { ...r, content: editText.trim() } : r
            ),
          };
        })
      );
      setEditingId(null);
    } catch (err) {
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    try {
      await deleteComment(postId, commentId);
      await loadComments();
    } catch (err) {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 댓글/대댓글 공통 액션 버튼
  const ActionButtons = ({ comment }) => (
    user?.id === comment.user_id && (
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="detail-comment-action-btn" onClick={() => handleEditStart(comment)}>수정</button>
        <button
          className="detail-comment-action-btn detail-comment-action-btn--delete"
          onClick={() => handleDelete(comment.id)}
        >
          삭제
        </button>
      </div>
    )
  );

  // 수정 인풋
  const EditInput = ({ commentId }) => (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input
        className="detail-comment-input"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(commentId); }}
      />
      <button className="detail-comment-submit" onClick={() => handleEditSave(commentId)}>저장</button>
      <button
        className="detail-comment-submit"
        style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1.5px solid var(--border)' }}
        onClick={() => setEditingId(null)}
      >
        취소
      </button>
    </div>
  );

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <section className="detail-comments-section">
      <h4 style={{ marginBottom: '20px' }}>댓글 {totalCount}개</h4>

      {/* 댓글 입력 */}
      <div className="detail-comment-wrap">
        <Avatar url={user?.profile_url} nickname={user?.nickname} className="detail-comment-avatar" />
        <input
          type="text"
          placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 남길 수 있습니다.'}
          className="detail-comment-input"
          value={newComment}
          disabled={!user}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSubmit(); }}
        />
        <button
          className="detail-comment-submit"
          onClick={handleSubmit}
          disabled={!user || isLoading || !newComment.trim()}
        >
          {isLoading ? '...' : '등록'}
        </button>
      </div>

      {[...comments].reverse().map(comment => (
        <div key={comment.id} className="detail-comment-item">

          {/* ── 부모 댓글 ── */}
          <div className="detail-comment-header">
            <div className="comm-user-info">
              <Avatar url={comment.profile_url} nickname={comment.nickname} className="comm-user-avatar" />
              <span className="comm-user-name">@{comment.nickname}</span>
              <span className="detail-meta-text">
                {new Date(comment.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <ActionButtons comment={comment} />
          </div>

          {editingId === comment.id
            ? <EditInput commentId={comment.id} />
            : <p className="detail-comment-content">{comment.content}</p>
          }

          {/* 답글 버튼 */}
          {user && (
            <button
              className="detail-comment-action-btn"
              style={{ marginTop: 4, fontSize: 12, paddingLeft: 40 }}
              onClick={() => {
                setReplyingId(replyingId === comment.id ? null : comment.id);
                setReplyText('');
              }}
            >
              {replyingId === comment.id ? '취소' : '답글'}
            </button>
          )}

          {/* 답글 입력창 */}
          {replyingId === comment.id && (
            <div className="detail-comment-wrap" style={{ marginTop: 8, paddingLeft: 24 }}>
              <Avatar url={user?.profile_url} nickname={user?.nickname} className="detail-comment-avatar" />
              <input
                type="text"
                placeholder="답글을 입력하세요..."
                className="detail-comment-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleReplySubmit(comment.id); }}
              />
              <button
                className="detail-comment-submit"
                onClick={() => handleReplySubmit(comment.id)}
                disabled={!replyText.trim()}
              >
                등록
              </button>
            </div>
          )}

          {/* ── 대댓글 목록 ── */}
          {comment.replies?.length > 0 && (
            <div style={{ paddingLeft: 24, marginTop: 8, borderLeft: '2px solid var(--border)' }}>
              {comment.replies.map(reply => (
                <div key={reply.id} className="detail-comment-item" style={{ marginBottom: 8 }}>
                  <div className="detail-comment-header">
                    <div className="comm-user-info">
                      <Avatar url={reply.profile_url} nickname={reply.nickname} className="comm-user-avatar" />
                      <span className="comm-user-name">@{reply.nickname}</span>
                      <span className="detail-meta-text">
                        {new Date(reply.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <ActionButtons comment={reply} />
                  </div>

                  {editingId === reply.id
                    ? <EditInput commentId={reply.id} />
                    : <p className="detail-comment-content">{reply.content}</p>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      
    </section>
  );
};

export default CommentList;