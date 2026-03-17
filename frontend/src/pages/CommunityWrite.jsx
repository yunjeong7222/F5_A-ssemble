import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Community.css';

const mockWorkflows = [
  {
    id: 1,
    title: 'Perplexity + Claude로 경쟁사 분석 보고서 30분 완성',
    toolsText: 'ChatGPT · Vrew · Canva AI · ElevenLabs',
    category: '스크립트',
    steps: [
      { step: 1, tool: 'ChatGPT', shortName: 'GPT', category: '기획 및 스크립트', description: '30초 숏폼 스크립트 작성', prompt_example: '"30초 숏폼용 스크립트 작성해줘. 주제는 [주제]"' },
      { step: 2, tool: 'Vrew', shortName: 'Vrew', category: '영상 편집', description: '오디오 기반 자동 컷 편집', prompt_example: '"생성된 스크립트를 바탕으로 템포가 빠른 숏폼 영상을 만들어줘."' },
      { step: 3, tool: 'Canva AI', shortName: 'Canva', category: '이미지 소스 생성', description: '썸네일 디자인 자동 생성', prompt_example: '"유튜브 썸네일 만들어줘. 텍스트: [제목], 톤: 밝고 강렬하게"' },
      { step: 4, tool: 'ElevenLabs', shortName: '11Labs', category: '보이스', description: 'AI 내레이션 생성', prompt_example: '"차분하고 신뢰감 있는 20대 여성 목소리로 자연스럽게 읽어줘."' }
    ]
  },
  {
    id: 2,
    title: '30초 숏폼 자동 제작',
    toolsText: 'ChatGPT · CapCut AI · Vrew',
    category: '영상 제작',
    steps: []
  }
];

const CommunityWrite = () => {
  const navigate = useNavigate();
  
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  
  const [hasSavedWorkflows, setHasSavedWorkflows] = useState(false); 
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [editablePrompts, setEditablePrompts] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const selectedWorkflow = mockWorkflows.find(w => w.id === selectedWorkflowId);

  useEffect(() => {
    if (selectedWorkflow && selectedWorkflow.steps) {
      const initialPrompts = {};
      selectedWorkflow.steps.forEach((step) => {
        initialPrompts[step.step] = step.prompt_example || '';
      });
      setEditablePrompts(initialPrompts);
    }
  }, [selectedWorkflow]);

  const handlePromptChange = (stepOrder, newText) => {
    setEditablePrompts(prev => ({ ...prev, [stepOrder]: newText }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('파일 크기는 50MB를 초과할 수 없습니다.');
      e.target.value = ''; 
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 
  };

  const handleUploadBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); 
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!postTitle.trim()) return alert('게시글 제목을 입력해주세요.');
    if (!selectedFile) return alert('결과물(이미지 또는 영상)을 업로드해주세요.');
    if (!selectedWorkflowId) return alert('공유할 레시피(워크플로우)를 선택해주세요.');
    if (!postContent.trim()) return alert('워크플로우 설명을 작성해주세요.');

    alert('게시글이 성공적으로 등록되었습니다! 🎉');
    navigate('/community'); 
  };

  return (
    <div className="write-wrapper">
      <div className="write-container">
        
        <header className="write-header">
          <h2 className="write-title">워크플로우 공유하기</h2>
          <button 
            onClick={() => {
              setHasSavedWorkflows(!hasSavedWorkflows);
              setSelectedWorkflowId(null);
            }}
            className="write-test-btn"
          >
            {hasSavedWorkflows ? '🔄⭕ 데이터 있음 (Beta)' : '🔄❌ 데이터 없음 (Beta)'}
          </button>
        </header>

        <section className="write-section">
          <label className="write-label">제목</label>
          <input 
            type="text" 
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="어떤 워크플로우인지 한눈에 알 수 있는 제목을 적어주세요"
            className="write-input"
          />
        </section>

        <section className="write-section">
          <label className="write-label">결과물 업로드</label>
          <input type="file" accept="image/png, image/jpeg, video/mp4" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />

          <div onClick={previewUrl ? undefined : handleUploadBoxClick} className={`write-upload-box ${previewUrl ? 'write-upload-filled' : 'write-upload-empty'}`}>
            {previewUrl ? (
              <>
                {selectedFile.type.startsWith('video/') ? (
                  <video src={previewUrl} controls className="write-preview-media" />
                ) : (
                  <img src={previewUrl} alt="업로드 미리보기" className="write-preview-media" />
                )}
                <button onClick={handleRemoveFile} className="write-remove-btn">✕</button>
              </>
            ) : (
              <div>
                <div className="write-upload-icon">↑</div>
                <p className="write-upload-text">이미지 또는 영상을 업로드하세요</p>
                <p className="write-upload-hint">PNG, JPG, MP4 · 최대 50MB</p>
              </div>
            )}
          </div>
        </section>

        <section className="write-section">
          <label className="write-label">{selectedWorkflow ? '연결된 레시피' : '레시피 연결'}</label>
          <div className="write-recipe-box">
            
            {!hasSavedWorkflows && (
              <div className="write-no-recipe">
                <div className="write-no-recipe-icon">✦</div>
                <h3 className="write-no-recipe-title">저장된 워크플로우가 없어요</h3>
                <p className="write-no-recipe-desc">워크플로우를 먼저 생성하면<br/>레시피를 연결할 수 있어요</p>
              </div>
            )}

            {hasSavedWorkflows && !selectedWorkflow && (
              <div>
                <div className="write-wf-header">
                  <span>내 워크플로우 목록</span><span>{mockWorkflows.length}개</span>
                </div>
                <div className="write-wf-list">
                  {mockWorkflows.map((item) => (
                    <div key={item.id} onClick={() => setSelectedWorkflowId(item.id)} className="write-wf-item">
                      <div className="write-wf-icon">✦</div>
                      <div>
                        <strong className="write-wf-title">{item.title}</strong>
                        <span className="write-wf-tools">{item.toolsText}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasSavedWorkflows && selectedWorkflow && (
              <div>
                <div className="write-sel-header">
                  <div className="write-sel-info">
                    <div className="write-sel-icon">✦</div>
                    <div>
                      <span className="write-sel-badge">자동 연결됨</span>
                      <strong className="write-sel-title">{selectedWorkflow.title}</strong>
                    </div>
                  </div>
                  <button onClick={() => setSelectedWorkflowId(null)} className="write-change-btn">변경</button>
                </div>

                <div className="write-cat-section">
                  <h5 className="write-cat-title">카테고리</h5>
                  <span className="write-cat-badge">{selectedWorkflow.category}</span>
                  <span className="write-cat-hint">레시피 기반 자동 분류</span>
                </div>

                <div className="write-flow-section">
                  <h5 className="write-cat-title">워크플로우 플로우</h5>
                  <div className="write-flow-wrap">
                    {selectedWorkflow.steps.map((step, index) => (
                      <React.Fragment key={step.step}>
                        <div className="write-flow-item">
                          <div className="write-flow-box">{step.shortName}</div>
                          <span className="write-flow-name">{step.tool}</span>
                        </div>
                        {index < selectedWorkflow.steps.length - 1 && <div className="write-flow-arrow">➔</div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="write-prompt-area">
                  <h5 className="write-cat-title" style={{ marginBottom: '20px' }}>단계별 프롬프트 수정</h5>
                  {selectedWorkflow.steps.map((step) => (
                    <div key={step.step} className="write-prompt-card">
                      <div className="write-prompt-header">
                        <div className="write-prompt-left">
                          <span className="write-prompt-num">{step.step}</span>
                          <strong className="write-prompt-tool">{step.tool}</strong>
                        </div>
                        <span className="write-prompt-cat">{step.category}</span>
                      </div>
                      <div className="write-prompt-desc">{step.description}</div>
                      <textarea 
                        value={editablePrompts[step.step] || ''} 
                        onChange={(e) => handlePromptChange(step.step, e.target.value)} 
                        className="write-textarea-prompt"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="write-section">
          <label className="write-label">워크플로우 설명</label>
          <textarea 
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="이 워크플로우를 어떤 상황에서 쓰면 좋은지, 혹은 나만의 활용 꿀팁을 자유롭게 적어주세요!"
            className="write-textarea-desc"
          />
        </section>

        <div className="write-footer">
          <button onClick={() => navigate(-1)} className="write-btn-cancel">취소</button>
          <button onClick={handleSubmit} className="write-btn-submit">공유하기</button>
        </div>

      </div>
    </div>
  );
};

export default CommunityWrite;