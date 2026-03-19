import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost } from '../api/posts';
import '../styles/Community.css';

const CommunityDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data.data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCopyContent = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('복사되었습니다!');
    } catch {
      alert('복사에 실패했습니다.');
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '60px' }}>불러오는 중...</div>;
  if (!post) return (
    <div className="detail-error-wrap">
      <h3>게시글을 찾을 수 없습니다.</h3>
      <button onClick={() => navigate('/community')} className="detail-error-btn">커뮤니티로 돌아가기</button>
    </div>
  );

  // attachments에서 미디어와 텍스트 콘텐츠 분리
  const mediaAttachment = post.attachments?.find(a => ['image', 'video', 'youtube'].includes(a.type));
  const contentAttachment = post.attachments?.find(a => a.type === 'text' || a.content);
  const postDescription = contentAttachment?.content || '';

  return (
    <div className="detail-container-new">

      <header>
        <h2>{post.title}</h2>
        <div className="detail-header-info">
          <div>
            <span className="detail-avatar-user">{(post.nickname || 'U').charAt(0).toUpperCase()}</span>
            <strong>@{post.nickname}</strong>
            <span className="detail-meta-text">{post.created_at} · {post.view_count || 0} 조회</span>
          </div>
          <div className="detail-header-btns">
            <button className="detail-like-btn">❤️ 좋아요 {post.like_count || 0}</button>
            <button className="detail-bookmark-btn">🔖 북마크</button>
          </div>
        </div>
      </header>

      {/* 미디어 */}
      <div className="detail-hero-box">
        {mediaAttachment ? (
          mediaAttachment.type === 'video' ? (
            <video src={mediaAttachment.url} controls style={{ width: '100%', borderRadius: '8px' }} />
          ) : (
            <img src={mediaAttachment.url || post.thumbnail_url} alt="결과물" style={{ width: '100%', borderRadius: '8px' }} />
          )
        ) : (
          <span className="detail-hero-text">결과물 이미지 / 영상</span>
        )}
      </div>

      {/* 워크플로우 설명 */}
      {postDescription && (
        <section style={{ marginTop: '30px' }}>
          <h3 className="detail-desc-title">WORKFLOW DESCRIPTION</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <p style={{ whiteSpace: 'pre-wrap', flex: 1 }}>{postDescription}</p>
            <button onClick={() => handleCopyContent(postDescription)} className="detail-copy-btn-new">복사</button>
          </div>
        </section>
      )}

      {/* 댓글 */}
      <section className="detail-comments-section">
        <h4 style={{ marginBottom: '20px' }}>댓글 {post.comment_count || 0}개</h4>
        <div className="detail-comment-wrap">
          <span className="detail-comment-avatar">{(post.nickname || 'U').charAt(0).toUpperCase()}</span>
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            className="detail-comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="detail-comment-submit">등록</button>
        </div>
      </section>

    </div>
  );
};

export default CommunityDetail;