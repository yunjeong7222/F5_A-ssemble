import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/Footer.css';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-top">
                <nav className="footer-links">
                    <a href="/">홈</a>
                    <a href="/tools">AI 툴 탐색</a>
                    <a href="/workflow">워크플로우</a>
                    <a href="/community">커뮤니티</a>
                </nav>
            </div>
            <div className="footer-bottom">
                <p>AIssemble | 부트캠프 팀 프로젝트 | © 2026 AIssemble. All rights reserved.</p>
            </div>
        </footer>
    );
}