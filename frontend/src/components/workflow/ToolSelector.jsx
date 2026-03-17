import React from 'react';
import useWorkflowStore from '../../store/workflowStore';
import '../../styles/Workflow.css'; // 💡 Workflow.css 가져오기

const ToolSelector = () => {
  const { recommendedTools, selectedTools, toggleSelectedTool } = useWorkflowStore();
  const categories = [...new Set(recommendedTools.map(tool => tool.category))];

  const getCategoryColor = (categoryName) => {
    const colors = {
      '기획 및 스크립트': '#8b5cf6',
      '영상 소스 생성': '#10b981',
      '성우 / TTS': '#f59e0b',
      '편집 / 숏폼 변환': '#ec4899',
      '디자인': '#3b82f6',
      '데이터 분석': '#0ea5e9',
    };
    return colors[categoryName] || '#64748b';
  };

  const getPricingStyle = (pricing) => {
    return pricing === '무료 지원' 
      ? { bg: '#e0f2fe', color: '#0369a1', icon: '✨' } 
      : { bg: '#f1f5f9', color: '#475569', icon: '💳' }; 
  };

  const getLevelStyle = (level) => {
    if (level === '초급') return { bg: '#dcfce3', color: '#15803d', icon: '🌱' }; 
    if (level === '중급') return { bg: '#fef3c7', color: '#b45309', icon: '⭐' }; 
    if (level === '고급') return { bg: '#fee2e2', color: '#b91c1c', icon: '🔥' }; 
    return { bg: '#f3f4f6', color: '#374151', icon: '📌' }; 
  };

  return (
    <div className="ts-container">
      {categories.map(category => (
        <div key={category} className="ts-category-section">
          
          <h3 className="ts-category-title">{category}</h3>
          
          <div className="ts-grid">
            {recommendedTools
              .filter(tool => tool.category === category)
              .map(tool => {
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
                        return data.split(/,|\n/).map(s => s.trim()).filter(Boolean);
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
                  cons: safeParseArray(tool.cons)  
                };

                return (
                  <div 
                    key={tool.id} 
                    onClick={() => toggleSelectedTool(tool.id)}
                    className={`ts-card ${isSelected ? 'selected' : ''}`}
                  >
                    
                    {isSelected && <div className="ts-check-icon">✓</div>}

                    <div className="ts-card-header">
                      <div className="ts-icon-box">
                        {/* ⭐ 정규식 적용된 썸네일 방어 로직 */}
                        <img 
                          src={
                            tool.thumbnail || 
                            `https://www.google.com/s2/favicons?domain=${tool.url || tool.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + '.com'}&sz=128`
                          } 
                          alt={tool.name} 
                          className="ts-tool-img"
                          onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                        />
                        <span className="ts-fallback-icon">🤖</span>
                      </div>
                      
                      <div className="ts-title-wrap">
                        <h4 className="ts-tool-title">{tool.name}</h4>
                        <div className="ts-badges-wrap">
                          {/* 뱃지 색상은 동적 데이터이므로 style 유지 */}
                          <span className="ts-badge" style={{ backgroundColor: getPricingStyle(displayData.pricing).bg, color: getPricingStyle(displayData.pricing).color }}>
                            <span>{getPricingStyle(displayData.pricing).icon}</span>
                            {displayData.pricing}
                          </span>
                          
                          <span className="ts-badge" style={{ backgroundColor: getLevelStyle(displayData.level).bg, color: getLevelStyle(displayData.level).color }}>
                            <span>{getLevelStyle(displayData.level).icon}</span>
                            {displayData.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ts-specialized" style={{ color: displayData.color }}>
                      ✦ {displayData.specialized}
                    </div>

                    <div className="ts-proscons-wrap">
                      {/* 장점 영역 */}
                      <div className="ts-proscons-block">
                        <div className="ts-pros-title">
                          <span className="ts-pros-badge"> 장점</span>
                        </div>
                        <ul className="ts-list">
                          {displayData.pros.length > 0 ? displayData.pros.slice(0, 3).map((pro, i) => (
                            <li key={i} className="ts-list-item">
                              <span className="ts-pros-mark">+</span> 
                              <span>{pro}</span>
                            </li>
                          )) : <li className="ts-empty-info">정보 없음</li>}
                        </ul>
                      </div>
                      
                      {/* 단점 영역 */}
                      <div className="ts-proscons-block">
                        <div className="ts-cons-title">
                          <span className="ts-cons-badge"> 단점</span>
                        </div>
                        <ul className="ts-list">
                          {displayData.cons.length > 0 ? displayData.cons.slice(0, 3).map((con, i) => (
                            <li key={i} className="ts-list-item">
                              <span className="ts-cons-mark">-</span> 
                              <span>{con}</span>
                            </li>
                          )) : <li className="ts-empty-info">정보 없음</li>}
                        </ul>
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolSelector;