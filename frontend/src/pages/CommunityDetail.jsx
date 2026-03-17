import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkflowStore from '../store/workflowStore'; 

const CommunityDetail = () => {
  const navigate = useNavigate();
  const workflowResult = useWorkflowStore((state) => state.workflowResult);

  // ⭐ 에러가 났던 부분: 프롬프트 상태 관리가 반드시 여기에 있어야 합니다.
  const [editablePrompts, setEditablePrompts] = useState({});
  // ⭐ 방금 추가하기로 한 워크플로우 설명 상태 관리
  const [workflowDescription, setWorkflowDescription] = useState('');

  // 화면 초기화 시 원본 프롬프트를 상태에 복사
  useEffect(() => {
    if (workflowResult && workflowResult.steps) {
      const initialPrompts = {};
      workflowResult.steps.forEach((step) => {
        initialPrompts[step.step] = step.prompt_example || '';
      });
      setEditablePrompts(initialPrompts);
    }
  }, [workflowResult]);

  // 프롬프트 수정 핸들러
  const handlePromptChange = (stepOrder, newText) => {
    setEditablePrompts((prev) => ({
      ...prev,
      [stepOrder]: newText,
    }));
  };

  // 프롬프트 복사 핸들러
  const handleCopyPrompt = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('프롬프트가 복사되었습니다!');
    } catch (err) {
      alert('복사에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 스토어 데이터가 없을 때의 방어 로직
  if (!workflowResult) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>데이터를 불러올 수 없습니다.</h3>
        <button 
          onClick={() => navigate('/workflow')} // 워크플로우 시작 페이지 경로로 맞춰주세요
          style={{ padding: '10px 20px', backgroundColor: '#9B72FF', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          워크플로우 다시 만들기
        </button>
      </div>
    );
  }

  const { title, steps } = workflowResult;
  const toolsFlow = steps.map((s) => s.tool);

  return (
    <div className="recipe-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* 1. 헤더 영역 */}
      <header>
        <h2>{title || 'AI 워크플로우 레시피'}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="avatar" style={{ backgroundColor: '#F1F5F9', borderRadius: '50%', padding: '5px 10px', marginRight: '10px' }}>U</span>
            <strong>@User</strong>
            <span style={{ color: 'gray', marginLeft: '10px' }}>방금 전 · 1 조회</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 16px', backgroundColor: '#FFF0F6', color: '#EB2F96', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              ❤️ 좋아요 0
            </button>
            <button style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              🔖 북마크
            </button>
          </div>
        </div>
      </header>

      {/* 2. 결과물 영역 */}
      <div className="hero-image-placeholder" style={{ backgroundColor: '#EBE4FF', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', borderRadius: '8px' }}>
        <span style={{ color: '#9B72FF', fontWeight: 'bold' }}>결과물 이미지 / 영상 (추후 업로드 기능 연동)</span>
      </div>

      {/* 3. 워크플로우 플로우 */}
      <section className="workflow-flow">
        <h3 style={{ color: '#A0B2C6' }}>WORKFLOW FLOW</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', margin: '20px 0', overflowX: 'auto', paddingBottom: '10px' }}>
          {toolsFlow.map((tool, index) => (
            <React.Fragment key={index}>
              <div className="tool-badge" style={{ padding: '15px 25px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', color: '#334155', whiteSpace: 'nowrap' }}>
                {tool}
              </div>
              {index < toolsFlow.length - 1 && <span style={{ color: '#CBD5E1', fontWeight: 'bold' }}>➔</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 4. 스텝별 프롬프트 수정 영역 */}
      <section className="workflow-steps">
        {steps.map((step) => (
          <div key={step.step} className="step-card" style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #E2E8F0' }}>

                {/* 왼쪽: 스텝 번호와 툴 이름 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#EBE4FF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '12px', color: '#9B72FF', fontWeight: 'bold' }}>
                    {step.step}
                    </span>
                    <strong style={{ fontSize: '1.1em', color: '#1E293B' }}>{step.tool}</strong>
                </div>
                
                {/* 오른쪽 끝: 카테고리 (작은 점을 추가해 디자인 요소로 활용) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#CBD5E1', borderRadius: '50%' }}></span>
                    <span style={{ color: '#94A3B8', fontSize: '0.9em', fontWeight: '500' }}>
                    {step.category}
                    </span>
                </div>
                
                </div>
            
            {step.tip && <p style={{ color: '#334155', margin: '15px 0' }}>💡 {step.tip}</p>}

            <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#FFFFFF', padding: '15px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <textarea 
                  value={editablePrompts[step.step] || ''} 
                  onChange={(e) => handlePromptChange(step.step, e.target.value)}
                  style={{ width: '100%', minHeight: '80px', border: 'none', resize: 'vertical', color: '#475569', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px', outline: 'none',  fontSize: '1em', fontFamily: 'monospace' }}
                  placeholder="프롬프트 내용을 입력하세요..."
                />
                <button 
                  onClick={() => handleCopyPrompt(editablePrompts[step.step])}
                  style={{ color: '#9B72FF', backgroundColor: '#F5F3FF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', whiteSpace: 'nowrap', marginLeft: '15px' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#EBE4FF'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#F5F3FF'}
                >
                  복사
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 5. 워크플로우 설명 작성 영역 (새로 추가됨) */}
      <section className="workflow-description" style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#A0B2C6', marginBottom: '15px' }}>WORKFLOW DESCRIPTION</h3>
        <textarea 
          value={workflowDescription}
          onChange={(e) => setWorkflowDescription(e.target.value)}
          placeholder="이 워크플로우를 어떤 상황에서 쓰면 좋은지, 혹은 나만의 활용 꿀팁을 자유롭게 적어주세요!"
          style={{ 
            width: '100%', 
            minHeight: '150px', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid #E2E8F0', 
            backgroundColor: '#F8FAFC', 
            color: '#334155', 
            fontSize: '1em', 
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      </section>

      {/* 6. 댓글 영역 */}
      <section className="comments-section" style={{ marginTop: '40px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
        <h4 style={{ marginBottom: '20px' }}>댓글 0개</h4>
        <div className="comment-input" style={{ display: 'flex', marginTop: '30px', gap: '10px' }}>
           <span className="avatar" style={{ backgroundColor: '#F5F3FF', color: '#9B72FF', borderRadius: '50%', padding: '10px 15px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>U</span>
           <input 
             type="text" 
             placeholder="댓글을 입력하세요..." 
             style={{ flex: 1, padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#F5F3FF', color: '#9B72FF', outline: 'none', fontWeight: '500' }} 
           />
           <button 
             style={{ padding: '0 25px', backgroundColor: '#F5F3FF', color: '#9B72FF', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
             onMouseOver={(e) => e.target.style.backgroundColor = '#EBE4FF'}
             onMouseOut={(e) => e.target.style.backgroundColor = '#F5F3FF'}
           >
             등록
           </button>
        </div>
      </section>
    </div>
  );
};

export default CommunityDetail;