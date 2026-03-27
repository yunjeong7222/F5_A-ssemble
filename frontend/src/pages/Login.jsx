import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, resetPassword } from '../api/auth';
import { updateProfile } from '../api/users';
import useAuthStore from '../store/authStore';
import '../styles/auth.css';

/* ── 임시 비밀번호 생성 유틸 ── */
const generateTempPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pw = '';
  for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw + '!';
};

/* ════════════════════════════════════════
   비밀번호 찾기 모달
════════════════════════════════════════ */
const FindPasswordModal = ({ onClose }) => {
  const [step, setStep]             = useState(1);
  const [email, setEmail]           = useState('');
  const [nickname, setNickname]     = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email && !nickname) { setErrorMsg('이메일과 닉네임을 입력해주세요.'); return; }
    if (!email)               { setErrorMsg('이메일을 입력해주세요.'); return; }
    if (!isEmailValid(email)) { setErrorMsg('올바른 이메일 형식이 아닙니다.'); return; }
    if (!nickname)            { setErrorMsg('닉네임을 입력해주세요.'); return; }

    setIsLoading(true);
    try {
      const newPassword = generateTempPassword();
      await resetPassword({ email, nickname, newPassword });
      setTempPassword(newPassword);
      setStep(2);
    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message;
      if (status === 401) {
        setErrorMsg('이메일 또는 닉네임이 일치하는 계정이 없습니다.');
      } else {
        setErrorMsg(msg || '오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-body">
          {step === 1 && (
            <>
              <h3 className="auth-modal-title">비밀번호 찾기</h3>
              <p className="auth-modal-desc">
                가입 시 사용한 <b>이메일과 닉네임</b>이<br />
                정확히 일치하면 임시 비밀번호를 발급해드립니다.
              </p>
              <input
                type="email"
                className={`auth-input${errorMsg && !email ? ' auth-input--error' : ''}`}
                style={{ marginBottom: 10 }}
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              />
              <input
                type="text"
                className={`auth-input${errorMsg && !nickname ? ' auth-input--error' : ''}`}
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); setErrorMsg(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSubmit(); }}
              />
              <div style={{ minHeight: 20, marginTop: 8 }}>
                {errorMsg && (
                  <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 700, margin: 0 }}>
                    {errorMsg}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="auth-modal-title">임시 비밀번호 발급 완료</h3>
              <div className="auth-modal-result-box">
                <p className="auth-modal-result-warning">⚠️ 로그인 후 반드시 비밀번호를 변경해주세요!</p>
                <p className="auth-modal-result-label">발급된 임시 비밀번호</p>
                <p className="auth-modal-result-value">{tempPassword}</p>
              </div>
              <p className="auth-modal-desc" style={{ margin: 0 }}>
                임시 비밀번호로 로그인 후<br />
                마이페이지 → 보안 설정에서 변경해주세요.
              </p>
            </>
          )}
        </div>

        <div className="auth-modal-footer">
          {step === 1 && (
            <>
              <button className="auth-modal-btn-cancel" onClick={onClose}>취소</button>
              <button className="auth-modal-btn-confirm" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? '확인 중...' : '임시 비번 발급'}
              </button>
            </>
          )}
          {step === 2 && (
            <button className="auth-modal-btn-confirm" style={{ flex: 1 }} onClick={onClose}>
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   로그인 페이지
════════════════════════════════════════ */
const Login = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [message, setMessage]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ProfileSetup에서 넘어온 profileUrl (있을 수도, 없을 수도 있음)
  const profileUrl = location.state?.profileUrl || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email)    { setMessage('이메일을 입력해주세요.'); return; }
    if (!password) { setMessage('비밀번호를 입력해주세요.'); return; }

    setIsLoading(true);
    try {
      const res = await login({ email, password });
      const { accessToken, refreshToken, user } = res.data.data;

      // 스토어에 저장 (accessToken 생김)
      loginStore(user, accessToken, refreshToken);

      // ProfileSetup에서 넘어온 profileUrl이 있으면 DB에 저장
      if (profileUrl) {
        try {
          await updateProfile({ profile_url: profileUrl, nickname: user.nickname });
        } catch (err) {
          console.error('프로필 사진 저장 실패:', err);
          // 실패해도 로그인은 유지
        }
      }

      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인 정보를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--login">
      <h2 className="auth-page-title">로그인</h2>

      <form onSubmit={handleLogin} noValidate>

        <div className="auth-form-group">
          <input
            className="auth-input"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-form-group login-input-wrapper">
          <input
            className="auth-input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-forgot-row">
            <button
              type="button"
              className="login-forgot-link"
              onClick={() => setIsModalOpen(true)}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </div>

        <div className="auth-error-area">
          {message && <p className="auth-error-msg">{message}</p>}
        </div>

        <button type="submit" className="auth-btn-primary" disabled={isLoading}>
          {isLoading ? '로그인 중' : '로그인'}
        </button>

        <div className="auth-redirect">
          기존 회원이 아니신가요?
          <span className="auth-redirect-link" onClick={() => navigate('/signup')}>
            회원가입
          </span>
        </div>
      </form>

      {isModalOpen && <FindPasswordModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Login;