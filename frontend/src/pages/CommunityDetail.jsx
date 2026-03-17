import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkflowStore from '../store/workflowStore'; 
import '../styles/Community.css'; // 💡 분리된 CSS 적용

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
      <div className="detail-error-wrap">
        <h3>데이터를 불러올 수 없습니다.</h3>
        <button 
          onClick={() => navigate('/workflow')} // 워크플로우 시작 페이지 경로로 맞춰주세요
          className="detail-error-btn"
        >
          워크플로우 다시 만들기
        </button>
      </div>
    );
  }

  const { title, steps } = workflowResult;
  const toolsFlow = steps.map((s) => s.tool);

  return (
    <div className="detail-container-new">
      
      {/* 1. 헤더 영역 */}
      <header>
        <h2>{title || 'AI 워크플로우 레시피'}</h2>
        <div className="detail-header-info">
          <div>
            <span className="detail-avatar-user">U</span>
            <strong>@User</strong>
            <span className="detail-meta-text">방금 전 · 1 조회</span>
          </div>
          <div className="detail-header-btns">
            <button className="detail-like-btn">❤️ 좋아요 0</button>
            <button className="detail-bookmark-btn">🔖 북마크</button>
          </div>
        </div>
      </header>

      {/* 2. 결과물 영역 */}
      <div className="detail-hero-box">
        <span className="detail-hero-text">결과물 이미지 / 영상 (추후 업로드 기능 연동)</span>
      </div>

      {/* 3. 워크플로우 플로우 */}
      <section>
        <h3 className="detail-section-title-sub">WORKFLOW FLOW</h3>
        <div className="detail-flow-wrap">
          {toolsFlow.map((tool, index) => (
            <React.Fragment key={index}>
              <div className="detail-flow-badge">{tool}</div>
              {index < toolsFlow.length - 1 && <span className="detail-flow-arrow">➔</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 4. 스텝별 프롬프트 수정 영역 */}
      <section>
        {steps.map((step) => (
          <div key={step.step} className="detail-step-card">
            <div className="detail-step-header">
                {/* 왼쪽: 스텝 번호와 툴 이름 */}
                <div className="detail-step-left">
                    <span className="detail-step-num">{step.step}</span>
                    <strong className="detail-step-tool">{step.tool}</strong>
                </div>
                
                {/* 오른쪽 끝: 카테고리 */}
                <div className="detail-step-right">
                    <span className="detail-step-dot"></span>
                    <span className="detail-step-cat">{step.category}</span>
                </div>
            </div>
            
            {step.tip && <p className="detail-step-tip">💡 {step.tip}</p>}

            <div className="detail-prompt-box">
              <div className="detail-prompt-inner">
                <textarea 
                  value={editablePrompts[step.step] || ''} 
                  onChange={(e) => handlePromptChange(step.step, e.target.value)}
                  className="detail-prompt-textarea"
                  placeholder="프롬프트 내용을 입력하세요..."
                />
                <button 
                  onClick={() => handleCopyPrompt(editablePrompts[step.step])}
                  className="detail-copy-btn-new"
                >
                  복사
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 5. 워크플로우 설명 작성 영역 */}
      <section style={{ marginTop: '30px' }}>
        <h3 className="detail-desc-title">WORKFLOW DESCRIPTION</h3>
        <textarea 
          value={workflowDescription}
          onChange={(e) => setWorkflowDescription(e.target.value)}
          placeholder="이 워크플로우를 어떤 상황에서 쓰면 좋은지, 혹은 나만의 활용 꿀팁을 자유롭게 적어주세요!"
          className="detail-desc-textarea-new"
        />
      </section>

      {/* 6. 댓글 영역 */}
      <section className="detail-comments-section">
        <h4 style={{ marginBottom: '20px' }}>댓글 0개</h4>
        <div className="detail-comment-wrap">
           <span className="detail-comment-avatar">U</span>
           <input 
             type="text" 
             placeholder="댓글을 입력하세요..." 
             className="detail-comment-input"
           />
           <button className="detail-comment-submit">등록</button>
        </div>
      </section>
      
    </div>
  );
};

export default CommunityDetail;