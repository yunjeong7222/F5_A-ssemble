import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link 추가
import { register } from '../api/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', nickname: '',
  });
  
  const [readStatus, setReadStatus] = useState({ terms: false, privacy: false, marketing: false });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState({ email: null, nickname: null, passwordMatch: null });

  const [touched, setTouched] = useState({ email: false, nickname: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ id: '', title: '', body: '' });

  // ✅ 전체 동의 상태 계산
  const isAllAgreed = readStatus.terms && readStatus.privacy && readStatus.marketing;

  // ✅ 전체 동의 핸들러
  const handleAllAgree = () => {
    const nextStatus = !isAllAgreed;
    setReadStatus({ terms: nextStatus, privacy: nextStatus, marketing: nextStatus });
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: '#e2e8f0' };
    if (pwd.length < 8) return { score: 33, text: '비밀번호가 짧음 (8자 이상)', color: '#ef4444' };
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    if (hasUpperCase || hasSpecialChar) {
      return { score: 100, text: '보안 수준: 안전함', color: '#10b981' };
    }
    return { score: 66, text: '보안 수준: 보통', color: '#f59e0b' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email' || name === 'nickname') {
      setCheckStatus(prev => ({ ...prev, [name]: null }));
      setMessage('');
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    if (!formData.confirmPassword) {
      setCheckStatus(prev => ({ ...prev, passwordMatch: null }));
    } else {
      const isMatch = formData.password === formData.confirmPassword;
      setCheckStatus(prev => ({ ...prev, passwordMatch: isMatch ? 'ok' : 'dupe' }));
    }
  }, [formData.password, formData.confirmPassword]);

  const openTermsModal = (id) => {
    const titles = { terms: '서비스 이용약관', privacy: '개인정보 처리방침', marketing: '마케팅 수신 동의' };
    const bodies = {
      terms: '제1조 (목적)\n이 약관은 RecipeHub가 제공하는 모든 서비스의 이용 조건 및 절차를 규정합니다...',
      privacy: '1. 수집 항목: 이메일, 닉네임\n2. 목적: 서비스 제공\n3. 보유 기간: 탈퇴 시까지',
      marketing: '이벤트 및 혜택 정보를 전달드립니다.'
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
    setIsLoading(true);
    setMessage('');

    try {
      await register({ 
        email: formData.email, 
        password: formData.password, 
        nickname: formData.nickname 
      });
      
      navigate('/profile-setup', { 
        state: { 
          email: formData.email, 
          nickname: formData.nickname,
          marketingAgreed: readStatus.marketing 
        } 
      }); 
      
    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg = errorData?.message || '가입 중 오류가 발생했습니다.';
      if (errorData?.field === 'email' || errorMsg.includes('이메일')) {
        setCheckStatus(prev => ({ ...prev, email: 'dupe' }));
      }
      if (errorData?.field === 'nickname' || errorMsg.includes('닉네임')) {
        setCheckStatus(prev => ({ ...prev, nickname: 'dupe' }));
      }
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (name, status) => {
    const isInvalidEmail = name === 'email' && touched.email && !isEmailValid(formData.email);
    const hasError = status === 'dupe' || isInvalidEmail;
    return {
      padding: '10px 12px', borderRadius: '8px', 
      border: `2px solid ${status === 'ok' ? '#10b981' : (hasError ? '#ef4444' : '#e2e8f0')}`,
      outline: 'none', width: '100%', boxSizing: 'border-box', fontSize: '14px',
      transition: 'border-color 0.2s'
    };
  };

  const isSubmitDisabled = isLoading || !readStatus.terms || !readStatus.privacy || formData.password.length < 8 || !isEmailValid(formData.email);

  return (
    <div style={{ maxWidth: '420px', margin: '20px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>RecipeHub 가입하기</h2>

      <form onSubmit={handleSignup}>
        {/* 이메일, 닉네임, 비밀번호 필드 생략 (기존과 동일) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '13px' }}>이메일 *</label>
          <input style={getInputStyle('email', checkStatus.email)} type="email" name="email" placeholder="example@recipehub.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} required />
          <div style={{ minHeight: '18px', marginTop: '4px' }}>
             {touched.email && formData.email !== '' && !isEmailValid(formData.email) && <p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold', color: '#ef4444' }}>올바른 이메일 형식이 아니에요</p>}
             {checkStatus.email === 'dupe' && <p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold', color: '#ef4444' }}>중복된 이메일입니다.</p>}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '13px' }}>닉네임 *</label>
          <input style={getInputStyle('nickname', checkStatus.nickname)} type="text" name="nickname" placeholder="멋진 닉네임을 적어주세요" value={formData.nickname} onChange={handleChange} onBlur={handleBlur} required />
          <div style={{ minHeight: '18px', marginTop: '4px' }}>
             {checkStatus.nickname === 'dupe' && <p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold', color: '#ef4444' }}>중복된 닉네임입니다.</p>}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}> 
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '13px' }}>비밀번호 *</label>
          <input style={getInputStyle('password', null)} type="password" name="password" placeholder="8자 이상 입력" value={formData.password} onChange={handleChange} required />
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${strength.score}%`, height: '100%', background: strength.color, transition: 'width 0.4s' }}></div>
          </div>
          <div style={{ minHeight: '18px', marginTop: '4px' }}><p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold', color: strength.color }}>{strength.text}</p></div>
        </div>

        <div style={{ marginBottom: '35px' }}> 
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '13px' }}>비밀번호 확인 *</label>
          <input style={getInputStyle('confirm', checkStatus.passwordMatch)} type="password" name="confirmPassword" placeholder="한 번 더 입력" value={formData.confirmPassword} onChange={handleChange} required />
          <div style={{ minHeight: '18px', marginTop: '4px' }}>
            {checkStatus.passwordMatch === 'ok' && <p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold', color: '#10b981' }}>✓ 비밀번호가 일치해요</p>}
            {checkStatus.passwordMatch === 'dupe' && <p style={{ fontSize: '11px', margin: 0, fontWeight: 'bold', color: '#ef4444' }}>비밀번호가 일치하지 않아요</p>}
          </div>
        </div>

        {/* ✅ 약관 동의 섹션 수정 */}
        <div style={{ backgroundColor: '#fcfdfe', padding: '15px', borderRadius: '12px', border: '1px solid #edf2f7', marginBottom: '20px' }}>
          {/* 전체 동의 체크박스 */}
          <div 
            onClick={handleAllAgree}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #edf2f7', cursor: 'pointer' }}
          >
            <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${isAllAgreed ? '#9c88ff' : '#e2e8f0'}`, backgroundColor: isAllAgreed ? '#9c88ff' : '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s' }}>
              {isAllAgreed && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: isAllAgreed ? '#9c88ff' : '#64748b' }}>전체 동의</span>
          </div>

          {['terms', 'privacy', 'marketing'].map((id) => (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <div 
                onClick={() => setReadStatus(prev => ({ ...prev, [id]: !prev[id] }))}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: `1.5px solid ${readStatus[id] ? '#9c88ff' : '#e2e8f0'}`, backgroundColor: readStatus[id] ? '#9c88ff' : '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {readStatus[id] && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
                </div>
                <span style={{ fontSize: '12px', color: readStatus[id] ? '#334155' : '#64748b' }}>
                  [{id === 'marketing' ? '선택' : '필수'}] {id === 'terms' ? '이용약관' : id === 'privacy' ? '개인정보 처리방침' : '마케팅 수신 동의'}
                </span>
              </div>
              <span onClick={(e) => { e.stopPropagation(); openTermsModal(id); }} style={{ fontSize: '11px', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}>보기</span>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSubmitDisabled} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', backgroundColor: isSubmitDisabled ? '#cbd5e1' : '#9c88ff', color: 'white', cursor: isSubmitDisabled ? 'not-allowed' : 'pointer', marginBottom: '20px' }}>
          {isLoading ? '확인 중...' : '다음 단계 — 프로필 설정 →'}
        </button>

        {/* ✅ 하단 로그인 링크 추가 */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: '#9c88ff', fontWeight: 'bold', textDecoration: 'none', marginLeft: '5px' }}>
            로그인 →
          </Link>
        </div>
      </form>

      {/* 모달 생략 (기존과 동일) */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '380px', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '17px', textAlign: 'center' }}>{modalContent.title}</h3>
            <div style={{ height: '180px', overflowY: 'auto', backgroundColor: '#f8fafc', padding: '12px', fontSize: '12px', borderRadius: '8px', whiteSpace: 'pre-wrap', marginBottom: '15px' }}>{modalContent.body}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>닫기</button>
              <button onClick={handleModalAgree} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: '#fff', fontWeight: 'bold' }}>동의</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;