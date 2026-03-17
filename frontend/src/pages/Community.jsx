import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Community.css';

const mockPosts = [
  { id: 1, title: 'AI로 만든 웹툰 \'사이버 펑크 대전\'', category: '영상제작', user: '@ai_writer', imageUrl: 'https://picsum.photos/seed/post1/400/300', likes: 145, tags: ['Midjourney', 'Runway', 'Gemini'] },
  { id: 2, title: '프롬프트 입력으로 3D 에셋 생성하기', category: '스크립트', user: '@brander_box', imageUrl: 'https://picsum.photos/seed/post2/400/300', likes: 72, tags: ['ChatGPT', 'Blender'] },
  { id: 3, title: '영상 속 인물 옷 스타일 AI로 바꾸기', category: '영상제작', user: '@fashion_ai', imageUrl: 'https://picsum.photos/seed/post3/400/300', likes: 210, tags: ['StableDiffusion', 'EbSynth', 'Vrew'] },
  { id: 4, title: '배경음악 무한 생성 AI 활용법', category: '보이스', user: '@music_maker', imageUrl: 'https://picsum.photos/seed/post4/400/300', likes: 45, tags: ['Suno AI', 'CapCut', 'Claude'] },
  { id: 5, title: 'AI 이미지로 NFT 컬렉션 만들기', category: '썸네일', user: '@nft_master', imageUrl: 'https://picsum.photos/seed/post5/400/300', likes: 322, tags: ['Midjourney', 'Photoshop'] },
  { id: 6, title: 'Luma AI로 만든 초현실 인테리어', category: '영상제작', user: '@ai_architect', imageUrl: 'https://picsum.photos/seed/post6/400/300', likes: 118, tags: ['Luma AI', 'NeRF', 'Suno', 'Perplexity'] },
  { id: 7, title: 'Runway로 완성한 시네마틱 오프닝', category: '배포', user: '@director_a', imageUrl: 'https://picsum.photos/seed/post7/400/300', likes: 198, tags: ['Runway Gen-2', 'AdobePremiere'] },
  { id: 8, title: '초보자를 위한 미드저니 꿀팁 모음', category: '썸네일', user: '@prompt_m', imageUrl: 'https://picsum.photos/seed/post8/400/300', likes: 501, tags: ['Midjourney', 'Tip'] },
  { id: 9, title: 'AI 더빙으로 5개 국어 채널 운영하기', category: '보이스', user: '@global_cr', imageUrl: 'https://picsum.photos/seed/post9/400/300', likes: 167, tags: ['ChatGPT','ElevenLabs', 'Vrew'] },
  { id: 10, title: 'Stable Video Diffusion 첫인상', category: '배포', user: '@reviewer_t', imageUrl: 'https://picsum.photos/seed/post10/400/300', likes: 93, tags: ['SVD', 'Review', 'YoutubeStudio'] },
  { id: 11, title: 'AI 툴로 만든 가상 피규어 디자인', category: '썸네일', user: '@toy_maker', imageUrl: 'https://picsum.photos/seed/post11/400/300', likes: 38, tags: ['ChatGPT', 'DALL-E 3'] },
  { id: 12, title: '제품 사진 AI로 연출하기', category: '스크립트', user: '@photographer', imageUrl: 'https://picsum.photos/seed/post12/400/300', likes: 180, tags: ['Photoshop AI', 'Lightroom'] },
];

const categories = ['전체', '스크립트', '영상제작', '썸네일', '보이스', '배포'];

const CommunityMain = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('전체');
  const [activeSort, setActiveSort] = useState('인기순'); 
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredPosts = mockPosts.filter(post => {
    if (activeCategory === '전체') return true;
    return post.category === activeCategory;
  });

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

      <div className="comm-grid-container">
        {filteredPosts.map((post) => (
          <a key={post.id} href="#" className="comm-card">
            <img src={post.imageUrl} alt={post.title} className="comm-card-image" />
            <div className="comm-card-content">
              <span className="comm-category-badge">{post.category}</span>
              <h3 className="comm-card-title">{post.title}</h3>
              <div className="comm-tag-container">
                {post.tags.map(tag => (
                  <span key={tag} className="comm-tag">{tag}</span>
                ))}
              </div>
              <div className="comm-card-footer">
                <div className="comm-user-info">
                  <div className="comm-user-avatar">{post.user.charAt(1).toUpperCase()}</div>
                  <span className="comm-user-name">{post.user}</span>
                </div>
                <div className="comm-stats-info">
                  <div className="comm-stat-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff4d4f" stroke="#ff4d4f" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span style={{ color: '#ef4444' }}>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CommunityMain;