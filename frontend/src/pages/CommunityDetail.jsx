import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';
import { likePost, unlikePost } from '../api/likes';
import { fetchWorkflowById } from '../api/workflows';
import { addBookmark, removeBookmark, checkBookmark } from '../api/workflowBookmarks';
import useAuthStore from '../store/authStore';
import EmbedPreview from '../components/community/EmbedPreview';
import CommentList from '../components/community/CommentList';

import Alert from '../utils/alert';
import '../styles/Community.css';

const CommunityDetail = ({ postId, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();

  const [post, setPost] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [editablePrompts, setEditablePrompts] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedStep, setCopiedStep] = useState(null);
  /* ── 게시글 + 워크플로우 로드 ── */
  useEffect(() => {
    const load = async () => {
      try {
        // 1. 게시글 로드
        const postRes = await getPost(id);
        const postData = postRes.data;
        setPost(postData);
        setLikeCount(postData.like_count || 0);
        setIsLiked(!!postData.is_liked);

        // 2. workflow_id 있으면 워크플로우 로드
        if (postData.workflow_id) {
          const wfRes = await fetchWorkflowById(postData.workflow_id);
          const wfData = wfRes.data.data;

          const resultJson = typeof wfData.result_json === 'string'
            ? JSON.parse(wfData.result_json)
            : wfData.result_json;

          const steps = (resultJson?.steps || []).map(s => ({
            step: s.step_order ?? s.step,
            tool: s.tool_name ?? s.tool,
            shortName: (s.tool_name ?? s.tool)?.slice(0, 5),
            category: s.category || '',
            tip: s.tip || '',
            prompt_example: s.prompt_example || '',
            thumbnail: wfData.tools?.find(t => t.tool_name === (s.tool_name ?? s.tool))?.thumbnail || null,
          }));

          setWorkflow({
            title: wfData.title,
            category: resultJson?.workflows_category || steps[0]?.category || '',
            categories: [...new Set(steps.map(s => s.category).filter(Boolean))],
            tools: wfData.tools || [],
            steps,
          });

          // 프롬프트 초기값 세팅
          const initialPrompts = {};
          steps.forEach(s => { initialPrompts[s.step] = s.prompt_example; });
          setEditablePrompts(initialPrompts);
        }
        if (postData.workflow_id && user) {
          const bmRes = await checkBookmark(postData.workflow_id);
          setIsBookmarked(bmRes.data.data.isBookmarked);
        }
      } catch (err) {
        console.error('불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── 좋아요 토글 ── */
  const handleLikeToggle = async () => {
    if (!user) {
      Alert.fire({
        text: '로그인이 필요한 서비스입니다.',
        showConfirmButton: '확인',
      });
      return;
    }
    try {
      if (isLiked) {
        await unlikePost(id);
        setLikeCount(prev => prev - 1);
      } else {
        await likePost(id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(prev => !prev);
    } catch {
      Alert.fire({
        text: '좋아요 처리에 실패했습니다.',
        showConfirmButton: '확인',
      });
    }
  };

  // 북마크 토글 함수 추가
  const handleBookmarkToggle = async () => {
    if (!user) {
      Alert.fire({
        text: '로그인이 필요한 서비스입니다.',
        showConfirmButton: '확인',
      });
      return;
    }
    try {
      if (isBookmarked) {
        await removeBookmark(post.workflow_id);
      } else {
        await addBookmark(post.workflow_id);
        Alert.fire({
          text: '워크플로우를 북마크 했습니다.',
          showConfirmButton: '확인',
        });
      }
      setIsBookmarked(prev => !prev);
    } catch (err) {
      if (err.response?.status === 409) {
        Alert.fire({
          text: '이미 북마크한 워크플로우입니다.',
          showConfirmButton: '확인',
        });
      } else {
        Alert.fire({
          text: '북마크 처리에 실패했습니다',
          showConfirmButton: '확인',
        });
      }
    }
  };

  /* ── 프롬프트 수정 ── */
  const handlePromptChange = (step, text) => {
    setEditablePrompts(prev => ({ ...prev, [step]: text }));
  };

  const handleCopyPrompt = async (text, stepKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepKey);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      Alert.fire({
        text: '복사에 실패했습니다.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  /* ── text attachment (본문 설명) ── */
  const textContent = post?.attachments?.find(a => a.type === 'text')?.content || '';

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
        불러오는 중...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="detail-error-wrap">
        <h3>게시글을 찾을 수 없습니다.</h3>
        <button className="detail-error-btn" onClick={() => navigate('/community')}>
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container-new">

      {/* ── 1. 헤더 ── */}
      <header>
        <p className="detail-header-title">{post.title}</p>
        <div className="detail-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {post.profile_url ? (
              <img
                src={post.profile_url}
                alt={post.nickname}
                style={{ width: 35, height: 35, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="detail-avatar-user">
                {(post.nickname || 'U').charAt(0).toUpperCase()}
              </span>
            )}
            <strong>@{post.nickname}</strong>
            <span className="detail-meta-text">
              {new Date(post.created_at).toLocaleDateString('ko-KR')} · 조회 {post.view_count}
            </span>
            {user?.id === post.user_id && (
              <>
                <button
                  className="detail-btn"
                  onClick={() => navigate(`/community/edit/${post.id}`)}
                >
                  수정
                </button>
                <button
                  className="detail-btn"
                  onClick={async () => {
                    const result = await Alert.fire({
                      title: '게시글을 삭제하시겠습니까?',
                      showCancelButton: true,
                      confirmButtonText: '삭제',
                      cancelButtonText: '취소',
                    });
                    if (result.isConfirmed) {
                      await deletePost(post.id);
                      navigate('/community');
                    }
                  }}
                >
                  삭제
                </button>
              </>
            )}
          </div>
          <div className="detail-header-btns">
            <button
              className={`detail-like-btn${isLiked ? ' detail-like-btn--active' : ''}`}
              onClick={handleLikeToggle}
            >
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={isLiked ? '#ef4444' : 'none'}
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likeCount}
            </button>


            {post.workflow_id && post.user_id !== user?.id && (
              <button
                onClick={handleBookmarkToggle}
                className={`detail-bookmark-btn${isBookmarked ? ' detail-bookmark-btn--active' : ''}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24"
                  fill={isBookmarked ? 'var(--primary)' : 'none'}
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. 미디어 ── */}
      <EmbedPreview attachments={post.attachments || []} />

      {/* ── 3. 연결된 레시피 + 워크플로우 플로우 ── */}
      {workflow && (
        <section>
          {/* 연결된 레시피 라벨 */}
          <div className="write-sel-header" style={{ marginBottom: 16 }}>
            <div className="write-sel-info">
              <div className="write-sel-icon">✦</div>
              <div>
                <span className="write-sel-badge">연결된 워크플로우</span>
                <strong className="write-sel-title">{workflow.title}</strong>
              </div>
            </div>
          </div>

          {/* 워크플로우 플로우 (썸네일 + 툴명) */}
          {workflow.steps.length > 0 && (
            <div className="write-flow-section">
              <h5 className="write-cat-title">WORKFLOW FLOW</h5>
              <div className="write-flow-wrap">
                {workflow.steps.map((step, index) => (
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
                    {index < workflow.steps.length - 1 && (
                      <div className="write-flow-arrow">➔</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* 단계별 프롬프트 */}
          {workflow.steps.length > 0 && (
            <div className="write-prompt-area">
              <h5 className="write-cat-title">단계별 프롬프트</h5>
              {workflow.steps.map(step => (
                <div key={step.step} className="detail-step-card">
                  <div className="detail-step-header">
                    <div className="detail-step-left">
                      <span className="detail-step-num">{step.step}</span>
                      <strong className="detail-step-tool">{step.tool}</strong>
                    </div>
                    <span className="detail-step-cat">{step.category}</span>
                  </div>

                  {step.tip && (
                    <p className="detail-step-tip">💡 {step.tip}</p>
                  )}

                  <div className="detail-prompt-box">
                    <div className="detail-prompt-inner">
                      <textarea
                        value={editablePrompts[step.step] || ''}
                        onChange={(e) => handlePromptChange(step.step, e.target.value)}
                        className="detail-prompt-textarea"
                        placeholder="프롬프트를 입력하세요..."
                      />
                      <button
                        className="detail-copy-btn-new"
                        onClick={() => handleCopyPrompt(editablePrompts[step.step] || '', step.step)}
                      >
                        {copiedStep === step.step ? (
                          <svg width="21" height="13" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : '복사'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── 4. 본문 설명 ── */}
      {textContent && (
        <section>
          <h3 className="detail-section-title-sub">WORKFLOW DESCRIPTION</h3>
          <p style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            background: 'var(--surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border)',
            whiteSpace: 'pre-wrap',
          }}>
            {textContent}
          </p>
        </section>
      )}

      {/* ── 5. 태그 ── */}
      {workflow?.categories?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '18px 0' }}>
          {workflow.categories.map(cat => (
            <span key={cat} className="comm-category-badge">
              # {cat}
            </span>
          ))}
        </div>
      )}

      {/* ── 6. 댓글 ── */}
      <CommentList postId={id} />

    </div>
  );
};

export default CommunityDetail;
