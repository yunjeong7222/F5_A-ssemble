import { create } from 'zustand';

const useWorkflowStore = create((set) => ({
  step: 1, // 1: 목적 입력, 2: 툴 선택, 3: 결과 확인
  purpose: '', // 사용자가 입력한 목적
  recommendedTools: [], // 1차 API(Claude) 호출 결과 (추천 툴 목록)
  selectedTools: [], // 사용자가 체크한 툴 ID 목록
  workflowResult: null, // 2차 API(Claude) 호출 결과 (생성된 워크플로우 데이터)
  isLoading: false, // 로딩 상태

  // 상태 변경 액션
  setStep: (step) => set({ step }),
  // 추가: 현재 스텝에서 1을 빼주는 액션 (최소 1단계 밑으로는 안 내려가도록 Math.max 사용)
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  setPurpose: (purpose) => set({ purpose }),
  setRecommendedTools: (tools) => set({ recommendedTools: tools }),
  toggleSelectedTool: (toolId) => set((state) => {
    // 1. 방금 클릭한 툴의 정보(카테고리 등)를 찾습니다.
    const clickedTool = state.recommendedTools.find(t => t.id === toolId);
    if (!clickedTool) return state;

    // 2. 현재 선택된 툴 목록 중에서, 방금 클릭한 툴과 '다른 카테고리'인 것들만 남깁니다.
    // (같은 카테고리인 기존 선택 툴을 배열에서 제거하는 효과)
    const filteredTools = state.selectedTools.filter(id => {
      const tool = state.recommendedTools.find(t => t.id === id);
      return tool && tool.category !== clickedTool.category;
    });

    // 3. 이미 체크된 툴을 다시 누른 거라면 선택을 해제하고, 아니면 새 툴을 추가합니다.
    const isAlreadySelected = state.selectedTools.includes(toolId);

    return {
      selectedTools: isAlreadySelected 
        ? filteredTools // 선택 해제
        : [...filteredTools, toolId] // 기존 것 지우고 새 툴 추가
    };
  }),
  setWorkflowResult: (result) => set({ workflowResult: result }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // 초기화 (다시 만들기용)
  resetWorkflow: () => set({ step: 1, purpose: '', recommendedTools: [], selectedTools: [], workflowResult: null })
}));

export default useWorkflowStore;