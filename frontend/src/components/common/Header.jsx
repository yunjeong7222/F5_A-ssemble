import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import '../../styles/Header.css';
import { logout as logoutAPI } from '../../api/auth';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuthStore();

  const navItems = [
    { label: '홈',        path: '/' },
    { label: '툴',        path: '/tools' },
    { label: '워크플로우', path: '/workflow' },
    { label: '커뮤니티',  path: '/community' },
  ];

  const handleLogout = async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    try{
      await logoutAPI(refreshToken); // 서버에 폐기 요청
    } catch (err) {
      console.error('logout error :', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="header">

      {/* 로고 */}
      <div className="header__logo" onClick={() => navigate('/')}>
        <div className="header__logo-icon">⚡</div>
        <span className="header__logo-text">A!!ssemble</span>
      </div>

      {/* 네비게이션 */}
      <nav className="header__nav">
        {navItems.map(item => (
          <span
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`header__nav-item ${location.pathname === item.path ? 'header__nav-item--active' : ''}`}
          >
            {item.label}
          </span>
        ))}
      </nav>

      {/* 검색창 */}
      <div className="header__search">
        <span className="header__search-icon">🔍</span>
        <input
          className="header__search-input"
          type="text"
          placeholder="레시피 검색..."
        />
      </div>

      {/* 로그인 상태 */}
      <div className="header__auth">
        {isLoggedIn ? (
          <>
            <span className="header__nickname" onClick={() => navigate('/mypage')}>
              {user?.nickname ?? '유저'}
            </span>
            <button className="btn--ghost" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button className="btn--ghost" onClick={() => navigate('/login')}>로그인</button>
            <button className="btn--primary" onClick={() => navigate('/signup')}>무료 시작</button>
          </>
        )}
      </div>

    </header>
  );
}