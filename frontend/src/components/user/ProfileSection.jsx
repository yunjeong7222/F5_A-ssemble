import { useState, useEffect } from 'react';
import { updateProfile } from '../../api/users';
import useAuthStore from '../../store/authStore';

export default function ProfileSection() {
  const { user, updateUser } = useAuthStore();
  
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState('none');

  // 성공 알림 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 엔터 키를 누르면 모달이 닫히는 로직 추가
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen && e.key === 'esc') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (!nickname) {
      setNicknameStatus('none');
      return;
    }
    setNicknameStatus(nickname.length >= 2 ? 'ok' : 'error');
  }, [nickname]);

  useEffect(() => {
  if (user) {
    setNickname(user.nickname || '');
    setBio(user.bio || '');
  }
}, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!nickname) {
      // alert('닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile({ 
        email: user?.email,
        nickname, 
        bio,
        profile_url: user?.profile_url
      });

      if (res.data.success) {
        updateUser(res.data.data); 
        // ✅ alert 대신 모달창 띄우기
        setIsModalOpen(true);
        setNickname('');
        setBio('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('닉네임')) setNicknameStatus('error');
      alert('저장 실패: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyle = (status) => ({
    width: '100%', padding: '15px', borderRadius: '12px', 
    boxSizing: 'border-box', fontSize: '14px', outline: 'none', 
    backgroundColor: '#fff', transition: 'all 0.2s',
    border: `2px solid ${status === 'ok' ? '#10b981' : status === 'error' ? '#ef4444' : '#e2e8f0'}`
  });

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto', padding: '20px 0' }}>
      <h2 style={{ textAlign: 'left', fontSize: '18px', marginBottom: '30px' }}>기본 정보 수정</h2>
      
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>이메일</label>
          <input 
            type="email"
            style={{ 
              width: '100%', padding: '15px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', 
              color: '#94a3b8', cursor: 'not-allowed', outline: 'none'
            }} 
            value={user?.email || ''} 
            readOnly 
          />
        </div>

        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>닉네임</label>
          <input 
            style={getButtonStyle(nicknameStatus)} 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            placeholder="수정할 닉네임을 입력하세요"
          />
          {nicknameStatus === 'ok' && <p style={{ fontSize: '11px', marginTop: '5px', color: '#10b981', fontWeight: 'bold' }}>멋진 닉네임이네요!</p>}
        </div>

        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>자기소개</label>
          <textarea 
            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '120px', resize: 'none', outline: 'none' }} 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            placeholder="새로운 자기소개를 적어주세요."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', padding: '18px', borderRadius: '15px', border: 'none', 
            backgroundColor: loading ? '#cbd5e1' : '#9c88ff', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
          }}
        >
          {loading ? '저장 중...' : '정보 업데이트'}
        </button>
      </form>

      {/* ✅ 수정 완료 알림 모달 UI */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '320px' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>✨</div>
            <h3 style={{ marginBottom: '10px', fontWeight: '800' }}>수정 완료!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px', lineHeight: '1.5' }}>
              회원 정보가 성공적으로<br/>변경되었습니다.
            </p>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                backgroundColor: '#9c88ff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' 
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}