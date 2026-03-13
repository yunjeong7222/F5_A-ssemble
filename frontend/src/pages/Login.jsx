import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await login({ email, password });
      const { token, user } = res.data.data;
      loginStore(user, token);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px', borderRadius: '4px',
    border: '1px solid #add8e6', width: '100%',
    marginBottom: '10px', boxSizing: 'border-box', outline: 'none',
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '30px' }}>로그인</h2>

      <form onSubmit={handleLogin}>
        <input
          style={inputStyle}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px', textAlign: 'left', fontWeight: 'bold' }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%', padding: '15px', backgroundColor: '#fff',
            border: '1px solid #000', borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold',
          }}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>아직 회원이 아니신가요?</p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: '#9c88ff', color: '#fff', padding: '12px 25px',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
          }}
        >
          회원가입하러 가기
        </button>
      </div>
    </div>
  );
};

export default Login;