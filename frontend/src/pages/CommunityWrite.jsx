import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { fetchMyWorkflows } from '../api/workflows';
import { getMyBookmarks } from '../api/workflowBookmarks';
import { uploadFile } from '../utils/uploadFile';
import '../styles/Community.css';
import Alert from '../utils/alert'

const CommunityWrite = () => {
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myWorkflows, setMyWorkflows] = useState([]);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(true);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [editablePrompts, setEditablePrompts] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [uploadType, setUploadType] = useState('file'); // 'file' | 'youtube'
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [activeTab, setActiveTab] = useState('my'); // 'my' | 'bookmarked'
  const [bookmarkedWorkflows, setBookmarkedWorkflows] = useState([]);

  // ── 워크플로우 목록 불러오기 ──
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const res = await fetchMyWorkflows();
        const list = res.data.data || [];
        const bmRes = await getMyBookmarks();
        const bmList = bmRes.data.data || [];

        const parseWf = (wf) => {
          const resultJson = typeof wf.result_json === 'string'
            ? JSON.parse(wf.result_json)
            : wf.result_json;
          const steps = resultJson?.steps || [];
          return {
            id: wf.id,
            title: wf.title,
            category: steps.map(s => s.category).filter(Boolean)[0] || '',
            categories: [...new Set(steps.map(s => s.category).filter(Boolean))],
            toolsText: wf.tools?.map(t => t.name).join(' · ') || '',
            steps: steps.map(s => ({
              step: s.step_order ?? s.step,
              tool: s.tool_name ?? s.tool,
              shortName: (s.tool_name ?? s.tool)?.slice(0, 5),
              category: s.category,
              description: s.tip || '',
              prompt_example: s.prompt_example || '',
              thumbnail: wf.tools?.find(t => t.name === (s.tool_name ?? s.tool))?.thumbnail || null,
            })),
          };
        };
        setMyWorkflows(list.map(parseWf));
        setBookmarkedWorkflows(bmList.map(parseWf));

      } catch (err) {
        console.error('워크플로우 불러오기 실패:', err);
      } finally {
        setIsLoadingWorkflows(false);
      }
    };
    loadWorkflows();
  }, []);

  const selectedWorkflow =
    myWorkflows.find(w => w.id === selectedWorkflowId) ||
    bookmarkedWorkflows.find(w => w.id === selectedWorkflowId);

  useEffect(() => {
    if (selectedWorkflow?.steps) {
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
      Alert.fire({
        text: '파일 크기는 50MB를 초과할 수 없습니다.',
        showConfirmButton: false,
        timer: 1500,
      });

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

  const getYoutubeId = (url) => {
    return url?.match(/[?&]v=([^&]+)/)?.[1] ||
      url?.match(/youtu\.be\/([^?]+)/)?.[1] || null;
  };

  const CATEGORY_PLACEHOLDER = {
    '기획 및 스크립트': '/icons/category-1.png',
    '영상 소스 생성': '/icons/category-2.png',
    '이미지 소스 생성': '/icons/category-3.png',
    '성우 / TTS': '/icons/category-4.png',
    'BGM': '/icons/category-5.png',
    '편집 / 숏폼 변환': '/icons/category-6.png',
    '업로드 최적화': '/icons/category-7.png',
  };

  const handleSubmit = async () => {
    if (!postTitle.trim()) {
      await Alert.fire({ text: '게시글 제목을 입력해주세요.', showConfirmButton: false, timer: 1500 });
      return;
    }
    if (uploadType === 'youtube' && !getYoutubeId(youtubeUrl)) {
      await Alert.fire({ text: '올바른 유튜브 URL을 입력해주세요.', showConfirmButton: false, timer: 1500 });
      return;
    }
    if (!selectedWorkflowId) {
      await Alert.fire({ text: '공유할 레시피(워크플로우)를 선택해주세요.', showConfirmButton: false, timer: 1500 });
      return;
    }
    if (!postContent.trim()) {
      await Alert.fire({ text: '워크플로우 설명을 작성해주세요.', showConfirmButton: false, timer: 1500 });
      return;
    }

    setIsSubmitting(true);
    try {
      let attachments = [];

      if (uploadType === 'file') {
        if (selectedFile) {
          const { url, type, thumbnailUrl } = await uploadFile(selectedFile);
          if (type === 'video' && thumbnailUrl) {
            attachments.push({ type: 'image', url: thumbnailUrl }); // 카드용 썸네일
          }
          attachments.push({ type, url });
        }
        else {
          const category = selectedWorkflow?.categories?.[0] || selectedWorkflow?.category || '';
          const placeholderUrl = CATEGORY_PLACEHOLDER[category] || '/icons/category-1.png';
          attachments.push({ type: 'image', url: placeholderUrl });
        }
      } else {
        attachments.push({ type: 'youtube', url: youtubeUrl });
      }

      attachments.push({ type: 'text', content: postContent });
      console.log('attachments:', JSON.stringify(attachments, null, 2));
      await createPost({
        title: postTitle,
        workflow_id: selectedWorkflowId,
        attachments,
      });

      await Alert.fire({
        text: '게시글이 성공적으로 등록되었습니다!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/community');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      Alert.fire({
        text: '게시글 등록에 실패했습니다. 다시 시도해주세요.',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="write-wrapper">
      <div className="write-container">

        <header className="write-header">
          <h2 className="write-title">게시글 작성</h2>
        </header>

        {/* 제목 */}
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

        {/* 결과물 업로드 */}
        <section className="write-section">
          <label className="write-label">결과물 업로드</label>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => setUploadType('file')}
              className={`comm-filter-btn ${uploadType === 'file' ? 'active' : ''}`}
            >
              이미지 / 영상
            </button>
            <button
              onClick={() => setUploadType('youtube')}
              className={`comm-filter-btn ${uploadType === 'youtube' ? 'active' : ''}`}
            >
              유튜브 URL
            </button>
          </div>

          {uploadType === 'file' && (
            <>
              <input
                type="file"
                accept="image/png, image/jpeg, video/mp4"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div
                onClick={previewUrl ? undefined : handleUploadBoxClick}
                className={`write-upload-box ${previewUrl ? 'write-upload-filled' : 'write-upload-empty'}`}
              >
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
            </>
          )}

          {uploadType === 'youtube' && (
            <div>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="write-input"
                style={{ marginBottom: '12px' }}
              />
              {getYoutubeId(youtubeUrl) && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* 레시피 연결 */}
        <section className="write-section">
          <label className="write-label">
            {selectedWorkflow ? '연결된 워크플로우' : '워크플로우 연결'}
          </label>
          <div className="write-recipe-box">

            {isLoadingWorkflows && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                불러오는 중...
              </div>
            )}

            {!isLoadingWorkflows && myWorkflows.length === 0 && bookmarkedWorkflows.length === 0 && (
              <div className="write-no-recipe">
                <div className="write-no-recipe-icon">✦</div>
                <h3 className="write-no-recipe-title">저장된 워크플로우가 없어요</h3>
                <p className="write-no-recipe-desc">워크플로우를 먼저 생성하면 연결할 수 있어요</p>
                <button
                  type="button"
                  className="write-no-recipe-btn"
                  onClick={() => navigate('/workflow')}
                >
                  워크플로우 만들러 가기 →
                </button>
              </div>
            )}

            {/* 워크플로우 목록 — 카테고리 함께 표시 */}
            {!isLoadingWorkflows && myWorkflows.length > 0 && !selectedWorkflow && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  {[
                    { key: 'my', label: `내 워크플로우 (${myWorkflows.length})` },
                    { key: 'bookmarked', label: `북마크 (${bookmarkedWorkflows.length})` },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`comm-filter-btn ${activeTab === tab.key ? 'active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 목록 */}
                {(() => {
                  const list = activeTab === 'my' ? myWorkflows : bookmarkedWorkflows;
                  if (list.length === 0) {
                    return (
                      <div className="write-no-recipe">
                        <div className="write-no-recipe-icon">✦</div>
                        <p className="write-no-recipe-desc">
                          {activeTab === 'my' ? '저장된 워크플로우가 없어요' : '북마크한 워크플로우가 없어요'}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="write-wf-list">
                      {list.map(item => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedWorkflowId(item.id)}
                          className="write-wf-item"
                        >
                          <div className="write-wf-icon">✦</div>
                          <div style={{ flex: 1 }}>
                            <strong className="write-wf-title">{item.title}</strong>
                            <span className="write-wf-tools">{item.toolsText}</span>
                          </div>
                          {item.category && (
                            <span className="write-cat-badge" style={{ flexShrink: 0 }}>
                              {item.category}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 선택된 워크플로우 */}
            {!isLoadingWorkflows && selectedWorkflow && (
              <div className="write-sel-animate">
                <div className="write-sel-header">
                  <div className="write-sel-info">
                    <div className="write-sel-icon">✦</div>
                    <div>
                      <span className="write-sel-badge">자동 연결됨</span>
                      <strong className="write-sel-title">{selectedWorkflow.title}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedWorkflowId(null)}
                    className="write-change-btn"
                  >
                    변경
                  </button>
                </div>

                {/* ✅ 카테고리 확인 영역 — 강조 */}
                <div className="write-cat-section">
                  <h5 className="write-cat-title">게시글 카테고리</h5>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    {selectedWorkflow.categories?.length > 0 ? (
                      <>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {selectedWorkflow.categories.map(cat => (
                            <span key={cat} className="write-cat-badge">{cat}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="write-cat-hint">카테고리 정보가 없습니다</span>
                    )}
                  </div>
                </div>

                {selectedWorkflow.steps.length > 0 && (
                  <>
                    <div className="write-flow-section">
                      <h5 className="write-cat-title">워크플로우 플로우</h5>
                      <div className="write-flow-wrap">
                        {selectedWorkflow.steps.map((step, index) => (
                          <React.Fragment key={step.step}>
                            <div className="write-flow-item">
                              <div className="write-flow-box">
                                {step.thumbnail ? (
                                  <img
                                    src={step.thumbnail}
                                    alt={step.tool}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                  />
                                ) : (
                                  step.shortName
                                )}
                              </div>
                              <span className="write-flow-name">{step.tool}</span>
                            </div>
                            {index < selectedWorkflow.steps.length - 1 && (
                              <div className="write-flow-arrow">➔</div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="write-prompt-area">
                      <h5 className="write-cat-title" style={{ marginBottom: '20px' }}>
                      </h5>
                      {selectedWorkflow.steps.map((step) => (
                        <div key={step.step} className="write-prompt-card">
                          <div className="write-prompt-header">
                            <div className="write-prompt-left">
                              <span className="write-prompt-num">{step.step}</span>
                              <strong className="write-prompt-tool">{step.tool}</strong>
                            </div>
                            <span className="write-prompt-cat">{step.category}</span>
                          </div>
                          {step.description && (
                            <div className="write-prompt-desc">{step.description}</div>
                          )}
                          <textarea
                            value={editablePrompts[step.step] || ''}
                            readOnly
                            onChange={(e) => handlePromptChange(step.step, e.target.value)}
                            className="write-textarea-prompt"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 설명 */}
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
          <button onClick={handleSubmit} disabled={isSubmitting} className="write-btn-submit">
            {isSubmitting ? '등록 중..' : '등록하기'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CommunityWrite;