import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, checkDuplicate } from '../api/auth';
import '../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', nickname: '',
  });

  const [readStatus, setReadStatus] = useState({ terms: false, privacy: false, marketing: false });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState({
    email: null,       // null | 'ok' | 'dupe' | 'invalid' | 'checking'
    nickname: null,    // null | 'ok' | 'dupe' | 'checking'
    passwordMatch: null,
  });
  const [touched, setTouched] = useState({ email: false, nickname: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ id: '', title: '', body: '' });

  // 디바운스 타이머 ref
  const emailTimer   = useRef(null);
  const nicknameTimer = useRef(null);

  const isAllAgreed = readStatus.terms && readStatus.privacy && readStatus.marketing;
  const handleAllAgree = () => {
    const next = !isAllAgreed;
    setReadStatus({ terms: next, privacy: next, marketing: next });
  };

  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'var(--border)' };
    if (pwd.length < 8) return { score: 33, text: '비밀번호가 짧음 (8자 이상)', color: '#ef4444' };
    const hasUpperOrSpecial = /[A-Z]/.test(pwd) || /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    if (hasUpperOrSpecial) return { score: 100, text: '보안 수준: 안전함', color: 'var(--secondary)' };
    return { score: 66, text: '보안 수준: 보통', color: '#f59e0b' };
  };
  const strength = getPasswordStrength(formData.password);

  /* ── 이메일 실시간 중복 확인 (디바운스 300ms) ── */
  useEffect(() => {
    const email = formData.email;

    // 빈 값이면 상태 초기화
    if (!email) { setCheckStatus(prev => ({ ...prev, email: null })); return; }

    // 형식 오류면 서버 호출 없이 바로 invalid
    if (!isEmailValid(email)) {
      setCheckStatus(prev => ({ ...prev, email: 'invalid' }));
      return;
    }

    // 300ms 디바운스
    setCheckStatus(prev => ({ ...prev, email: 'checking' }));
    clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(async () => {
      try {
        const res = await checkDuplicate({ field: 'email', value: email });
        setCheckStatus(prev => ({
          ...prev,
          email: res.data.isDuplicate ? 'dupe' : 'ok',
        }));
      } catch {
        setCheckStatus(prev => ({ ...prev, email: null }));
      }
    }, 300);

    return () => clearTimeout(emailTimer.current);
  }, [formData.email]);

  /* ── 닉네임 실시간 중복 확인 (디바운스 300ms) ── */
  useEffect(() => {
    const nickname = formData.nickname;

    if (!nickname) { setCheckStatus(prev => ({ ...prev, nickname: null })); return; }
    if (nickname.length < 2) { setCheckStatus(prev => ({ ...prev, nickname: 'short' })); return; }

    setCheckStatus(prev => ({ ...prev, nickname: 'checking' }));
    clearTimeout(nicknameTimer.current);
    nicknameTimer.current = setTimeout(async () => {
      try {
        const res = await checkDuplicate({ field: 'nickname', value: nickname });
        setCheckStatus(prev => ({
          ...prev,
          nickname: res.data.isDuplicate ? 'dupe' : 'ok',
        }));
      } catch {
        setCheckStatus(prev => ({ ...prev, nickname: null }));
      }
    }, 300);

    return () => clearTimeout(nicknameTimer.current);
  }, [formData.nickname]);

  /* ── 비밀번호 일치 확인 ── */
  useEffect(() => {
    if (!formData.confirmPassword) {
      setCheckStatus(prev => ({ ...prev, passwordMatch: null }));
    } else {
      setCheckStatus(prev => ({
        ...prev,
        passwordMatch: formData.password === formData.confirmPassword ? 'ok' : 'dupe',
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  /* ── 이메일 input className ── */
  const getEmailClass = () => {
    const s = checkStatus.email;
    if (s === 'ok')      return 'auth-input auth-input--ok';
    if (s === 'dupe' || s === 'invalid') return 'auth-input auth-input--error';
    return 'auth-input';
  };

  /* ── 닉네임 input className ── */
  const getNicknameClass = () => {
    const s = checkStatus.nickname;
    if (s === 'ok')                    return 'auth-input auth-input--ok';
    if (s === 'dupe' || s === 'short') return 'auth-input auth-input--error';
    return 'auth-input';
  };

  /* ── 이메일 힌트 메시지 ── */
  const EmailHint = () => {
    const s = checkStatus.email;
    if (s === 'checking') return <p className="auth-hint--warn">확인 중...</p>;
    if (s === 'invalid')  return <p className="auth-hint--error">올바른 이메일 형식이 아니에요</p>;
    if (s === 'dupe')     return <p className="auth-hint--error">이미 사용 중인 이메일입니다.</p>;
    if (s === 'ok')       return <p className="auth-hint--ok">✓ 사용 가능한 이메일입니다.</p>;
    return null;
  };

  /* ── 닉네임 힌트 메시지 ── */
  const NicknameHint = () => {
    const s = checkStatus.nickname;
    if (s === 'checking') return <p className="auth-hint--warn">확인 중...</p>;
    if (s === 'short')    return <p className="auth-hint--error">닉네임은 2자 이상이어야 합니다.</p>;
    if (s === 'dupe')     return <p className="auth-hint--error">이미 사용 중인 닉네임입니다.</p>;
    if (s === 'ok')       return <p className="auth-hint--ok">✓ 사용 가능한 닉네임입니다.</p>;
    return null;
  };

  const openTermsModal = (id) => {
    const titles = { terms: '서비스 이용약관', privacy: '개인정보 처리방침', marketing: '마케팅 수신 동의' };
    const bodies = {
      terms: '제1조 (목적)\n이 약관은 RecipeHub가 제공하는 모든 서비스의 이용 조건 및 절차를 규정합니다...',
      privacy: '1. 수집 항목: 이메일, 닉네임\n2. 목적: 서비스 제공\n3. 보유 기간: 탈퇴 시까지',
      marketing: '이벤트 및 혜택 정보를 전달드립니다.',
    };
    setModalContent({ id, title: titles[id], body: bodies[id] });
    setIsModalOpen(true);
  };

  const handleModalAgree = () => {
    setReadStatus(prev => ({ ...prev, [modalContent.id]: true }));
    setIsModalOpen(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!readStatus.terms || !readStatus.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    // 중복/형식 오류 있으면 제출 막기
    if (checkStatus.email !== 'ok') {
      setMessage('이메일을 확인해주세요.');
      return;
    }
    if (checkStatus.nickname !== 'ok') {
      setMessage('닉네임을 확인해주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    try {
      await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });
      navigate('/profile-setup', {
        state: {
          email: formData.email,
          nickname: formData.nickname,
          marketingAgreed: readStatus.marketing,
        },
      });
    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg = errorData?.message || '가입 중 오류가 발생했습니다.';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled =
    isLoading ||
    !readStatus.terms ||
    !readStatus.privacy ||
    formData.password.length < 8 ||
    checkStatus.email !== 'ok' ||
    checkStatus.nickname !== 'ok' ||
    checkStatus.passwordMatch !== 'ok';

  const termsMeta = [
    { id: 'terms',     required: true,  label: '이용약관' },
    { id: 'privacy',   required: true,  label: '개인정보 처리방침' },
    { id: 'marketing', required: false, label: '마케팅 수신 동의' },
  ];

  return (
    <div className="auth-page">
      <h2 className="auth-page-title">RecipeHub 가입하기</h2>

      <form onSubmit={handleSignup} noValidate>

        {/* 이메일 */}
        <div className="auth-form-group">
          <label className="auth-label">이메일 *</label>
          <input
            className={getEmailClass()}
            type="email"
            name="email"
            placeholder="example@recipehub.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="auth-field-hint"><EmailHint /></div>
        </div>

        {/* 닉네임 */}
        <div className="auth-form-group">
          <label className="auth-label">닉네임 *</label>
          <input
            className={getNicknameClass()}
            type="text"
            name="nickname"
            placeholder="멋진 닉네임을 적어주세요"
            value={formData.nickname}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="auth-field-hint"><NicknameHint /></div>
        </div>

        {/* 비밀번호 */}
        <div className="auth-form-group">
          <label className="auth-label">비밀번호 *</label>
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="8자 이상 입력"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="signup-strength-bar">
            <div className="signup-strength-fill"
              style={{ width: `${strength.score}%`, backgroundColor: strength.color }} />
          </div>
          <div className="auth-field-hint">
            {strength.text && <p style={{ color: strength.color }}>{strength.text}</p>}
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="auth-form-group auth-form-group--last">
          <label className="auth-label">비밀번호 확인 *</label>
          <input
            className={`auth-input${checkStatus.passwordMatch === 'dupe' ? ' auth-input--error' : checkStatus.passwordMatch === 'ok' ? ' auth-input--ok' : ''}`}
            type="password"
            name="confirmPassword"
            placeholder="한 번 더 입력"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className="auth-field-hint">
            {checkStatus.passwordMatch === 'ok'   && <p className="auth-hint--ok">✓ 비밀번호가 일치해요</p>}
            {checkStatus.passwordMatch === 'dupe' && <p className="auth-hint--error">비밀번호가 일치하지 않아요</p>}
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="signup-terms-box">
          <div className="signup-terms-all-row" onClick={handleAllAgree}>
            <div className={`auth-checkbox auth-checkbox--lg${isAllAgreed ? ' auth-checkbox--checked' : ''}`}>
              {isAllAgreed && <span className="auth-checkbox-mark auth-checkbox-mark--lg">✓</span>}
            </div>
            <span className={`signup-terms-all-label${isAllAgreed ? ' signup-terms-all-label--active' : ' signup-terms-all-label--inactive'}`}>
              전체 동의
            </span>
          </div>

          {termsMeta.map(({ id, required, label }) => (
            <div key={id} className="signup-terms-row">
              <div className="signup-terms-item"
                onClick={() => setReadStatus(prev => ({ ...prev, [id]: !prev[id] }))}>
                <div className={`auth-checkbox auth-checkbox--sm${readStatus[id] ? ' auth-checkbox--checked' : ''}`}>
                  {readStatus[id] && <span className="auth-checkbox-mark auth-checkbox-mark--sm">✓</span>}
                </div>
                <span className={`signup-terms-item-label${readStatus[id] ? ' signup-terms-item-label--active' : ' signup-terms-item-label--inactive'}`}>
                  [{required ? '필수' : '선택'}] {label}
                </span>
              </div>
              <button type="button" className="signup-terms-view-link"
                onClick={(e) => { e.stopPropagation(); openTermsModal(id); }}>
                보기
              </button>
            </div>
          ))}
        </div>

        {/* 에러 메시지 */}
        {message && (
          <div className="auth-error-area">
            <p className="auth-error-msg">{message}</p>
          </div>
        )}

        <button type="submit" className="auth-btn-primary" disabled={isSubmitDisabled}>
          {isLoading ? '확인 중...' : '다음 단계 — 프로필 설정 →'}
        </button>

        <div className="auth-redirect">
          이미 계정이 있으신가요?
          <Link to="/login" className="auth-redirect-link">로그인 →</Link>
        </div>
      </form>

      {/* 약관 모달 */}
      {isModalOpen && (
        <div className="auth-modal-overlay">
          <div className="auth-modal auth-modal--terms">
            <h3 className="auth-modal-title">{modalContent.title}</h3>
            <div className="auth-modal-terms-body">{modalContent.body}</div>
            <div className="auth-modal-footer" style={{ padding: 0 }}>
              <button className="auth-modal-btn-cancel" onClick={() => setIsModalOpen(false)}>닫기</button>
              <button className="auth-modal-btn-confirm" onClick={handleModalAgree}>동의</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;