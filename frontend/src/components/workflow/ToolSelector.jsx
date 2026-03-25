import React, {useState} from 'react';
import useWorkflowStore from '../../store/workflowStore';
import '../../styles/Workflow.css'; // 💡 Workflow.css 가져오기

const ToolSelector = () => {
    const {recommendedTools, selectedTools, toggleSelectedTool} = useWorkflowStore();
    const categories = [...new Set(recommendedTools.map((tool) => tool.category))];

    // 💡 현재 보여줄 단계(카테고리)의 인덱스를 관리하는 상태 추가
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [hoveredTooltip, setHoveredTooltip] = useState(null);

    const getCategoryColor = (categoryName) => {
        const colors = {
            '기획 및 스크립트': '#8b5cf6',
            '영상 소스 생성': '#10b981',
            '성우 / TTS': '#f59e0b',
            '편집 / 숏폼 변환': '#ec4899',
            디자인: '#3b82f6',
            '데이터 분석': '#0ea5e9',
        };
        return colors[categoryName] || '#64748b';
    };

    const getPricingStyle = (pricing) => {
        return pricing === '무료 지원'
            ? {bg: '#e0f2fe', color: '#0369a1', icon: '✨'}
            : {bg: '#f1f5f9', color: '#475569', icon: '💳'};
    };

    const getLevelStyle = (level) => {
        if (level === '초급') return {bg: '#dcfce3', color: '#15803d', icon: '🌱'};
        if (level === '중급') return {bg: '#fef3c7', color: '#b45309', icon: '⭐'};
        if (level === '고급') return {bg: '#fee2e2', color: '#b91c1c', icon: '🔥'};
        return {bg: '#f3f4f6', color: '#374151', icon: '📌'};
    };

    // 💡 툴 선택 시 처리하는 함수 (자동으로 다음 단계 이동)
    const handleToolSelect = (toolId) => {
        toggleSelectedTool(toolId);

        // 툴을 '선택'하는 동작이고(해제가 아님), 마지막 단계가 아니라면
        if (!selectedTools.includes(toolId) && currentCategoryIndex < categories.length - 1) {
            // 선택된 효과를 아주 잠깐(0.35초) 보여준 뒤 다음 카테고리로 부드럽게 이동
            setTimeout(() => {
                setCurrentCategoryIndex((prev) => prev + 1);
            }, 350);
        }
    };

    // 현재 보여주어야 할 단일 카테고리
    const currentCategory = categories[currentCategoryIndex];

    return (
        <div className="ts-container">
            {/* 상단 워크플로우 플로우 (진행바) */}
            <div className="ts-flow-container">
                {categories.map((category, index) => {
                    // 현재 카테고리에서 선택된 툴 찾기
                    const selectedInCat = recommendedTools.filter(
                        (tool) => tool.category === category && selectedTools.includes(tool.id),
                    );

                    // 💡 현재 보고 있는 단계인지 확인
                    const isActiveView = currentCategoryIndex === index;

                    return (
                        <React.Fragment key={`flow-${category}`}>
                            <div
                                // 💡 onClick 이벤트 추가 및 활성화 클래스(active-view) 부여
                                className={`ts-flow-step ${selectedInCat.length > 0 ? 'selected' : ''} ${isActiveView ? 'active-view' : ''}`}
                                onClick={() => setCurrentCategoryIndex(index)}
                            >
                                {/* 카테고리 이름 (해당 카테고리 고유 색상 적용) */}
                                <div className="ts-flow-category" style={{color: getCategoryColor(category)}}>
                                    {category}
                                </div>

                                {/* 선택된 툴 이름 표시 (없으면 '미선택') */}
                                <div className="ts-flow-tool">
                                    {selectedInCat.length > 0 ? (
                                        selectedInCat.map((t) => t.name).join(', ')
                                    ) : (
                                        <span className="ts-flow-empty">미선택</span>
                                    )}
                                </div>
                            </div>

                            {/* 마지막 단계가 아니면 다음 단계로 넘어가는 화살표(>) 아이콘 추가 */}
                            {index < categories.length - 1 && (
                                <div className="ts-flow-arrow">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#cbd5e1"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* 💡 전체 카테고리 map을 지우고 현재 카테고리 1개만 렌더링하도록 수정 */}
            {currentCategory && (
                <div key={currentCategory} className="ts-category-section ts-fade-in">
                    <h3 className="ts-category-title">{currentCategory}</h3>

                    <div className="ts-grid">
                        {recommendedTools
                            .filter((tool) => tool.category === currentCategory)
                            .slice(0, 4)
                            .map((tool) => {
                                const isSelected = selectedTools.includes(tool.id);

                                // ⭐ 안전하게 배열로 파싱하는 로직 (유지)
                                const safeParseArray = (data) => {
                                    if (!data) return [];
                                    if (Array.isArray(data)) return data;
                                    try {
                                        const parsed = JSON.parse(data);
                                        return Array.isArray(parsed) ? parsed : [data];
                                    } catch (e) {
                                        if (typeof data === 'string') {
                                            if (data.includes(',') || data.includes('\n')) {
                                                return data
                                                    .split(/,|\n/)
                                                    .map((s) => s.trim())
                                                    .filter(Boolean);
                                            }
                                            return [data];
                                        }
                                        return [];
                                    }
                                };

                                const displayData = {
                                    pricing: tool.free_plan ? '무료 지원' : '유료 전용',
                                    level: tool.difficulty || '초급',
                                    specialized: tool.description || '특화 분야 없음',
                                    color: getCategoryColor(tool.category),
                                    pros: safeParseArray(tool.pros),
                                    cons: safeParseArray(tool.cons),
                                };

                                return (
                                    <div
                                        key={tool.id}
                                        onClick={() => handleToolSelect(tool.id)}
                                        className={`ts-card ${isSelected ? 'selected' : ''}`}
                                        onMouseEnter={() => setHoveredTooltip(tool.id)}
                                        onMouseLeave={() => setHoveredTooltip(null)}
                                    >
                                        {isSelected && <div className="ts-check-icon">✓</div>}
                                        <div className="ts-card-header">
                                            <div className="ts-icon-box">
                                                <img
                                                    src={
                                                        tool.thumbnail ||
                                                        `https://www.google.com/s2/favicons?domain=${tool.url || tool.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + '.com'}&sz=128`
                                                    }
                                                    alt={tool.name}
                                                    className="ts-tool-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'block';
                                                    }}
                                                />
                                                <span className="ts-fallback-icon">🤖</span>
                                            </div>
                                            <div className="ts-title-wrap">
                                                <h4 className="ts-tool-title">{tool.name}</h4>
                                                <div className="ts-badges-wrap">
                                                    <span
                                                        className="ts-badge"
                                                        style={{
                                                            backgroundColor: getPricingStyle(displayData.pricing).bg,
                                                            color: getPricingStyle(displayData.pricing).color,
                                                        }}
                                                    >
                                                        <span>{getPricingStyle(displayData.pricing).icon}</span>
                                                        {displayData.pricing}
                                                    </span>
                                                    <span
                                                        className="ts-badge"
                                                        style={{
                                                            backgroundColor: getLevelStyle(displayData.level).bg,
                                                            color: getLevelStyle(displayData.level).color,
                                                        }}
                                                    >
                                                        <span>{getLevelStyle(displayData.level).icon}</span>
                                                        {displayData.level}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ts-specialized" style={{color: displayData.color}}>
                                            ✦ {tool.desc_short || displayData.specialized}
                                        </div>

                                        {hoveredTooltip === tool.id && (
                                            <div className="ts-overlay">
                                                <div className="ts-overlay-inner">
                                                    <div className="ts-proscons-block">
                                                        <span className="ts-pros-badge">장점</span>
                                                        <ul className="ts-list">
                                                            {displayData.pros.slice(0, 3).map((pro, i) => (
                                                                <li key={i} className="ts-list-item">
                                                                    <span className="ts-pros-mark">+</span> {pro}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="ts-proscons-block">
                                                        <span className="ts-cons-badge">단점</span>
                                                        <ul className="ts-list">
                                                            {displayData.cons.slice(0, 3).map((con, i) => (
                                                                <li key={i} className="ts-list-item">
                                                                    <span className="ts-cons-mark">-</span> {con}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolSelector;
