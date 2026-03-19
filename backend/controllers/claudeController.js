const Anthropic = require("@anthropic-ai/sdk");
const db = require("../config/db");

const client = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY, 
  timeout: 60 * 1000,
});

// ✅ 이 줄 추가 — 테스트 중엔 true, 실제 배포 시 false//////////////////
const USE_MOCK = false;

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
        recommended_categories: ["기획 및 스크립트", "편집 / 숏폼 변환"],
        tools_by_category: {
          "기획 및 스크립트": ["ChatGPT", "Claude"],
          "편집 / 숏폼 변환": ["CapCut AI", "Vrew"]
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

카테고리는 반드시 아래 7개 중에서만 선택해.
사용자 요청에 필요한 카테고리만 골라서 반환해. 전부 쓸 필요 없어.

사용 가능한 카테고리:
- 기획 및 스크립트
- 영상 소스 생성
- 이미지 소스 생성
- 성우 / TTS
- BGM
- 편집 / 숏폼 변환
- 업로드 최적화

아래는 사용 가능한 AI 툴 목록이야.
각 카테고리에서 사용자 목적에 가장 적합한 툴을 최대 3개만 골라줘.
평점과 난이도, 설명을 참고해서 사용자 수준에 맞게 추천해.

${toolList}

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
        total_time: "약 40분",
        workflows_category: "영상제작",
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

    응답 형식:
    {
      "title": "숏폼 영상 제작 워크플로우",
      "total_time": "약 40분",
      "workflows_category": "영상제작",
      "steps": [
        {
          "step_order": 1,
          "category": "기획 및 스크립트",
          "tool_name": "ChatGPT",
          "task": "숏폼 스크립트 작성",
          "prompt_example": "30초 숏폼용 스크립트를 작성해줘. 주제는 [주제], 톤은 친근하게.",
          "duration": "10분",
          "tip": "주제를 구체적으로 입력할수록 좋은 결과가 나와요",
          "caution": "생성된 스크립트는 반드시 직접 검토 후 사용하세요"
        }
      ]
    }

    workflows_category 규칙:
    - 반드시 아래 5개 중 하나만 선택해. 다른 값은 절대 사용하지 마.
      "스크립트" → 스크립트 작성, 기획, 아이디어 발굴, 카피라이팅 중심 워크플로우
      "영상제작" → 영상 편집, 자막, 컷편집, 영상 생성 중심 워크플로우
      "썸네일"  → 이미지 생성, 썸네일 디자인, 그래픽 중심 워크플로우
      "보이스"  → 보이스오버, TTS, 음성 합성, 배경음악 중심 워크플로우
      "배포"    → SNS 업로드, 스케줄링, 분석, 마케팅 중심 워크플로우
    - 워크플로우 전체 흐름에서 가장 비중이 큰 목적을 기준으로 1개만 선택해.

    주의사항:
    - [필수] 전달받은 '선택한 툴 조합'의 개수와 steps 배열의 길이는 반드시 일치해야 해. (툴이 3개면 스텝도 무조건 3개)
    - [필수] 하나의 툴 당 하나의 스텝(step)만 할당해. 절대 같은 툴을 여러 스텝으로 쪼개서 중복 등장시키지 마.
    - [필수] 만약 하나의 툴로 여러 작업(예: 트렌드 조사 + 타겟 분석 + 캡션 작성)을 수행해야 한다면, 스텝을 나누지 말고 하나의 스텝 안에서 'prompt_example'에 여러 요청사항을 통합해서 작성해.
    - step_order는 사용자가 툴을 선택한 순서대로 진행해.
    - prompt_example은 실제로 복붙해서 쓸 수 있게 구체적으로 작성해.
    - duration은 초보자 기준으로 작성해.
    - tip과 caution은 초보자가 자주 하는 실수 기반으로 작성해.
    `;

  const userPrompt = `
    사용자 목적: "${user_input}"
    선택한 툴 조합:
    ${selected_tools.map((t) => `- ${t.category}: ${t.name}`).join("\n")}
    `;

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
    
    // 성공 시 workflows_category 유효성 검증 (기존 코드 유지)
    const validCategories = ["스크립트", "영상제작", "썸네일", "보이스", "배포"];
    if (!validCategories.includes(parsed.workflows_category)) {
      parsed.workflows_category = "스크립트"; 
    }

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