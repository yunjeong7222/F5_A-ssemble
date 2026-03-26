import {useNavigate, useLocation} from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {logout as logoutAPI} from '../../api/auth';
import '../../styles/Header.css';
import HeaderLogo from '../../assets/common/Aissemble-header.png';
import HeaderLogoM from '../../assets/common/Aissemble-logo.png';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const {isLoggedIn, user, logout} = useAuthStore();

    const navItems = [
        {label: '홈', path: '/'},
        {label: 'AI 툴 탐색', path: '/tools'},
        {label: '워크플로우', path: '/workflow'},
        {label: '커뮤니티', path: '/community'},
    ];

    const privateRoutes = ['/mypage', '/community/write'];

    const handleLogout = async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        try {
            await logoutAPI(refreshToken);
        } catch (err) {
            console.error('logout error :', err);
        } finally {
            logout();
            const isPrivate = privateRoutes.some((path) => location.pathname.startsWith(path));
            navigate(isPrivate ? '/' : location.pathname);
        }
    };

    return (
        <div className="header-container">
            <header className="header">
                <div className="header-logo" onClick={() => navigate('/')}>
                    <img src={HeaderLogo} alt="AIssemble" className="header-logo-img" />
                    <img src={HeaderLogoM} alt="AIssemble-M" className="header-logo-img-M" />
                </div>

                <nav className="header-nav">
                    {navItems.map((item) => (
                        <span
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`header-nav-item ${location.pathname === item.path ? 'header-nav-active' : ''}`}
                        >
                            {item.label}
                        </span>
                    ))}
                </nav>

                <div className="header-auth">
                    {isLoggedIn ? (
                        <>
                            <span className="header-nick" onClick={() => navigate('/mypage')}>
                                {user?.profile_url ? (
                                    <img src={user.profile_url} alt={user.nickname} className="header-nick-img" />
                                ) : (
                                    <div className="header-nick-placeholder">
                                        {(user?.nickname || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="header-nick-text">{user?.nickname ?? '유저'}</span>
                            </span>
                            <button className="header-logout" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="header-login" onClick={() => navigate('/login')}>
                                로그인
                            </button>
                            <button className="header-start" onClick={() => navigate('/workflow')}>
                                무료 시작
                            </button>
                        </>
                    )}
                </div>
            </header>
        </div>
    );
}
