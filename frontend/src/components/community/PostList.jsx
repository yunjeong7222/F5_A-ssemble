import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likePost, unlikePost } from '../../api/likes';
import useAuthStore from '../../store/authStore';

const PostList = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPlaceholder = post.thumbnail_url?.startsWith('/icons/category-');
  const [liked, setLiked]         = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [isLiking, setIsLiking]   = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return alert('로그인 후 이용해주세요.');
    if (isLiking) return;

    setIsLiking(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount(prev => nextLiked ? prev + 1 : prev - 1);

    try {
      nextLiked ? await likePost(post.id) : await unlikePost(post.id);
    } catch {
      setLiked(!nextLiked);
      setLikeCount(prev => nextLiked ? prev - 1 : prev + 1);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="comm-list-item" onClick={() => navigate(`/community/${post.id}`)}>
      {isPlaceholder ? (
        <div className="comm-list-thumbnail" style={{
          background: '#ede9ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img
            src={post.thumbnail_url}
            alt={post.title}
            style={{ width: 40, height: 40, objectFit: 'contain' }}
          />
        </div>
      ) : (
        post.thumbnail_url && (
          <img src={post.thumbnail_url} alt={post.title} className="comm-list-thumbnail" />
        )
      )}
      <div className="comm-list-content">
        <div className="comm-list-top">
          {post.category && <span className="comm-category-badge">{post.category}</span>}
          <h3 className="comm-list-title">{post.title}</h3>
        </div>
        <div className="comm-card-footer">
          <div className="comm-user-info">
            {post.profile_url ? (
              <img src={post.profile_url} alt={post.nickname} className="comm-user-avatar" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="comm-user-avatar">{(post.nickname || 'U').charAt(0).toUpperCase()}</div>
            )}
            <span className="comm-user-name">@{post.nickname}</span>
          </div>
          <div className="comm-stats-info">
            <div className="comm-stat-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              <span>{post.view_count || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24"
                    fill="#ef4444" stroke="#ef4444" strokeWidth="2"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span style={{ color: '#ef4444', fontSize: 12 }}>{post.like_count || 0}</span>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;