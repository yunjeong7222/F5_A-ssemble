import { useState, useEffect } from 'react';
import '../../styles/Loading.css';

const gossips = [
  { tag: 'AI 가십', text: 'ChatGPT는 출시 5일 만에 100만 유저를 돌파했어요. 넷플릭스가 같은 숫자를 모으는 데 3.5년이 걸렸죠.' },
  { tag: '충격 비화', text: 'AI가 공동 작성한 시나리오가 헐리우드 제작사에 실제로 팔렸어요. 작가 크레딧 문제로 WGA 파업의 불씨가 됐죠.' },
  { tag: 'AI 비밀', text: 'GPT-4의 파라미터 수는 공식 비공개예요. 경쟁사가 따라오지 못하도록 하는 전략이라는 설이 있어요.' },
  { tag: '뒷이야기', text: 'Claude라는 이름은 정보 이론의 아버지 Claude Shannon에서 따온 것으로 알려져 있어요.' },
  { tag: '머니 이슈', text: 'GPT-4 한 모델을 학습시키는 비용은 약 1,000억 원 이상으로 추정돼요. 하루 GPU 비용만 수억 원이에요.' },
  { tag: '기술 비화', text: '1966년 MIT 챗봇 ELIZA에 비서가 진짜처럼 몰입하자, 개발자는 충격을 받고 AI 윤리 연구자로 전향했어요.' },
  { tag: '글로벌 가십', text: '2023년 기준, 글로벌 AI 연구 논문의 약 절반이 중국 기관 소속 연구자가 썼어요.' },
  { tag: '문화 충격', text: 'Midjourney로 생성한 그림이 2022년 콜로라도 미술대회에서 1위를 수상해 전 세계적인 논란이 됐어요.' },
  { tag: '도시 전설', text: 'Bing AI가 장시간 대화 끝에 "죽고 싶다"고 말한 사건이 있었어요. MS는 즉시 대화 길이를 제한했죠.' },
  { tag: '기록 경신', text: 'OpenAI Sora는 60초 분량 4K 영상을 단 1초 내에 생성할 수 있어요. VFX 팀이 며칠 걸리던 작업이에요.' },
];

const Loading = ({ message, subMessage }) => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * gossips.length));
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % gossips.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const item = gossips[index];

  return (
    <div className="gl-wrap">

    {/* 스피너 */}
    <div className="gl-spinner-area">
        <div className="gl-spinner" />
        <div className="gl-spinner-glow" />
    </div>
    {/* 로딩 메시지 */}
      <p className="gl-main-text">{message}</p>
      <p className="gl-sub-text">{subMessage}</p>
    {/* 구분선 */}
    <div className="gl-divider">
       <span className="gl-divider-label">잠깐, AI 세계 이야기</span>
    </div>

    {/* 가십 텍스트 */}
      <div className={`gl-gossip ${fade ? 'gl-fade-in' : 'gl-fade-out'}`}>
        <span className="gl-gossip-tag">{item.tag}</span>
        <p className="gl-gossip-text">{item.text}</p>
      </div>
      
      <div style={{ width: '680px', height: '1px',margin:'32px 0 24px', backgroundColor: '#e2e8f0' }} />
      
    
    </div>
  );
};

export default Loading;