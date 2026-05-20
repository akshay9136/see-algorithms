import { useState } from 'react';
import { Paper } from '@mui/material';

function useAlgorithm(algorithm) {
  const [currentStep, setCurrentStep] = useState('');

  const stepsToColor = currentStep.length
    ? currentStep.split(',').map(Number)
    : [];

  const steps = (
    <Paper className="pseudoCode">
      {algorithm
        .split('\n')
        .slice(1, -1)
        .map((step, index) => (
          <pre
            key={index}
            className={stepsToColor.includes(index) ? 'currentStep' : ''}
          >
            {step}
          </pre>
        ))}
    </Paper>
  );

  return [steps, setCurrentStep];
}

export default useAlgorithm;
