import {useState} from 'react';
import {deleteAccount} from '../../api/users';
import useAuthStore from '../../store/authStore';
import '../../styles/mypage.css';
import Alert from '../../utils/alert';

export default function AccountSection({workflowCount = 0, bookmarkCount = 0}) {
    const {user, logout} = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        const {value: password} = await Alert.fire({
            title: '정말 탈퇴 하시겠습니까?',
            html: `
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;line-height:1.5;">
          지금까지 쌓아오신<br/><b>소중한 기록들</b>이<br/>모두 사라지게 됩니다.<br/>
        </p>
        <p style="padding:10px 0;">탈퇴하시려면 비밀번호를 입력하세요</p>
      `,
            input: 'password',
            inputPlaceholder: '비밀번호 입력',
            inputAttributes: {autocomplete: 'new-password'},
            showCancelButton: true,
            confirmButtonText: '탈퇴',
            cancelButtonText: '취소',
            confirmButtonColor: '#ef4444',
            preConfirm: (pw) => {
                if (!pw) {
                    Alert.showValidationMessage('비밀번호를 입력해주세요.');
                    return false;
                }
                return pw;
            },
        });

        if (!password) return;

        setLoading(true);
        try {
            await deleteAccount({password});
            await Alert.fire({
                text: '계정이 영구 삭제되었습니다. 그동안 이용해 주셔서 감사합니다.',
                showConfirmButton: false,
                timer: 2000,
            });
            logout();
        } catch (err) {
            Alert.fire({
                text: '탈퇴 실패: ' + (err.response?.data?.message || err.message),
                showConfirmButton: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-section">
            <div className="profile-layout">
                {/* 왼쪽 안내 */}
                <div className="profile-info">
                    <h2 className="profile-section-title">계정 관리</h2>
                    <p className="profile-info-desc">계정 탈퇴 시 모든 데이터가 영구 삭제돼요.</p>
                    <ul className="profile-tip-list">
                        <li>작성한 워크플로우 {workflowCount}개가 모두 삭제돼요</li>
                        <li>북마크한 {bookmarkCount}개 워크플로우 목록이 사라져요</li>
                        <li>작성한 댓글과 평점이 모두 삭제돼요</li>
                        <li>이 작업은 되돌릴 수 없어요</li>
                    </ul>
                </div>

                {/* 오른쪽 */}
                <div className="account-warning-box">
                    <div className="account-warning-header">
                        <span className="account-warning-icon">⚠️</span>
                        <div>
                            <h3 className="account-warning-title">계정 탈퇴</h3>
                            <p className="account-warning-subtitle">이 작업은 되돌릴 수 없어요</p>
                        </div>
                    </div>
                    <button className="account-delete-trigger-btn" onClick={handleDeleteAccount} disabled={loading}>
                        {loading ? '처리 중...' : '계정 탈퇴하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
