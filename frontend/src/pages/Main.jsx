import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getTools} from '../api/tools';
import {getPosts} from '../api/posts';
import useAuthStore from '../store/authStore';
import Swal from 'sweetalert2';
import IntroPhysics from '../components/main/IntroPhysics';
import '../styles/Main.css';
import visStyles from '../styles/MainVisualizer.module.css';
import heroImg from '../assets/images/main-hero2.png';
import introImg1 from '../assets/images/intro2-1.png';
import introImg2 from '../assets/images/intro2-2.png';
import MainStep1Visualizer from '../components/main/MainStep1Visualizer';
import MainStep2Visualizer from '../components/main/MainStep2Visualizer';
import MainStep3Visualizer from '../components/main/MainStep3Visualizer';
import MainStep4Visualizer from '../components/main/MainStep4Visualizer';
import serviceImg1 from '../assets/images/service-1.png';
import serviceImg2 from '../assets/images/service-2.jpeg';
import serviceImg3 from '../assets/images/service-3.png';
import communityImg from '../assets/images/main-community.png';

const SECTIONS = ['hero', 'intro-1', 'intro-2', 'service', 'how-it-works', 'community'];

export default function Main() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuthStore();
    const [activeSection, setActiveSection] = useState(0);
    const [activeStep, setActiveStep] = useState(1);
    const [showFloat, setShowFloat] = useState(false);
    const [tools, setTools] = useState([]);
    const [physicsActive, setPhysicsActive] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
    const [topPosts, setTopPosts] = useState([]);
    const sectionRefs = useRef([]);

    // 메인 마운트 시 body에 snap-scroll 클래스 추가
    useEffect(() => {
        document.documentElement.classList.add('snap-scroll'); // body → documentElement
        return () => document.documentElement.classList.remove('snap-scroll');
    }, []);

    // 섹션 진입 감지
    useEffect(() => {
        const observers = sectionRefs.current.map((ref, i) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(i);
                        ref.classList.add('in-view');
                        setShowFloat(i > 0 && i < SECTIONS.length - 1);
                    }
                },
                {threshold: 0.5},
            );
            observer.observe(ref);
            return observer;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    // 스크롤 + dot 패이지컨트롤
    const scrollToSection = (i) => {
        const el = sectionRefs.current[i];
        if (!el) return;
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({top, behavior: 'smooth'});
    };

    // 스크롤 인디케이터
    const scrollUp = () => window.scrollTo({top: 0, behavior: 'smooth'});
    const scrollDown = () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});

    // intro-1 Tools
    useEffect(() => {
        getTools()
            .then((data) => {
                setTools([...data.slice(0, 25), ...data.slice(0, 25)]);
            })
            .catch((err) => console.error(err));
    }, []);
    // intro-1 Tools delay
    useEffect(() => {
        if (activeSection === 1 && !physicsActive) {
            const timer = setTimeout(() => setPhysicsActive(true), 1200);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection]);
    // service card Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % 3);
        }, 3000); // 3초마다 다음 카드
        return () => clearInterval(interval);
    }, []);

    // 쇼케이스 자동 전환 타이머
    const STEP_DURATIONS = {1: 8000, 2: 8000, 3: 6000, 4: 10000};
    useEffect(() => {
        const duration = STEP_DURATIONS[activeStep];
        if (!duration) return;
        const timer = setTimeout(() => {
            setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
        }, duration);
        return () => clearTimeout(timer);
    }, [activeStep]);

    // 커뮤니티 top3 가져오기
    useEffect(() => {
        getPosts({sort: 'likes'}).then((data) => {
            const posts = data.data || [];
            const top3 = posts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 3);
            setTopPosts(top3);
        });
    }, []);

    return (
        <div className="main-wrapper">
            {/* 섹션 인디케이터 -> dot 삭제*/}
            <div className="section-dots">
                {SECTIONS.map((_, i) => (
                    <div
                        key={i}
                        className={`dot ${activeSection === i ? 'active' : ''}`}
                        onClick={() => scrollToSection(i)}
                    />
                ))}
            </div>
            {/* 페이지 TOP/DOWN : 함수 필요, 위치만 잡음 */}
            <div className="scrollNav">
                <button onClick={scrollUp}>▲</button>
                <button onClick={scrollDown}>▼</button>
            </div>

            {/* ── 1. Hero 히어로 ── */}
            <section className="container snap-section section-hero" ref={(el) => (sectionRefs.current[0] = el)}>
                <div className="hero-contents">
                    <h1 className="hero-title">
                        AI 툴은 넘치는데,
                        <br />
                        <span className="hero-title-accent">뭘 써야할 지 </span>모르겠다면
                    </h1>
                    <p className="hero-sub">나에게 꼭 맞는 워크플로우, AIssemble이 찾아드릴께요!</p>
                    <div className="hero-img">
                        <img src={heroImg} alt="hero"></img>
                    </div>
                </div>
                <div className="scroll-hint">
                    <span>스크롤하여 탐색하기</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </section>

            {/* ── 2. intro 서비스 제안 배경 ── */}
            {/* ── 2-1. intro-1 : matter ── */}
            <section className="snap-section section-intro-1" ref={(el) => (sectionRefs.current[1] = el)}>
                <div className="intro-text">
                    <div className="bubbles">
                        <div className="bubble bubble-left">뭐가 좋지? 🤔</div>
                    </div>
                    <h2 className="hero-title intro-text-hook">
                        AI 툴은 매일같이
                        <br />
                        <span className="hero-title-accent">새롭게</span> 쏟아져요
                    </h2>
                    <div className="bubbles">
                        <div className="bubble bubble-right">어떻게 써야 하지? 😅</div>
                    </div>
                </div>
                <div className="intro-physics">
                    <IntroPhysics tools={tools} isActive={physicsActive} />
                </div>
            </section>
            {/* ── 2-2. intro-2 : 문제해결 제안 ── */}
            <section className="snap-section section-intro-2" ref={(el) => (sectionRefs.current[2] = el)}>
                <div className="intro-2-container">
                    {/* 왼쪽 덩어리 */}
                    <div className="intro-col-left">
                        <div className="intro-card">
                            <h2>
                                툴을 조합해서
                                <br /> 쓰는 방법은 없을까?
                            </h2>
                            <p>단계별로 가이드가 있으면 딱 좋을텐데!</p>
                        </div>
                        <div className="intro-img-left">
                            <img src={introImg1} alt="intro-2-1" />
                        </div>
                    </div>
                    {/* 오른쪽 덩어리 */}
                    <div className="intro-col-right">
                        <div className="intro-img-right">
                            <img src={introImg2} alt="intro-2-2" />
                        </div>
                        <div className="intro-card">
                            <h2>
                                워크플로우와
                                <br /> 프롬프트 팁, 한번에
                            </h2>
                            <p>목적만 말하면 나머지는 AIssemble이 다 알려드려요 😄</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* ── 3. service : 주요 기능 ── */}
            <section className="snap-section section-service" ref={(el) => (sectionRefs.current[3] = el)}>
                <div className="container">
                    <div className="service-header">
                        <h2>
                            AIssemble에서
                            <br /> <span className="hero-title-accent">경험</span>할 수 있는 것들
                        </h2>
                        <p>툴 탐색부터 워크플로우 추천, 커뮤니티까지 한곳에서</p>
                    </div>
                    <div className="service-cards">
                        <div className={`service-card ${activeCard === 0 ? 'active' : ''}`}>
                            <img src={serviceImg1} className="service-card-img" />
                            <div className="service-card-text">
                                <h3>AI 툴 탐색</h3>
                                <p>
                                    수백 가지 AI 툴을 카테고리별로 탐색해보세요.
                                    <br />
                                    평점, 난이도, 무료 여부까지 한눈에
                                </p>
                            </div>
                        </div>
                        <div className={`service-card ${activeCard === 1 ? 'active' : ''}`}>
                            <img src={serviceImg2} className="service-card-img" />
                            <div className="service-card-text">
                                <h3>워크플로우 추천</h3>
                                <p>
                                    목적만 말하면 AI가 최적의 툴 조합을 추천해드려요.
                                    <br />
                                    단계별 프롬프트 팁까지 바로 제공
                                </p>
                            </div>
                        </div>
                        <div className={`service-card ${activeCard === 2 ? 'active' : ''}`}>
                            <img src={serviceImg3} className="service-card-img" />
                            <div className="service-card-text">
                                <h3>커뮤니티</h3>
                                <p>
                                    다른 크리에이터들의 워크플로우를 구경하고
                                    <br />내 결과물도 공유해보세요
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. HOW IT WORKS ── */}
            <section
                className="snap-section section-how"
                ref={(el) => {
                    sectionRefs.current[4] = el;
                }}
            >
                <div className={visStyles['showcase-container']}>
                    <div className={visStyles['showcase-header']}>
                        <h2 className={visStyles['showcase-title']}>직접 경험하고, 공유해요</h2>

                        <div className={visStyles['showcase-tabs']}>
                            <button
                                onClick={() => setActiveStep(1)}
                                className={`${visStyles['showcase-tab']} ${activeStep === 1 ? visStyles['active'] : ''}`}
                            >
                                목적 입력
                            </button>
                            <button
                                onClick={() => setActiveStep(2)}
                                className={`${visStyles['showcase-tab']} ${activeStep === 2 ? visStyles['active'] : ''}`}
                            >
                                AI 툴 선택
                            </button>
                            <button
                                onClick={() => setActiveStep(3)}
                                className={`${visStyles['showcase-tab']} ${activeStep === 3 ? visStyles['active'] : ''}`}
                            >
                                워크플로우 생성
                            </button>
                            <button
                                onClick={() => setActiveStep(4)}
                                className={`${visStyles['showcase-tab']} ${activeStep === 4 ? visStyles['active'] : ''}`}
                            >
                                커뮤니티 공유
                            </button>
                        </div>
                    </div>

                    <div className={visStyles['showcase-content']}>
                        {activeStep === 1 && <MainStep1Visualizer />}
                        {activeStep === 2 && <MainStep2Visualizer />}
                        {activeStep === 3 && <MainStep3Visualizer />}
                        {activeStep === 4 && <MainStep4Visualizer />}
                    </div>
                </div>
            </section>

            {/* ── 5. Commuinity + CTA ── */}
            <section className="snap-section section-community" ref={(el) => (sectionRefs.current[5] = el)}>
                <div className="container">
                    <div className="community-top">
                        <div className="community-text">
                            <p className="community-mini">우리끼리 공유하는 워크플로우</p>
                            <h2>
                                다른 <span className="hero-title-accent">크리에이터</span>들은
                                <br />
                                어떻게 만들고 있을까요?
                            </h2>
                            <p className="community-sub">
                                마음에 드는 워크플로우를 저장하고,
                                <br />
                                북마크에서 바로 꺼내볼 수 있어요
                            </p>
                            <button className="btn-primary" onClick={() => navigate('/community')}>
                                커뮤니티 바로가기<span className="arrow">→</span>
                            </button>
                        </div>
                        <div className="community-illust">
                            <img src={communityImg} alt="community" />
                        </div>
                    </div>
                    <div className="community-cards-text">
                        <h3>사람들이 가장 좋아하는 글</h3>
                        <p>좋아요를 가장 많이 받은 게시글이에요</p>
                    </div>
                    <div className="community-cards">
                        {topPosts.map((post) => (
                            <div
                                key={post.id}
                                className="community-card"
                                onClick={() => {
                                    if (isLoggedIn) {
                                        navigate(`/community/${post.id}`);
                                    } else {
                                        Swal.fire({
                                            title: '로그인이 필요해요',
                                            text: '게시글을 보려면 로그인해주세요',
                                            icon: 'info',
                                            confirmButtonText: '로그인하기',
                                            showCancelButton: true,
                                            cancelButtonText: '취소',
                                        }).then((result) => {
                                            if (result.isConfirmed) navigate('/login');
                                        });
                                    }
                                }}
                            >
                                <div className="community-card-img">
                                    {post.thumbnail_url ? (
                                        <img src={post.thumbnail_url} alt={post.title} />
                                    ) : (
                                        <div className="community-card-placeholder" />
                                    )}
                                </div>
                                <div className="community-card-body">
                                    <div className="community-card-title">{post.title}</div>
                                    <div className="community-card-user">
                                        <div className="community-card-nick">@{post.nickname}</div>
                                        <div className="community-card-like">
                                            <span className="hero-title-accent">♥</span> {post.like_count || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 플로팅 CTA */}
            {showFloat && (
                <div className="floating-cta">
                    <button className="float-btn-primary" onClick={() => navigate('/workflow')}>
                        워크플로우 만들러가기
                    </button>
                </div>
            )}
        </div>
    );
}
