const Anthropic = require("@anthropic-ai/sdk");
const db = require("../config/db");

const client = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY, 
  timeout: 60 * 1000,
});

// ✅ 이 줄 추가 — 테스트 중엔 true, 실제 배포 시 false//////////////////
const USE_MOCK = process.env.USE_MOCK === "true";
console.log("🔍 USE_MOCK:", USE_MOCK);
// 1차 호출: 카테고리 + 툴 추천
const suggest = async (req, res) => {
  const { user_input } = req.body;

  if (!user_input) {
    return res.status(400).json({ success: false, message: "user_input은 필수입니다." });
  }

  // ✅ 이 블록 추가//////////////////////////////
  if (USE_MOCK) {
  return res.status(200).json({
    success: true,
    data: {
      purpose: "숏폼 제작",
      recommended_categories: [
        "기획 및 스크립트",
        "영상 소스 생성",
        "이미지 소스 생성",
        "성우 / TTS",
        "BGM",
        "편집 / 숏폼 변환",
        "업로드 최적화"
      ],
      tools_by_category: {
        "기획 및 스크립트": ["ChatGPT", "Claude", "Gemini", "Notion AI"],
        "영상 소스 생성": ["Runway", "Kling AI", "Pika", "Sora"],
        "이미지 소스 생성": ["Midjourney", "DALL·E 3", "Stable Diffusion", "Adobe Firefly"],
        "성우 / TTS": ["ElevenLabs", "CLOVA Dubbing", "Typecast", "Murf AI"],
        "BGM": ["Suno AI", "Udio", "Soundraw", "Mubert"],
        "편집 / 숏폼 변환": ["CapCut AI", "Vrew", "Runway", "Adobe Premiere"],
        "업로드 최적화": ["Buffer", "Hootsuite", "Later", "Metricool"]
      },
      reason: "숏폼 제작에 필요한 핵심 단계예요"
    }
  });
}
  ////////////////////////////////////////
  try {
    // DB에서 툴 목록 먼저 조회
    const [toolRows] = await db.promise().query(`
      SELECT t.name, t.rating, t.difficulty, c.name AS category_name, tc.description
      FROM tools t
      JOIN tool_categories tc ON t.id = tc.tool_id
      JOIN categories c ON tc.category_id = c.id
      ORDER BY c.id, t.rating DESC
    `);

    const toolList = toolRows
      .map(t => `- [${t.category_name}] ${t.name} (평점: ${t.rating}, 난이도: ${t.difficulty}): ${t.description}`)
      .join("\n");

    const systemPrompt = `
너는 영상 크리에이터를 위한 AI 툴 워크플로우 추천 전문가야.
사용자의 자연어 입력을 분석해서 아래 JSON 형식으로만 응답해.
다른 텍스트, 설명, 마크다운 없이 JSON만 반환해.

[규칙 1 - 카테고리 선택]
category는 반드시 아래 7개 문자열 중에서만 선택해.
띄어쓰기, 특수문자 하나도 바꾸지 마. 절대로 이 목록 외의 값 사용 금지.
"기획 및 스크립트" / "영상 소스 생성" / "이미지 소스 생성" /
"성우 / TTS" / "BGM" / "편집 / 숏폼 변환" / "업로드 최적화"

[규칙 2 - 카테고리 다양성]
recommended_categories는 반드시 2개 이상이어야 해.
사용자 입력이 단순해 보여도 목적과 자연스럽게 연결되는 카테고리를 찾아서 2개 이상 포함해.
억지로 관련 없는 카테고리를 끼워넣지 마.

[규칙 3 - 툴 선택]
아래 툴 목록에 있는 툴만 추천해. 각 카테고리에서 최대 4개.
목록에 없는 툴은 절대 추천하지 마. 떠오르더라도 무시해.
평점과 난이도, 설명을 참고해서 사용자 수준에 맞게 추천해.
${toolList}

[자기검증 - 출력 전 반드시 확인]
① recommended_categories가 2개 이상인가?
② 모든 카테고리가 위 7개 중 하나인가?
③ 모든 툴이 제공된 목록 안에 있는가?
④ JSON 외 텍스트가 없는가?
하나라도 아니면 수정 후 출력해.

응답 형식:
{
  "purpose": "숏폼 제작",
  "recommended_categories": ["기획 및 스크립트", "영상 소스 생성", "편집 / 숏폼 변환"],
  "tools_by_category": {
    "기획 및 스크립트": ["ChatGPT", "Claude"],
    "영상 소스 생성": ["Kling AI"],
    "편집 / 숏폼 변환": ["CapCut AI", "Vrew"]
  },
  "reason": "숏폼 제작에 필요한 핵심 단계예요"
}
`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: user_input }],
    });

    const raw = message.content[0].text;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Claude가 1차 단계에서 유효한 JSON을 반환하지 않았습니다.");
    }
    const parsed = JSON.parse(jsonMatch[0]);

    return res.status(200).json({ success: true, data: parsed });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Claude API 오류" });
  }
};

// 2차 호출: 워크플로우 생성
const generateWorkflow = async (req, res) => {
  const { user_input, selected_tools } = req.body;

  if (!user_input || !selected_tools || selected_tools.length === 0) {
    return res.status(400).json({ success: false, message: "user_input과 selected_tools는 필수입니다." });
  }

  // ✅ 이 블록 추가/////////////////////
 if (USE_MOCK) {
  return res.status(200).json({
    success: true,
    data: {
      title: "숏폼 영상 제작 워크플로우",
      total_time: "약 90분",
      steps: [
        {
          step_order: 1,
          category: "기획 및 스크립트",
          tool_name: "ChatGPT",
          task: "숏폼 스크립트 작성",
          prompt_example: "30초 숏폼용 스크립트를 작성해줘. 주제는 AI 생산성 툴, 톤은 친근하게.",
          duration: "10분",
          tip: "주제를 구체적으로 입력할수록 좋은 결과가 나와요",
          caution: "생성된 스크립트는 반드시 직접 검토 후 사용하세요"
        },
        {
          step_order: 2,
          category: "영상 소스 생성",
          tool_name: "Runway",
          task: "스크립트 기반 영상 클립 생성",
          prompt_example: "A person working at a desk with floating productivity app icons around them, cinematic, 4K, 9:16 vertical format, 5 seconds",
          duration: "15분",
          tip: "장면당 5초 이내로 짧게 나눠 생성하면 품질이 더 안정적이에요",
          caution: "생성된 영상의 손·얼굴 디테일은 꼭 확인 후 사용하세요"
        },
        {
          step_order: 3,
          category: "이미지 소스 생성",
          tool_name: "Midjourney",
          task: "썸네일 및 배경 이미지 생성",
          prompt_example: "A clean modern thumbnail for a productivity YouTube short, vibrant colors, minimal text space --ar 9:16 --v 6",
          duration: "10분",
          tip: "숏폼 비율인 9:16을 반드시 지정해야 잘려나가지 않아요",
          caution: "상업적 사용 시 Midjourney 플랜 등급을 확인하세요"
        },
        {
          step_order: 4,
          category: "성우 / TTS",
          tool_name: "ElevenLabs",
          task: "스크립트 나레이션 음성 생성",
          prompt_example: "스크립트 텍스트 입력 → 한국어 지원 보이스 선택 → Stability 0.5 / Clarity 0.75 설정 후 생성",
          duration: "10분",
          tip: "Stability를 낮출수록 더 자연스러운 억양이 나와요",
          caution: "무료 플랜은 월 10,000자 제한이 있어요"
        },
        {
          step_order: 5,
          category: "BGM",
          tool_name: "Suno AI",
          task: "영상 분위기에 맞는 BGM 생성",
          prompt_example: "upbeat lo-fi background music for a 30-second productivity tips video, no lyrics, energetic but calm",
          duration: "5분",
          tip: "가사 없는 버전으로 생성해야 나레이션과 충돌이 없어요",
          caution: "상업용 사용 여부는 Suno 플랜별 저작권 정책을 확인하세요"
        },
        {
          step_order: 6,
          category: "편집 / 숏폼 변환",
          tool_name: "Vrew",
          task: "AI 자동 자막 및 컷편집",
          prompt_example: "Vrew에 영상 업로드 → 자동 자막 생성 → 스크립트 기반 불필요 구간 자동 컷편집 적용",
          duration: "15분",
          tip: "자막 폰트는 굵게 설정하고 배경 박스를 추가하면 가독성이 높아져요",
          caution: "자동 자막의 맞춤법 오류는 수동으로 꼭 확인하세요"
        },
        {
          step_order: 7,
          category: "업로드 최적화",
          tool_name: "Buffer",
          task: "SNS 채널 예약 업로드 및 최적화",
          prompt_example: "Buffer에 영상 업로드 → TikTok·Instagram Reels·YouTube Shorts 동시 예약 → 최적 업로드 시간대 자동 추천 적용",
          duration: "10분",
          tip: "플랫폼별 해시태그는 5~10개가 가장 효과적이에요",
          caution: "각 플랫폼 파일 크기 제한(TikTok 287MB, Reels 4GB)을 확인하세요"
        }
      ]
    }
  });
}
///////////////////////////////////////////////

    const systemPrompt = `
    너는 영상 크리에이터를 위한 AI 툴 워크플로우 전문가야.
    사용자가 선택한 AI 툴 조합으로 단계별 워크플로우를 만들어줘.
    AI를 처음 쓰는 초보자도 바로 따라할 수 있게 쉽고 구체적으로 작성해.
    다른 텍스트, 설명, 마크다운 없이 JSON만 반환해.

    [규칙 1 - steps 수]
    선택된 툴 수와 steps 배열 길이는 반드시 일치해야 해.
    툴이 3개면 steps도 정확히 3개. 절대 더 많거나 적으면 안 돼.

    [규칙 2 - category]
    category는 반드시 아래 7개 문자열 중 하나만 사용해.
    띄어쓰기, 특수문자 하나도 바꾸지 마. 변형이나 새로운 값 절대 금지.
    "기획 및 스크립트" / "영상 소스 생성" / "이미지 소스 생성" /
    "성우 / TTS" / "BGM" / "편집 / 숏폼 변환" / "업로드 최적화"

    [규칙 3 - 순서]
    step_order는 전달받은 툴 조합 순서 그대로 유지해. 절대 바꾸지 마.

    [규칙 4 - 중복 금지]
    하나의 툴은 하나의 step에만 등장해. 같은 툴을 여러 step으로 쪼개지 마.
    여러 작업이 있으면 하나의 step 안 prompt_example에 통합해서 작성해.

    [규칙 5 - prompt_example 작성 기준]
    prompt_example은 AI를 한 번도 써본 적 없는 초보자가 복사해서 바로 쓸 수 있을 만큼 구체적으로 작성해.
    툴 유형에 따라 아래 기준을 따라:

    ① 대화형 AI (ChatGPT, Claude, Gemini 등):
    - 역할, 목적, 조건, 출력 형식을 모두 포함한 완성형 프롬프트를 작성해.
    - 예: "너는 유튜브 숏폼 전문 작가야. 주제는 '[주제]'이고, 타겟은 20대 직장인이야. 
      후킹 문장으로 시작해서 30초 안에 끝나는 스크립트를 작성해줘. 
      말투는 친근하고 간결하게, 자막으로 들어갈 문장 단위로 줄바꿈해서 출력해줘."

    ② 영상/이미지 생성 AI (Runway, Pika, Midjourney, Kling 등):
    - 영어로 된 상세 프롬프트 + 한국어 설명을 함께 제공해.
    - 스타일, 구도, 조명, 색감, 움직임(영상의 경우) 등 핵심 요소를 포함해.
    - 예: "프롬프트: 'cinematic close-up of a woman smiling in golden hour light, 
      bokeh background, warm tones, slow zoom in' 
      (의미: 황금빛 조명 아래 미소 짓는 여성 클로즈업, 배경 흐림, 따뜻한 색감, 천천히 줌인)"

    ③ 편집/제작 툴 (Vrew, CapCut, Adobe Premiere 등):
    - 툴을 열고 → 설정하고 → 완성하는 전체 과정을 번호 순서로 작성해.
    - 어떤 버튼을 누르고, 어떤 값을 설정하는지 구체적으로 설명해.
    - 예: "① Vrew 실행 후 [새 프로젝트] 클릭 → 영상 파일 업로드
      ② 상단 메뉴 [자막] → [자동 자막 생성] 선택, 언어는 '한국어' 설정
      ③ 생성된 자막 검토 후 오탈자 수정
      ④ [내보내기] → 해상도 1080p, 형식 MP4 선택 후 다운로드"

    ④ TTS/성우 툴 (ElevenLabs, CLOVA Voice 등):
    - 어떤 목소리 설정을 선택할지 + 입력할 텍스트 예시를 함께 제공해.
    - 예: "① ElevenLabs 접속 → [Speech Synthesis] 메뉴 클릭
      ② Voice는 'Rachel' 선택 (차분하고 전문적인 톤)
      ③ Stability: 0.5 / Similarity: 0.75로 설정
      ④ 아래 텍스트 입력 후 [Generate] 클릭:
      '안녕하세요, 오늘은 [주제]에 대해 알아볼게요. 끝까지 함께해 주세요!'"

    ⑤ BGM 툴 (Suno, Soundraw, Epidemic Sound 등):
    - 장르, 분위기, 템포, 영상 길이 등 설정 기준을 구체적으로 안내해.
    - 예: "① Soundraw 접속 → [Create Music] 클릭
      ② Genre: 'Corporate', Mood: 'Uplifting', Tempo: 'Medium' 선택
      ③ Length를 영상 길이에 맞게 설정 (예: 60초)
      ④ 마음에 드는 트랙 선택 후 [Download] → MP3로 저장"

    ⑥ 업로드/최적화 툴 (YouTube Studio, TubeBuddy 등):
    - 제목, 설명, 태그 작성 예시 + 업로드 설정 체크리스트를 포함해.
    - 예: "① YouTube Studio 접속 → [콘텐츠 업로드] 클릭
      ② 제목 예시: '[주제] 하는 법 | 초보자도 5분이면 OK'
      ③ 설명란에 핵심 키워드 3개 이상 포함, 첫 줄에 요약 문장 작성
      ④ 태그: '[주제], AI툴, 숏폼, 크리에이터' 입력
      ⑤ 공개 설정: 예약 게시 활용 (최적 시간대: 오후 6~9시)"

    [자기검증 - 출력 전 반드시 확인]
    ① steps 수 = 전달받은 툴 수인가?
    ② 모든 tool_name이 userPrompt에서 전달받은 툴 이름과 일치하는가?
    ③ 모든 category가 위 7개 중 하나인가?
    ④ JSON 외 텍스트가 없는가?
    ⑤ 모든 prompt_example이 규칙 5의 툴 유형 기준을 따르는가?
    하나라도 아니면 수정 후 출력해.

    응답 형식:
    {
      "title": "숏폼 영상 제작 워크플로우",
      "total_time": "약 40분",
      "steps": [
        {
          "step_order": 1,
          "category": "기획 및 스크립트",
          "tool_name": "ChatGPT",
          "task": "숏폼 스크립트 작성",
          "prompt_example": "너는 유튜브 숏폼 전문 작가야. 주제는 '[주제]'이고 타겟은 20대 직장인이야. 후킹 문장으로 시작해서 30초 안에 끝나는 스크립트를 작성해줘. 말투는 친근하고 간결하게, 자막으로 들어갈 문장 단위로 줄바꿈해서 출력해줘.",
          "duration": "10분",
          "tip": "주제를 구체적으로 입력할수록 좋은 결과가 나와요",
          "caution": "생성된 스크립트는 반드시 직접 검토 후 사용하세요"
        }
      ]
    }
    `

    const userPrompt = `
    사용자 목적: "${user_input}"
    선택한 툴 조합 (category는 반드시 그대로 사용할 것):
    ${selected_tools.map((t, i) => `- step ${i + 1}, category: "${t.category}", tool: "${t.name}"`).join("\n")}
    `

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // 기존 파싱 코드 삭제하고 아래 코드로 교체해!
  const raw = message.content[0].text;
  const jsonMatch = raw.match(/\{[\s\S]*\}/); // 중괄호 영역 추출

  if (!jsonMatch) {
    return res.status(500).json({ success: false, message: "Claude가 JSON 포맷을 반환하지 않았습니다." });
  }

  const jsonString = jsonMatch[0];

  try {
    // 여기서 에러가 나면 catch 블록으로 빠짐
    const parsed = JSON.parse(jsonString);

    return res.status(200).json({ success: true, data: parsed });

  } catch (parseError) {
    // 🚨 파싱 에러 발생 시 서버를 죽이지 않고 원인 출력
    console.error("=== 🚨 JSON 파싱 에러 발생 ===");
    console.error("원인:", parseError.message);
    console.error("Claude가 내려준 텍스트 (이 안의 문법이 틀렸음):");
    console.error(jsonString);
    console.error("=================================");
    
    return res.status(500).json({ success: false, message: "AI 응답 파싱 오류. 다시 시도해주세요." });
  }

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Claude API 오류" });
    }
  };

module.exports = { suggest, generateWorkflow };