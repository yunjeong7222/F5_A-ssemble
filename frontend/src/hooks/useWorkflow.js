import useWorkflowStore from '../store/workflowStore';
import { suggestTools, createWorkflow } from '../api/claude';

export const useWorkflow = () => {
  const { setStep, setRecommendedTools, setWorkflowResult, setIsLoading, recommendedTools } = useWorkflowStore();

  // 1차 API 호출: 목적을 바탕으로 툴 추천 받기
  const handleSuggestTools = async (purpose) => {
    setIsLoading(true);
    try {
      console.log('1차 API 호출 시작 (목적:', purpose, ')');
      
      // API 호출 시 객체가 아닌 문자열(purpose) 형태로 전달
      const data = await suggestTools(purpose); 
      
      console.log('1차 API 호출 완료:', data);
      
      // API에서 받은 실제 데이터를 스토어에 저장
      setRecommendedTools(data);
      setStep(2);
    } catch (error) {
      console.error('툴 추천을 가져오는 중 오류 발생:', error);
      alert('AI 툴 추천을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2차 API 호출: 선택된 툴을 바탕으로 워크플로우 생성
  const handleCreateWorkflow = async (purpose, selectedTools) => {
    setIsLoading(true);
    try {
      console.log('2차 API 호출 시작 (선택된 툴 ID:', selectedTools, ')');
      const selectedToolNames = selectedTools
        .map(id => {
          const tool = recommendedTools.find(t => t.id === id); // ID와 일치하는 툴 객체 찾기
          return tool ? tool.name : '';
        })
        .filter(Boolean); // 유효한 이름만 남기기

      // ⚠️ 기존에 있던 setWorkflowResult({ title: ... combination: ... }) 등 
      // 하드코딩된 임시 데이터 배열을 완전히 삭제하고, API에서 받아온 결과를 바로 넣습니다.
      const data = await createWorkflow(purpose, selectedToolNames);
      
      console.log('API 응답 결과:', data); // 콘솔에서 구조 확인용
      setWorkflowResult(data); 
      setStep(3); // 결과 확인 화면으로 이동

    } catch (error) {
      console.error('워크플로우 생성 중 오류 발생:', error);
      alert('워크플로우를 생성하는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return { handleSuggestTools, handleCreateWorkflow };
};