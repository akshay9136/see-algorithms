import { render, screen, fireEvent } from '@testing-library/react';
import { interviewQtns as questionsMap } from '../src/data/interview-qtns';
import { algorithms } from '../src/common/appData';
import InterviewQtns from '../src/components/interview-qtns';

describe('Interview Questions Dataset Validation', () => {
  test('All algorithms in appData have dedicated interview question sets', () => {
    algorithms.forEach((algo) => {
      const questionSet = questionsMap[algo.id];
      expect(questionSet).toBeDefined();
      expect(Array.isArray(questionSet)).toBe(true);
      expect(questionSet.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('Every question entry contains required fields', () => {
    Object.entries(questionsMap).forEach(([algoId, questions]) => {
      questions.forEach((q) => {
        expect(typeof q.question).toBe('string');
        expect(q.question.length).toBeGreaterThan(5);
        expect(
          typeof q.answer === 'string' || typeof q.answer === 'object',
        ).toBe(true);
        if (typeof q.answer === 'string') {
          expect(q.answer.length).toBeGreaterThan(10);
        } else {
          expect(q.answer).toBeTruthy();
        }
      });
    });
  });
});

describe('InterviewQtns Component', () => {
  test('Renders section title and question cards for MergeSort', () => {
    render(<InterviewQtns algorithmId="MergeSort" />);

    expect(screen.getByText('Common Interview Questions')).toBeInTheDocument();
    expect(
      screen.getByText(/Why is Merge Sort preferred for sorting Linked Lists/i),
    ).toBeInTheDocument();
  });

  test('Answer text is present in the DOM for SEO when collapsed', () => {
    render(<InterviewQtns algorithmId="MergeSort" />);

    const answerElement = screen.getByText(
      /elements can be merged in-place by updating pointer references/i,
    );
    expect(answerElement).toBeInTheDocument();
  });

  test('Renders copy code button for answers with code snippets', () => {
    render(<InterviewQtns algorithmId="SelectionSort" />);

    const header = screen.getByText(/Why is Selection Sort unstable/i);
    fireEvent.click(header);

    expect(
      screen.getByRole('button', { name: 'Copy Code' }),
    ).toBeInTheDocument();
  });
});
