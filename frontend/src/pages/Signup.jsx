import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (formData.password.length < 8) {
      setMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });
      alert('회원가입이 완료되었습니다!');
      navigate('/profile-setup');
    } catch (err) {
      setMessage(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px', borderRadius: '4px',
    border: '1px solid #add8e6', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  };
  const rowStyle = { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '30px', backgroundColor: '#f8fbff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>회원가입</h2>

      <form onSubmit={handleSignup}>
        <div style={rowStyle}>
          <label style={{ fontWeight: 'bold' }}>이메일</label>
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={rowStyle}>
          <label style={{ fontWeight: 'bold' }}>닉네임</label>
          <input
            style={inputStyle}
            type="text"
            name="nickname"
            placeholder="최대 8자"
            maxLength={8}
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>

        <div style={rowStyle}>
          <label style={{ fontWeight: 'bold' }}>비밀번호</label>
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="8자 이상"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={rowStyle}>
          <label style={{ fontWeight: 'bold' }}>비밀번호 확인</label>
          <input
            style={inputStyle}
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 재입력"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {message && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', fontWeight: 'bold' }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%', padding: '15px', backgroundColor: '#9c88ff',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px',
          }}
        >
          {isLoading ? '가입 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
