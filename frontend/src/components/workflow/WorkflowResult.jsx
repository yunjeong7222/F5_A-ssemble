import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkflowStore from '../../store/workflowStore';


// ⭐ 7번 배포/최적화 전용 애니메이션 컴포넌트 (초당 60프레임 부드러운 숫자 카운팅)
const OptimizationVisualizer = () => {
  const [views, setViews] = React.useState(0);
  const [ctr, setCtr] = React.useState(0);
  const [seo, setSeo] = React.useState(0);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    let animationFrame;
    const animate = () => {
      const duration = 2500; // 2.5초 동안 파바박! 상승
      const pause = 2500; // 2.5초 동안 멈춰서 결과 감상
      const totalCycle = duration + pause;
      
      const now = performance.now();
      const cycleTime = now % totalCycle;
      
      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        // easeOutExpo 효과: 처음엔 미친듯이 빠르고 끝에서 엄청 부드럽게 멈춤
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
    <div style={{
      backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', height: '220px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', position: 'relative'
    }}>
      <style>{`
        @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.1; } }
        .tb-counter { font-variant-numeric: tabular-nums; }
      `}</style>

      {[
        { label: 'Total Views', icon: '👀', iconBg: '#dcfce3', iconColor: '#16a34a', val: views.toLocaleString(), unit: '', trend: '+573%', trendColor: '#10b981' },
        { label: 'Click-Thru', icon: '🖱️', iconBg: '#dbeafe', iconColor: '#2563eb', val: ctr, unit: '%', trend: '+433%', trendColor: '#10b981' },
        { label: 'SEO Score', icon: '🎯', iconBg: '#fef08a', iconColor: '#ca8a04', val: seo, unit: '/100', trend: 'Top 1%', trendColor: '#ca8a04' },
        { label: 'Time Saved', icon: '⚡', iconBg: '#fce7f3', iconColor: '#db2777', val: time, unit: 'hrs', trend: 'Monthly', trendColor: '#db2777' },
      ].map((item, idx) => (
        <div key={idx} style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: '12px', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: item.iconBg, color: item.iconColor, borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>{item.icon}</div>
            {idx === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', color: '#dc2626', fontWeight: 'bold' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#dc2626', borderRadius: '50%', animation: 'blinkDot 1.2s infinite' }}></span> LIVE
              </div>
            )}
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ color: '#0f172a', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.04em', display: 'flex', alignItems: 'baseline' }}>
              <span className="tb-counter">{item.val}</span>
              {item.unit && <span style={{ fontSize: '0.9rem', marginLeft: '4px', color: '#64748b', fontWeight: '700' }}>{item.unit}</span>}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: item.trendColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
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
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', height: '220px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', marginBottom: '24px' }}>
        <style>{`
          @keyframes fadeUser { 0%, 5% { opacity: 0; transform: translateY(10px); } 10%, 90% { opacity: 1; transform: translateY(0); } 95%, 100% { opacity: 0; transform: translateY(-10px); } }
          @keyframes fadeTyping { 0%, 20% { opacity: 0; transform: translateY(10px); } 25%, 45% { opacity: 1; transform: translateY(0); } 50%, 100% { opacity: 0; visibility: hidden; } }
          @keyframes fadeAI { 0%, 50% { opacity: 0; transform: translateY(10px); } 55%, 90% { opacity: 1; transform: translateY(0); } 95%, 100% { opacity: 0; transform: translateY(-10px); } }
          @keyframes dotBlink { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
        `}</style>
        <div style={{ alignSelf: 'flex-end', backgroundColor: '#3b82f6', color: 'white', padding: '10px 16px', borderRadius: '16px 16px 2px 16px', fontSize: '0.9rem', fontWeight: '500', animation: 'fadeUser 6s infinite', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}>"유튜브 숏폼 대본 짜줘"</div>
        <div style={{ position: 'absolute', top: '74px', left: '20px', alignSelf: 'flex-start', backgroundColor: '#e2e8f0', padding: '12px 16px', borderRadius: '16px 16px 16px 2px', display: 'flex', gap: '6px', animation: 'fadeTyping 6s infinite' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#64748b', borderRadius: '50%', animation: 'dotBlink 1.2s infinite both' }}></span>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#64748b', borderRadius: '50%', animation: 'dotBlink 1.2s infinite both 0.2s' }}></span>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#64748b', borderRadius: '50%', animation: 'dotBlink 1.2s infinite both 0.4s' }}></span>
        </div>
        <div style={{ position: 'absolute', top: '74px', left: '20px', alignSelf: 'flex-start', backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', padding: '14px 18px', borderRadius: '16px 16px 16px 2px', fontSize: '0.9rem', animation: 'fadeAI 6s infinite', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', lineHeight: '1.5', minWidth: '60%' }}>
          <strong style={{ color: '#4f46e5', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>✨ AI의 답변</strong>
          1. 오프닝 (0~3초): 시선 집중!<br/>2. 본론 (3~45초): 핵심 정보 전달<br/>3. 결론: 좋아요 및 구독 유도
        </div>
      </div>
    );
  }

 // 2. 🎬 [영상 소스 생성]
  if (category === '영상 소스 생성') {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <style>{`
          @keyframes typingPrompt { 0% { max-width: 0%; } 60% { max-width: 100%; } 100% { max-width: 100%; } }
          @keyframes blinkCursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `}</style>
        <video src="https://cdn.openai.com/nf2/nf2-lp/nf2-lp-hero/4544fb23-bfdb-4f39-a226-cbf7bc022cf5/20250925_2005_New%20Video_simple_compose_01k61zpm1jesn8d3wksf7vv35g.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', display: 'block', borderRadius: '12px' }} />
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(23, 23, 23, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '12px 16px 12px 24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '85%', maxWidth: '480px', border: '1px solid rgba(255,255,255,0.1)' }}>
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

  // 3. [성우 · TTS]
  if (category === '성우 · TTS') {
    return (
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', height: '170px', display: 'flex', alignItems: 'center', padding: '20px 24px', marginBottom: '24px', gap: '24px', position: 'relative', overflow: 'hidden', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px)', backgroundSize: '100% 100%' }}>
        <style>{`
          @keyframes albumPulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); } 50% { transform: scale(1.02); box-shadow: 0 0 20px 5px rgba(168, 85, 247, 0.2); } }
          @keyframes eqSmoothBounce { 0% { transform: scaleY(0.2); opacity: 0.5; } 100% { transform: scaleY(1); opacity: 1; filter: brightness(1.2); } }
        `}</style>
        <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, animation: 'albumPulse 3s ease-in-out infinite', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
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

  // 4. ✂️ [영상 편집] (기존 영상이 안 나오던 문제 수정 완료)
  if (category === '영상 편집') {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <video
          src="https://www.adobe.com/creativecloud/media_141358e1c6f03665f231c26f66738f5fbc3235a22.mp4" /* 안정적으로 재생되는 테스트 영상으로 교체 */
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', display: 'block', borderRadius: '12px' }}
        />
      </div>
    );
  }

  // 5. [자막 · 번역]
  if (category === '자막 · 번역') {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video src="https://framerusercontent.com/assets/uws0xVIxSrruH3JROQ44TkSKUVE.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', display: 'block' }} />
      </div>
    );
  }

  // 6. ⭐ [썸네일 · 디자인]
  if (category === '썸네일 · 디자인') {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <video src="https://cdn.midjourney.com/video/8f014b3f-1a01-47d5-9a6c-6caba17c0734/0.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', display: 'block', borderRadius: '12px' }} />
      </div>
    );
  }

  // 7. ⭐ [배포 · 최적화]
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
  
  // 아코디언 상태 관리 (1단계 기본 오픈)
  const [expandedSteps, setExpandedSteps] = useState([0]);

  const toggleStep = (index) => {
    if (expandedSteps.includes(index)) {
      setExpandedSteps(expandedSteps.filter(i => i !== index));
    } else {
      setExpandedSteps([...expandedSteps, index]);
    }
  };

  const mockWorkflowResult = {
    title: '유튜브 숏폼 자동화 마스터 플랜',
    combination: '기획부터 배포까지',
    steps: [
      { step: 1, tool: 'ChatGPT', category: '기획 · 아이디어', estimated_time: '10분', prompt_example: '최신 트렌드를 반영한 숏폼 대본 3가지를 제안해 줘.', tip: '후킹한 오프닝을 강조하세요.', precautions: '거짓 정보 주의' },
      { step: 2, tool: 'Sora', category: '영상 소스 생성', estimated_time: '5분', prompt_example: '미래 도시를 날아다니는 드론 시점 영상 (4K, Cinematic)', tip: '카메라 무빙을 구체적으로 적으세요.', precautions: '토큰 소모량 확인' },
      { step: 3, tool: 'ElevenLabs', category: '성우 · TTS', estimated_time: '3분', prompt_example: '대본 텍스트 입력...', tip: '감정 태그를 적절히 섞어보세요.', precautions: '한국어 억양 어색함 주의' },
      { step: 4, tool: 'CapCut', category: '영상 편집', estimated_time: '15분', prompt_example: '자동 캡션 기능 및 트랜지션 효과 적용', tip: '모바일 연동으로 빠른 편집 가능', precautions: '무료 버전 워터마크 주의' },
      { step: 5, tool: 'Whisper', category: '자막 · 번역', estimated_time: '2분', prompt_example: '오디오 파일 업로드 후 SRT 변환', tip: '다국어 변환 시 정확도가 높습니다.', precautions: '고유명사 오탈자 검수 필수' },
      { step: 6, tool: 'Midjourney', category: '썸네일 · 디자인', estimated_time: '5분', prompt_example: '사이버펑크 스타일 유튜브 썸네일 --ar 16:9 --v 6.0', tip: '색감을 쨍하게 설정하세요.', precautions: '프롬프트 순서에 따른 가중치' },
      { step: 7, tool: 'TubeBuddy', category: '배포 · 최적화', estimated_time: '5분', prompt_example: '제목 및 태그 최적화 키워드 분석', tip: '경쟁도는 낮고 검색량은 높은 키워드 타겟', precautions: '알고리즘 변화 상시 체크' }
    ]
  };

  const displayData = workflowResult || mockWorkflowResult;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('프롬프트가 클립보드에 복사되었습니다! 🚀');
  };

  // 원본에 있던 9개 데이터 그대로 복구
  const toolDirectory = {
    'ChatGPT': { domain: 'openai.com', category: '기획 · 아이디어', desc: '대화형 AI로 대본 초안 및 아이디어를 기획합니다.' },
    'Claude': { domain: 'anthropic.com', category: '기획 · 아이디어', desc: '뛰어난 문장력으로 대본 및 아이디어를 기획합니다.' },
    'Gemini': { domain: 'gemini.google.com', category: '기획 · 아이디어', desc: '강력한 AI 모델로 아이디어를 기획하고 분석합니다.' },
    'Sora': { domain: 'openai.com/sora', category: '영상 소스 생성', desc: '텍스트 프롬프트를 고품질 영상으로 변환합니다.' },
    'ElevenLabs': { domain: 'elevenlabs.io', category: '성우 · TTS', desc: '실제 사람과 똑같은 감정선의 목소리를 만듭니다.' },
    'CapCut': { domain: 'capcut.com', category: '영상 편집', desc: '다양한 템플릿과 트랜지션으로 숏폼 영상을 완성합니다.' },
    'Whisper': { domain: 'openai.com/research/whisper', category: '자막 · 번역', desc: '강력한 음성 인식 기술로 오디오를 텍스트로 변환합니다.' },
    'Midjourney': { domain: 'midjourney.com', category: '썸네일 · 디자인', desc: '압도적인 퀄리티의 배경 및 일러스트 이미지를 생성합니다.' },
    'TubeBuddy': { domain: 'tubebuddy.com', category: '배포 · 최적화', desc: '유튜브 SEO 최적화 및 키워드 분석 확장 프로그램.' }
  };

  const getToolInfo = (toolName, stepCategory) => {
    if (toolDirectory[toolName]) return toolDirectory[toolName];
    
    // ⭐ 리스트에 없는 툴일 경우: 아이콘용 도메인과 클릭용 링크를 분리합니다.
    const guessedDomain = `${toolName.toLowerCase().replace(/\s/g, '')}.com`; // 예: "Notion AI" -> "notionai.com"
    
    return { 
      domain: guessedDomain, // 아이콘을 불러올 때 사용할 추측 도메인
      link: `https://www.google.com/search?q=${toolName} AI`, // 클릭 시 이동할 구글 검색 링크
      category: stepCategory || '기획 · 아이디어', 
      desc: `${toolName} 도구를 활용하여 작업을 최적화합니다.` 
    };
  };

  // ⭐ 카테고리별로 '이 단계 결과물' 텍스트를 다르게 반환하는 함수
  const getExpectedOutput = (category) => {
    switch (category) {
      case '기획 · 아이디어': 
        return '주제, 핵심 키워드 및 대본 초안';
      case '영상 소스 생성': 
        return '프롬프트에 맞춰 생성된 고해상도 영상 소스';
      case '성우 · TTS': 
        return '대본이 적용된 자연스러운 AI 목소리 파일';
      case '영상 편집': 
        return '컷 편집과 트랜지션이 적용된 숏폼 영상';
      case '자막 · 번역': 
        return '정확한 타이밍에 맞춰진 자막 파일 (SRT 등)';
      case '썸네일 · 디자인': 
        return '시선을 끄는 맞춤형 썸네일 이미지';
      case '배포 · 최적화': 
        return 'SEO가 적용된 클릭 유도형 제목과 태그';
      default: 
        return '해당 단계의 작업 결과물';
    }
  };

  const workflowTips = displayData.steps.filter(s => s.tip).map(s => s.tip);
  const workflowPrecautions = displayData.steps.filter(s => s.precautions).map(s => s.precautions);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '50px', background: '#ffffff', borderRadius: '24px', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      
      {/* ⭐ 1. 상단 플로팅 애니메이션 정의 */}
      <style>{`
        @keyframes floatCard {
          0% { transform: translateY(0px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
          50% { transform: translateY(-12px); box-shadow: 0 20px 30px rgba(0,0,0,0.15); }
          100% { transform: translateY(0px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        }
        /* ⭐ 예쁘고 얇은 가로 스크롤바 추가 (잘림 방지 및 스크롤 인지용) */
        .workflow-scroll::-webkit-scrollbar { height: 8px; }
        .workflow-scroll::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .workflow-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .workflow-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* ⭐ 2. 메인 퍼플 배너 (요구사항 1, 2 반영) */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', borderRadius: '24px', padding: '60px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', overflow: 'hidden' }}>
        
        {/* 배경 꾸밈 요소 (반투명 원) */}
        <div style={{ position: 'absolute', bottom: '-50px', left: '30%', width: '250px', height: '250px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(10px)' }}></div>
        
        {/* 왼쪽 텍스트 영역 */}
        <div style={{ color: '#ffffff', zIndex: 1, flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px', backdropFilter: 'blur(5px)' }}>
            <span style={{ color: '#4ade80' }}>✓</span> 워크플로우 생성 완료
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 16px 0', lineHeight: '1.3', wordBreak: 'keep-all' }}>
            {displayData.title}
          </h2>
          <p style={{ fontSize: '1.1rem', fontWeight: '400', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            {displayData.combination}
          </p>
        </div>

        {/* 오른쪽 둥둥 떠다니는 카드 (요구사항 1, 2) */}
        <div style={{ position: 'relative', zIndex: 1, width: '340px', animation: 'floatCard 4s ease-in-out infinite' }}>
          
          {/* 우측 상단 평점 뱃지 */}
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', backgroundColor: '#ffffff', padding: '10px 16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#f59e0b' }}>★</span> 4.9 / 5.0
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>추천 레시피</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>✍️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 16px 0' }}>선택한 AI 워크플로우</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 사용자가 선택한 툴 정보를 동적으로 최대 3개까지만 보여줌 (디자인 유지) */}
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

          {/* 좌측 하단 시간 뱃지 */}
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', backgroundColor: '#ffffff', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2 }}>
            <div style={{ color: '#eab308', fontSize: '1.2rem' }}>⚡</div>
            <div>
              {/* 예상 시간을 모두 합산하여 동적으로 계산 */}
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                총 {displayData.steps.reduce((acc, cur) => acc + (parseInt(cur.estimated_time) || 0), 0)}분 완성
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>단계별 시간 포함</div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ 3. 동적 WORKFLOW FLOW 영역 (요구사항 3) */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', backgroundColor: '#fafaf9', marginBottom: '50px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#8b5cf6', margin: '0 0 24px 0', letterSpacing: '0.05em' }}>WORKFLOW FLOW</h4>
        
        {/* 가로로 스크롤 가능하도록 flex 컨테이너 설정 + 얇은 스크롤바 클래스 적용 */}
        <div className="workflow-scroll" style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '16px', gap: '16px' }}>
          
          {displayData.steps.map((step, index) => {
            const toolInfo = getToolInfo(step.tool, step.category);
            return (
              <React.Fragment key={index}>
                {/* 툴 카드 (flexShrink: 0 추가하여 찌그러짐 방지) */}
                <div style={{ minWidth: '120px', flexShrink: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolInfo.domain}&sz=64`} alt={step.tool} style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>{step.tool}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#10b981', marginTop: '4px' }}>{toolInfo.category.split('·')[0].trim()} 특화</div>
                  </div>
                </div>

                {/* 화살표 (flexShrink: 0 추가) */}
                <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </React.Fragment>
            );
          })}

          {/* 최종 결과물 카드 (flexShrink: 0 추가) */}
          <div style={{ minWidth: '120px', flexShrink: 0, backgroundColor: '#dcfce3', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#166534' }}>결과물 완성</div>
          </div>
          
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>단계별 가이드 & 프롬프트</h3>
      {/* ... 이후 기존 아코디언 코드 이어짐 ... */}

      {/* 스텝 리스트 (아코디언) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {displayData.steps.map((step, index) => {
          const isExpanded = expandedSteps.includes(index);
          const toolInfo = getToolInfo(step.tool, step.category);

          return (
            <div key={index} style={{ border: `1px solid ${isExpanded ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: '16px', backgroundColor: '#ffffff', overflow: 'hidden', transition: 'all 0.2s ease' }}>
              
              <div 
                onClick={() => toggleStep(index)}
                style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? '#fafaf9' : '#ffffff' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  
                  {/* 👇 1. 로고 아이콘을 클릭 가능한 링크(a 태그)로 변경 👇 */}
                  <a 
                    href={toolInfo.domain.startsWith('http') ? toolInfo.domain : `https://${toolInfo.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // ⭐ 중요: 링크 클릭 시 아코디언이 접히는 현상 방지
                    style={{ width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={`https://www.google.com/s2/favicons?domain=${toolInfo.domain}&sz=64`} alt={`${step.tool} logo`} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                  </a>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1' }}>STEP {step.step}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#10b981', backgroundColor: '#dcfce3', padding: '2px 8px', borderRadius: '20px' }}>{step.tool}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ {step.estimated_time}</span>
                      
                      {/* 👇 2. 직관적인 텍스트 링크 추가 👇 */}
                      <a 
                        href={toolInfo.domain.startsWith('http') ? toolInfo.domain : `https://${toolInfo.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // ⭐ 아코디언 열림/닫힘 충돌 방지
                        style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6', textDecoration: 'none', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '4px' }}
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
                <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0' }}>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <CategoryVisualizer category={toolInfo.category} />
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>타겟 독자와 핵심 키워드를 정의하고 콘텐츠 방향을 잡는 단계</p>
                  
                  <div style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📋 복사 가능한 프롬프트
                  </div>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <pre style={{ margin: 0, color: '#f8fafc', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: "'Pretendard', sans-serif" }}>
                      {step.prompt_example}
                    </pre>
                    <button onClick={() => handleCopy(step.prompt_example)} style={{ backgroundColor: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', flexShrink: 0, display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      복사
                    </button>
                  </div>

                  {/* 👇 새로 추가했던 '이 단계 결과물' 연두색 박스 👇 */}
                  <div style={{ marginTop: '16px', backgroundColor: '#dcfce3', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>이 단계 결과물</div>
                      
                      {/* ⭐ 고정된 텍스트 대신 함수를 호출하여 카테고리에 맞는 문구를 출력합니다 ⭐ */}
                      <div style={{ fontSize: '0.95rem', color: '#15803d', fontWeight: '600' }}>
                        {getExpectedOutput(toolInfo.category)}
                      </div> 

                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 팁과 주의사항 모음 */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div style={{ flex: '1 1 45%', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', marginTop: 0 }}>
             <span style={{ fontSize: '1.4rem' }}>💡</span> 활용 팁
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workflowTips.map((tip, idx) => (
              <div key={idx} style={{ border: '1px solid #fef08a', backgroundColor: '#fefce8', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <div style={{ width: '28px', height: '28px', backgroundColor: '#facc15', color: '#ffffff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem', fontWeight: '800', flexShrink: 0 }}>{idx + 1}</div>
                 <div style={{ color: '#854d0e', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>{tip}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 45%', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', backgroundColor: '#ffffff' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', marginTop: 0 }}>
             <span style={{ fontSize: '1.4rem' }}>⚠️</span> 주의사항
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workflowPrecautions.map((precaution, idx) => (
              <div key={idx} style={{ border: '1px solid #fecdd3', backgroundColor: '#fff1f2', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <div style={{ color: '#e11d48', fontWeight: '800', flexShrink: 0, fontSize: '1.1rem', width: '28px', textAlign: 'center' }}>!</div>
                 <div style={{ color: '#9f1239', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>{precaution}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 재생성/저장 버튼 */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#0f172a' }}>이 워크플로우가 마음에 드셨나요?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>저장하거나 직접 레시피로 등록해보세요</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          
          {/* 👇 다시 복구된 '이전 단계' 버튼 👇 */}
          <button onClick={() => setStep(2)} style={{ padding: '12px 24px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '24px', color: '#475569', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
            ← 이전 단계
          </button>
          
          <button onClick={() => setStep(1)} style={{ padding: '12px 24px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '24px', color: '#475569', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
            ↻ 다시 만들기
          </button>
          
          <button 
            onClick={() => navigate('/community/123')}
            style={{ padding: '12px 24px', backgroundColor: '#8b5cf6', border: 'none', borderRadius: '24px', color: '#ffffff', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'} onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}>
              🚀 레시피로 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowResult;