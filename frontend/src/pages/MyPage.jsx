import { useState, useRef, useEffect } from 'react';
import { updateProfile, getMe } from '../api/users';
import supabase from '../config/supabase';
import useAuthStore from '../store/authStore';
import ProfileSection from '../components/user/ProfileSection';
import PasswordSection from '../components/user/PasswordSection';
import AccountSection from '../components/user/AccountSection';
import { fetchMyWorkflows, deleteWorkflow } from '../api/workflows';
import '../styles/mypage.css';

export default function MyPage() {
  const { user, updateUser } = useAuthStore();
  const [myWorkflows, setMyWorkflows] = useState([]);
  const [bookmarkedWorkflows, setBookmarkedWorkflows] = useState([]);
  const [activeTab, setActiveTab] = useState('workflows');
  const [workflowSubTab, setWorkflowSubTab] = useState('mine');
  const fileInputRef = useRef(null);

  // 마운트 시 최신 유저 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        updateUser(res.data.data);
      } catch (err) {
        console.error('유저 정보 불러오기 실패:', err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const res = await fetchMyWorkflows();
        const list = res.data.data || [];

        const parsed = list.map(wf => ({
          id: wf.id,
          title: wf.title,
          tools: wf.tools,
        }));

        setMyWorkflows(parsed);
      } catch (err) {
        console.error('워크플로우 불러오기 실패:', err);
      }
    };
    fetchWorkflowData();
  }, []);

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newProfileUrl = data.publicUrl;

      const res = await updateProfile({
        profile_url: newProfileUrl,
        nickname: user.nickname,
      });

      if (res.status === 200 || res.status === 201 || res.data?.success) {
        updateUser({ profile_url: newProfileUrl });
        alert('프로필 사진이 성공적으로 저장되었습니다! 😎');
      }
    } catch (err) {
      console.error('사진 업로드 중 발생한 에러:', err);
      const errorMsg = err.response?.data?.message || err.message || '';
      alert(
        errorMsg.includes('403') || errorMsg.includes('인증')
          ? '세션이 만료되었습니다. 다시 로그인 후 시도해주세요.'
          : '사진 저장 중 문제가 발생했습니다.'
      );
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm('워크플로우를 삭제할까요?')) return;
    try {
      await deleteWorkflow(id);
      setMyWorkflows(prev => prev.filter(wf => wf.id !== id));
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const subTabs = [
    { id: 'profile',  label: '기본 정보' },
    { id: 'password', label: '보안 설정' },
    { id: 'account',  label: '계정 관리' },
  ];

  const visibleWorkflows = workflowSubTab === 'mine' ? myWorkflows : bookmarkedWorkflows;

  return (
    <div className="mypage-wrapper">

      {/* 1. 상단 프로필 요약 카드 */}
      <div className="mypage-profile-card">
        <div className="mypage-profile-left">

          {/* Avatar */}
          <div className="mypage-avatar-container">
            <div className="mypage-avatar-img-wrapper">
              <img
                src={user?.profile_url || 'https://placehold.co/90'}
                alt="profile"
                className="mypage-avatar-img"
              />
            </div>
            <div className="mypage-avatar-edit-btn" onClick={handleImageClick}>
              <span className="mypage-avatar-edit-label">EDIT</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          {/* Profile info */}
          <div>
            <h2 className="mypage-profile-name">{user?.nickname || '레시피마스터'}</h2>
            <p className="mypage-profile-email">{user?.email || 'user@example.com'}</p>
            <span className="mypage-profile-badge">🪄 레시피 작성자</span>
          </div>
        </div>

        {/* Right side */}
        <div className="mypage-profile-right">

          {/* Stats */}
          <div className="mypage-stats-box">
            <div className="mypage-stat-item mypage-stat-item--border">
              <p className="mypage-stat-number">{myWorkflows.length}</p>
              <p className="mypage-stat-label">내 워크플로우</p>
            </div>
            <div className="mypage-stat-item">
              <p className="mypage-stat-number">{bookmarkedWorkflows.length}</p>
              <p className="mypage-stat-label">북마크</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mypage-action-buttons">
            <button
              onClick={() => setActiveTab('profile')}
              className={`mypage-btn-info${activeTab === 'workflows' ? ' mypage-btn-info--faded' : ''}`}
            >
            기본 정보
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`mypage-btn-workflow${activeTab === 'workflows' ? ' mypage-btn-workflow--active' : ''}`}
            >
              내 워크플로우
            </button>
          </div>
        </div>
      </div>

      {/* 2. 서브 탭 바 (workflows가 아닐 때만 표시) */}
      {activeTab !== 'workflows' && (
        <div className="mypage-subtab-bar">
          {subTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mypage-subtab-btn${activeTab === tab.id ? ' mypage-subtab-btn--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 3. 콘텐츠 영역 */}
      <div className="mypage-content-box">

        {activeTab === 'profile'  && <ProfileSection user={{ ...user, profile_url: user?.profile_url || 'https://placehold.co/32' }} />}
        {activeTab === 'password' && <PasswordSection />}
        {activeTab === 'account'  && <AccountSection />}

        {activeTab === 'workflows' && (
          <div className="mypage-workflow-section">

            {/* 필터 탭 */}
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
                저장한 워크플로우
              </button>
            </div>

            {/* 워크플로우 카드 목록 */}
            {visibleWorkflows.map(wf => (
              <div key={wf.id} className="mypage-workflow-card">
                <div className="mypage-workflow-card-header">
                  <span className="mypage-workflow-label">
                    {workflowSubTab === 'mine' ? 'MY WORKFLOW' : 'BOOKMARKED RECIPE'}
                  </span>
                  <button
                    onClick={() => handleDeleteWorkflow(wf.id)}
                    className="mypage-workflow-delete-btn"
                  >
                    삭제
                  </button>
                </div>

                <div className="mypage-workflow-tools">
                  {wf.tools.map((tool, index) => (
                    <div key={index} className="mypage-tool-item">
                      <div className="mypage-tool-card">
                        <div className="mypage-tool-img-box">
                          {tool.thumbnail ? (
                            <img
                              src={tool.thumbnail}
                              alt={tool.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${tool.name.toLowerCase().replace(/\s/g, '')}.com&sz=64`}
                              alt={tool.name}
                              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                          )}
                        </div>
                        <p className="mypage-tool-name">{tool.name}</p>
                      </div>
                      {index < wf.tools.length - 1 && (
                        <span className="mypage-tool-arrow">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}