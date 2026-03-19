import React, { useState } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { useWorkflow } from '../hooks/useWorkflow';
import ToolSelector from '../components/workflow/ToolSelector';
import StepCard from '../components/workflow/StepCard';
import WorkflowResult from '../components/workflow/WorkflowResult';
import '../styles/Workflow.css'; // 💡 새로 만든 CSS 연결

const Workflow = () => {
  const { step, purpose, setPurpose, selectedTools, workflowResult, isLoading, resetWorkflow, prevStep } = useWorkflowStore();
  const { handleSuggestTools, handleCreateWorkflow } = useWorkflow();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleExampleClick = (text) => {
    setPurpose(text);
  };

  return (
    <div className="workflow-container">
      
      {/* 상단 스텝 인디케이터 */}
      <div className="wf-step-indicator">
        <div className="wf-step-item">
          <div className={`wf-step-circle ${step === 1 ? 'active' : ''}`}>1</div>
          <span className={`wf-step-label ${step === 1 ? 'active' : ''}`}>목적 입력</span>
        </div>
        <div className="wf-step-line"></div>
        <div className="wf-step-item">
          <div className={`wf-step-circle ${step === 2 ? 'active' : ''}`}>2</div>
          <span className={`wf-step-label ${step === 2 ? 'active' : ''}`}>툴 선택</span>
        </div>
        <div className="wf-step-line"></div>
        <div className="wf-step-item">
          <div className={`wf-step-circle ${step === 3 ? 'active' : ''}`}>3</div>
          <span className={`wf-step-label ${step === 3 ? 'active' : ''}`}>결과 확인</span>
        </div>
      </div>

      {/* 화면 1: 목적 입력 (WORKFLOW_01) */}
      {step === 1 && (
        <section className="wf-step1-section">
          
          <h3 className="wf-step1-badge">STEP 1</h3>
          <h2 className="wf-step1-title">어떤 분야의 워크플로우를<br/>만들고 싶으신가요?</h2>
          <p className="wf-step1-desc">목적을 입력하거나 직군을 선택하면 최적의 AI 툴 조합을 추천해드릴게요</p>

          <div className="wf-input-wrap">
            <div className="wf-input-group">
              <input 
                type="text" 
                value={purpose} 
                onChange={(e) => setPurpose(e.target.value)} 
                placeholder="예) 초보 영상 크리에이터인데, 무료 AI 툴로 고퀄리티 BGM과 자막을 만들고 싶어요" 
                className="wf-input-field"
              />
              <button 
                onClick={() => handleSuggestTools(purpose)} 
                disabled={!purpose || isLoading}
                className="wf-submit-btn"
              >
                {isLoading ? '로딩중...' : 'AI 툴 추천받기 →'}
              </button>
            </div>
          </div>

          <div className="wf-suggest-wrap">
            <span className="wf-suggest-label">💡 이런 목적은 어때요?</span>
            {['유튜브 영상 편집', '무료 BGM 생성', '무료 이미지 생성'].map((tag) => (
              <button 
                key={tag}
                onClick={() => handleExampleClick(tag)}
                className="wf-suggest-btn"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="wf-category-grid">
            {[
              { id: '콘텐츠 제작', icon: '✍️', desc: '블로그·SNS·영상 스크립트' },
              { id: '개발·코딩', icon: '💻', desc: '코드 리뷰·문서화·디버깅' },
              { id: '디자인', icon: '🎨', desc: '시안·브랜딩·이미지 생성' },
              { id: '데이터 분석', icon: '📊', desc: '리포트·인사이트·시각화' },
              { id: '마케팅', icon: '📢', desc: '카피·광고·SEO 최적화' },
              { id: '기획·전략', icon: '🧠', desc: '리서치·보고서·발표자료' }
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div 
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPurpose(`${cat.id} 업무를 효율적으로 할 수 있는 AI 툴 조합을 추천해줘`);
                  }}
                  className={`wf-category-card ${isSelected ? 'selected' : ''}`}
                >
                  {isSelected && (
                    <div className="wf-category-check">✓</div>
                  )}
                  <div className="wf-category-icon">{cat.icon}</div>
                  <h4 className="wf-category-title">{cat.id}</h4>
                  <p className="wf-category-desc">{cat.desc}</p>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* 화면 2: 툴 선택 (WORKFLOW_02) */}
      {step === 2 && (
        <section>
          <h2 className="wf-step2-title">"{purpose}"에 추천하는 AI 툴 조합이에요. 사용하실 툴을 선택하세요.</h2>
          <ToolSelector />
          <button onClick={prevStep} disabled={isLoading} className="wf-action-btn wf-prev-btn">← 이전 단계</button>
          <button onClick={() => handleCreateWorkflow(purpose, selectedTools)} disabled={selectedTools.length === 0 || isLoading} className="wf-action-btn wf-next-btn">
            {isLoading ? '워크플로우 생성 중...' : '워크플로우 생성 →'}
          </button>
        </section>
      )}

      {/* 화면 3: 결과 확인 (WORKFLOW_03) */}
      {step === 3 && (
        <WorkflowResult workflowResult={workflowResult} />
      )}
    </div>
  );
};

export default Workflow;