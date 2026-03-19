import { useState } from 'react';
import { deleteAccount } from '../../api/users';
import useAuthStore from '../../store/authStore';

export default function AccountSection() {
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [agreedText, setAgreedText] = useState(''); // ⭐ '동의합니다' 입력 상태 추가
  const [loading, setLoading] = useState(false);

  // ✅ 모달을 열 때 모든 입력 초기화
  const openModal = () => {
    setPassword('');
    setAgreedText(''); // 추가
    setIsModalOpen(true);
  };

  // ✅ 모달을 닫을 때 모든 입력 초기화
  const closeModal = () => {
    setPassword('');
    setAgreedText(''); // 추가
    setIsModalOpen(false);
  };

  // ⭐ 버튼 활성화 조건: '동의합니다'가 정확히 입력되고 비밀번호가 입력되었을 때
  const isDeleteEnabled = agreedText === '동의합니다' && password.length > 0;

  const handleDeleteAccount = async () => {
    if (!isDeleteEnabled) return; // 조건 미달 시 실행 방지

    setLoading(true);
    try {
      await deleteAccount({ password });
      alert('계정이 영구 삭제되었습니다. 그동안 이용해 주셔서 감사합니다.');
      logout(); 
    } catch (err) {
      alert('탈퇴 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  // 스타일 정의 (기존 유지)
  const infoBoxStyle = { backgroundColor: '#fcfdfe', border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', marginBottom: '25px' };
  const warningBoxStyle = { border: '1px solid #ef4444', borderRadius: '15px', padding: '25px', backgroundColor: '#fff5f5' };
  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };
  const modalContentStyle = {
    backgroundColor: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px'
  };
  const inputStyle = { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '10px', fontSize: '14px', outline: 'none', textAlign: 'center' };
  const buttonStyle = { flex: 1, padding: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      
      {/* 1. 탈퇴 전 확인 박스 */}
      <div style={infoBoxStyle}>
        <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>📋 탈퇴 전 확인해주세요</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '2' }}>
          <li>✍️ 작성한 레시피 {user?.recipe_count || 0}개가 모두 삭제돼요</li>
          <li>📌 북마크한 {user?.bookmark_count || 0}개 레시피 목록이 사라져요</li>
          <li>💬 작성한 댓글과 평점이 모두 삭제돼요</li>
          <li>🔄 탈퇴 후 30일 내에 재가입 시 복구 가능해요</li>
        </ul>
      </div>

      {/* 2. 경고 및 탈퇴 버튼 박스 */}
      <div style={warningBoxStyle}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '15px', marginBottom: '20px' }}>
          <span style={{ fontSize: '24px', color: '#ef4444' }}>⚠️</span>
          <div>
            <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', color: '#ef4444' }}>계정 영구 삭제</h3>
            <p style={{ fontSize: '13px', margin: 0, color: '#ef4444' }}>이 작업은 되돌릴 수 없어요</p>
          </div>
        </div>
        <button 
          onClick={openModal}
          style={{ 
            width: '100%', padding: '18px', borderRadius: '12px', border: '1px solid #ef4444', 
            backgroundColor: 'transparent', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' 
          }}
        >
          계정 영구 삭제하기
        </button>
      </div>



      {/* 3. 회원 탈퇴 확인 모달 */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ backgroundColor: '#fee2e2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <span style={{ fontSize: '30px' }}>🗑️</span>
            </div>
            
            <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', fontWeight: '800' }}>정말 우리를 떠나시나요? 😢</h3>
            
            {/* ⭐ 제안 2 스타일 적용: 안내 문구 영역 */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8', margin: '0 0 10px 0', wordBreak: 'keep-all' }}>
                지금까지 쌓아오신 <b style={{ color: '#1e293b' }}>소중한 기록들</b>이 <br />
                모두 사라지게 됩니다. <br />
                <span style={{ 
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '2px 10px',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  fontSize: '11px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  ⚠️ 복구 절대 불가능
                </span>
              </p>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginTop: '15px' }}>
                정말 삭제하시려면 "동의합니다"를 입력해주세요.
              </p>
            </div>

            {/* ⭐ 동의 문구 입력칸 */}
            <input 
              type="text"
              style={inputStyle}
              value={agreedText}
              onChange={(e) => setAgreedText(e.target.value)}
              placeholder="동의합니다"
              autoComplete="off"
            />

            {/* 비밀번호 입력 input */}
            <input 
              type="password"
              style={{ ...inputStyle, marginBottom: '20px' }}
              value={password}
              autoComplete="new-password" 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isDeleteEnabled && !loading) {
                  handleDeleteAccount();
                }
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={closeModal}
                style={{ ...buttonStyle, backgroundColor: '#f1f5f9', color: '#64748b' }}
              >
                취소
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={!isDeleteEnabled || loading}
                style={{ 
                  ...buttonStyle, 
                  backgroundColor: isDeleteEnabled ? '#ef4444' : '#e2e8f0', 
                  color: isDeleteEnabled ? 'white' : '#94a3b8',
                  cursor: isDeleteEnabled ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? '처리 중...' : '영구 삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}