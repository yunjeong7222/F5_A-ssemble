import React, { useState } from 'react';
import './MainVisualizer.css'; 

// 💡 지금까지 만든 4개의 컴포넌트를 불러옵니다. (파일 경로에 맞게 수정해주세요)
import MainStep1Visualizer from './MainStep1Visualizer';
import MainStep2Visualizer from './MainStep2Visualizer';
import MainStep3Visualizer from './MainStep3Visualizer';
import MainStep4Visualizer from './MainStep4Visualizer';

const Tools = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="showcase-container">
      
      <div className="showcase-header">
        <h2 className="showcase-title">AIssemble 핵심 기능 미리보기</h2>
        
        {/* 네비게이션 탭 버튼 */}
        <div className="showcase-tabs">
          <button 
            onClick={() => setActiveStep(1)} 
            className={`showcase-tab ${activeStep === 1 ? 'active' : ''}`}
          >
            1. 목적 입력
          </button>
          <button 
            onClick={() => setActiveStep(2)} 
            className={`showcase-tab ${activeStep === 2 ? 'active' : ''}`}
          >
            2. 툴 조립
          </button>
          <button 
            onClick={() => setActiveStep(3)} 
            className={`showcase-tab ${activeStep === 3 ? 'active' : ''}`}
          >
            3. 결과 확인
          </button>
          <button 
            onClick={() => setActiveStep(4)} 
            className={`showcase-tab ${activeStep === 4 ? 'active' : ''}`}
          >
            4. 레시피 공유
          </button>
        </div>
      </div>

      {/* 선택된 단계의 컴포넌트 렌더링 영역 */}
      <div className="showcase-content">
        {activeStep === 1 && <MainStep1Visualizer />}
        {activeStep === 2 && <MainStep2Visualizer />}
        {activeStep === 3 && <MainStep3Visualizer />}
        {activeStep === 4 && <MainStep4Visualizer />}
      </div>

    </div>
  );
};

export default Tools;