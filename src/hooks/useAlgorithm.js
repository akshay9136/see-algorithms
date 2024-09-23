import React, { useState } from 'react';

const useAlgorithm = (algo) => {
  const [currentStep, setCurrentStep] = useState('');
  const steps = (
    <div className="algorithm">
      {algo.split('\n').slice(1, -1).map((step, i) => (
        <pre
          key={i}
          className={currentStep.includes(i) ? 'currentStep' : ''}
        >
          {step}
        </pre>
      ))}
    </div>
  );
  return [steps, setCurrentStep];
};

export default useAlgorithm;
