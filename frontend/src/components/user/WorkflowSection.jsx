import { useState, useEffect } from 'react';
import { fetchWorkflowById, deleteWorkflow, updateWorkflow } from '../../api/workflows';
import { getMyBookmarks, updateBookmarkPrompt, getBookmarkDetail } from '../../api/workflowBookmarks';
import CommunityDetail from '../../pages/CommunityDetail';
import { useNavigate } from 'react-router-dom';
import Alert from '../../utils/alert';

const WorkflowDetailModal = ({ workflowId, isBookmarked, onClose }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPrompts, setEditedPrompts] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        let wfData;
        let resultJson;

        if (isBookmarked) {
          const res = await getBookmarkDetail(workflowId);
          wfData = res.data.data;
          resultJson = wfData.result_json;
        } else {
          const res = await fetchWorkflowById(workflowId);
          wfData = res.data.data;
          resultJson = typeof wfData.result_json === 'string'
            ? JSON.parse(wfData.result_json)
            : wfData.result_json;
        }

        setData({ ...wfData, resultJson });

        const initial = {};
        resultJson?.steps?.forEach(s => {
          initial[s.step_order ?? s.step] = s.prompt_example || '';
        });
        setEditedPrompts(initial);
      } catch (err) {
        console.error('워크플로우 상세 불러오기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [workflowId, isBookmarked]);

  const handleSave = async () => {
    const hasChanged = data.resultJson.steps.some(s => {
      const key = s.step_order ?? s.step;
      return editedPrompts[key] !== (s.prompt_example || '');
    });

    if (!hasChanged) {
      Alert.fire({
      text: '변경된 내용이 없습니다.',
      showConfirmButton: false,
      timer: 1500,
    });
      return;
    }

    setIsSaving(true);
    try {
      const updatedSteps = data.resultJson.steps.map(s => ({
        ...s,
        prompt_example: editedPrompts[s.step_order ?? s.step] ?? s.prompt_example,
      }));
      const updatedResultJson = { ...data.resultJson, steps: updatedSteps };

      if (isBookmarked) {
        await updateBookmarkPrompt(workflowId, { result_json: updatedResultJson });
      } else {
        await updateWorkflow(workflowId, { result_json: updatedResultJson });
      }

      setData(prev => ({ ...prev, resultJson: updatedResultJson }));
      setIsEditing(false);
      alert('저장되었습니다!');
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const original = {};
    data.resultJson?.steps?.forEach(s => {
      original[s.step_order ?? s.step] = s.prompt_example || '';
    });
    setEditedPrompts(original);
    setIsEditing(false);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '28px'}}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>불러오는 중</div>
        ) : !data ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>데이터를 불러올 수 없습니다.</div>
        ) : (
          <>
            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', letterSpacing: '1px', marginBottom: '6px' }}>
                  {isBookmarked ? 'BOOKMARKED' : 'MY WORKFLOW'}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  {data.title || data.user_input}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)', background: '#ede9fe', border: 'none', borderRadius: '8px', padding: '6px 13px', cursor: 'pointer' }}
                  >
                    수정
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 13px', cursor: 'pointer' }}
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{ fontSize: '13px', fontWeight: '600', color: '#fff', background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '6px 13px', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}
                    >
                      {isSaving ? '저장 중' : '저장'}
                    </button>
                  </>
                )}
               
              </div>
            </div>

            {/* 툴 플로우 */}
            {data.tools?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', padding: '14px 16px', background: '#f8fafc', borderRadius: '12px' }}>
                {data.tools.map((tool, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <img
                        src={tool.thumbnail || `https://www.google.com/s2/favicons?domain=${tool.tool_name?.toLowerCase().replace(/\s/g, '')}.com&sz=64`}
                        alt={tool.tool_name}
                        style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{tool.tool_name}</span>
                    </div>
                    {i < data.tools.length - 1 && <span style={{ color: '#cbd5e1' }}>→</span>}
                  </div>
                ))}
              </div>
            )}

            {/* 단계별 프롬프트 */}
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {data.resultJson?.steps?.map((step, i) => {
              const stepKey = step.step_order ?? step.step;
              return (
                <div key={i} style={{ border: `1px solid ${isEditing ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px', marginBottom: '12px', transition: 'border-color .2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', background: '#6366f1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
                        {stepKey}
                      </span>
                      <strong style={{ fontSize: '14px', color: '#1e293b' }}>{step.tool_name ?? step.tool}</strong>
                    </div>
                    <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>
                      {step.category}
                    </span>
                  </div>

                  <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px', position: 'relative' }}>
                    {isEditing ? (
                      <textarea
                        value={editedPrompts[stepKey] || ''}
                        onChange={(e) => setEditedPrompts(prev => ({ ...prev, [stepKey]: e.target.value }))}
                        style={{
                          width: '100%', minHeight: '75px',
                          background: 'transparent', border: 'none', outline: 'none',
                          color: '#f8fafc', fontSize: '12px', lineHeight: '1.6',
                          fontFamily: 'Pretendard, sans-serif', resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                      />
                    ) : (
                      <>
                        <pre style={{ margin: 0, color: '#f8fafc', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: '1.6', fontFamily: 'Pretendard, sans-serif' }}>
                          {editedPrompts[stepKey]}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(editedPrompts[stepKey] || '').then(() => alert('복사됐습니다!'))}
                          style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          복사
                        </button>
                      </>
                    )}
                  </div>

                  {step.tip && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#854d0e', background: '#fefce8', padding: '8px 12px', borderRadius: '8px' }}>
                      💡 {step.tip}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WorkflowSection = ({ myWorkflows, setMyWorkflows, myPosts, setMyPosts }) => {
  const [workflowSubTab, setWorkflowSubTab] = useState('mine');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [bookmarkedWorkflows, setBookmarkedWorkflows] = useState([]);
  const navigate = useNavigate();

  const handleDeleteWorkflow = async (id) => {
    const result = await Alert.fire({
      text: '워크플로우를 삭제할까요?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteWorkflow(id);
      setMyWorkflows(prev => prev.filter(wf => wf.id !== id));
    } catch {
      Alert.fire({
        title: '삭제에 실패했습니다.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyBookmarks();
        setBookmarkedWorkflows(res.data.data || []);
      } catch (err) {
        console.error('북마크 불러오기 실패:', err);
      }
    };
    load();
  }, []);

  const visibleWorkflows = workflowSubTab === 'mine' ? myWorkflows : bookmarkedWorkflows;

  return (
    <div className="mypage-workflow-section">
      {selectedWorkflow && (
        <WorkflowDetailModal
          workflowId={selectedWorkflow.id}
          isBookmarked={selectedWorkflow.isBookmarked}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}

      {selectedPostId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setSelectedPostId(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <CommunityDetail postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
          </div>
        </div>
      )}
      {/* 탭 버튼 */}
      <div className="mypage-workflow-filter">
        <button
          onClick={() => setWorkflowSubTab('mine')}
          className={`mypage-filter-btn${workflowSubTab === 'mine' ? ' mypage-filter-btn--active' : ''}`}
        >
          내 워크플로우
        </button>
        <button
          onClick={() => setWorkflowSubTab('bookmarked')}
          className={`mypage-filter-btn${workflowSubTab === 'bookmarked' ? ' mypage-filter-btn--active' : ''}`}
        >
          북마크
        </button>
        <button
          onClick={() => setWorkflowSubTab('posts')}
          className={`mypage-filter-btn${workflowSubTab === 'posts' ? ' mypage-filter-btn--active' : ''}`}
        >
          내가 쓴 글
        </button>
      </div>

      {/* 빈 상태 */}
      {workflowSubTab !== 'posts' && visibleWorkflows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '14px' }}>
          {workflowSubTab === 'mine' ? '생성한 워크플로우가 없습니다.' : '저장한 워크플로우가 없습니다.'}
        </div>
      )}
      {workflowSubTab === 'posts' && myPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '14px' }}>
          작성한 글이 없습니다.
        </div>
      )}

      {/* 워크플로우 카드 */}
      {workflowSubTab !== 'posts' && visibleWorkflows.map(wf => (
        <div
          key={wf.id}
          className="mypage-workflow-card"
          onClick={() => setSelectedWorkflow({ id: wf.id, isBookmarked: workflowSubTab === 'bookmarked' })}
          style={{ cursor: 'pointer' }}
        >
          <div className="mypage-workflow-card-header">
            <span className="mypage-workflow-label">
             {wf.title}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteWorkflow(wf.id); }}
              className="mypage-workflow-delete-btn"
            >
              삭제
            </button>
          </div>

          {wf.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {wf.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', fontWeight: '600', background: '#ede9fe', color: '#7b40db', padding: '3px 10px', borderRadius: '20px' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mypage-workflow-tools">
            {wf.tools.map((tool, index) => (
              <div key={index} className="mypage-tool-item">
                <div className="mypage-tool-card">
                  <div className="mypage-tool-img-box">
                    {tool.thumbnail ? (
                      <img src={tool.thumbnail} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={`https://www.google.com/s2/favicons?domain=${tool.name.toLowerCase().replace(/\s/g, '')}.com&sz=64`} alt={tool.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    )}
                  </div>
                  <p className="mypage-tool-name">{tool.name}</p>
                </div>
                {index < wf.tools.length - 1 && <span className="mypage-tool-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 내가 쓴 글 */}
    {workflowSubTab === 'posts' && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {myPosts.map(post => (
        <div
            key={post.id}
            className="mypage-post-card"
            onClick={() => navigate(`/community/${post.id}`)}
            style={{ cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'center' }}
        >
            {post.thumbnail_url && (
            <img
                src={post.thumbnail_url}
                alt={post.title}
                style={{ width: '140px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
            />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: 'block', fontSize: '15px', color: '#1e293b', marginBottom: '7px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.title}
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                <span>{post.view_count || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span style={{ color: '#ef4444', fontSize: '12px' }}>{post.like_count || 0}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </span>
            </div>
            </div>
        </div>
        ))}
    </div>
    )}
    </div>
  );
};

export default WorkflowSection;