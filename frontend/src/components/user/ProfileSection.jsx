import {useState, useEffect} from 'react';
import {updateProfile} from '../../api/users';
import useAuthStore from '../../store/authStore';
import '../../styles/Mypage.css';
import Alert from '../../utils/alert';

export default function ProfileSection() {
    const {user, updateUser} = useAuthStore();

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
                Alert.fire({
                    text: '회원 정보가 수정되었습니다.',
                    showConfirmButton: false,
                    timer: 1500,
                });
                setNickname('');
                setBio('');
            }
        } catch (err) {
            const msg = err.response?.data?.message || '';
            if (msg.includes('닉네임')) setNicknameStatus('error');
            Alert.fire({
                text: '저장 실패: ' + msg,
                showConfirmButton: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // 닉네임 input className 결정
    const nicknameInputClass = [
        'profile-input',
        nicknameStatus === 'ok' ? 'profile-input--ok' : '',
        nicknameStatus === 'error' ? 'profile-input--error' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="profile-section">
            <div className="profile-layout">
                {/* 왼쪽 안내 */}
                <div className="profile-info">
                    <h2 className="profile-section-title">기본 정보</h2>
                    <p className="profile-info-desc">프로필 정보를 수정할 수 있어요.</p>
                    <ul className="profile-tip-list">
                        <li>이메일은 변경이 불가능해요</li>
                        <li>닉네임은 2자 이상이어야 해요</li>
                        <li>한 줄 소개로 나만의 스타일을 알려보세요</li>
                    </ul>
                </div>

                {/* 오른쪽 폼 */}
                <form onSubmit={handleSave}>
                    <div className="profile-form-group form-first">
                        <label className="profile-label">이메일</label>
                        <input
                            type="email"
                            className="profile-input profile-input--readonly"
                            value={user?.email || ''}
                            readOnly
                        />
                    </div>
                    <div className="profile-form-group">
                        <label className="profile-label">닉네임</label>
                        <input
                            className={nicknameInputClass}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="수정할 닉네임을 입력하세요"
                        />
                        {nicknameStatus === 'ok' && <p className="profile-input-hint">✓ 사용 가능한 닉네임입니다.</p>}
                    </div>
                    <div className="profile-form-group">
                        <label className="profile-label">한 줄 소개</label>
                        <textarea
                            className="profile-textarea"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="나를 한 줄로 소개해보세요"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`profile-submit-btn${loading ? ' profile-submit-btn--loading' : ''}`}
                    >
                        {loading ? '저장 중...' : '정보 수정'}
                    </button>
                </form>
            </div>
        </div>
    );
}
