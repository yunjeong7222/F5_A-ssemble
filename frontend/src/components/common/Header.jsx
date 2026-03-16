import {useNavigate, useLocation} from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const {isLoggedIn, user, logout} = useAuthStore();

    const navItems = [
        {label: '홈', path: '/'},
        {label: '툴', path: '/tools'},
        {label: '워크플로우', path: '/workflow'},
        {label: '커뮤니티', path: '/community'},
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                borderBottom: '1px solid #eee',
            }}
        >
            {/* 로고 */}
            <div style={{cursor: 'pointer', fontWeight: 800, fontSize: 18}} onClick={() => navigate('/')}>
                A!!!!!ssemble
            </div>

            {/* 네비게이션 */}
            <nav style={{display: 'flex', gap: 24}}>
                {navItems.map((item) => (
                    <span
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            cursor: 'pointer',
                            fontWeight: location.pathname === item.path ? 700 : 400,
                            textDecoration: location.pathname === item.path ? 'underline' : 'none',
                        }}
                    >
                        {item.label}
                    </span>
                ))}
            </nav>

            {/* 로그인 상태 */}
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                {isLoggedIn ? (
                    <>
                        <span>{user?.nickname ?? '유저'}</span>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')}>로그인</button>
                        <button onClick={() => navigate('/signup')}>회원가입</button>
                    </>
                )}
            </div>
        </header>
    );
}
