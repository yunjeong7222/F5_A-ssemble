import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getLikedPosts } from '../api/posts';
import PostCard from '../components/community/PostCard';
import PostList from '../components/community/PostList';
import useAuthStore from '../store/authStore';
import '../styles/Community.css';

const categories = [
  '전체',
  '기획 및 스크립트',
  '영상 소스 생성',
  '이미지 소스 생성',
  '성우 / TTS',
  'BGM',
  '편집 / 숏폼 변환',
  '업로드 최적화',
];

// 카드 뷰 아이콘
const CardViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="9" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="9" width="6" height="6" rx="1" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
);
 
// 리스트 뷰 아이콘
const ListViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="2" width="14" height="2.5" rx="1" />
    <rect x="1" y="6.75" width="14" height="2.5" rx="1" />
    <rect x="1" y="11.5" width="14" height="2.5" rx="1" />
  </svg>
);

const CommunityMain = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [activeSort, setActiveSort] = useState('인기순');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [viewMode, setViewMode] = useState('card'); 

  useEffect(() => {
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let data;
      if (activeFilter === '좋아요한 글') {
        data = await  getLikedPosts({
         category: activeCategory === '전체' ? undefined : activeCategory,
        });
      } else {
        data = await getPosts({
          category: activeCategory === '전체' ? undefined : activeCategory,
          sort: activeSort === '인기순' ? 'likes' : 'latest',
        });
      }
      setPosts(data.data || []);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchPosts();
}, [activeCategory, activeSort, activeFilter]);

  return (
    <div className="comm-container">

      {/* 헤더 */}
      <div className="comm-header-area">
        <h1 className="comm-page-title">커뮤니티</h1>
        <div className="comm-header-actions">
          <button className="comm-workflow-btn" onClick={() => navigate('/mypage?tab=workflow')}>
            내 워크플로우
          </button>
          <button className="comm-write-btn" onClick={() => {
            if (!user) { alert('로그인이 필요한 서비스입니다.'); return; }
            navigate('/community/write');
          }}>
            게시글 작성
          </button>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="comm-category-nav">
        {categories.map(category => (
          <button
            key={category}
            className={`comm-category-tab${activeCategory === category ? ' active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 필터 / 정렬 */}
      <div className="comm-grid-header">
        <div className="comm-filter-group">
          <button
            className={`comm-filter-btn${activeFilter === '전체' ? ' active' : ''}`}
            onClick={() => setActiveFilter('전체')}
          >
            전체
          </button>
          <button
            className={`comm-filter-btn${activeFilter === '좋아요한 글' ? ' active' : ''}`}
            onClick={() => {
              if (!user) { alert('로그인이 필요한 서비스입니다.'); return; }
              setActiveFilter('좋아요한 글');
            }}
          >
            좋아요한 글
          </button>
        </div>

        <div className='comm-group'>
        <div className="comm-sort-group">
          <button
            className={`comm-sort-btn${activeSort === '인기순' ? ' active' : ''}`}
            onClick={() => setActiveSort('인기순')}
          >
            인기순
          </button>
          <button
            className={`comm-sort-btn${activeSort === '최신순' ? ' active' : ''}`}
            onClick={() => setActiveSort('최신순')}
          >
            최신순
          </button>
        </div>
        <div className="comm-view-toggle">
            <button
              className={`comm-view-btn${viewMode === 'card' ? ' active' : ''}`}
              onClick={() => setViewMode('card')}
              title="카드형"
            >
              <CardViewIcon />
            </button>
            <button
              className={`comm-view-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              title="리스트형"
            >
              <ListViewIcon />
            </button>
          </div>
          </div>
      </div>

      {/* 게시글 목록 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          불러오는 중...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          게시글이 없습니다.
        </div>
      ) : viewMode === 'card' ? (
        <div className="comm-grid-container">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="comm-list-container">
          {posts.map(post => (
            <PostList key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityMain;