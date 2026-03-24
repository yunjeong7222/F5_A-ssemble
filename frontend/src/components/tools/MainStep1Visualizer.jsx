import React from 'react'
import '../../styles/MainVisualizer.css';

const MainStep1Visualizer = () => {
  return (
    <div className="vis-mockup-wrapper vis-step1-wrapper">
      <div className="vis-workflow-container">
        {/* 메인 콘텐츠 영역 */}
        <div className="wf-step1-section" style={{ padding: '0 20px' }}>
          <h2 className="wf-step1-title" style={{color: 'white'}}>어떤 분야의 워크플로우를<br/>만들고 싶으신가요?</h2>
          <p className="wf-step1-desc" style={{ marginBottom: '30px' }}>목적을 입력하거나 직군을 선택하면 최적의 AI 툴 조합을 추천해드릴게요</p>

          {/* 가짜 입력창 & 버튼 (애니메이션 요소) */}
          <div className="wf-input-wrap">
            <div className="wf-input-group vis-fake-group">
              <div className="wf-input-field vis-fake-input">
                <span className="vis-placeholder">예) 초보 영상 크리에이터인데, 무료 AI 툴로 고퀄리티 BGM과 자막을 만들고 싶어요</span>
                <span className="vis-typing-text">여행 브이로그 편집할 건데 무료 AI 툴 추천해줘</span>
                <span className="vis-cursor-blink"></span>
              </div>
              <div className="wf-submit-btn vis-fake-btn">
                AI 툴 추천받기 →
              </div>
            </div>
          </div>

          {/* 추천 키워드 영역 */}
          <div className="wf-suggest-wrap" style={{ marginBottom: '20px' }}>
            <span className="wf-suggest-label">💡 이런 목적은 어때요?</span>
            <div className="wf-suggest-btn">유튜브 영상 편집</div>
            <div className="wf-suggest-btn">무료 BGM 생성</div>
            <div className="wf-suggest-btn">무료 이미지 생성</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainStep1Visualizer