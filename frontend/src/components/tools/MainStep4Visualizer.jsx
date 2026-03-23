import React from 'react'
import '../../styles/MainVisualizer.css';

const MainStep4Visualizer = () => {
  return (
    <div className="vis-mockup-wrapper vis-step4-wrapper">
      
      {/* 1. 최상단 글로벌 헤더 */}
      <div className="vis-comm-global-header">
        <div className="vis-comm-logo">AIssemble</div>
        <div className="vis-comm-actions">
          <div className="vis-btn-outline">내 워크플로우</div>
          <div className="vis-btn-primary">+ 게시글 작성</div>
        </div>
      </div>

      {/* 2. 커뮤니티 피드 영역 */}
      <div className="vis-comm-board">
        
        {/* 그리드 상단 탭 & 필터 */}
        <div className="vis-comm-grid-header">
          <div className="vis-comm-tabs">
            <span className="vis-tab active">전체</span>
            <span className="vis-tab">좋아요한 글</span>
          </div>
          <div className="vis-comm-filters">
            <span className="vis-filter active">최신순</span>
            <span className="vis-filter">인기순</span>
          </div>
        </div>

        {/* 게시글 그리드 */}
        <div className="vis-comm-grid">
          
          {/* ✨ 애니메이션 타겟 1: 방금 작성되어 나타나는 새 게시글 */}
          <div className="vis-post-card vis-anim-new-post">
            {/* 💡 보라색 배경 대신 여행 브이로그 썸네일 이미지 삽입 */}
            <div className="vis-post-thumb">
              <img src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=400&q=80" alt="여행 브이로그" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="vis-post-content">
              <h4 className="vis-post-title">초보 영상 크리에이터를 위한 여행 브이로그 올인원</h4>
              <p className="vis-post-desc">기획부터 편집까지 한 번에 끝내는 워크플로우입니다. 무료 툴로만 구성했습니다.</p>
              <div className="vis-post-tags">
                <span className="vis-tag">Claude</span>
                <span className="vis-tag">Vrew</span>
                <span className="vis-tag">CapCut AI</span>
              </div>
              <div className="vis-post-meta">
                <span>작성자: 뉴비크리에이터</span>
                <span>좋아요 0</span>
              </div>
            </div>
          </div>

          {/* 기존 게시글 1 */}
          <div className="vis-post-card">
            {/* 💡 파란색 배경 대신 쇼츠/작업 관련 썸네일 이미지 삽입 */}
            <div className="vis-post-thumb">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80" alt="쇼츠 제작" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="vis-post-content">
              <h4 className="vis-post-title">정보성 쇼츠 10분만에 대량 생산하는 방법</h4>
              <p className="vis-post-desc">대본 작성부터 컷편집까지 반자동화하는 루틴 공유합니다.</p>
              <div className="vis-post-tags">
                <span className="vis-tag">ChatGPT</span>
                <span className="vis-tag">Vrew</span>
              </div>
              <div className="vis-post-meta">
                <span>작성자: 숏폼마스터</span>
                <span>좋아요 128</span>
              </div>
            </div>
          </div>

          {/* 기존 게시글 2 */}
          <div className="vis-post-card">
            {/* 💡 노란색 배경 대신 영화/리뷰 관련 썸네일 이미지 삽입 */}
            <div className="vis-post-thumb">
              <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80" alt="영화 리뷰" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="vis-post-content">
              <h4 className="vis-post-title">분위기 있는 영화 리뷰 채널 BGM 및 더빙 조합</h4>
              <p className="vis-post-desc">저작권 걱정 없이 고퀄리티 사운드와 더빙을 입히는 워크플로우.</p>
              <div className="vis-post-tags">
                <span className="vis-tag">Claude</span>
                <span className="vis-tag">ElevenLabs</span>
                <span className="vis-tag">Suno</span>
              </div>
              <div className="vis-post-meta">
                <span>작성자: 시네마리뷰</span>
                <span>좋아요 85</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. 새 게시글 작성 모달 창 */}
      <div className="vis-modal-overlay vis-anim-modal">
        <div className="vis-modal-window">
          <h3 className="vis-modal-title">나만의 워크플로우 공유하기</h3>
          
          <div className="vis-modal-tools">
            <span className="vis-modal-tool-badge">Claude</span>
            <span className="vis-modal-tool-arrow">→</span>
            <span className="vis-modal-tool-badge">Vrew</span>
            <span className="vis-modal-tool-arrow">→</span>
            <span className="vis-modal-tool-badge">CapCut AI</span>
          </div>

          <div className="vis-modal-input-wrap">
            <div className="vis-modal-label">제목</div>
            <div className="vis-modal-input">
              <span className="vis-anim-type-title">초보 영상 크리에이터를 위한 여행 브이로그 올인원</span>
              <span className="vis-cursor-title"></span>
            </div>
          </div>

          <div className="vis-modal-input-wrap">
            <div className="vis-modal-label">설명</div>
            {/* 💡 모달 창 내부의 설명 입력칸과 이미지 첨부 영역은 그대로 유지했습니다 */}
            <div className="vis-modal-textarea-container">
              <div className="vis-modal-textarea">
                <span className="vis-anim-type-desc-1">기획부터 편집까지 한 번에 끝내는 워크플로우입니다.</span>
                <span className="vis-cursor-desc-1"></span>
                <br />
                <span className="vis-anim-type-desc-2">무료 툴로만 구성했습니다.</span>
                <span className="vis-cursor-desc-2"></span>
              </div>
              
              <div className="vis-modal-img-wrap">
  
                {/* 1. 클릭 전 플레이스홀더 (클릭 애니메이션 적용) */}
                <div className="vis-modal-img-placeholder vis-anim-img-click">
                  <span className="vis-icon">+</span>
                  <span>이미지 첨부</span>
                </div>
                
                {/* 2. 클릭 후 나타나는 이미지 (게시글 썸네일과 동일한 이미지) */}
                <div className="vis-modal-img-uploaded vis-anim-img-show">
                  <img src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=400&q=80" alt="첨부된 이미지" />
                </div>

              </div>
            </div>
          </div>

          <div className="vis-modal-submit vis-anim-submit-btn">게시하기</div>
        </div>
      </div>

    </div>
  )
}

export default MainStep4Visualizer