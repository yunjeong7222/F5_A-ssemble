import React from 'react';
import useWorkflowStore from '../../store/workflowStore';
// import ToolCard from '../tools/ToolCard'; // 실제 구현 시 공통 컴포넌트 재사용 권장

const ToolSelector = () => {
  const { recommendedTools, selectedTools, toggleSelectedTool } = useWorkflowStore();

  // 카테고리별로 툴을 그룹화하는 로직
  const categories = [...new Set(recommendedTools.map(tool => tool.category))];

  return (
    <div>
      {categories.map(category => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <h3>{category}</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {recommendedTools
              .filter(tool => tool.category === category)
              .map(tool => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <div 
                    key={tool.id} 
                    onClick={() => toggleSelectedTool(tool.id)}
                    style={{ 
                      border: isSelected ? '2px solid blue' : '1px solid gray', 
                      padding: '10px', 
                      cursor: 'pointer' 
                    }}
                  >
                    <strong>{tool.name}</strong> {isSelected && '✔️'}
                    <p>{tool.description}</p>
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