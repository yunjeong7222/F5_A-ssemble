import { useState, useEffect } from 'react';
import { updatePassword } from '../../api/users';

export default function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 상태 관리: 'none', 'weak'(빨간색), 'medium'(주황색), 'strong'(초록색)
  const [passwordLevel, setPasswordLevel] = useState('none');
  const [currentStatus, setCurrentStatus] = useState('none'); 
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ 실시간 비밀번호 강도 및 색상 로직 (숫자 제외)
  useEffect(() => {
    const hasSpecialOrUpper = /[A-Z]/.test(newPassword) || /[!@#$%^&*]/.test(newPassword);
    
    if (newPassword.length === 0) {
      setPasswordLevel('none');
    } else if (newPassword.length < 8) {
      setPasswordLevel('weak');    // 8자 미만: 빨간색
    } else if (newPassword.length >= 8 && !hasSpecialOrUpper) {
      setPasswordLevel('medium');  // 8자 이상: 주황색
    } else if (newPassword.length >= 8 && hasSpecialOrUpper) {
      setPasswordLevel('strong');  // 8자 이상 + 특수/대문자: 초록색
    }
  }, [newPassword]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordLevel === 'weak' || passwordLevel === 'none') {
      alert('새 비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setCurrentStatus('none');
    setErrorMessage('');

    try {
      await updatePassword({ currentPassword, newPassword });
      setCurrentStatus('success');
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordLevel('none');
    } catch (err) {
      setCurrentStatus('error');
      setErrorMessage(err.response?.data?.message || '현재 비밀번호가 틀렸거나 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 강도에 따른 색상 및 메시지 반환 함수
  const getLevelInfo = () => {
    switch (passwordLevel) {
      case 'weak': return { color: '#ef4444', text: '비밀번호가 짧음 (8자 이상)', width: '33.3%' };
      case 'medium': return { color: '#f59e0b', text: '보안 수준: 보통', width: '66.6%' };
      case 'strong': return { color: '#10b981', text: '보안 수준: 안전함', width: '100%' };
      default: return { color: '#e2e8f0', text: '', width: '0%' };
    }
  };

  const levelInfo = getLevelInfo();

  const inputBaseStyle = { 
    width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', 
    boxSizing: 'border-box', fontSize: '14px', outline: 'none', backgroundColor: '#fcfdfe',
    transition: 'all 0.2s'
  };

  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', textAlign: 'left', fontSize: '14px', color: '#334155' };

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto' }}>
      <form onSubmit={handleUpdatePassword}>
        {/* 현재 비밀번호 */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>현재 비밀번호</label>
          <input 
            type="password"
            style={{ 
              ...inputBaseStyle, 
              borderColor: currentStatus === 'error' ? '#ef4444' : currentStatus === 'success' ? '#10b981' : '#e2e8f0'
            }} 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력하세요"
          />
          {currentStatus === 'error' && <p style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left', marginTop: '6px' }}>{errorMessage}</p>}
        </div>

        {/* 새 비밀번호 */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>새 비밀번호</label>
          <input 
            type="password"
            style={inputBaseStyle} 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="새로운 비밀번호 입력"
          />
          
          {/* ✅ 실시간 강도 게이지 바 (이미지 스타일) */}
          <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ 
              width: levelInfo.width, 
              height: '100%', 
              backgroundColor: levelInfo.color, 
              transition: 'all 0.4s ease' 
            }} />
          </div>
          
          {/* ✅ 하단 상태 메시지 */}
          {newPassword && (
            <p style={{ color: levelInfo.color, fontSize: '12px', textAlign: 'left', marginTop: '8px', fontWeight: 'bold' }}>
              {levelInfo.text}
            </p>
          )}
        </div>

        {/* 새 비밀번호 확인 */}
        <div style={{ marginBottom: '35px' }}>
          <label style={labelStyle}>새 비밀번호 확인</label>
          <input 
            type="password" 
            style={{
              ...inputBaseStyle,
              borderColor: (confirmPassword && newPassword !== confirmPassword) ? '#ef4444' : '#e2e8f0'
            }} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="비밀번호 재입력" 
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p style={{ color: '#ef4444', fontSize: '12px', textAlign: 'left', marginTop: '6px' }}>새 비밀번호가 일치하지 않습니다.</p>
          )}
          {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
            <p style={{ color: '#10b981', fontSize: '12px', textAlign: 'left', marginTop: '6px' }}>비밀번호가 일치합니다.</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', padding: '18px', borderRadius: '15px', border: 'none', 
            backgroundColor: loading ? '#cbd5e1' : '#9c88ff', 
            color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
          }}
        >
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>
    </div>
  );
}