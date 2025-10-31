import React, { useState } from 'react';

const useAlgorithm = (algo) => {
  const [currentStep, setCurrentStep] = useState('');
  const _currentStep = currentStep.length
    ? currentStep.split(',').map(Number)
    : [];
  const steps = (
    <div className="algorithm">
      {algo
        .split('\n')
        .slice(1, -1)
        .map((step, i) => (
          <pre
            key={i}
            className={_currentStep.includes(i) ? 'currentStep' : ''}
          >
            {step}
          </pre>
        ))}
    </div>
  );
  return [steps, setCurrentStep];
};

export default useAlgorithm;
