import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ToolMarquee from '../components/tools/ToolMarquee';
import MainToolSection from '../components/tools/MainToolSection';
import '../styles/Main.css';
import MainStep1Visualizer from '../components/tools/MainStep1Visualizer';
import MainStep2Visualizer from '../components/tools/MainStep2Visualizer';
import MainStep3Visualizer from '../components/tools/MainStep3Visualizer';
import MainStep4Visualizer from '../components/tools/MainStep4Visualizer';

const HOW_STEPS = [
    {
        num: 'STEP 01',
        title: '목적을 입력하면\nAI가 툴을 추천해요',
        desc: '숏폼 제작, 유튜브 영상 등 원하는 목적을 자연어로 입력하면 Claude가 최적의 AI 툴 조합을 추천해드려요.',
    },
    {
        num: 'STEP 02',
        title: '사용할 툴을\n직접 선택해요',
        desc: '추천받은 툴 중 원하는 것만 골라서 나만의 워크플로우를 완성하세요.',
    },
    {
        num: 'STEP 03',
        title: '프롬프트를 복사해서\n바로 실행해요',
        desc: '각 단계별 프롬프트를 클립보드에 복사하고 AI 툴에 붙여넣기만 하면 끝이에요.',
    },
    {
        num: 'STEP 04',
        title: '결과물을 저장하고\n커뮤니티에 공유해요',
        desc: '완성된 워크플로우를 저장하고 다른 크리에이터들과 노하우를 나눠보세요.',
    },
];

const SECTIONS = ['hero', 'tools', 'how', 'cta'];

export default function Main() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(0);
    const [activeStep, setActiveStep] = useState(1);
    const [showFloat, setShowFloat] = useState(false);
    const sectionRefs = useRef([]);
    const howSectionRef = useRef(null);
    

    // 메인 마운트 시 body에 snap-scroll 클래스 추가
    useEffect(() => {
        document.body.classList.add('snap-scroll');
        return () => document.body.classList.remove('snap-scroll');
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
                        setShowFloat(i > 0);
                    }
                },
                {threshold: 0.5},
            );
            observer.observe(ref);
            return observer;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    // HOW 섹션 내부 휠로 스텝 전환
    useEffect(() => {
        const el = howSectionRef.current;
        if (!el) return;

        let locked = false;

        const handleWheel = (e) => {
            if (activeSection !== 2) return;

            const goingDown = e.deltaY > 0;

            if (goingDown && activeStep < HOW_STEPS.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!locked) {
                    locked = true;
                    setActiveStep((prev) => prev + 1);
                    setTimeout(() => {
                        locked = false;
                    }, 600);
                }
            } else if (!goingDown && activeStep > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!locked) {
                    locked = true;
                    setActiveStep((prev) => prev - 1);
                    setTimeout(() => {
                        locked = false;
                    }, 600);
                }
            }
        };

        el.addEventListener('wheel', handleWheel, {passive: false});
        return () => el.removeEventListener('wheel', handleWheel);
    }, [activeSection, activeStep]);

    const scrollToSection = (i) => {
        sectionRefs.current[i]?.scrollIntoView({behavior: 'smooth'});
    };

    // 쇼케이스 자동 전환 타이머
    const STEP_DURATIONS = { 1: 8000, 2: 8000, 3: 6000, 4: 10000 };
    useEffect(() => {
        const duration = STEP_DURATIONS[activeStep];
        if (!duration) return;
        const timer = setTimeout(() => {
            setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
        }, duration);
        return () => clearTimeout(timer);
    }, [activeStep]);

    return (
        <div className="main-wrapper">
            {/* 섹션 인디케이터 */}
            <div className="section-dots">
                {SECTIONS.map((_, i) => (
                    <div
                        key={i}
                        className={`dot ${activeSection === i ? 'active' : ''}`}
                        onClick={() => scrollToSection(i)}
                    />
                ))}
            </div>

            {/* ── 0. 히어로 ── */}
            <section className="container snap-section section-hero" ref={(el) => (sectionRefs.current[0] = el)}>
                <div className="hero-grid">
                    <div className="hero-left animate-left">
                        <div className="hero-tag">✦ AI 툴 워크플로우 플랫폼</div>
                        <h1 className="hero-title">
                            AI 툴, 혼자 쓰면
                            <br />
                            <span className="hero-title-accent">절반의 효과</span>만 납니다
                        </h1>
                        <p className="hero-sub">
                            영상 크리에이터를 위한 AI 툴 조합 레시피.
                            <br />
                            복사 가능한 프롬프트와 실제 결과물을 확인하세요.
                        </p>
                        <div className="hero-btns">
                            <button className="btn-primary" onClick={() => navigate('/workflow')}>
                                워크플로우 만들기
                            </button>
                            <button className="btn-ghost" onClick={() => navigate('/tools')}>
                                툴 탐색하기 →
                            </button>
                        </div>
                    </div>
                    <div className="hero-right animate-right" />
                </div>
                <div className="scroll-hint">
                    <span>스크롤하여 탐색하기</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </section>

            {/* ── 1. 툴 마퀴 + TOP6 ── */}
            <section className="snap-section section-tools" ref={(el) => (sectionRefs.current[1] = el)}>
                <div className="tools-marquee-wrap">
                    <div className="container marquee-header animate-up">
                        <h2 className="marquee-title">지금 주목받는 AI 툴</h2>
                        <button className="marquee-link" onClick={() => navigate('/tools')}>
                            전체 보기 →
                        </button>
                    </div>
                    <ToolMarquee />
                </div>
                <div className="container animate-up" style={{animationDelay: '0.15s'}}>
                    <MainToolSection />
                </div>
            </section>

                {/* CSS애니메이션 */}
            <div className="showcase-container snap-section section-tools">
      
      <div className="showcase-header">
        <h2 className="showcase-title">AIssemble 핵심 기능 미리보기</h2>
        
        {/* 네비게이션 탭 버튼 */}
        <div className="showcase-tabs">
          <button 
            onClick={() => setActiveStep(1)} 
            className={`showcase-tab ${activeStep === 1 ? 'active' : ''}`}
          >
            1. 목적 입력
          </button>
          <button 
            onClick={() => setActiveStep(2)} 
            className={`showcase-tab ${activeStep === 2 ? 'active' : ''}`}
          >
            2. 툴 조립
          </button>
          <button 
            onClick={() => setActiveStep(3)} 
            className={`showcase-tab ${activeStep === 3 ? 'active' : ''}`}
          >
            3. 결과 확인
          </button>
          <button 
            onClick={() => setActiveStep(4)} 
            className={`showcase-tab ${activeStep === 4 ? 'active' : ''}`}
          >
            4. 레시피 공유
          </button>
        </div>
      </div>

      {/* 선택된 단계의 컴포넌트 렌더링 영역 */}
      <div className="showcase-content">
        {activeStep === 1 && <MainStep1Visualizer />}
        {activeStep === 2 && <MainStep2Visualizer />}
        {activeStep === 3 && <MainStep3Visualizer />}
        {activeStep === 4 && <MainStep4Visualizer />}
      </div>

    </div>

            {/* ── 3. CTA + 푸터 ── */}
            <section className="snap-section section-cta" ref={(el) => (sectionRefs.current[3] = el)}>
                <div className="container">
                    <div className="cta-banner animate-up">
                        <div className="cta-left">
                            <h2 className="cta-title">지금 바로 시작하세요 🚀</h2>
                            <p className="cta-sub">
                                무료로 모든 레시피를 탐색하고 나만의 AI 워크플로우를 만들어보세요.
                            </p>
                        </div>
                        <div className="cta-btns">
                            <button className="btn-primary" onClick={() => navigate('/workflow')}>
                                무료로 시작하기
                            </button>
                            <button className="btn-ghost" onClick={() => navigate('/tools')}>
                                레시피 둘러보기
                            </button>
                        </div>
                    </div>
                </div>
                {/* 푸터는 App.jsx의 <Footer />가 자연스럽게 이 섹션 아래 붙음 */}
            </section>

            {/* 플로팅 CTA */}
            {showFloat && (
                <div className="floating-cta">
                    <div className="floating-inner">
                        <button className="float-btn-primary" onClick={() => navigate('/workflow')}>
                            워크플로우 만들기
                        </button>
                        <button className="float-btn-ghost" onClick={() => navigate('/tools')}>
                            툴 탐색하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}