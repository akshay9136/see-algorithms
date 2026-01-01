import { useState } from 'react';

function useAlgorithm(algorithm) {
  const [currentStep, setCurrentStep] = useState('');
  const _currentStep = currentStep.length
    ? currentStep.split(',').map(Number)
    : [];
  const steps = (
    <div className="algorithm">
      {algorithm
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
