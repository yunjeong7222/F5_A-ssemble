import React from 'react'
import '../../styles/MainVisualizer.css';
const MainStep3Visualizer = () => {
  return (
    <div className="vis-mockup-wrapper vis-step3-wrapper">

      <div className="vis-workflow-container">
        {/* 상단 스텝 인디케이터 */}
        {/* <div className="wf-step-indicator" style={{ marginBottom: '30px' }}>
          <div className="wf-step-item">
            <div className="wf-step-circle">1</div>
            <span className="wf-step-label">목적 입력</span>
          </div>
          <div className="wf-step-line"></div>
          <div className="wf-step-item">
            <div className="wf-step-circle">2</div>
            <span className="wf-step-label">툴 선택</span>
          </div>
          <div className="wf-step-line"></div>
          <div className="wf-step-item">
            <div className="wf-step-circle active">3</div>
            <span className="wf-step-label active">결과 확인</span>
          </div>
        </div> */}

        <div style={{ padding: '0 30px' }}>
          
          {/* 1. 메인 퍼플 배너 */}
          <div className="vis-banner">
            <div className="vis-banner-text">
              <div className="vis-banner-badge">
                <span style={{ color: '#4ade80' }}>✓</span> 워크플로우 생성 완료
              </div>
              <h2 className="vis-banner-title">유튜브 영상 제작 올인원 워크플로우</h2>
              <p className="vis-banner-desc">약 2시간</p>
            </div>

            {/* 오른쪽 둥둥 떠다니는 카드 (✨ 애니메이션 타겟 1) */}
            <div className="vis-float-wrap vis-anim-float">
              <div className="vis-float-time">
                <div style={{ color: '#eab308', fontSize: '1.2rem' }}>⚡</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white' }}>총 120분 완성</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>단계별 시간 포함</div>
                </div>
              </div>

              <div className="vis-float-card">
                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>✍️</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: '0 0 16px 0' }}>선택한 AI 워크플로우</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="vis-float-item" style={{ backgroundColor: '#ecfdf5' }}>
                    <div className="vis-float-num" style={{ backgroundColor: '#10b981' }}>1</div>
                    <div className="vis-float-tool" style={{ color: '#059669' }}>Claude</div>
                    <div className="vis-float-cat">기획 · 아이디어</div>
                  </div>
                  <div className="vis-float-item" style={{ backgroundColor: '#e0e7ff' }}>
                    <div className="vis-float-num" style={{ backgroundColor: '#6366f1' }}>2</div>
                    <div className="vis-float-tool" style={{ color: '#4338ca' }}>Vrew</div>
                    <div className="vis-float-cat">성우/TTS</div>
                  </div>
                  <div className="vis-float-item" style={{ backgroundColor: '#f1f5f9' }}>
                    <div className="vis-float-num" style={{ backgroundColor: '#64748b' }}>3</div>
                    <div className="vis-float-tool" style={{ color: '#334155' }}>CapCut AI</div>
                    <div className="vis-float-cat">영상 소스 생성 및 편집</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 동적 WORKFLOW FLOW 영역 */}
          <div className="vis-flow-box">
            <h4 className="vis-flow-title">WORKFLOW FLOW</h4>
            
            <div className="vis-flow-list">
              {/* ✨ 애니메이션 타겟 2 (순차적 등장) */}
              <div className="vis-flow-item vis-anim-flow-1">
                <img src="https://www.google.com/s2/favicons?domain=anthropic.com&sz=64" alt="Claude" style={{ width: '40px', height: '40px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>Claude</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>기획 특화</div>
                </div>
              </div>
              <div className="vis-flow-arrow vis-anim-flow-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>

              <div className="vis-flow-item vis-anim-flow-2">
                <img src="https://www.google.com/s2/favicons?domain=vrew.ai&sz=64" alt="Vrew" style={{ width: '40px', height: '40px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>Vrew</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>성우 특화</div>
                </div>
              </div>
              <div className="vis-flow-arrow vis-anim-flow-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>

              <div className="vis-flow-item vis-anim-flow-3">
                <img src="https://www.google.com/s2/favicons?domain=capcut.com&sz=64" alt="CapCut AI" style={{ width: '40px', height: '40px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>CapCut AI</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>영상 소스 생성 및 편집 특화</div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default MainStep3Visualizer