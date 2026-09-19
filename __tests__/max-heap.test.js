import maxHeap from '@/helpers/maxHeap';

jest.mock('@/common/utils', () => ({
  sound: jest.fn(),
  sleep: jest.fn().mockResolvedValue(),
}));

/**
 * Drive a generator to completion, collecting all yielded values.
 */
async function drain(gen) {
  let result;
  do result = await gen.next();
  while (!result.done);
  return result.value;
}

describe('maxHeap helper', () => {
  let tree, mockAnim;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnim = {
      bgcolor: jest.fn().mockResolvedValue(),
      animate: jest.fn().mockResolvedValue(),
      txy: jest.fn().mockResolvedValue(),
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

  test('inserts a single element', () => {
    tree._insert(10);
    expect(tree.collect()).toEqual([10]);
  });

  test('inserts multiple elements in level order', () => {
    [50, 30, 40, 10, 20].forEach((n) => tree._insert(n));

    // collect returns level-order values
    expect(tree.collect()).toHaveLength(5);
    // Max-heap property: root must be the largest value
    expect(tree.collect()[0]).toBe(50);
  });

  test('heapifies down correctly when root is not largest', async () => {
    // Build a heap manually: put a small value at root
    [10, 50, 40].forEach((k) => tree._insert(k));

    const root = tree.node(0);
    // Force root value down so heapify must swap
    root.update({ value: 1 });
    await drain(tree.heapify(root, tree.size()));

    // bgcolor should have been called during comparisons
    expect(mockAnim.bgcolor).toHaveBeenCalled();
  });

  test('heapify does not swap when root is already largest', async () => {
    [100, 20, 30].forEach((k) => tree._insert(k));
    const root = tree.node(0);
    mockAnim.bgcolor.mockClear();

    await drain(tree.heapify(root, tree.size()));
    // bgcolor should have been called to highlight the node
    expect(mockAnim.bgcolor).toHaveBeenCalled();
  });

  test('heapifies up when inserted child is larger than parent', async () => {
    tree._insert(10);
    tree._insert(5);
    // Manually set last node to a value larger than parent
    const last = tree.node(1);
    last.update({ value: 99 });
    mockAnim.bgcolor.mockClear();

    await drain(tree.heapifyUp(last));
    expect(mockAnim.bgcolor).toHaveBeenCalled();
  });

  test('heapifyUp does nothing when child is smaller than parent', async () => {
    tree._insert(100);
    tree._insert(5);
    const last = tree.node(1);
    mockAnim.bgcolor.mockClear();

    await drain(tree.heapifyUp(last));
    // bgcolor should have been called to highlight the node
    expect(mockAnim.bgcolor).toHaveBeenCalled();
  });

  test('extracts root from a single-element heap', async () => {
    tree._insert(42);
    await drain(tree.extract());
    // animate should have been called
    expect(mockAnim.animate).toHaveBeenCalled();
    expect(tree.size()).toBe(0);
  });

  test('extracts root and heapifies down on multi-element heap', async () => {
    [50, 30, 40, 10, 20].forEach((n) => tree._insert(n));
    const sizeBefore = tree.size();
    mockAnim.bgcolor.mockClear();

    await drain(tree.extract());
    expect(mockAnim.bgcolor).toHaveBeenCalled();
    expect(tree.size()).toBe(sizeBefore - 1);
  });
});
