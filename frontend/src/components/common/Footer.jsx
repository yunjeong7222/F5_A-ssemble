import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/Footer.css'; // ✅ styles 폴더의 CSS를 불러옵니다.

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    {/* 브랜드 섹션 */}
                    <div className="footer-brand">
                        <div className="footer-logo" onClick={() => navigate('/')}>
                            <div className="logo-icon-box">🪄</div>
                            RecipeHub
                        </div>
                        <p className="footer-description">
                            AI 툴 조합 레시피를 공유하고 발견하는 플랫폼
                            <br />
                            AI 입문자를 위한 가장 쉬운 가이드
                        </p>
                    </div>

                    {/* 링크 섹션 그룹 */}
                    <div className="footer-links-group">
                        <div className="footer-links">
                            <h4>서비스</h4>
                            <ul>
                                <li onClick={() => navigate('/recipes')}>레시피 탐색</li>
                                <li onClick={() => navigate('/category')}>카테고리</li>
                                <li onClick={() => navigate('/popular')}>인기 레시피</li>
                                <li onClick={() => navigate('/new')}>신규 레시피</li>
                            </ul>
                        </div>

                        <div className="footer-links">
                            <h4>계정</h4>
                            <ul>
                                <li onClick={() => navigate('/login')}>로그인</li>
                                <li onClick={() => navigate('/signup')}>회원가입</li>
                                <li onClick={() => navigate('/mypage')}>내 레시피</li>
                                <li onClick={() => navigate('/bookmarks')}>북마크</li>
                            </ul>
                        </div>

                        <div className="footer-links">
                            <h4>회사</h4>
                            <ul>
                                <li>소개</li>
                                <li>블로그</li>
                                <li>개인정보처리방침</li>
                                <li>이용약관</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 하단 저작권 영역 */}
                <div className="footer-bottom">
                    <p>© 2026 RecipeHub. All rights reserved.</p>
                    <div className="footer-tagline">
                        Made with <span className="heart-icon">❤️</span> for AI beginners
                    </div>
                </div>
            </div>
        </footer>
    );
}