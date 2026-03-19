import { useState, useRef, useEffect } from 'react';
import { updateProfile, getMe } from '../api/users'; 
import supabase from '../config/supabase';
import useAuthStore from '../store/authStore';
import ProfileSection from '../components/user/ProfileSection';
import PasswordSection from '../components/user/PasswordSection';
import AccountSection from '../components/user/AccountSection';

export default function MyPage() {
  const { user,updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [workflowSubTab, setWorkflowSubTab] = useState('mine'); // ⭐ 하위 탭 상태 추가
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

  const mockWorkflows = [
    { id: 1, title: 'Workflow Flow 1', tools: ['ChatGPT', 'Vrew', 'Canva AI', 'ElevenLabs'] },
    { id: 2, title: 'Workflow Flow 2', tools: ['ChatGPT', 'Vrew', 'Canva AI', 'ElevenLabs'] },
    { id: 3, title: 'Workflow Flow 3', tools: ['ChatGPT', 'Vrew', 'Canva AI', 'ElevenLabs'] },
    { id: 4, title: 'Workflow Flow 4', tools: ['ChatGPT', 'Vrew', 'Canva AI', 'ElevenLabs'] },
  ];

  // ⭐ 퍼가요(북마크) 목데이터 추가
  // ⭐ 퍼가요(북마크) 목데이터를 4개로 늘렸습니다.
  const bookmarkedWorkflows = [
    { id: 101, title: '다른 사용자의 레시피 1', tools: ['Midjourney', 'Photoshop'] },
    { id: 102, title: '다른 사용자의 레시피 2', tools: ['Claude', 'Python', 'GitHub'] },
    { id: 103, title: '다른 사용자의 레시피 3', tools: ['ChatGPT', 'Notion', 'Slack'] },
    { id: 104, title: '다른 사용자의 레시피 4', tools: ['Stable Diffusion', 'ControlNet', 'Lama Cleaner'] },
  ];

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
        nickname: user.nickname 
      });

      if (res.status === 200 || res.status === 201 || res.data?.success) {
        
        updateUser({ profile_url: newProfileUrl });
        alert('프로필 사진이 성공적으로 저장되었습니다! 😎');
      }
    } catch (err) {
      console.error("사진 업로드 중 발생한 에러:", err);
      const errorMsg = err.response?.data?.message || err.message || "";
      alert(errorMsg.includes("403") || errorMsg.includes("인증") 
        ? "세션이 만료되었습니다. 다시 로그인 후 시도해주세요." 
        : "사진 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'Pretendard' }}>
      
      {/* 1. 상단 프로필 요약 카드 */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '30px', borderRadius: '24px', backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eee' }}>
              <img 
                src={user?.profile_url || 'https://placehold.co/90'} 
                alt="profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              />
            </div>
            <div onClick={handleImageClick} style={{ position: 'absolute', bottom: '0px', right: '0px', backgroundColor: '#9c88ff', borderRadius: '50%', padding: '6px', display: 'flex', border: '2px solid #fff', zIndex: 10, cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>EDIT</span>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>{user?.nickname || '레시피마스터'}</h2>
            <p style={{ margin: '4px 0', color: '#94a3b8', fontSize: '14px' }}>{user?.email || 'user@example.com'}</p>
            <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', color: '#6366f1', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              🪄 레시피 작성자
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', overflow: 'hidden' }}>
            <div style={{ padding: '10px 20px', textAlign: 'center', minWidth: '90px', borderRight: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>12</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>내 워크플로우</p>
            </div>
            <div style={{ padding: '10px 20px', textAlign: 'center', minWidth: '90px' }}>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '20px', color: '#1e293b' }}>48</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>북마크</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '5px', width: '181px', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{ 
                flex: 1, padding: '8px 0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                border: '1px solid #e2e8f0', backgroundColor: activeTab !== 'workflows' ? '#fff' : '#f8fafc',
                color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
              }}
            >
              👤 기본 정보
            </button>
            <button 
              onClick={() => setActiveTab('workflows')}
              style={{ 
                flex: 1, padding: '8px 0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', 
                border: 'none', backgroundColor: activeTab === 'workflows' ? '#7a65e0' : '#9c88ff', color: '#fff' 
              }}
            >
              내 워크플로우
            </button>
          </div>
        </div>
      </div>

      {activeTab !== 'workflows' && (
        <div style={{ display: 'flex', gap: '10px', padding: '6px', backgroundColor: '#f1f5f9', borderRadius: '12px', marginBottom: '30px' }}>
          {[
            { id: 'profile', label: '기본 정보' },
            { id: 'password', label: '보안 설정' },
            { id: 'account', label: '계정 관리' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                backgroundColor: activeTab === tab.id ? '#9c88ff' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                transition: '0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        {activeTab === 'profile' && <ProfileSection user={{...user, profile_url: user?.profile_url || 'https://placehold.co/32'}} />}
        {activeTab === 'password' && <PasswordSection />}
        {activeTab === 'account' && <AccountSection />}
        
        {activeTab === 'workflows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {/* ⭐ 클릭 시 상태 변경 로직 추가 */}
                <button 
                  onClick={() => setWorkflowSubTab('mine')}
                  style={{ 
                    padding: '8px 20px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                    backgroundColor: workflowSubTab === 'mine' ? '#9c88ff' : '#e2e8f0', 
                    color: workflowSubTab === 'mine' ? '#fff' : '#64748b' 
                  }}
                >
                  내 워크플로우
                </button>
                <button 
                  onClick={() => setWorkflowSubTab('bookmarked')}
                  style={{ 
                    padding: '8px 20px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                    backgroundColor: workflowSubTab === 'bookmarked' ? '#9c88ff' : '#e2e8f0', 
                    color: workflowSubTab === 'bookmarked' ? '#fff' : '#64748b' 
                  }}
                >
                  저장한 워크플로우
                </button>
            </div>
            
            {/* ⭐ 선택된 탭에 따라 데이터 필터링 렌더링 */}
            {(workflowSubTab === 'mine' ? mockWorkflows : bookmarkedWorkflows).map((wf) => (
              <div key={wf.id} style={{ padding: '30px', borderRadius: '20px', border: '1px solid #f1f5f9', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#9c88ff' }}>
                      {workflowSubTab === 'mine' ? 'MY WORKFLOW' : 'BOOKMARKED RECIPE'}
                    </span>
                    <button style={{ padding: '6px 16px', backgroundColor: '#9c88ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>사용</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', overflowX: 'auto' }}>
                    {wf.tools.map((tool, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '60px', height: '60px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #eee', marginBottom: '8px' }}></div>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>{tool}</p>
                                <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>기능 설명</p>
                            </div>
                            {index < wf.tools.length - 1 && <span style={{ color: '#e2e8f0', fontSize: '20px' }}>→</span>}
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