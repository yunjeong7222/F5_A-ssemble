import React from 'react';
import useWorkflowStore from '../../store/workflowStore';

const ToolSelector = () => {
  const { recommendedTools, selectedTools, toggleSelectedTool } = useWorkflowStore();
  console.log("스토어에서 넘어온 데이터 확인:", recommendedTools[0]);
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      {categories.map(category => (
        <div key={category} style={{ marginBottom: '40px' }}>
          
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #f1f5f9' }}>
            {category}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
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

                // ⭐ 포장지 뜯는 복잡한 로직 다 지우고, 직관적으로 데이터 연결
                const displayData = {
                  pricing: tool.free_plan ? '무료 지원' : '유료 전용',
                  level: tool.difficulty || '초급',
                  specialized: tool.description || '특화 분야 없음',
                  color: getCategoryColor(tool.category), 
                  pros: safeParseArray(tool.pros), // 정상적으로 tools 테이블에서 꺼내온 데이터 연결
                  cons: safeParseArray(tool.cons)  // 정상적으로 tools 테이블에서 꺼내온 데이터 연결
                };

                return (
                  <div 
                    key={tool.id} 
                    onClick={() => toggleSelectedTool(tool.id)}
                    style={{ 
                      backgroundColor: isSelected ? '#faf5ff' : '#ffffff',
                      border: isSelected ? '2px solid #8b5cf6' : '1px solid #e2e8f0', 
                      borderRadius: '24px',
                      padding: '24px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 10px 25px rgba(139, 92, 246, 0.15)' : '0 4px 10px rgba(0,0,0,0.03)'
                    }}
                    onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: '#8b5cf6', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', fontWeight: 'bold' }}>✓</div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ width: '64px', height: '64px', backgroundColor: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #f1f5f9', flexShrink: 0 }}>
                        {/* ⭐ 정규식 적용된 썸네일 방어 로직 */}
                        <img 
                          // ⭐ DB에 썸네일이 있으면 쓰고, 없으면 툴의 진짜 url을 이용해 구글 아이콘을 가져옴
                          src={
                            tool.thumbnail || 
                            `https://www.google.com/s2/favicons?domain=${tool.url || tool.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + '.com'}&sz=128`
                          } 
                          alt={tool.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                          onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                        />
                        <span style={{ display: 'none', fontSize: '2rem' }}>🤖</span>
                      </div>
                      
                      <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {tool.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                            {displayData.pricing}
                          </span>
                          <span style={{ backgroundColor: '#dcfce3', color: '#15803d', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                            {displayData.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: displayData.color, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ✦ {displayData.specialized}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981', marginBottom: '10px' }}>장점</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {displayData.pros.length > 0 ? displayData.pros.map((pro, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '4px', wordBreak: 'keep-all', lineHeight: '1.4' }}>
                              <span style={{ color: '#10b981', fontWeight: 'bold' }}>+</span> <span>{pro}</span>
                            </li>
                          )) : <li style={{ fontSize: '0.8rem', color: '#94a3b8' }}>정보 없음</li>}
                        </ul>
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ef4444', marginBottom: '10px' }}>단점</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {displayData.cons.length > 0 ? displayData.cons.map((con, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '4px', wordBreak: 'keep-all', lineHeight: '1.4' }}>
                              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-</span> <span>{con}</span>
                            </li>
                          )) : <li style={{ fontSize: '0.8rem', color: '#94a3b8' }}>정보 없음</li>}
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