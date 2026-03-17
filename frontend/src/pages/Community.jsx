import React, { useState } from 'react';

// 임시 확인용 데이터
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
  const [activeFilter, setActiveFilter] = useState('전체');
  const [activeSort, setActiveSort] = useState('인기순'); 
  const [activeCategory, setActiveCategory] = useState('전체');
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const styles = {
    container: { width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: '"Pretendard", sans-serif', color: '#1f2937', boxSizing: 'border-box' },
    
    headerArea: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '1.5rem' 
    },
    pageTitle: { fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#111827' },
    headerActions: { display: 'flex', gap: '0.75rem' },
    workflowBtn: { 
      backgroundColor: '#737373', color: 'white', border: 'none', 
      padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' 
    },
    writeBtn: { 
      backgroundColor: '#8b5cf6', color: 'white', border: 'none', 
      padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', 
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' 
    },

    categoryNav: {
      display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', 
      borderBottom: '1px solid #e5e7eb'
    },
    // border-bottom 대신 text-decoration 밑줄 적용
    categoryTab: (isActive, isHovered) => ({
      background: isHovered ? '#f3f4f6' : 'none',
      border: 'none', 
      padding: '0.5rem 0.75rem', 
      borderRadius: '8px', 
      fontSize: '1rem', 
      fontWeight: isActive ? 'bold' : '500', 
      color: isActive ? '#8b5cf6' : '#9ca3af', 
      cursor: 'pointer',
      
      textDecorationLine: isActive ? 'underline' : 'none',
      textDecorationThickness: '4px',
      textUnderlineOffset: '8px',
      
      transition: 'all 0.2s'
    }),

    gridHeader: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '1rem' 
    },
    filterGroup: { display: 'flex', gap: '0.5rem' },
    filterBtn: (isActive) => ({
      backgroundColor: isActive ? '#4b5563' : 'transparent', 
      color: isActive ? 'white' : '#6b7280',
      border: isActive ? '1px solid #4b5563' : '1px solid #d1d5db', 
      padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
    }),

    sortGroup: { display: 'flex', gap: '0.25rem', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '8px' },
    sortBtn: (isActive) => ({
      backgroundColor: isActive ? '#4b5563' : 'transparent', 
      color: isActive ? 'white' : '#6b7280',
      border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
    }),

    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
    card: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', cursor: 'pointer', textDecoration: 'none', color: 'inherit' },
    cardImage: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', backgroundColor: '#ede9fe' }, 
    cardContent: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 },
    
    categoryBadge: { 
      alignSelf: 'flex-start', border: '1px solid #d8b4fe', color: '#8b5cf6', 
      fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '12px', fontWeight: '600' 
    },
    
    cardTitle: { fontSize: '1rem', fontWeight: 'bold', margin: 0, lineHeight: '1.4', wordBreak: 'keep-all', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', color: '#111827' },
    tagContainer: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
    tag: { backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '500' }, 
    
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
    userAvatar: { width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' },
    userName: { fontSize: '0.8rem', color: '#64748b' },
    statsInfo: { display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' },
    statItem: { display: 'flex', alignItems: 'center', gap: '0.2rem' }
  };

  const filteredPosts = mockPosts.filter(post => {
    if (activeCategory === '전체') return true;
    return post.category === activeCategory;
  });

  return (
    <div style={styles.container}>
      
      <div style={styles.headerArea}>
        <h1 style={styles.pageTitle}>커뮤니티</h1>
        <div style={styles.headerActions}>
          <button style={styles.workflowBtn}>내 워크플로우</button>
          <button style={styles.writeBtn}>
            + 게시글 작성
          </button>
        </div>
      </div>

      {/* 카테고리 탭 네비게이션 */}
      <div style={styles.categoryNav}>
        {categories.map(category => (
          <button 
            key={category} 
            style={styles.categoryTab(activeCategory === category, hoveredCategory === category)} 
            onClick={() => setActiveCategory(category)}
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {category}
          </button>
        ))}
      </div>
      <div style={styles.gridHeader}>
        <div style={styles.filterGroup}>
          <button style={styles.filterBtn(activeFilter === '전체')} onClick={() => setActiveFilter('전체')}>전체</button>
          <button style={styles.filterBtn(activeFilter === '좋아요한 글')} onClick={() => setActiveFilter('좋아요한 글')}>좋아요한 글</button>
        </div>

        <div style={styles.sortGroup}>
          <button style={styles.sortBtn(activeSort === '인기순')} onClick={() => setActiveSort('인기순')}>인기순</button>
          <button style={styles.sortBtn(activeSort === '최신순')} onClick={() => setActiveSort('최신순')}>최신순</button>
        </div>
      </div>

      <div style={styles.gridContainer}>
        {filteredPosts.map((post) => (
          <a key={post.id} href="#" style={styles.card}>
            <img src={post.imageUrl} alt={post.title} style={styles.cardImage} />
            <div style={styles.cardContent}>
              <span style={styles.categoryBadge}>{post.category}</span>
              <h3 style={styles.cardTitle}>{post.title}</h3>
              <div style={styles.tagContainer}>
                {post.tags.map(tag => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
              <div style={styles.cardFooter}>
                <div style={styles.userInfo}>
                  <div style={styles.userAvatar}>{post.user.charAt(1).toUpperCase()}</div>
                  <span style={styles.userName}>{post.user}</span>
                </div>
                <div style={styles.statsInfo}>
                  <div style={styles.statItem}>
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