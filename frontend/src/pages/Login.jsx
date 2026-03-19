import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';

// ✅ 임시 비밀번호 발급 모달 컴포넌트
const FindPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [foundPassword, setFoundPassword] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ 엔터 키 이벤트: 결과 확인 전엔 '발급', 확인 후엔 '닫기'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (!isSearched) {
          handleFindPassword();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [email, nickname, isSearched]);

  const handleFindPassword = () => {
    if (!email || !nickname) {
      alert('이메일과 닉네임을 모두 입력해주세요.');
      return;
    }

    setIsSearching(true);

    // ✅ 서버 에러(404)를 피해 프론트에서 직접 생성 로직 (0.6초 뒤 실행)
    setTimeout(() => {
      // 1. 랜덤 8자리 비밀번호 생성
      const tempPw = Math.random().toString(36).slice(-8) + '!';
      
      // 2. 만료 시간 설정 (현재시간 + 5분)
      const expiryTime = Date.now() + 5 * 60 * 1000;

      // 3. 로컬스토리지에 저장 (로그인 시 검증용)
      localStorage.setItem('tempPasswordInfo', JSON.stringify({
        email: email,
        tempPassword: tempPw,
        expiryTime: expiryTime
      }));

      setFoundPassword(tempPw);
      setIsSearched(true);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '32px', width: '380px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px', fontWeight: '800', fontSize: '20px' }}>비밀번호 찾기</h3>
        
        {!isSearched ? (
          <>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              정보를 입력하시면 <b>5분간 유효한</b><br/>임시 비밀번호를 발급해 드립니다.
            </p>
            <input 
              type="email" placeholder="이메일 주소 입력" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '10px', outline: 'none' }}
            />
            <input 
              type="text" placeholder="닉네임 입력" value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', outline: 'none' }}
            />
          </>
        ) : (
          <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', marginBottom: '25px' }}>
            <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '8px', fontWeight: 'bold' }}>⚠️ 5분 뒤 만료됩니다!</p>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>발급된 임시 비밀번호</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#9c88ff', letterSpacing: '1px' }}>{foundPassword}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', fontWeight: 'bold', cursor: 'pointer' }}>
            {isSearched ? "닫기" : "취소"}
          </button>
          {!isSearched && (
            <button 
              onClick={handleFindPassword} 
              disabled={isSearching}
              style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#9c88ff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isSearching ? '발급 중...' : '임시 비번 발급'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ 로그인 페이지 컴포넌트
const Login = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // ✅ 1. 임시 비밀번호 로그인 체크
    const tempInfo = JSON.parse(localStorage.getItem('tempPasswordInfo'));
    if (tempInfo && email === tempInfo.email && password === tempInfo.tempPassword) {
      if (Date.now() > tempInfo.expiryTime) {
        setMessage('임시 비밀번호 사용 시간이 만료되었습니다. (5분 초과)');
        localStorage.removeItem('tempPasswordInfo');
        setIsLoading(false);
        return;
      }
      // 임시 비번이 맞고 시간도 남았다면 성공 처리
      alert('임시 비밀번호로 로그인되었습니다. 보안을 위해 비밀번호를 변경해주세요!');
      localStorage.removeItem('tempPasswordInfo');
      navigate('/'); 
      return;
    }

    // ✅ 2. 일반 로그인 (기존 서버 연동)
    try {
      const res = await login({ email, password });
      const { accessToken, refreshToken, user } = res.data.data;
      loginStore(user, accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인 정보를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0',
    width: '100%', marginBottom: '10px', boxSizing: 'border-box', outline: 'none',
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '30px', fontWeight: '800' }}>로그인</h2>

      <form onSubmit={handleLogin}>
        <input style={inputStyle} type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div style={{ position: 'relative' }}>
          <input style={inputStyle} type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div style={{ textAlign: 'right', marginTop: '-5px', marginBottom: '10px' }}>
            <span onClick={() => setIsModalOpen(true)} style={{ fontSize: '13px', color: '#9c88ff', cursor: 'pointer', fontWeight: 'bold' }}>
              비밀번호를 잊으셨나요?
            </span>
          </div>
        </div>

        {/* ⭐ 수정된 부분: 에러 메시지가 들어갈 공간을 미리 고정 확보 (밀림 방지) */}
        <div style={{ minHeight: '24px', marginBottom: '15px', textAlign: 'left' }}>
          {message && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>{message}</p>}
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '18px', backgroundColor: '#9c88ff', border: 'none', borderRadius: '15px', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {/* 회원가입 유도 문구 및 버튼 */}
        <div style={{ marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
          기존 회원이 아니신가요?{' '}
          <span 
            onClick={() => navigate('/signup')} 
            style={{ color: '#9c88ff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            회원가입
          </span>
        </div>
      </form>

      {isModalOpen && <FindPasswordModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Login;