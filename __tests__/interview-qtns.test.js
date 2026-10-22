import { render } from '@testing-library/react';
import { interviewQtns } from '../src/data/interview-qtns';
import { algorithms } from '../src/common/appData';
import InterviewQtns from '../src/components/interview-qtns';

describe('Interview Questions', () => {
  test('All algorithms have dedicated interview question sets', () => {
    algorithms.forEach((algo) => {
      const questionSet = interviewQtns[algo.id];
      expect(questionSet).toBeDefined();
      expect(Array.isArray(questionSet)).toBe(true);
      expect(questionSet.length >= 1).toBe(true);
    });
  });

  test('Renders pre tag for answers with code snippets', () => {
    const { container } = render(<InterviewQtns algorithmId="SelectionSort" />);
    expect(container.querySelector('pre')).toBeInTheDocument();
  });
});
