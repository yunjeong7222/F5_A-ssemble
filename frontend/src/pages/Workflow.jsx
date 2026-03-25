import useWorkflowStore from '../store/workflowStore';
import {useWorkflow} from '../hooks/useWorkflow';
import ToolSelector from '../components/workflow/ToolSelector';
import WorkflowResult from '../components/workflow/WorkflowResult';
import '../styles/Workflow.css';

const Workflow = () => {
    const {step, purpose, setPurpose, selectedTools, workflowResult, isLoading, resetWorkflow, prevStep} =
        useWorkflowStore();
    const {handleSuggestTools, handleCreateWorkflow} = useWorkflow();
    const handleExampleClick = (text) => {
        setPurpose(text);
    };

    return (
        <div className="workflow-container">
            {/* 상단 스텝 인디케이터 */}
            <div className="wf-step-indicator">
                <div className="wf-step-item">
                    <div className={`wf-step-circle ${step === 1 ? 'active' : ''}`}>1</div>
                    <span className={`wf-step-label ${step === 1 ? 'active' : ''}`}>목적 입력</span>
                </div>
                <div className="wf-step-line"></div>
                <div className="wf-step-item">
                    <div className={`wf-step-circle ${step === 2 ? 'active' : ''}`}>2</div>
                    <span className={`wf-step-label ${step === 2 ? 'active' : ''}`}>툴 선택</span>
                </div>
                <div className="wf-step-line"></div>
                <div className="wf-step-item">
                    <div className={`wf-step-circle ${step === 3 ? 'active' : ''}`}>3</div>
                    <span className={`wf-step-label ${step === 3 ? 'active' : ''}`}>결과 확인</span>
                </div>
            </div>

            {/* 화면 1: 목적 입력 (WORKFLOW_01) */}
            {step === 1 && (
                <section className="wf-step1-section">
                    {isLoading ? (
                        /* ⏳ 로딩 중일 때 보여줄 화면 (버튼 밖으로 빼냄) */
                        <div className="wf-loading-wrap">
                            <div className="wf-spinner"></div>
                            <p className="wf-loading-text">
                                AI가 목적에 맞는 최적의 툴 조합을 찾고 있어요
                                <br />
                                <span className="wf-loading-sub">잠시만 기다려주세요</span>
                            </p>
                        </div>
                    ) : (
                        /* 📝 로딩 중이 아닐 때 보여줄 기존 화면 전체 */
                        <>
                            <h3 className="wf-step1-badge">STEP 1</h3>
                            <h2 className="wf-step1-title">
                                어떤 분야의 워크플로우를
                                <br />
                                만들고 싶으신가요?
                            </h2>
                            <p className="wf-step1-desc">
                                목적을 입력하거나 직군을 선택하면 최적의 AI 툴 조합을 추천해드릴게요
                            </p>

                            <div className="wf-input-wrap">
                                <div className="wf-input-group">
                                    <input
                                        type="text"
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        placeholder="예) 초보 영상 크리에이터인데, 무료 AI 툴로 고퀄리티 BGM과 자막을 만들고 싶어요"
                                        className="wf-input-field"
                                    />
                                    <button
                                        onClick={() => handleSuggestTools(purpose)}
                                        disabled={!purpose || isLoading}
                                        className="wf-submit-btn"
                                    >
                                        AI 툴 추천받기 →
                                    </button>
                                </div>
                            </div>

                            <div className="wf-suggest-wrap">
                                <span className="wf-suggest-label">💡 이런 목적은 어때요?</span>
                                {['유튜브 영상 편집', '무료 BGM 생성', '무료 이미지 생성'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleExampleClick(tag)}
                                        className="wf-suggest-btn"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* 화면 2: 툴 선택 (WORKFLOW_02) */}
            {step === 2 && (
                <section>
                    {isLoading ? (
                        /* ⏳ 로딩 중일 때 보여줄 화면 */
                        <div className="wf-loading-wrap">
                            <div className="wf-spinner"></div>
                            <p className="wf-loading-text">
                                선택하신 툴을 바탕으로 맞춤형 워크플로우를 생성하고 있어요.
                                <br />
                                <span className="wf-loading-sub">잠시만 기다려주세요...</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="wf-step2-title">
                                "{purpose}"에 추천하는 AI 툴 조합이에요. 사용하실 툴을 선택하세요.
                            </h2>
                            <ToolSelector />

                            {/* 하단 버튼 영역 (양쪽 끝으로 배치) */}
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '30px'}}>
                                <button onClick={prevStep} disabled={isLoading} className="wf-action-btn wf-prev-btn">
                                    ← 이전 단계
                                </button>

                                <button
                                    onClick={() => handleCreateWorkflow(purpose, selectedTools)}
                                    disabled={selectedTools.length === 0 || isLoading}
                                    className="wf-action-btn wf-next-btn"
                                >
                                    워크플로우 생성 →
                                </button>
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* 화면 3: 결과 확인 (WORKFLOW_03) */}
            {step === 3 && <WorkflowResult workflowResult={workflowResult} />}
        </div>
    );
};

export default Workflow;
