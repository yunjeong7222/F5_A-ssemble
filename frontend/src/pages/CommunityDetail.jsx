import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';
import { likePost, unlikePost } from '../api/likes';
import { fetchWorkflowById } from '../api/workflows';
import { addBookmark, removeBookmark, checkBookmark } from '../api/workflowBookmarks';
import useAuthStore from '../store/authStore';
import EmbedPreview from '../components/community/EmbedPreview';
import CommentList from '../components/community/CommentList';
import CommunityEdit from './CommunityEdit';
import Alert from '../utils/alert';
import '../styles/Community.css';

const CommunityDetail = () => {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { user } = useAuthStore();

  const [post, setPost]           = useState(null);
  const [workflow, setWorkflow]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [editablePrompts, setEditablePrompts] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);

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
            step:          s.step_order ?? s.step,
            tool:          s.tool_name  ?? s.tool,
            shortName:     (s.tool_name ?? s.tool)?.slice(0, 5),
            category:      s.category   || '',
            tip:           s.tip        || '',
            prompt_example: s.prompt_example || '',
            thumbnail:     wfData.tools?.find(t => t.tool_name === (s.tool_name ?? s.tool))?.thumbnail || null,
          }));

          setWorkflow({
            title:    wfData.title,
            category: resultJson?.workflows_category || steps[0]?.category || '',
            categories: [...new Set(steps.map(s => s.category).filter(Boolean))],
            tools:    wfData.tools || [],
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
    if (!user) { alert('로그인 후 이용해주세요.'); return; }
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
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 북마크 토글 함수 추가
  const handleBookmarkToggle = async () => {
    if (!user) { alert('로그인 후 이용해주세요.'); return; }
    try {
      if (isBookmarked) {
        await removeBookmark(post.workflow_id);
      } else {
        await addBookmark(post.workflow_id);
      }
      setIsBookmarked(prev => !prev);
    } catch (err) {
      if (err.response?.status === 409) {
        alert('이미 북마크한 워크플로우입니다.');
      } else {
        alert('북마크 처리에 실패했습니다.');
      }
    }
  };

  /* ── 프롬프트 수정 ── */
  const handlePromptChange = (step, text) => {
    setEditablePrompts(prev => ({ ...prev, [step]: text }));
  };

  const handleCopyPrompt = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('프롬프트가 복사되었습니다!');
    } catch {
      alert('복사에 실패했습니다.');
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
        {workflow?.categories?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {workflow.categories.map(cat => (
              <span key={cat} className="comm-category-badge">
                {cat}
              </span>
            ))}
          </div>
        )}
        <h2>{post.title}</h2>
        <div className="detail-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {post.profile_url ? (
              <img
                src={post.profile_url}
                alt={post.nickname}
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover'}}
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
          </div>
          <div className="detail-header-btns">
            <button
              className={`detail-like-btn${isLiked ? ' detail-like-btn--active' : ''}`}
              onClick={handleLikeToggle}
            >
              {isLiked ? '❤️' : '🤍'} 좋아요 {likeCount}
            </button>

            {user?.id === post.user_id && (
              <>
                <button
                  className="detail-like-btn"
                  onClick={() => navigate(`/community/edit/${post.id}`)}
                >
                  수정
                </button>
                <button
                  className="detail-like-btn"
                  onClick={async () => {
                    const result = await Alert.fire({
                      icon: 'warning',
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
            {post.workflow_id && post.user_id !== user?.id && (
              <button
                onClick={handleBookmarkToggle}
                className={`detail-like-btn${isBookmarked ? ' detail-like-btn--active' : ''}`}
              >
                {isBookmarked ? '🔖' : '📄'} {isBookmarked ? '저장됨' : '워크플로우 저장'}
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
              <h5 className="write-cat-title" style={{ marginBottom: 20 }}>단계별 프롬프트</h5>
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
                        onClick={() => handleCopyPrompt(editablePrompts[step.step] || '')}
                      >
                        복사
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

      {/* ── 5. 댓글 ── */}
      <CommentList postId={id} />

    </div>
  );
};

export default CommunityDetail;