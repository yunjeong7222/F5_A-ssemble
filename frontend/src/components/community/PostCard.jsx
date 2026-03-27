import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {likePost, unlikePost} from '../../api/likes';
import useAuthStore from '../../store/authStore';

const PostCard = ({post}) => {
    const navigate = useNavigate();
    const {user} = useAuthStore();
    const isPlaceholder = !post.thumbnail_url || post.thumbnail_url.startsWith('/icons/category-');
    const [liked, setLiked] = useState(post.is_liked || false);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const youtubeVideoId = post.thumbnail_url?.match(/\/vi\/([^/]+)\//)?.[1];
    const isYoutube = !!youtubeVideoId;

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return alert('로그인 후 이용해주세요.');
        if (isLiking) return;

        setIsLiking(true);
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));

        try {
            nextLiked ? await likePost(post.id) : await unlikePost(post.id);
        } catch {
            setLiked(!nextLiked);
            setLikeCount((prev) => (nextLiked ? prev - 1 : prev + 1));
        } finally {
            setIsLiking(false);
        }
    };

    const renderThumbnail = () => {
        // 플레이스홀더
        if (isPlaceholder) {
            return (
                <div
                    className="comm-card-image"
                    style={{
                        background: '#ede9ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={post.thumbnail_url || '/icons/category-1.png'}
                        alt={post.title}
                        style={{width: 64, height: 64, objectFit: 'contain'}}
                    />
                </div>
            );
        }

        // 유튜브 썸네일 — hover 시 자동재생
        if (isYoutube) {
            return (
                <div
                    className="comm-card-image"
                    style={{position: 'relative', overflow: 'hidden', cursor: 'pointer'}}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* 썸네일 — hover 시 fade out */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: isHovered ? 0 : 1,
                            transition: 'opacity 0.3s ease',
                            zIndex: 2,
                        }}
                    >
                        <img
                            src={post.thumbnail_url}
                            alt={post.title}
                            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,0.15)',
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'rgba(0,0,0,0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* iframe — hover 시 fade in */}
                    <iframe
                        src={
                            isHovered
                                ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`
                                : undefined
                        }
                        allow="autoplay; encrypted-media"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            pointerEvents: 'none',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            zIndex: 1,
                        }}
                    />
                </div>
            );
        }

        // 일반 이미지
        return (
            <img
                src={post.thumbnail_url}
                alt={post.title}
                className="comm-card-image"
                onLoad={(e) => {
                    const img = e.target;
                    const ratio = img.naturalWidth / img.naturalHeight;
                    img.style.objectPosition = ratio < 1.5 ? 'top' : 'center';
                }}
            />
        );
    };

    return (
        <div className="comm-card" onClick={() => navigate(`/community/${post.id}`)}>
            {renderThumbnail()}

            <div className="comm-card-content">
                {post.profile_url ? (
                    <img
                        src={post.profile_url}
                        alt={post.nickname}
                        className="comm-user-avatar"
                        style={{objectFit: 'cover', flexShrink: 0, marginTop: 2}}
                    />
                ) : (
                    <div className="comm-user-avatar" style={{flexShrink: 0, marginTop: 2}}>
                        {(post.nickname || 'U').charAt(0).toUpperCase()}
                    </div>
                )}

                <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5}}>
                    {post.category && <span className="comm-category-badge">{post.category}</span>}
                    <h3 className="comm-card-title">{post.title}</h3>
                    <div className="comm-card-footer">
                        <span className="comm-user-name">@{post.nickname}</span>
                        <div className="comm-stats-info">
                            <div className="comm-stat-item">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>{post.view_count || 0}</span>
                            </div>
                            <div className="comm-stat-item" onClick={handleLike}>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill={liked ? '#ef4444' : 'none'}
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span style={{color: '#ef4444', fontSize: 12}}>{likeCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
