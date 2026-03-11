import React from 'react';
import useWorkflowStore from '../../store/workflowStore';

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

 // 2. 🎬 [영상 소스 생성] (OpenAI 영상 + 실시간 타이핑 프롬프트 오버레이)
  if (category === '영상 소스 생성') {
    return (
      <div style={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        marginBottom: '24px', 
        border: '1px solid #e2e8f0', 
        backgroundColor: '#0f172a', 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%'
      }}>
        <style>{`
          /* ⭐ 프롬프트 타이핑 및 커서 깜빡임 애니메이션 */
          @keyframes typingPrompt {
            0% { max-width: 0%; }
            60% { max-width: 100%; }
            100% { max-width: 100%; } /* 타이핑 완료 후 잠시 대기 */
          }
          @keyframes blinkCursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        <video
          src="https://cdn.openai.com/nf2/nf2-lp/nf2-lp-hero/4544fb23-bfdb-4f39-a226-cbf7bc022cf5/20250925_2005_New%20Video_simple_compose_01k61zpm1jesn8d3wksf7vv35g.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxHeight: '450px', 
            objectFit: 'contain', 
            display: 'block',
            borderRadius: '12px' 
          }}
        />
        
        {/* 프롬프트 오버레이 창 */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(23, 23, 23, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '12px 16px 12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          width: '85%',
          maxWidth: '480px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          
          {/* ⭐ 타이핑 애니메이션 텍스트 영역 */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            overflow: 'hidden' // 텍스트가 컨테이너를 넘어가지 않도록 숨김
          }}>
            <div style={{
              display: 'inline-block',
              overflow: 'hidden',
              whiteSpace: 'nowrap', // 한 줄 입력창 느낌을 주기 위해 줄바꿈 방지
              animation: 'typingPrompt 4s steps(40, end) infinite', // 40단계로 끊어서 타닥타닥 타이핑
              color: '#f8fafc', 
              fontSize: '0.9rem', 
              fontWeight: '500',
            }}>
              "초록색 옷을 입은 흑인이 친구와 스케이트 보드를 타고 노는 영상"
            </div>
            
            {/* ⭐ 깜빡이는 커서 막대기 */}
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '16px',
              backgroundColor: '#ffffff',
              marginLeft: '4px',
              animation: 'blinkCursor 0.8s step-end infinite'
            }}></span>
          </div>
          
          {/* 전송(업로드) 화살표 버튼 */}
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
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

  // 4. ✂️ [영상 편집] (Adobe Premiere 시연 영상 적용 및 잘림 방지 최적화)
  if (category === '영상 편집') {
    return (
      <div style={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        marginBottom: '24px', 
        border: '1px solid #e2e8f0', 
        backgroundColor: '#f8fafc', // 다른 영상 탭들과 통일된 배경색
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%'
      }}>
        <video
          src="https://images-tv.adobe.com/mpcv3/10887/20dbb47c-3e68-4257-8614-ef3ec64fa9d9_1762182798.854x480at800_h264.mp4#_autoplay"
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ 
            width: '100%', 
            height: 'auto', // 영상 비율에 맞춰 박스 크기가 유동적으로 조절됨
            maxHeight: '450px', 
            objectFit: 'contain', // 영상이 박스 밖으로 잘리지 않도록 보호
            display: 'block',
            borderRadius: '12px' // 비디오 모서리를 부드럽게 깎음
          }}
        />
      </div>
    );
  }

  // 5. [자막 · 번역]
  if (category === '자막 · 번역') {
    return (
      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video
          src="https://framerusercontent.com/assets/uws0xVIxSrruH3JROQ44TkSKUVE.mp4"
          autoPlay loop muted playsInline
          style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
        />
      </div>
    );
  }

  // 6. ⭐ [썸네일 · 디자인] (Midjourney 영상 적용 및 비디오 모서리 둥글게 깎기)
  if (category === '썸네일 · 디자인') {
    return (
      <div style={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        marginBottom: '24px', 
        border: '1px solid #e2e8f0', 
        backgroundColor: '#f8fafc', // 5번과 동일한 배경색
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%'
      }}>
        <video
          src="https://cdn.midjourney.com/video/8f014b3f-1a01-47d5-9a6c-6caba17c0734/0.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxHeight: '450px', 
            objectFit: 'contain', 
            display: 'block',
            borderRadius: '12px' /* ⭐ 비디오 자체의 모서리를 부드럽게 깎음 */
          }}
        />
      </div>
    );
  }

  // 7. ⭐ [배포 · 최적화] (0부터 시작, 1단위 감속 카운트업, 최초 목표 수치 복구)
  if (category === '배포 · 최적화') {
    return (
      <div style={{
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        height: '220px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
        position: 'relative'
      }}>
        <style>{`
          /* ⭐ 총 5초 주기 
             0~20%(1초): 0 대기 
             20~40%(1초): 거대한 폭으로 미친듯이 상승 
             40~60%(1초): 목표치 근처에서 1단위씩 쪼개며 감속 (타다닥!) 
             60~100%(2초): 목표 수치에서 멈춤 (감상)
          */
          @keyframes countViewsFinal { 
            0%, 20% { content: "0"; }
            22% { content: "42,150"; } 24% { content: "150,200"; } 26% { content: "490,400"; } 
            28% { content: "950,000"; } 30% { content: "1,550,800"; } 32% { content: "2,100,500"; } 
            34% { content: "2,350,200"; } 36% { content: "2,480,100"; } 38% { content: "2,510,400"; } 
            40% { content: "2,530,200"; } 42% { content: "2,538,100"; } 44% { content: "2,540,500"; } 
            46% { content: "2,541,300"; } 48% { content: "2,541,350"; } 
            50% { content: "2,541,384"; } 52% { content: "2,541,385"; } 54% { content: "2,541,386"; } 
            56% { content: "2,541,387"; } 58%, 100% { content: "2,541,388"; } 
          }
          @keyframes countCTRFinal { 
            0%, 20% { content: "0.0"; }
            24% { content: "1.2"; } 28% { content: "3.5"; } 32% { content: "5.2"; } 
            36% { content: "6.8"; } 40% { content: "7.5"; } 44% { content: "7.9"; } 
            48% { content: "8.1"; } 52% { content: "8.2"; } 54% { content: "8.3"; } 
            56% { content: "8.4"; } 58%, 100% { content: "8.5"; } 
          }
          @keyframes countSEOFinal { 
            0%, 20% { content: "0"; }
            24% { content: "24"; } 28% { content: "51"; } 32% { content: "73"; } 
            36% { content: "85"; } 40% { content: "91"; } 44% { content: "94"; } 
            48% { content: "96"; } 52% { content: "97"; } 54% { content: "98"; } 
            56% { content: "99"; } 58%, 100% { content: "100"; } 
          }
          @keyframes countTimeFinal { 
            0%, 20% { content: "0"; }
            24% { content: "12"; } 28% { content: "25"; } 32% { content: "34"; } 
            36% { content: "40"; } 40% { content: "43"; } 44% { content: "44"; } 
            48% { content: "45"; } 52% { content: "46"; } 54% { content: "47"; } 
            56%, 100% { content: "48"; } 
          }
          
          @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.1; } }

          /* 애니메이션 적용 & 폰트 너비 고정(tabular-nums)으로 떨림 방지 */
          .tb-counter { font-variant-numeric: tabular-nums; }
          .count-views::after { content: "0"; animation: countViewsFinal 5s infinite; }
          .count-ctr::after { content: "0.0"; animation: countCTRFinal 5s infinite; }
          .count-seo::after { content: "0"; animation: countSEOFinal 5s infinite; }
          .count-time::after { content: "0"; animation: countTimeFinal 5s infinite; }
        `}</style>

        {[
          { label: 'Total Views', icon: '👀', iconBg: '#dcfce3', iconColor: '#16a34a', class: 'count-views', unit: '', trend: '+573%', trendColor: '#10b981' },
          { label: 'Click-Thru', icon: '🖱️', iconBg: '#dbeafe', iconColor: '#2563eb', class: 'count-ctr', unit: '%', trend: '+433%', trendColor: '#10b981' },
          { label: 'SEO Score', icon: '🎯', iconBg: '#fef08a', iconColor: '#ca8a04', class: 'count-seo', unit: '/100', trend: 'Top 1%', trendColor: '#ca8a04' },
          { label: 'Time Saved', icon: '⚡', iconBg: '#fce7f3', iconColor: '#db2777', class: 'count-time', unit: 'hrs', trend: 'Monthly', trendColor: '#db2777' },
        ].map((item, idx) => (
          <div key={idx} style={{
            flex: 1,
            backgroundColor: '#f8fafc', 
            borderRadius: '12px',
            height: '100%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '36px', height: '36px', 
                backgroundColor: item.iconBg, color: item.iconColor, 
                borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' 
              }}>
                {item.icon}
              </div>
              
              {idx === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', color: '#dc2626', fontWeight: 'bold' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#dc2626', borderRadius: '50%', animation: 'blinkDot 1.2s infinite' }}></span>
                  LIVE
                </div>
              )}
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
              {/* 긴 숫자가 잘리지 않도록 1.6rem 적용 및 장평(letterSpacing) 좁힘 */}
              <div style={{ color: '#0f172a', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.04em', display: 'flex', alignItems: 'baseline' }}>
                <span className={`tb-counter ${item.class}`}></span>
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
  }

  return null;
};

// --- 메인 컴포넌트 ---
const WorkflowResult = ({ workflowResult }) => {
  const setStep = useWorkflowStore(state => state.setStep);

  // 💡 [테스트용 목업 데이터] UI 확인을 위해 카테고리 7개를 순서대로 주입합니다.
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

  const displayData = mockWorkflowResult; // 테스트 적용

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('프롬프트가 클립보드에 복사되었습니다! 🚀');
  };

  const toolDirectory = {
    'ChatGPT': { domain: 'openai.com', category: '기획 · 아이디어', desc: '대화형 AI로 대본 초안 및 아이디어를 기획합니다.' },
    'Sora': { domain: 'openai.com/sora', category: '영상 소스 생성', desc: '텍스트 프롬프트를 고품질 영상으로 변환합니다.' },
    'ElevenLabs': { domain: 'elevenlabs.io', category: '성우 · TTS', desc: '실제 사람과 똑같은 감정선의 목소리를 만듭니다.' },
    'CapCut': { domain: 'capcut.com', category: '영상 편집', desc: '다양한 템플릿과 트랜지션으로 숏폼 영상을 완성합니다.' },
    'Whisper': { domain: 'openai.com/research/whisper', category: '자막 · 번역', desc: '강력한 음성 인식 기술로 오디오를 텍스트로 변환합니다.' },
    'Midjourney': { domain: 'midjourney.com', category: '썸네일 · 디자인', desc: '압도적인 퀄리티의 배경 및 일러스트 이미지를 생성합니다.' },
    'TubeBuddy': { domain: 'tubebuddy.com', category: '배포 · 최적화', desc: '유튜브 SEO 최적화 및 키워드 분석 확장 프로그램.' }
  };

  const getToolInfo = (toolName) => {
    return toolDirectory[toolName] || { domain: 'google.com', category: '알 수 없음', desc: 'AI 도구를 활용하여 작업을 최적화합니다.' };
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '50px', background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', color: '#4338ca', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '20px', border: '1px solid #c7d2fe', boxShadow: '0 4px 10px rgba(67, 56, 202, 0.1)' }}>
          <span style={{ fontSize: '1.2rem' }}>✨</span> AI 최적화 워크플로우 완성
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-0.03em', lineHeight: '1.2' }}>{displayData.title}</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>{displayData.combination} 기반의 단계별 자동화 가이드입니다.</p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '40px' }}>
        <div style={{ position: 'absolute', left: '14px', top: '30px', bottom: '30px', width: '3px', background: 'linear-gradient(to bottom, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '3px' }}></div>
        
        {displayData.steps.map((step, index) => {
          const toolInfo = getToolInfo(step.tool);
          return (
            <div key={index} style={{ position: 'relative', marginBottom: '50px' }}>
              
              <div style={{ position: 'absolute', left: '-38px', top: '20px', width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: '4px solid #ffffff', zIndex: 1, boxShadow: '0 0 0 4px rgba(59,130,246,0.2)' }}>
                <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{step.step}</span>
              </div>
              
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                
                {/* 스텝 제목 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '0.9rem' }}>STEP {step.step}</span>
                    {step.tool} 사용하기
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '6px 14px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>
                    ⏱ 예상 시간: <span style={{ color: '#0f172a' }}>{step.estimated_time}</span>
                  </div>
                </div>

                {/* 툴 프로필 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <img src={`https://www.google.com/s2/favicons?domain=${toolInfo.domain}&sz=128`} alt={`${step.tool} 로고`} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4f46e5', backgroundColor: '#e0e7ff', padding: '3px 8px', borderRadius: '6px' }}>{toolInfo.category}</span>
                      <a href={`https://${toolInfo.domain}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', textDecoration: 'none' }}>공식 사이트 ↗</a>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{toolInfo.desc}</p>
                  </div>
                </div>
                
                {/* ⭐ CSS 시각화 애니메이션 렌더링 부분 */}
                <CategoryVisualizer category={toolInfo.category} />
                
                {/* 프롬프트 블록 */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                    </div>
                    <button onClick={() => handleCopy(step.prompt_example)} style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>복사하기</button>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <pre style={{ margin: 0, color: '#38bdf8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '1rem', lineHeight: '1.7', fontFamily: "'Fira Code', 'Consolas', monospace" }}>
                      {step.prompt_example}
                    </pre>
                  </div>
                </div>

                {/* 팁과 주의사항 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'linear-gradient(to right, #f0fdf4, #ffffff)', borderLeft: '4px solid #22c55e', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', borderRadius: '0 8px 8px 0', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.4rem' }}>💡</span>
                    <div><strong style={{ display: 'block', color: '#166534', fontSize: '0.9rem', marginBottom: '4px' }}>Pro Tip</strong><span style={{ color: '#3f6212', fontSize: '0.95rem', lineHeight: '1.6' }}>{step.tip}</span></div>
                  </div>
                  <div style={{ background: 'linear-gradient(to right, #fff1f2, #ffffff)', borderLeft: '4px solid #f43f5e', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', borderRadius: '0 8px 8px 0', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                    <div><strong style={{ display: 'block', color: '#9f1239', fontSize: '0.9rem', marginBottom: '4px' }}>주의사항</strong><span style={{ color: '#881337', fontSize: '0.95rem', lineHeight: '1.6' }}>{step.precautions}</span></div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 버튼 */}
      <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => setStep(2)} style={{ padding: '14px 28px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#475569', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer' }}>← 이전 단계</button>
        <button onClick={() => setStep(1)} style={{ padding: '14px 28px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#334155', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer' }}>↻ 처음부터 다시</button>
      </div>
    </div>
  );
};

export default WorkflowResult;