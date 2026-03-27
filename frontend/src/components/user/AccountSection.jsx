import { useState } from 'react';
import { deleteAccount } from '../../api/users';
import useAuthStore from '../../store/authStore';
import '../../styles/mypage.css';

export default function AccountSection({ workflowCount = 0, bookmarkCount = 0 }) {
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 버튼 활성화 조건: '동의합니다' 입력 + 비밀번호 입력
  const isDeleteEnabled = password.length > 0;

  const openModal = () => {
    setPassword('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPassword('');
    setIsModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteEnabled) return;

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

  return (
    <div className="account-section">

      {/* 1. 탈퇴 전 확인 박스 */}
      <div className="account-info-box">
        <h3>탈퇴 전 확인해주세요</h3>
        <ul className="account-info-list">
          <li>✅ 작성한 워크플로우 {workflowCount}개가 모두 삭제돼요</li>
          <li>✅ 북마크한 {bookmarkCount}개 워크플로우 목록이 사라져요</li>
          <li>✅ 작성한 댓글과 평점이 모두 삭제돼요</li>
        </ul>
      </div>

      {/* 2. 경고 및 탈퇴 버튼 박스 */}
      <div className="account-warning-box">
        <div className="account-warning-header">
          <span className="account-warning-icon">⚠️</span>
          <div>
            <h3 className="account-warning-title">계정 영구 삭제</h3>
            <p className="account-warning-subtitle">이 작업은 되돌릴 수 없어요</p>
          </div>
        </div>
        <button className="account-delete-trigger-btn" onClick={openModal}>
          계정 영구 삭제하기
        </button>
      </div>

      {/* 3. 회원 탈퇴 확인 모달 */}
      {isModalOpen && (
        <div className="account-modal-overlay">
          <div className="account-modal-content">
            <h3 className="account-modal-title">정말 우리를 떠나시나요?</h3>

            <div className="account-modal-desc-wrapper">
              <p className="account-modal-desc">
                지금까지 쌓아오신 <b>소중한 기록들</b>이 <br />
                모두 사라지게 됩니다. <br />
                <span className="account-modal-warning-badge">⚠️ 복구 절대 불가능</span>
              </p>
            </div>

            {/* 비밀번호 입력 */}
            <input
              type="password"
              className="account-modal-input account-modal-input--password"
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

            <div className="account-modal-btns">
              <button className="account-modal-cancel-btn" onClick={closeModal}>
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!isDeleteEnabled || loading}
                className={`account-modal-delete-btn${!isDeleteEnabled ? ' account-modal-delete-btn--disabled' : ''}`}
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