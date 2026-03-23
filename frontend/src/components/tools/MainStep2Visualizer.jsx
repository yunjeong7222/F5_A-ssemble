import React from 'react'
import '../../styles/MainVisualizer.css';

const MainStep2Visualizer = () => {
  return (
    <div className="vis-mockup-wrapper vis-step2-wrapper">

      <div className="vis-workflow-container">
        {/* 상단 스텝 인디케이터 */}
        {/* <div className="wf-step-indicator" style={{ marginBottom: '30px' }}>
          <div className="wf-step-item">
            <div className="wf-step-circle">1</div>
            <span className="wf-step-label">목적 입력</span>
          </div>
          <div className="wf-step-line"></div>
          <div className="wf-step-item">
            <div className="wf-step-circle active">2</div>
            <span className="wf-step-label active">툴 선택</span>
          </div>
          <div className="wf-step-line"></div>
          <div className="wf-step-item">
            <div className="wf-step-circle">3</div>
            <span className="wf-step-label">결과 확인</span>
          </div>
        </div> */}

        {/* 메인 콘텐츠 영역 */}
        <div style={{ padding: '0 30px' }}>
          <h2 className="wf-step2-title" style={{ textAlign: 'left', fontSize: '1.25rem', lineHeight: '1.4', color: 'white' }}>
            "여행 브이로그 편집할 건데 무료 AI 툴 추천해줘"에 추천하는 AI 툴 조합이에요. 사용하실 툴을 선택하세요.
          </h2>

          <div className="ts-container" style={{ padding: '0', marginTop: '30px'}}>
            
            {/* 상단 워크플로우 플로우 (진행바) */}
            <div className="ts-flow-container">
              
              {/* 1. 기획 및 스크립트 */}
              <div className="ts-flow-step vis-flow-step-1">
                <div className="ts-flow-category" style={{ color: '#8b5cf6' }}>기획 및 스크립트</div>
                <div className="ts-flow-tool">
                  <span className="vis-flow-empty-1">미선택</span>
                  <span className="vis-flow-selected-1">Claude</span>
                </div>
              </div>
              <div className="ts-flow-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>

              {/* 2. 영상 소스 생성 */}
              <div className="ts-flow-step vis-flow-step-2">
                <div className="ts-flow-category" style={{ color: '#10b981' }}>영상 소스 생성</div>
                <div className="ts-flow-tool">
                  <span className="vis-flow-empty-2">미선택</span>
                  <span className="vis-flow-selected-2">CapCut AI</span>
                </div>
              </div>
              <div className="ts-flow-arrow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></div>

              {/* 3. 성우/TTS */}
              <div className="ts-flow-step vis-flow-step-3">
                <div className="ts-flow-category" style={{ color: '#f59e0b' }}>성우/TTS</div>
                <div className="ts-flow-tool">
                  <span className="vis-flow-empty-3">미선택</span>
                  <span className="vis-flow-selected-3">Vrew</span>
                </div>
              </div>
            </div>

            {/* 카드 렌더링 영역 */}
            <div className="vis-grid-wrapper">
              
              {/* === PAGE 1: 기획 및 스크립트 === */}
              <div className="vis-grid-page vis-page-1">
                <h3 className="ts-category-title">기획 및 스크립트</h3>
                <div className="ts-grid">
                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=openai.com&sz=128" alt="ChatGPT" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">ChatGPT</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-beginner"><span>🌱</span>초급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#8b5cf6' }}>✦ OpenAI가 만든 대화형 AI 텍스트 생성, 요약, 번역 등 다양한 작업 가능</div>
                  </div>
                  
                  <div className="ts-card vis-target-1">
                    <div className="ts-check-icon vis-check-1">✓</div>
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=anthropic.com&sz=128" alt="Claude" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">Claude</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-beginner"><span>🌱</span>초급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#8b5cf6' }}>✦ 인간적인 문체와 문맥 이해가 뛰어난 감성 에디터. 스토리 설계와 감성 브이로그 대본 작성에 최적</div>
                  </div>
                  
                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=notion.so&sz=128" alt="Notion AI" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">Notion AI</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-mid"><span>⭐</span>중급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#8b5cf6' }}>✦ Notion 문서 내 AI 글쓰기·요약·번역 보조 기능. 기획 및 스크립트 작성에 유용</div>
                  </div>
                </div>
              </div>

              {/* === PAGE 2: 영상 소스 생성 === */}
              <div className="vis-grid-page vis-page-2">
                <h3 className="ts-category-title">영상 소스 생성</h3>
                <div className="ts-grid">
                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=runwayml.com&sz=128" alt="Runway" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">Runway Gen</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-hard"><span>🔥</span>고급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#10b981' }}>✦ 고급 영상 편집 및 특수 효과, 이미지나 텍스트를 움직이는 짧은 비디오로 만들어주는 AI</div>
                  </div>
                  
                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=128" alt="Luma" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">Luma Dream</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-mid"><span>⭐</span>중급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#10b981' }}>✦ 빠른 생성 속도와 자연스러운 카메라 무빙이 강점인 영상 생성 툴. 텍스트·이미지 → 영상 변환 지원</div>
                  </div>
                  
                  <div className="ts-card vis-target-2">
                    <div className="ts-check-icon vis-check-2">✓</div>
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=capcut.com&sz=128" alt="CapCut" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">CapCut AI</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-beginner"><span>🌱</span>초급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#10b981' }}>✦ 텍스트·이미지로 짧은 영상을 자동 생성하며, 소스 생성부터 편집까지 원스톱 지원</div>
                  </div>
                </div>
              </div>

              {/* === PAGE 3: 성우/TTS === */}
              <div className="vis-grid-page vis-page-3">
                <h3 className="ts-category-title">성우/TTS</h3>
                <div className="ts-grid">
                  
                  <div className="ts-card vis-target-3">
                    <div className="ts-check-icon vis-check-3">✓</div>
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=vrew.ai&sz=128" alt="Vrew" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">Vrew</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-beginner"><span>🌱</span>초급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#f59e0b' }}>✦ 대본 입력만으로 AI 보이스오버를 생성하는 TTS 기능 내장, 텍스트 수정으로 재생성 가능</div>
                  </div>

                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128" alt="ElevenLabs" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">ElevenLabs</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-hard"><span>🔥</span>고급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#f59e0b' }}>✦ 세계 최고 수준의 AI TTS·음성 복제·더빙 플랫폼, 감정 실린 고품질 음성 생성</div>
                  </div>
                  
                  <div className="ts-card">
                    <div className="ts-card-header">
                      <div className="ts-icon-box"><img src="https://www.google.com/s2/favicons?domain=murf.ai&sz=128" alt="Murf AI" className="ts-tool-img" /></div>
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">Murf AI</h4>
                        <div className="ts-badges-wrap">
                          <span className="ts-badge ts-badge-free"><span>✨</span>무료 지원</span>
                          <span className="ts-badge ts-badge-mid"><span>⭐</span>중급</span>
                        </div>
                      </div>
                    </div>
                    <div className="ts-specialized" style={{ color: '#f59e0b' }}>✦ 120개 이상 AI 음성·20개 언어 지원 고품질 TTS 및 음성 더빙·영상 편집 통합 플랫폼</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainStep2Visualizer
