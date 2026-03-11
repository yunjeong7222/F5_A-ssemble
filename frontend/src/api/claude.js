import axios from 'axios';

// ⚠️ 테스트용 API 키 (실제 배포 시에는 반드시 백엔드로 분리해야 합니다)
const ANTHROPIC_API_KEY = '';

// 브라우저에서 직접 호출하기 위한 Axios 인스턴스 설정
const claudeClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    // 브라우저 직접 호출 허용을 위한 필수 특수 헤더
    'anthropic-dangerous-direct-browser-access': 'true' 
  }
});

// 💡 테스트용 Mock 스위치 (true면 가짜 데이터 반환, false면 실제 요금 발생 API 호출)
const USE_MOCK = true;

// 1차 API: 목적을 기반으로 툴 추천 받기
export const suggestTools = async (purpose) => {
  // 🚧 [Mock Mode] 1차 API 통신 흉내내기
  if (USE_MOCK) {
    console.log('🚧 [Mock Mode] 1차 API 통신 흉내내기');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      // 기획 카테고리 (2개)
      { id: 1, category: "기획", name: "ChatGPT", description: "대본 및 기획안 초안 작성" },
      { id: 2, category: "기획", name: "Claude", description: "자연스러운 말투의 나레이션 대본 다듬기" },
      
      // 영상 카테고리 (2개)
      { id: 3, category: "영상", name: "Vrew", description: "자동 자막 생성 및 컷 편집" },
      { id: 4, category: "영상", name: "CapCut", description: "화려한 트랜지션 및 숏폼 템플릿 활용" },
      
      // 음원/음성 카테고리 (2개)
      { id: 5, category: "음원 및 음성", name: "Suno", description: "저작권 없는 맞춤형 배경음악 생성" },
      { id: 6, category: "음원 및 음성", name: "ElevenLabs", description: "고품질 AI 성우 나레이션(TTS) 생성" }
    ];
  }

  // --- 아래는 기존 실제 API 호출 로직 그대로 유지 ---
  const prompt = `사용자가 다음 목적을 달성하려고 해: "${purpose}"
이 목적에 가장 잘 맞는 AI 툴 3~5개를 추천해줘.
반드시 아래의 JSON 배열 형식으로만 응답해야 해. 다른 말은 절대 추가하지 마.
[
  { "id": 1, "category": "카테고리", "name": "툴이름", "description": "추천 이유 한 줄" }
]`;


try {
      const response = await claudeClient.post('/messages', {
        model: 'claude-sonnet-4-6', // 최신 3.5 Sonnet 모델
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });
    const content = response.data.content[0].text;
    // Claude가 마크다운(```json)을 붙여서 응답할 경우를 대비해 순수 텍스트만 추출
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString); // 배열 형태로 변환하여 반환
  } catch (error) {
    if (error.response) {
      console.error('💡 Anthropic API 상세 에러:', error.response.data);
    } else {
      console.error('💡 네트워크/CORS 에러:', error.message);
    }
    throw new Error('API 호출에 실패했습니다.');
  }
};

// 2차 API: 선택된 툴을 기반으로 워크플로우 생성
export const createWorkflow = async (purpose, selectedTools) => {
  const toolNames = selectedTools.join(', ');

  // 🚧 [Mock Mode] 
  if (USE_MOCK) {
    console.log('🚧 [Mock Mode] 2차 API 통신 흉내내기');
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      title: `${purpose} 워크플로우`,
      combination: `${toolNames} 조합`,
      steps: selectedTools.map((tool, index) => ({
        step: index + 1,
        tool: tool,
        prompt_example: `[${tool}]을(를) 활용하여 "${purpose}"를 시작해줘.`,
        estimated_time: "약 15분",
        tip: "처음에는 단순한 키워드로 시작해서 점차 구체화하는 것이 좋습니다.",
        precautions: "결과물이 의도와 다를 수 있으니 반드시 한 번 더 검수하세요."
      }))
    };
  }

  // --- 실제 API 호출 로직 ---
  // 👉 규칙을 문장으로만 설명하지 않고, AI가 완벽하게 따라 할 수 있는 [예시]를 추가했습니다.
  const prompt = `사용자의 목적: "${purpose}"
선택한 AI 툴: [${toolNames}]

위 툴들을 순서대로 활용해서 목적을 달성하기 위한 단계별 워크플로우를 만들어줘.

⚠️[가장 중요한 작성 규칙]⚠️
1. 반드시 아래의 [응답 예시]와 100% 동일한 JSON 구조로만 대답해.
2. 문자열(값) 내부에 실제 줄바꿈(Enter)을 절대 치지 마. 줄바꿈이 필요하면 반드시 '\\n' 문자로 적어.
3. 문자열(값) 내부에 쌍따옴표(")를 절대 쓰지 마. 강조가 필요하면 홑따옴표(')를 써.

[응답 예시]
{
  "title": "SNS 콘텐츠 기획 워크플로우",
  "combination": "ChatGPT, Notion AI 조합",
  "steps": [
    { 
      "step": 1, 
      "tool": "ChatGPT", 
      "prompt_example": "SNS 콘텐츠 아이디어를 5개 제안해줘.\\n'타겟층'은 20대 직장인이야.",
      "estimated_time": "15분",
      "tip": "구체적인 키워드를 줄수록 좋습니다.",
      "precautions": "결과물이 비슷할 수 있으니 한 번 더 다듬어야 합니다."
    }
  ]
}`;

  try {
    const response = await claudeClient.post('/messages', {
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.data.content[0].text;
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 파싱 시도
    return JSON.parse(jsonString);

  } catch (error) {
    // 💡 에러 발생 시, AI가 보낸 원본 텍스트를 콘솔에 출력하여 정확한 원인을 잡습니다.
    if (error.name === 'SyntaxError') {
      console.error('🚨 JSON 파싱 에러 발생!');
      console.error('AI가 뱉어낸 잘못된 원본 텍스트:', error.message);
      // response 데이터가 있다면 그 안의 텍스트를 강제로 꺼내서 보여줌
    } else {
      console.error('워크플로우 생성 API 에러:', error);
    }
    throw new Error('데이터 형식이 올바르지 않습니다.');
  }
};