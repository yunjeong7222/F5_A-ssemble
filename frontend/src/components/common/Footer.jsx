import {useNavigate} from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer style={{borderTop: '1px solid #eee', padding: '40px 24px 24px'}}>
            <div style={{display: 'flex', gap: 48, marginBottom: 32, flexWrap: 'wrap'}}>
                {/* 로고 + 소개 */}
                <div style={{flex: '0 0 220px'}}>
                    <div
                        style={{fontWeight: 800, fontSize: 18, marginBottom: 8, cursor: 'pointer'}}
                        onClick={() => navigate('/')}
                    >
                        RecipeHub
                    </div>
                    <p style={{fontSize: 13, color: '#64748b', lineHeight: 1.6}}>
                        AI 툴 조합 레시피로
                        <br />
                        누구나 쉽게 AI 워크플로우를 만들 수 있어요.
                    </p>
                </div>

                {/* 서비스 링크 */}
                <div>
                    <div style={{fontWeight: 700, fontSize: 13, marginBottom: 12}}>서비스</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                        {[
                            {label: '홈', path: '/'},
                            {label: '툴', path: '/tools'},
                            {label: '워크플로우', path: '/workflow'},
                            {label: '커뮤니티', path: '/community'},
                        ].map((item) => (
                            <span
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{fontSize: 13, color: '#64748b', cursor: 'pointer'}}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 계정 링크 */}
                <div>
                    <div style={{fontWeight: 700, fontSize: 13, marginBottom: 12}}>계정</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                        {[
                            {label: '로그인', path: '/login'},
                            {label: '회원가입', path: '/signup'},
                        ].map((item) => (
                            <span
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{fontSize: 13, color: '#64748b', cursor: 'pointer'}}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 저작권 */}
            <div style={{borderTop: '1px solid #eee', paddingTop: 16, fontSize: 12, color: '#94a3b8'}}>
                © 2025 RecipeHub. All rights reserved.
            </div>
        </footer>
    );
}
