import React from 'react';

const StepCard = ({ stepData }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(stepData.prompt)
      .then(() => alert('프롬프트가 복사되었습니다!'))
      .catch(err => console.error('복사 실패:', err));
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
      <h4>STEP {stepData.step} {stepData.tool} <span style={{fontSize: '12px', color: 'gray'}}>{stepData.title}</span></h4>
      
      <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
        <p>{stepData.prompt}</p>
      </div>
      
      <button onClick={handleCopy}>복사</button>
    </div>
  );
};

export default StepCard;