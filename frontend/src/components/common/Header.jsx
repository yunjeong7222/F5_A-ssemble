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
    { label: 'AI 툴 탐색',        path: '/tools' },
    { label: '워크플로우', path: '/workflow' },
    { label: '커뮤니티',  path: '/community' },
  ];

  const privateRoutes = ['/mypage', '/community/write'];

  const handleLogout = async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    try{
      await logoutAPI(refreshToken); // 서버에 폐기 요청
    } catch (err) {
      console.error('logout error :', err);
    } finally {
      logout();
      const isPrivate = privateRoutes.some(path => location.pathname.startsWith(path));
      navigate(isPrivate ? '/' : location.pathname);
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

      <div className="header__auth">
        {isLoggedIn ? (
          <>
            <span className="header__nickname" onClick={() => navigate('/mypage')}>
              {user?.profile_url ? (
                <img
                  src={user.profile_url}
                  alt={user.nickname}
                  className="header__profile-img"
                />
              ) : (
                <div className="header__profile-placeholder">
                  {(user?.nickname || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="header__nickname-text">{user?.nickname ?? '유저'}</span>
            </span>
            <button className="btn--ghost header__logout" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button className="btn--ghost header__login" onClick={() => navigate('/login')}>로그인</button>
            <button className="btn--primary header__start" onClick={() => navigate('/workflow')}>무료 시작</button>
          </>
        )}
      </div>

    </header>
  );
}
