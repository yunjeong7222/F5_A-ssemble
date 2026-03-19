import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkflowStore from '../../store/workflowStore';
import '../../styles/Workflow.css';

// ⭐ 7번 배포/최적화 전용 애니메이션 컴포넌트
const OptimizationVisualizer = () => {
  const [views, setViews] = React.useState(0);
  const [ctr, setCtr] = React.useState(0);
  const [seo, setSeo] = React.useState(0);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    let animationFrame;
    const animate = () => {
      const duration = 2500; 
      const pause = 2500; 
      const totalCycle = duration + pause;
      
      const now = performance.now();
      const cycleTime = now % totalCycle;
      
      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setViews(Math.floor(easeOut * 2541388));
        setCtr((easeOut * 8.5).toFixed(1));
        setSeo(Math.floor(easeOut * 100));
        setTime(Math.floor(easeOut * 48));
      } else {
        setViews(2541388);
        setCtr((8.5).toFixed(1));
        setSeo(100);
        setTime(48);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="wr-opt-container">
      {[
        { label: 'Total Views', icon: '👀', iconBg: '#dcfce3', iconColor: '#16a34a', val: views.toLocaleString(), unit: '', trend: '+573%', trendColor: '#10b981' },
        { label: 'Click-Thru', icon: '🖱️', iconBg: '#dbeafe', iconColor: '#2563eb', val: ctr, unit: '%', trend: '+433%', trendColor: '#10b981' },
        { label: 'SEO Score', icon: '🎯', iconBg: '#fef08a', iconColor: '#ca8a04', val: seo, unit: '/100', trend: 'Top 1%', trendColor: '#ca8a04' },
        { label: 'Time Saved', icon: '⚡', iconBg: '#fce7f3', iconColor: '#db2777', val: time, unit: 'hrs', trend: 'Monthly', trendColor: '#db2777' },
      ].map((item, idx) => (
        <div key={idx} className="wr-opt-card">
          <div className="wr-opt-header">
            <div className="wr-opt-icon" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>{item.icon}</div>
            {idx === 0 && (
              <div className="wr-opt-live">
                <span className="wr-opt-dot"></span> LIVE
              </div>
            )}
          </div>
          <div>
            <div className="wr-opt-label">{item.label}</div>
            <div className="wr-opt-value">
              <span className="tb-counter">{item.val}</span>
              {item.unit && <span className="wr-opt-unit">{item.unit}</span>}
            </div>
          </div>
          <div className="wr-opt-trend" style={{ color: item.trendColor }}>
            {item.trend.includes('+') ? '↗' : ''} {item.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

// 🎨 카테고리별 시각화 컴포넌트
const CategoryVisualizer = ({ category }) => {

  // 1. [기획 · 아이디어]
  if (category === '기획 · 아이디어') {
    return (
      <div className="wr-cat-plan">
        <div className="wr-cat-user">"유튜브 숏폼 대본 짜줘"</div>
        <div className="wr-cat-typing">
          <span className="wr-cat-dot1"></span>
          <span className="wr-cat-dot2"></span>
          <span className="wr-cat-dot3"></span>
        </div>
        <div className="wr-cat-ai">
          <strong style={{ color: '#4f46e5', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>✨ AI의 답변</strong>
          1. 오프닝 (0~3초): 시선 집중!<br/>2. 본론 (3~45초): 핵심 정보 전달<br/>3. 결론: 좋아요 및 구독 유도
        </div>
      </div>
    );
  }

  // 2. 🎬 [영상 소스 생성]
  if (category === '영상 소스 생성') {
    return (
      <div className="wr-cat-media">
        <video src="https://cdn.openai.com/nf2/nf2-lp/nf2-lp-hero/4544fb23-bfdb-4f39-a226-cbf7bc022cf5/20250925_2005_New%20Video_simple_compose_01k61zpm1jesn8d3wksf7vv35g.mp4" autoPlay loop muted playsInline className="wr-cat-video" />
        <div className="wr-cat-prompt-overlay">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', animation: 'typingPrompt 4s steps(40, end) infinite', color: '#f8fafc', fontSize: '0.9rem', fontWeight: '500' }}>
              "초록색 옷을 입은 소년이 친구와 스케이트 보드를 타고 노는 영상"
            </div>
            <span style={{ display: 'inline-block', width: '2px', height: '16px', backgroundColor: '#ffffff', marginLeft: '4px', animation: 'blinkCursor 0.8s step-end infinite' }}></span>
          </div>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </div>
        </div>
      </div>
    );
  }

  // 3. 🎙️ [성우/TTS]
  if (category === '성우/TTS' || category === '성우 · TTS' || category === '음성 생성') {
    return (
      <div className="wr-cat-media">
        <video src="https://framerusercontent.com/assets/uws0xVIxSrruH3JROQ44TkSKUVE.mp4" autoPlay loop muted playsInline className="wr-cat-video" style={{ maxHeight: '350px' }} />
      </div>
    );
  }

  // 4. ✂️ [영상 편집]
  if (category === '영상 편집' || category === '영상 편집 및 자막') {
    return (
      <div className="wr-cat-media">
        <video src="https://www.adobe.com/creativecloud/media_141358e1c6f03665f231c26f66738f5fbc3235a22.mp4" autoPlay loop muted playsInline className="wr-cat-video" />
      </div>
    );
  }

  // 5. 🎵 [BGM]
  if (category === 'BGM' || category === '배경음악 생성' || category === '배경음악') {
    return (
      <div className="wr-cat-voice">
        <div className="wr-cat-voice-icon">
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>🎙️</span>
          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: '#10b981', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #0f172a' }}>
            <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid white', marginLeft: '2px' }}></div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ height: '45px', marginBottom: '10px' }}>
            <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></span>GENERATING AUDIO...
            </div>
            <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Natural AI Voiceover Generation</div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '2px solid #334155', paddingBottom: '2px', position: 'relative' }}>
            {[...Array(31)].map((_, i) => {
              const distanceFromCenter = Math.abs(i - 15);
              const maxBarHeight = Math.max(12, 65 - (distanceFromCenter * 3.5)); 
              const delay = (Math.sin(i * 0.4) + Math.cos(i * 0.3)) * 0.4;
              return (<div key={i} style={{ width: '6px', height: `${maxBarHeight}px`, background: 'linear-gradient(to top, #6366f1, #a855f7, #ec4899, #f97316)', borderRadius: '3px', transformOrigin: 'bottom', animation: `eqSmoothBounce 0.75s ease-in-out infinite alternate ${delay}s`, boxShadow: '0 0 8px rgba(168, 85, 247, 0.2)' }}></div>);
            })}
          </div>
        </div>
      </div>
    );
  }

  // 6. ⭐ [썸네일 · 디자인]
  if (category === '썸네일 · 디자인') {
    return (
      <div className="wr-cat-media">
        <video src="https://cdn.midjourney.com/video/8f014b3f-1a01-47d5-9a6c-6caba17c0734/0.mp4" autoPlay loop muted playsInline className="wr-cat-video" />
      </div>
    );
  }

  // 7. ⭐ [배포 · 최적화]
  if (category === '배포 · 최적화') {
    return <OptimizationVisualizer />;
  }

  return null;
};

// --- 메인 컴포넌트 ---
const WorkflowResult = ({ workflowResult }) => {
  const setStep = useWorkflowStore(state => state.setStep);
  const navigate = useNavigate();
  
  const [expandedSteps, setExpandedSteps] = useState([0]);

  // 방어 코드: workflowResult 데이터가 없거나 올바르지 않을 때 로딩/빈 화면 처리
  if (!workflowResult || !workflowResult.steps) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '1.1rem', fontWeight: '600' }}>
        워크플로우 데이터를 불러오는 중입니다...
      </div>
    );
  }

  const toggleStep = (index) => {
    if (expandedSteps.includes(index)) {
      setExpandedSteps(expandedSteps.filter(i => i !== index));
    } else {
      setExpandedSteps([...expandedSteps, index]);
    }
  };

  const displayData = workflowResult;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('프롬프트가 클립보드에 복사되었습니다! 🚀');
  };

  const toolDirectory = {
    'ChatGPT': { domain: 'openai.com', category: '기획 · 아이디어', desc: '대화형 AI로 대본 초안 및 아이디어를 기획합니다.' },
    'Claude': { domain: 'anthropic.com', category: '기획 · 아이디어', desc: '뛰어난 문장력으로 대본 및 아이디어를 기획합니다.' },
    'Gemini': { domain: 'gemini.google.com', category: '기획 · 아이디어', desc: '강력한 AI 모델로 아이디어를 기획하고 분석합니다.' },
    'Sora': { domain: 'openai.com/sora', category: '영상 소스 생성', desc: '텍스트 프롬프트를 고품질 영상으로 변환합니다.' },
    'ElevenLabs': { domain: 'elevenlabs.io', category: '성우/TTS', desc: '실제 사람과 똑같은 감정선의 목소리를 만듭니다.' },
    'CapCut': { domain: 'capcut.com', category: '영상 편집', desc: '다양한 템플릿과 트랜지션으로 숏폼 영상을 완성합니다.' },
    'Whisper': { domain: 'openai.com/research/whisper', category: 'BGM', desc: '강력한 음성 인식 기술로 오디오를 텍스트로 변환합니다.' },
    'Midjourney': { domain: 'midjourney.com', category: '썸네일 · 디자인', desc: '압도적인 퀄리티의 배경 및 일러스트 이미지를 생성합니다.' },
    'TubeBuddy': { domain: 'tubebuddy.com', category: '배포 · 최적화', desc: '유튜브 SEO 최적화 및 키워드 분석 확장 프로그램.' }
  };

  const getToolInfo = (toolName, stepCategory) => {
    if (toolDirectory[toolName]) return toolDirectory[toolName];
    
    const guessedDomain = `${toolName.toLowerCase().replace(/\s/g, '')}.com`; 
    
    return { 
      domain: guessedDomain, 
      link: `https://www.google.com/search?q=${toolName} AI`, 
      category: stepCategory || '기획 · 아이디어', 
      desc: `${toolName} 도구를 활용하여 작업을 최적화합니다.` 
    };
  };

  const getExpectedOutput = (category) => {
    switch (category) {
      case '기획 · 아이디어': return '주제, 핵심 키워드 및 대본 초안';
      case '영상 소스 생성': return '프롬프트에 맞춰 생성된 고해상도 영상 소스';
      case '성우/TTS': return '대본이 적용된 자연스러운 AI 목소리 파일';
      case '영상 편집': return '컷 편집과 트랜지션이 적용된 숏폼 영상';
      case 'BGM': return '영상 분위기에 어울리는 배경음악 파일';
      case '썸네일 · 디자인': return '시선을 끄는 맞춤형 썸네일 이미지';
      case '배포 · 최적화': return 'SEO가 적용된 클릭 유도형 제목과 태그';
      default: return '해당 단계의 작업 결과물';
    }
  };

  return (
    <div className="wr-main-container">
      
      {/* 1. 메인 퍼플 배너 */}
      <div className="wr-banner">
        <div className="wr-banner-deco"></div>
        <div className="wr-banner-text">
          <div className="wr-banner-badge">
            <span style={{ color: '#4ade80' }}>✓</span> 워크플로우 생성 완료
          </div>
          <h2 className="wr-banner-title">{displayData.title}</h2>
          <p className="wr-banner-desc">{displayData.combination}</p>
        </div>

        {/* 오른쪽 둥둥 떠다니는 카드 */}
        <div className="wr-float-wrap">
          <div className="wr-float-time" style={{ top: '-20px', right: '-20px', bottom: 'auto', left: 'auto' }}>
            <div style={{ color: '#eab308', fontSize: '1.2rem' }}>⚡</div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                총 {displayData.steps.reduce((acc, cur) => acc + (parseInt(cur.estimated_time) || 0), 0)}분 완성
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>단계별 시간 포함</div>
            </div>
          </div>

          <div className="wr-float-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>✍️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>선택한 AI 워크플로우</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayData.steps.slice(0, 3).map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: ['#ecfdf5', '#e0e7ff', '#f1f5f9'][idx % 3], padding: '10px 14px', borderRadius: '12px' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: ['#10b981', '#6366f1', '#64748b'][idx % 3], color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {step.step}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: ['#059669', '#4338ca', '#334155'][idx % 3] }}>
                    {step.tool}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {step.category}
                  </div>
                </div>
              ))}
              {displayData.steps.length > 3 && (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '4px', fontWeight: '600' }}>
                  + {displayData.steps.length - 3}개의 단계 더보기
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 동적 WORKFLOW FLOW 영역 */}
      <div className="wr-flow-box">
        <h4 className="wr-flow-title">WORKFLOW FLOW</h4>
        
        <div className="workflow-scroll wr-flow-list">
          {displayData.steps.map((step, index) => {
            const toolInfo = getToolInfo(step.tool, step.category);
            return (
              <React.Fragment key={index}>
                <div className="wr-flow-item">
                  <img src={`https://www.google.com/s2/favicons?domain=${toolInfo.domain}&sz=64`} alt={step.tool} style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>{step.tool}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>{toolInfo.category.split('·')[0].trim()} 특화</div>
                  </div>
                </div>

                {index !== displayData.steps.length - 1 && (
                  <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>단계별 가이드 & 프롬프트</h3>

      {/* 3. 스텝 리스트 (아코디언) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {displayData.steps.map((step, index) => {
          const isExpanded = expandedSteps.includes(index);
          const toolInfo = getToolInfo(step.tool, step.category);

          return (
            <div key={index} className="wr-step-item" style={{ border: `1px solid ${isExpanded ? '#c7d2fe' : '#e2e8f0'}` }}>
              
              <div onClick={() => toggleStep(index)} className="wr-step-header" style={{ backgroundColor: isExpanded ? '#fafaf9' : '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  
                  <a 
                    href={toolInfo.domain.startsWith('http') ? toolInfo.domain : `https://${toolInfo.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                    className="wr-step-link"
                  >
                    <img src={`https://www.google.com/s2/favicons?domain=${toolInfo.domain}&sz=64`} alt={`${step.tool} logo`} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain' }} />
                  </a>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1' }}>STEP {step.step}</span>
                      <span className="wr-step-badge">{step.tool}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ {step.estimated_time}</span>
                      
                      <a 
                        href={toolInfo.domain.startsWith('http') ? toolInfo.domain : `https://${toolInfo.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                        className="wr-step-link-text"
                      >
                        공식 사이트 ↗
                      </a>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>
                      {toolInfo.category}
                    </div>
                  </div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '1.5rem' }}>
                  {isExpanded ? '⌃' : '⌄'}
                </div>
              </div>

              {isExpanded && (
                <div className="wr-step-content">
                  <div style={{ marginBottom: '20px' }}>
                    <CategoryVisualizer category={toolInfo.category} />
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>타겟 독자와 핵심 키워드를 정의하고 콘텐츠 방향을 잡는 단계</p>
                  
                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📋 복사 가능한 프롬프트
                  </div>
                  
                  <div className="wr-prompt-box">
                    <pre style={{ margin: 0, color: '#f8fafc', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: "'Pretendard', sans-serif" }}>
                      {step.prompt_example}
                    </pre>
                    <button onClick={() => handleCopy(step.prompt_example)} className="wr-copy-btn">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      복사
                    </button>
                  </div>

                  <div className="wr-result-box">
                    <div style={{ backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>이 단계 결과물</div>
                      <div style={{ fontSize: '0.95rem', color: '#15803d', fontWeight: '600' }}>
                        {getExpectedOutput(toolInfo.category)}
                      </div> 
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {step.tip && (
                      <div style={{ border: '1px solid #fef08a', backgroundColor: '#fefce8', padding: '16px', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#854d0e', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1.1rem' }}>💡</span> 활용 팁
                        </h4>
                        <div style={{ color: '#854d0e', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5' }}>
                          {step.tip}
                        </div>
                      </div>
                    )}
                    
                    {step.precautions && (
                      <div style={{ border: '1px solid #fecdd3', backgroundColor: '#fff1f2', padding: '16px', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#9f1239', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1.1rem' }}>⚠️</span> 주의사항
                        </h4>
                        <div style={{ color: '#9f1239', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5' }}>
                          {step.precautions}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. 하단 재생성/저장 버튼 */}
      <div className="wr-footer">
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#0f172a' }}>이 워크플로우가 마음에 드셨나요?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>저장하거나 직접 레시피로 등록해보세요</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          
          <button onClick={() => setStep(2)} className="wr-btn-outline">
            ← 이전 단계
          </button>
          
          <button onClick={() => setStep(1)} className="wr-btn-outline">
            ↻ 다시 만들기
          </button>
          
          {/* 커뮤니티 저장 기능 */}
          <button onClick={() => navigate('/community/123')} className="wr-btn-primary">
            🚀 레시피로 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowResult;