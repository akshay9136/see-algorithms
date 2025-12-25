import { testAnimation } from './test-utils/sorting';

import BubbleSort from '@/pages/sorting/BubbleSort';
import InsertionSort from '@/pages/sorting/InsertionSort';
import SelectionSort from '@/pages/sorting/SelectionSort';
import HeapSort from '@/pages/sorting/HeapSort';
import MergeSort from '@/pages/sorting/MergeSort';
import QuickSort from '@/pages/sorting/QuickSort';
import RadixSort from '@/pages/sorting/RadixSort';

describe('Bubble sort visualization', () => {
  testAnimation(BubbleSort);
});

describe('Insertion sort visualization', () => {
  testAnimation(InsertionSort);
});

describe('Selection sort visualization', () => {
  testAnimation(SelectionSort);
});

describe('Heap sort visualization', () => {
  testAnimation(HeapSort);
});

describe('Merge sort visualization', () => {
  testAnimation(MergeSort);
});

describe('Quick sort visualization', () => {
  testAnimation(QuickSort);
});

describe('Radix sort visualization', () => {
  testAnimation(RadixSort);
});
