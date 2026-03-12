import React from 'react';
import useWorkflowStore from '../store/workflowStore';
import { useWorkflow } from '../hooks/useWorkflow';
import ToolSelector from '../components/workflow/ToolSelector';
import StepCard from '../components/workflow/StepCard';
import WorkflowResult from '../components/workflow/WorkflowResult';

const Workflow = () => {
  // 👉 prevStep을 스토어에서 꺼내옵니다.
  const { step, purpose, setPurpose, selectedTools, workflowResult, isLoading, resetWorkflow, prevStep } = useWorkflowStore();
  const { handleSuggestTools, handleCreateWorkflow } = useWorkflow();

  // 예시 태그 클릭 핸들러 (설계서 화면 1의 3번 기능)
  const handleExampleClick = (text) => {
    setPurpose(text);
  };

  return (
    <div>
      {/* 상단 스텝 인디케이터 */}
      <div>
        <span>{step === 1 ? '👉 ① 목적 입력' : '① 목적 입력'}</span> | 
        <span>{step === 2 ? '👉 ② 툴 선택' : '② 툴 선택'}</span> | 
        <span>{step === 3 ? '👉 ③ 결과 확인' : '③ 결과 확인'}</span>
      </div>

      <hr />

      {/* 화면 1: 목적 입력 (WORKFLOW_01) */}
      {step === 1 && (
        <section>
          <h2>어떤 걸 만들고 싶으세요?</h2>
          <p>목적을 자유롭게 입력하면 맞춤 AI 툴 조합을 추천해드려요</p>
          
          <input 
            type="text" 
            value={purpose} 
            onChange={(e) => setPurpose(e.target.value)} 
            placeholder="예) 유튜브 숏폼을 만들고 싶어요 / 브랜드 BGM을 만들고 싶어요..." 
          />
          
          <button onClick={() => handleSuggestTools(purpose)} disabled={!purpose || isLoading}>
            {isLoading ? '로딩중...' : 'AI 툴 추천받기 →'}
          </button>

          <div>
            <p>💡 이런 목적은 어때요?</p>
            <button onClick={() => handleExampleClick('유튜브 숏폼 제작')}>유튜브 숏폼 제작</button>
            <button onClick={() => handleExampleClick('브랜드 BGM 생성')}>브랜드 BGM 생성</button>
            <button onClick={() => handleExampleClick('SNS 콘텐츠 기획')}>SNS 콘텐츠 기획</button>
          </div>
        </section>
      )}

      {/* 화면 2: 툴 선택 (WORKFLOW_02) */}
      {step === 2 && (
        <section>
          <h2>"{purpose}"에 추천하는 AI 툴 조합이에요. 사용하실 툴을 선택하세요.</h2>
          
          {/* 카테고리별 툴 선택 컴포넌트 */}
          <ToolSelector />
        
        <button onClick={prevStep} disabled={isLoading} style={{ marginRight: '10px' }}>
            ← 이전 단계
          </button>
          <button onClick={() => handleCreateWorkflow(purpose, selectedTools)} disabled={selectedTools.length === 0 || isLoading}>
            {isLoading ? '워크플로우 생성 중...' : '워크플로우 생성 →'}
          </button>
        </section>
      )}

      {/* 화면 3: 결과 확인 (WORKFLOW_03) */}
      {/* 기존 step === 3 일 때 렌더링하던 복잡한 태그들 삭제 후 아래 코드로 교체 */}
      {step === 3 && (
        <WorkflowResult workflowResult={workflowResult} />
      )}
    </div>
  );
};

export default Workflow;