import React, { useState } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { useWorkflow } from '../hooks/useWorkflow';
import ToolSelector from '../components/workflow/ToolSelector';
import StepCard from '../components/workflow/StepCard';
import WorkflowResult from '../components/workflow/WorkflowResult';

const Workflow = () => {
  const { step, purpose, setPurpose, selectedTools, workflowResult, isLoading, resetWorkflow, prevStep } = useWorkflowStore();
  const { handleSuggestTools, handleCreateWorkflow } = useWorkflow();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleExampleClick = (text) => {
    setPurpose(text);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '50px', backgroundColor: '#ffffff', borderRadius: '24px', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      
      {/* 상단 스텝 인디케이터 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: step === 1 ? '#f5f3ff' : '#f8fafc', border: step === 1 ? '2px solid #8b5cf6' : '2px solid #e2e8f0', color: step === 1 ? '#8b5cf6' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '1.2rem' }}>1</div>
          <span style={{ fontSize: '0.85rem', fontWeight: step === 1 ? '700' : '600', color: step === 1 ? '#8b5cf6' : '#94a3b8' }}>목적 입력</span>
        </div>
        <div style={{ width: '80px', height: '2px', backgroundColor: '#e2e8f0', margin: '0 16px', alignSelf: 'flex-start', marginTop: '22px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: step === 2 ? '#f5f3ff' : '#f8fafc', border: step === 2 ? '2px solid #8b5cf6' : '2px solid #e2e8f0', color: step === 2 ? '#8b5cf6' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '1.2rem' }}>2</div>
          <span style={{ fontSize: '0.85rem', fontWeight: step === 2 ? '700' : '600', color: step === 2 ? '#8b5cf6' : '#94a3b8' }}>툴 선택</span>
        </div>
        <div style={{ width: '80px', height: '2px', backgroundColor: '#e2e8f0', margin: '0 16px', alignSelf: 'flex-start', marginTop: '22px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: step === 3 ? '#f5f3ff' : '#f8fafc', border: step === 3 ? '2px solid #8b5cf6' : '2px solid #e2e8f0', color: step === 3 ? '#8b5cf6' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '1.2rem' }}>3</div>
          <span style={{ fontSize: '0.85rem', fontWeight: step === 3 ? '700' : '600', color: step === 3 ? '#8b5cf6' : '#94a3b8' }}>결과 확인</span>
        </div>
      </div>

      {/* 화면 1: 목적 입력 (WORKFLOW_01) */}
      {step === 1 && (
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <h3 style={{ color: '#8b5cf6', fontSize: '1rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '0.05em' }}>STEP 1</h3>
          <h2 style={{ fontSize: '2.6rem', fontWeight: '800', textAlign: 'center', margin: '0 0 16px 0', color: '#0f172a', lineHeight: '1.3' }}>어떤 분야의 워크플로우를<br/>만들고 싶으신가요?</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '50px', fontWeight: '500' }}>목적을 입력하거나 직군을 선택하면 최적의 AI 툴 조합을 추천해드릴게요</p>

          <div style={{ width: '100%', maxWidth: '750px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', height: '60px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderRadius: '16px' }}>
              <input 
                type="text" 
                value={purpose} 
                onChange={(e) => setPurpose(e.target.value)} 
                placeholder="예) 초보 영상 크리에이터인데, 무료 AI 툴로 고퀄리티 BGM과 자막을 만들고 싶어요" 
                style={{ flex: 1, padding: '0 24px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '1.05rem', outline: 'none', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '500' }}
              />
              <button 
                onClick={() => handleSuggestTools(purpose)} 
                disabled={!purpose || isLoading}
                style={{ padding: '0 32px', backgroundColor: purpose ? '#8b5cf6' : '#cbd5e1', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '700', cursor: purpose ? 'pointer' : 'not-allowed', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              >
                {isLoading ? '로딩중...' : 'AI 툴 추천받기 →'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '700', marginRight: '8px' }}>💡 이런 목적은 어때요?</span>
            {['유튜브 영상 편집', '무료 BGM 생성', '무료 이미지 생성'].map((tag) => (
              <button 
                key={tag}
                onClick={() => handleExampleClick(tag)}
                style={{ padding: '8px 20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '30px', color: '#475569', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', maxWidth: '900px' }}>
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
                  style={{ 
                    border: isSelected ? '2px solid #8b5cf6' : '1px solid #e2e8f0', 
                    backgroundColor: isSelected ? '#f5f3ff' : '#ffffff', 
                    borderRadius: '24px', 
                    padding: '36px 20px', 
                    textAlign: 'center', 
                    position: 'relative', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 10px 25px rgba(139, 92, 246, 0.15)' : '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                  onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#8b5cf6', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>✓</div>
                  )}
                  <div style={{ fontSize: '3rem', marginBottom: '20px', filter: isSelected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none', transition: 'all 0.2s' }}>{cat.icon}</div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>{cat.id}</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b', wordBreak: 'keep-all', fontWeight: '500' }}>{cat.desc}</p>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* 화면 2: 툴 선택 (WORKFLOW_02) */}
      {step === 2 && (
        <section>
          <h2>"{purpose}"에 추천하는 AI 툴 조합이에요. 사용하실 툴을 선택하세요.</h2>
          <ToolSelector />
          <button onClick={prevStep} disabled={isLoading} style={{ marginRight: '10px' }}>← 이전 단계</button>
          <button onClick={() => handleCreateWorkflow(purpose, selectedTools)} disabled={selectedTools.length === 0 || isLoading}>
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