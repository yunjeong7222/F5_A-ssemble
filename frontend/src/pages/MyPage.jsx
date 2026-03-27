import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateProfile, getMe } from '../api/users';
import { getMyBookmarks } from '../api/workflowBookmarks'; 
import supabase from '../config/supabase';
import useAuthStore from '../store/authStore';
import ProfileSection from '../components/user/ProfileSection';
import PasswordSection from '../components/user/PasswordSection';
import AccountSection from '../components/user/AccountSection';
import WorkflowSection from '../components/user/WorkflowSection';
import { fetchMyWorkflows } from '../api/workflows';
import { getPosts } from '../api/posts';
import '../styles/mypage.css';

export default function MyPage() {
  const { user, updateUser } = useAuthStore();
  const [myWorkflows, setMyWorkflows] = useState([]);
  const [bookmarkedWorkflows, setBookmarkedWorkflows] = useState([]);
  const [activeTab, setActiveTab] = useState('workflows');
  const fileInputRef = useRef(null);
  const [myPosts, setMyPosts] = useState([]);
  const [workflowSubTab, setWorkflowSubTab] = useState('mine');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab === 'posts') {
      setActiveTab('workflows');
      setWorkflowSubTab('posts');
    }
  }, []);

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
  }, [updateUser]);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const res = await fetchMyWorkflows();
        const list = res.data.data || [];
        const parsed = list.map(wf => ({
          id: wf.id,
          title: wf.title,
          tools: wf.tools,
          tags : wf.tags || [],
        }));
        setMyWorkflows(parsed);
      } catch (err) {
        console.error('워크플로우 불러오기 실패:', err);
      }
    };
    fetchWorkflowData();
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await getPosts({ user_id: 'me' });
        setMyPosts(res.data || []);
      } catch (err) {
        console.error('내 글 불러오기 실패:', err);
      }
    };
    fetchMyPosts();
  }, []);

  useEffect(() => {
  const fetchBookmarks = async () => {
    try {
      const res = await getMyBookmarks();
      setBookmarkedWorkflows(res.data.data || []);
    } catch (err) {
      console.error('북마크 불러오기 실패:', err);
    }
  };
  fetchBookmarks();
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
        alert('프로필 사진이 성공적으로 저장되었습니다!');
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

  const subTabs = [
    { id: 'profile',  label: '기본 정보' },
    { id: 'password', label: '보안 설정' },
    { id: 'account',  label: '계정 관리' },
  ];

  return (
    <div className="mypage-wrapper">

      {/* 1. 상단 프로필 요약 카드 */}
      <div className="mypage-profile-card">
        <div className="mypage-profile-left">

          <div className="mypage-avatar-container">
            <div className="mypage-avatar-img-wrapper">
              <img
                src={user?.profile_url || 'https://placehold.co/90'}
                alt="profile"
                className="mypage-avatar-img"
              />
            </div>
            <div className="mypage-avatar-edit-btn" onClick={handleImageClick}>
              <span className="mypage-avatar-edit-label">+</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <h2 className="mypage-profile-name">{user?.nickname || '레시피마스터'}</h2>
            <p className="mypage-profile-email">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <div className="mypage-profile-right">
          <div className="mypage-stats-box">
            <div className="mypage-stat-item mypage-stat-item--border">
              <p className="mypage-stat-number">{myWorkflows.length}</p>
              <p className="mypage-stat-label">내 워크플로우</p>
            </div>
            <div className="mypage-stat-item mypage-stat-item--border">
              <p className="mypage-stat-number">{bookmarkedWorkflows.length}</p>
              <p className="mypage-stat-label">북마크</p>
            </div>
            <div className="mypage-stat-item">
              <p className="mypage-stat-number">{myPosts.length}</p>
              <p className="mypage-stat-label">내가 쓴 글</p>
            </div>
          </div>

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

      {/* 2. 서브 탭 바 */}
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
        {activeTab === 'account'  && <AccountSection 
          workflowCount={myWorkflows.length}
          bookmarkCount={bookmarkedWorkflows.length}
        />}
        {activeTab === 'workflows' && (
          <WorkflowSection
            myWorkflows={myWorkflows}
            setMyWorkflows={setMyWorkflows}
            bookmarkedWorkflows={bookmarkedWorkflows}
            setBookmarkedWorkflows={setBookmarkedWorkflows}
            myPosts={myPosts}
            setMyPosts={setMyPosts}
            workflowSubTab={workflowSubTab}
            setWorkflowSubTab={setWorkflowSubTab}
          />
        )}
      </div>
    </div>
  );
}