import {useState, useEffect} from 'react';
import {updatePassword} from '../../api/users';
import '../../styles/Mypage.css';
import Alert from '../../utils/alert';

export default function PasswordSection() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 'none' | 'weak' | 'medium' | 'strong'
    const [passwordLevel, setPasswordLevel] = useState('none');
    const [currentStatus, setCurrentStatus] = useState('none');
    const [errorMessage, setErrorMessage] = useState('');

    // 실시간 비밀번호 강도 계산
    useEffect(() => {
        const hasSpecialOrUpper = /[A-Z]/.test(newPassword) || /[!@#$%^&*]/.test(newPassword);

        if (newPassword.length === 0) {
            setPasswordLevel('none');
        } else if (newPassword.length < 8) {
            setPasswordLevel('weak');
        } else if (!hasSpecialOrUpper) {
            setPasswordLevel('medium');
        } else {
            setPasswordLevel('strong');
        }
    }, [newPassword]);

    const getLevelText = () => {
        switch (passwordLevel) {
            case 'weak':
                return '비밀번호가 짧음 (8자 이상)';
            case 'medium':
                return '보안 수준 : 보통';
            case 'strong':
                return '보안 수준 : 안전함';
            default:
                return '';
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (passwordLevel === 'weak' || passwordLevel === 'none') {
            Alert.fire({
                text: '비밀번호는 최소 8자 이상이어야 합니다.',
                showConfirmButton: '확인',
            });
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
            await updatePassword({currentPassword, newPassword});
            setCurrentStatus('success');
            Alert.fire({
                text: '비밀번호가 성공적으로 변경되었습니다.',
                showConfirmButton: '확인',
            });
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

    // 현재 비밀번호 input className
    const currentInputClass = [
        'password-input',
        currentStatus === 'error' ? 'password-input--error' : '',
        currentStatus === 'success' ? 'password-input--success' : '',
    ]
        .filter(Boolean)
        .join(' ');

    // 비밀번호 확인 input className
    const confirmInputClass = [
        'password-input',
        confirmPassword && newPassword !== confirmPassword ? 'password-input--error' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="password-section">
            <div className="profile-layout">
                {/* 왼쪽 안내 */}
                <div className="profile-info">
                    <h2 className="profile-section-title">비밀번호 변경</h2>
                    <p className="profile-info-desc">
                        주기적으로 비밀번호를 변경하면 계정을
                        <br />
                        안전하게 지킬 수 있어요.
                    </p>
                    <ul className="profile-tip-list">
                        <li>8자 이상 입력해주세요</li>
                        <li>대문자나 특수문자를 포함하면 더 안전해요</li>
                        <li>현재 비밀번호와 다르게 설정해주세요</li>
                    </ul>
                </div>

                {/* 오른쪽 폼 */}
                <form onSubmit={handleUpdatePassword}>
                    <div className="password-form-group form-first">
                        <label className="password-label">현재 비밀번호</label>
                        <input
                            type="password"
                            className={currentInputClass}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 비밀번호를 입력하세요"
                        />
                        {currentStatus === 'error' && <p className="password-error-text">{errorMessage}</p>}
                    </div>

                    <div className="password-form-group">
                        <label className="password-label">새 비밀번호</label>
                        <input
                            type="password"
                            className="password-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="새로운 비밀번호 입력"
                        />
                        <div className="password-strength-bar">
                            <div className={`password-strength-fill password-strength-fill--${passwordLevel}`} />
                        </div>
                        {newPassword && (
                            <p className={`password-status-text password-status-text--${passwordLevel}`}>
                                {getLevelText()}
                            </p>
                        )}
                    </div>

                    <div className="password-form-group password-form-group--last">
                        <label className="password-label">새 비밀번호 확인</label>
                        <input
                            type="password"
                            className={confirmInputClass}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="비밀번호 재입력"
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="password-match-text password-match-text--error">
                                새 비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                        {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                            <p className="password-match-text password-match-text--ok">비밀번호가 일치합니다.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`password-submit-btn${loading ? ' password-submit-btn--loading' : ''}`}
                    >
                        {loading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </form>
            </div>
        </div>
    );
}
