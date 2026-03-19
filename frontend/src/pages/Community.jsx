import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getLikedPosts } from '../api/posts';
import '../styles/Community.css';

const categories = ['전체', '스크립트', '영상제작', '썸네일', '보이스', '배포'];
// 더미 데이터
const dummyPosts = [
  {
    id: 1,
    title: 'ChatGPT + Vrew로 유튜브 숏폼 10분 완성',
    category: '영상제작',
    nickname: 'ai_creator',
    thumbnail_url: 'https://picsum.photos/seed/post1/400/300',
    like_count: 245,
  },
  {
    id: 2,
    title: '미드저니로 NFT 컬렉션 100개 만든 방법',
    category: '썸네일',
    nickname: 'nft_master',
    thumbnail_url: 'https://picsum.photos/seed/post2/400/300',
    like_count: 512,
  },
  {
    id: 3,
    title: 'ElevenLabs로 5개 국어 AI 더빙하기',
    category: '보이스',
    nickname: 'global_youtuber',
    thumbnail_url: 'https://picsum.photos/seed/post3/400/300',
    like_count: 178,
  },
  {
    id: 4,
    title: 'Claude + Perplexity 경쟁사 분석 보고서 자동화',
    category: '스크립트',
    nickname: 'brander_box',
    thumbnail_url: 'https://picsum.photos/seed/post4/400/300',
    like_count: 89,
  },
  {
    id: 5,
    title: 'Runway Gen-2로 시네마틱 오프닝 만들기',
    category: '영상제작',
    nickname: 'director_ai',
    thumbnail_url: 'https://picsum.photos/seed/post5/400/300',
    like_count: 334,
  },
  {
    id: 6,
    title: 'TubeBuddy SEO 태그 자동 생성 꿀팁',
    category: '배포',
    nickname: 'tube_pro',
    thumbnail_url: 'https://picsum.photos/seed/post6/400/300',
    like_count: 67,
  },
  {
    id: 7,
    title: 'Canva AI로 유튜브 썸네일 30초 완성',
    category: '썸네일',
    nickname: 'design_ai',
    thumbnail_url: 'https://picsum.photos/seed/post7/400/300',
    like_count: 421,
  },
  {
    id: 8,
    title: 'Suno AI로 유튜브 배경음악 무한 생성하기',
    category: '보이스',
    nickname: 'music_maker',
    thumbnail_url: 'https://picsum.photos/seed/post8/400/300',
    like_count: 156,
  },
];

const CommunityMain = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [activeSort, setActiveSort] = useState('인기순');
  const [activeCategory, setActiveCategory] = useState('전체');

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, activeSort, activeFilter]);

  const fetchPosts = async () => {
  setIsLoading(true);
  try {
    // TODO: API 연결 후 아래 주석 해제
    // const data = await getPosts({ ... });
    // setPosts(data.data || []);

    // 더미 데이터 임시 사용
    setTimeout(() => {
      setPosts(dummyPosts);
      setIsLoading(false);
    }, 500); // 로딩 느낌 주려고 0.5초 딜레이
  } catch (error) {
    console.error('게시글 불러오기 실패:', error);
    setIsLoading(false);
  }
};

  return (
    <div className="comm-container">
      <div className="comm-header-area">
        <h1 className="comm-page-title">커뮤니티</h1>
        <div className="comm-header-actions">
          <button className="comm-workflow-btn">내 워크플로우</button>
          <button className="comm-write-btn" onClick={() => navigate('/community/write')}>
            + 게시글 작성
          </button>
        </div>
      </div>

      <div className="comm-category-nav">
        {categories.map(category => (
          <button
            key={category}
            className={`comm-category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="comm-grid-header">
        <div className="comm-filter-group">
          <button className={`comm-filter-btn ${activeFilter === '전체' ? 'active' : ''}`} onClick={() => setActiveFilter('전체')}>전체</button>
          <button className={`comm-filter-btn ${activeFilter === '좋아요한 글' ? 'active' : ''}`} onClick={() => setActiveFilter('좋아요한 글')}>좋아요한 글</button>
        </div>
        <div className="comm-sort-group">
          <button className={`comm-sort-btn ${activeSort === '인기순' ? 'active' : ''}`} onClick={() => setActiveSort('인기순')}>인기순</button>
          <button className={`comm-sort-btn ${activeSort === '최신순' ? 'active' : ''}`} onClick={() => setActiveSort('최신순')}>최신순</button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>게시글이 없습니다.</div>
      ) : (
        <div className="comm-grid-container">
          {posts.map((post) => (
            <div
              key={post.id}
              className="comm-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/community/${post.id}`)}
            >
              <img src={post.thumbnail_url} alt={post.title} className="comm-card-image" />
              <div className="comm-card-content">
                <span className="comm-category-badge">{post.category}</span>
                <h3 className="comm-card-title">{post.title}</h3>
                <div className="comm-card-footer">
                  <div className="comm-user-info">
                    <div className="comm-user-avatar">
                      {(post.nickname || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="comm-user-name">@{post.nickname}</span>
                  </div>
                  <div className="comm-stats-info">
                    <div className="comm-stat-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff4d4f" stroke="#ff4d4f" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span style={{ color: '#ef4444' }}>{post.like_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityMain;