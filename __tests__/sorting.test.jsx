import { render } from '@testing-library/react';
import { runAnimation } from './test-utils/sorting';
import BubbleSort from '@/pages/sorting/BubbleSort';
import InsertionSort from '@/pages/sorting/InsertionSort';
import SelectionSort from '@/pages/sorting/SelectionSort';
import HeapSort from '@/pages/sorting/HeapSort';
import MergeSort from '@/pages/sorting/MergeSort';
import QuickSort from '@/pages/sorting/QuickSort';
import RadixSort from '@/pages/sorting/RadixSort';

const numbers = [4, 1, 7, 3, 9, 2, 6, 8, 5];

describe('Bubble sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<BubbleSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('Insertion sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<InsertionSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('Selection sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<SelectionSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('Heap sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<HeapSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.node');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('Merge sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<MergeSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('Quick sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<QuickSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('Radix sort visualization', () => {
  test('renders in correct order after animation', async () => {
    const { container } = render(<RadixSort />);
    await runAnimation(numbers);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes)
        .slice(0, numbers.length)
        .map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});
