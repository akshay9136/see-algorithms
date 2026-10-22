import { runIt } from './test-utils/iterator';
import { Numbers } from './test-utils/common';
import maxHeap from '@/helpers/maxHeap';

jest.mock('@/common/utils', () => ({
  sound: jest.fn(),
  sleep: jest.fn().mockResolvedValue(),
}));

describe('maxHeap helper', () => {
  let tree, mockAnim;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnim = {
      bgcolor: jest.fn().mockResolvedValue(),
      animate: jest.fn().mockResolvedValue(),
      txy: jest.fn().mockResolvedValue(),
      tx: jest.fn().mockResolvedValue(),
      cleanup: jest.fn(),
      scope: {
        current: {
          querySelector: (q) => document.querySelector(q),
          getBoundingClientRect: () => ({ width: 700, height: 500 }),
        },
      },
    };
    tree = maxHeap(mockAnim);
  });

  function expectHeap(expected) {
    const values = tree.collect();
    expect(tree.size()).toBe(expected.length);
    expect(Numbers.sortAsc(values)).toEqual(Numbers.sortAsc(expected));

    for (let i = 1; i < values.length; i++) {
      expect(values[Math.floor((i - 1) / 2)] >= values[i]).toBe(true);
      expect(tree.node(i).parent.key).toBe(
        tree.node(Math.floor((i - 1) / 2)).key,
      );
    }
  }

  test('_insert appends in level order without automatically heapifying', () => {
    [10, 50, 40, 20].forEach((value) => tree._insert(value));
    expect(tree.collect()).toEqual([10, 50, 40, 20]);
    expect(tree.size()).toBe(4);
  });

  test.each([
    ['left child is largest', [1, 50, 40], [50, 1, 40]],
    ['right child is largest', [1, 40, 50], [50, 40, 1]],
    ['only a left child', [1, 50], [50, 1]],
    [
      'multiple levels',
      [1, 90, 80, 70, 60, 50, 40],
      [90, 70, 80, 1, 60, 50, 40],
    ],
    ['already a heap', [100, 20, 30], [100, 20, 30]],
    ['equal values', [5, 5, 5], [5, 5, 5]],
  ])('heapify: %s', async (_label, input, expected) => {
    input.forEach((value) => tree._insert(value));
    await runIt(tree.heapify(tree.root(), tree.size()));
    expect(tree.collect()).toEqual(expected);
    expectHeap(input);
  });

  test('heapify respects the active heap boundary', async () => {
    [1, 40, 99].forEach((value) => tree._insert(value));
    await runIt(tree.heapify(tree.root(), 2));
    expect(tree.collect()).toEqual([40, 1, 99]);
  });

  test.each([
    ['larger child', [10, 99], [99, 10]],
    ['multiple levels', [100, 50, 40, 200], [200, 100, 40, 50]],
    ['smaller child', [100, 5], [100, 5]],
    ['equal child', [5, 5], [5, 5]],
    ['root only', [42], [42]],
  ])('heapify up: %s', async (_label, input, expected) => {
    input.forEach((value) => tree._insert(value));
    await runIt(tree.heapifyUp(tree.node(input.length - 1)));
    expect(tree.collect()).toEqual(expected);
    expectHeap(input);
  });

  test('extracts the only element and clears the root', async () => {
    tree._insert(42);
    await runIt(tree.extract());
    expect(tree.collect()).toEqual([]);
    expect(tree.root()).toBeNull();
    expect(tree.size()).toBe(0);
  });

  test.each([[[100, 90, 80, 70, 60, 50, 40]], [[5, 5, 0, -1, -3, -4]]])(
    'repeated extraction returns in descending order for %j',
    async (input) => {
      const expected = Numbers.sortDesc(input);
      input.forEach((value) => tree._insert(value));

      for (let i = 0; i < expected.length; i++) {
        expect(tree.root().value).toBe(expected[i]);
        await runIt(tree.extract());
        expectHeap(expected.slice(i + 1));
      }
      expect(tree.root()).toBeNull();
    },
  );
});
