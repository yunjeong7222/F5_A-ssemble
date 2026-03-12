import useWorkflowStore from '../store/workflowStore';
import { suggestTools, createWorkflow } from '../api/claude';
import { saveWorkflow } from '../api/workflows';
import { fetchTools } from '../api/tools';

export const useWorkflow = () => {
  const { setStep, setRecommendedTools, setWorkflowResult, setIsLoading, recommendedTools } = useWorkflowStore();

  const handleSuggestTools = async (purpose) => {
  setIsLoading(true);
  try {
    const suggestData = await suggestTools(purpose);
    const { recommended_categories, tools_by_category } = suggestData;

    // 전체 툴 목록 가져오기
    const allTools = await fetchTools();

    // tools_by_category 이름 기준으로 매칭
    const filtered = [];
    recommended_categories.forEach(categoryName => {
      const recommendedNames = tools_by_category[categoryName] || [];
      allTools.forEach(tool => {
        tool.categories.forEach(cat => {
          if (
            cat.category_name === categoryName &&
            recommendedNames.includes(tool.name)
          ) {
            filtered.push({
              id: tool.id,
              name: tool.name,
              category: cat.category_name,
              description: cat.description,
              rating: tool.rating,
            });
          }
        });
      });
    });

    setRecommendedTools(filtered);
    setStep(2);

  } catch (error) {
    console.error('툴 추천 오류:', error);
    alert('AI 툴 추천을 불러오는데 실패했습니다.');
  } finally {
    setIsLoading(false);
  }
};

  // BE 카테고리명 → 컴포넌트 카테고리명 매핑
  const normalizeCategoryName = (category) => {
    const map = {
      '기획 및 스크립트': '기획 · 아이디어',
      '성우 / TTS':       '성우 · TTS',
      '편집 / 숏폼 변환': '영상 편집',
      '업로드 최적화':    '배포 · 최적화',
      '영상 소스 생성':   '영상 소스 생성', // 동일
      '이미지 소스 생성': '썸네일 · 디자인',
      'BGM':              '성우 · TTS', // 가장 가까운 시각화로 대체
    };
    return map[category] || category;
  };

  // 2차 API 호출: 선택된 툴을 바탕으로 워크플로우 생성
  const handleCreateWorkflow = async (purpose, selectedTools) => {
  setIsLoading(true);
  try {
    const selectedToolObjects = selectedTools
      .map(id => {
        const tool = recommendedTools.find(t => t.id === id);
        return tool ? { category: tool.category, name: tool.name } : null;
      })
      .filter(Boolean);

    const data = await createWorkflow(purpose, selectedToolObjects);
    
    // BE 응답 → 컴포넌트 필드명으로 변환
    const normalized = {
      title: data.title,
      combination: data.total_time, // combination 없으므로 total_time 대체
      steps: data.steps.map(s => ({
        step: s.step_order,
        tool: s.tool_name,
        category: normalizeCategoryName(s.category), // 카테고리명 변환
        estimated_time: s.duration,
        prompt_example: s.prompt_example,
        tip: s.tip,
        precautions: s.caution,
      }))
    };

    setWorkflowResult(normalized);
    setStep(3);
  } catch (error) {
    console.error('워크플로우 생성 오류:', error);
    alert('워크플로우를 생성하는데 실패했습니다.');
  } finally {
    setIsLoading(false);
  }
};



  // 3차: DB 저장 (새로 추가)
  const handleSaveWorkflow = async () => {
    const { workflowResult, purpose, selectedTools } = useWorkflowStore.getState();
    setIsLoading(true);

    try {
      const response = await saveWorkflow({
        user_input: purpose,
        result_json: workflowResult,
        title: workflowResult?.title || purpose,
        // workflowResult 안에 title이 있으면 그걸 쓰고
        // 없으면 purpose(목적 입력값)를 title로 대신 사용
        tool_ids: selectedTools,
      });

      alert('워크플로우가 저장되었습니다!');
      return response.data.id;   // 저장된 워크플로우 ID 반환 

    } catch (error) {
      console.error('워크플로우 저장 오류:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSuggestTools, handleCreateWorkflow, handleSaveWorkflow };
};