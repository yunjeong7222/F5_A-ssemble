import { useState, useEffect } from 'react';
import { updateProfile } from '../../api/users';
import useAuthStore from '../../store/authStore';
import '../../styles/mypage.css';

export default function ProfileSection() {
  const { user, updateUser } = useAuthStore();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState('none');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen && e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // 닉네임 유효성 실시간 체크
  useEffect(() => {
    if (!nickname) {
      setNicknameStatus('none');
      return;
    }
    setNicknameStatus(nickname.length >= 2 ? 'ok' : 'error');
  }, [nickname]);

  // 유저 정보로 초기값 세팅
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nickname) return;

    setLoading(true);
    try {
      const res = await updateProfile({ 
        email: user?.email,
        nickname,
        bio,
        profile_url: user?.profile_url,
      });

      if (res.data.success) {
        updateUser(res.data.data);
        alert('회원 정보가 성공적으로 변경되었습니다.');
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

  // 닉네임 input className 결정
  const nicknameInputClass = [
    'profile-input',
    nicknameStatus === 'ok'    ? 'profile-input--ok'    : '',
    nicknameStatus === 'error' ? 'profile-input--error' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="profile-section">
      <h2 className="profile-section-title">기본 정보 수정</h2>

      <form onSubmit={handleSave}>

        {/* 이메일 (읽기 전용) */}
        <div className="profile-form-group">
          <label className="profile-label">이메일</label>
          <input
            type="email"
            className="profile-input profile-input--readonly"
            value={user?.email || ''}
            readOnly
          />
        </div>

        {/* 닉네임 */}
        <div className="profile-form-group">
          <label className="profile-label profile-label--dark">닉네임</label>
          <input
            className={nicknameInputClass}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="수정할 닉네임을 입력하세요"
          />
          {nicknameStatus === 'ok' && (
            <p className="profile-input-hint">Good!</p>
          )}
        </div>

        {/* 자기소개 */}
        <div className="profile-form-group">
          <label className="profile-label profile-label--dark">자기소개</label>
          <textarea
            className="profile-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="새로운 자기소개를 적어주세요."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`profile-submit-btn${loading ? ' profile-submit-btn--loading' : ''}`}
        >
          {loading ? '저장 중...' : '정보 업데이트'}
        </button>
      </form>
    </div>
  );
}