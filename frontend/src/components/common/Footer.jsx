import {Link} from 'react-router-dom';
import '../../styles/Footer.css';
import GithubIcon from '../../assets/common/github.svg';
import FooterLogo from '../../assets/common/Aissemble-footer.png';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <img src={FooterLogo} alt="AIssemble-F" className="footer-logo-img" />
                    </div>
                    <nav className="footer-links">
                        <Link to="/">홈</Link>
                        <Link to="/tools">AI 툴 탐색</Link>
                        <Link to="/workflow">워크플로우</Link>
                        <Link to="/community">커뮤니티</Link>
                    </nav>
                </div>
                <div className="footer-bottom">
                    <p>AIssemble | Team F5 | © 2026 AIssemble. All rights reserved.</p>
                    <a
                        className="footer-icons"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/yunjeong7222/F5_A-ssemble"
                    >
                        <img src={GithubIcon} alt="github" />
                    </a>
                </div>
            </div>
        </footer>
    );
}