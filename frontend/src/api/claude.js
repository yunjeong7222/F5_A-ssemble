import api from '../config/axios';

// 1차: 툴 추천 → BE /api/claude/suggest 호출
export const suggestTools = async (purpose) => {
  const response = await api.post('/api/claude/suggest', {
    user_input: purpose,
  });
  return response.data.data;
};

// 2차: 워크플로우 생성 → BE /api/claude/workflow 호출
export const createWorkflow = async (purpose, selectedTools) => {
  const response = await api.post('/api/claude/workflow', {
    user_input: purpose,
    selected_tools: selectedTools,
  });
  return response.data.data;
};
