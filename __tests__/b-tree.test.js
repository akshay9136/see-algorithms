import bTree from '@/helpers/bTree';
import { expectbTree } from './test-utils/multiway-tree';
import { runIt } from './test-utils/iterator';

jest.mock('@/common/utils', () => ({
  sound: jest.fn(),
  sleep: jest.fn().mockResolvedValue(),
}));

describe('bTree helper', () => {
  let tree, mockAnim, updateView;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnim = {
      bgcolor: jest.fn().mockResolvedValue(),
    };
    tree = bTree(mockAnim);
    updateView = jest.fn();
    const bTreeDiv = document.createElement('div');
    bTreeDiv.id = 'bTree';
    document.body.appendChild(bTreeDiv);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('_insert adds elements and splits correctly', () => {
    // B tree ORDER is 3, so max keys per node is 2 before split.
    [10, 20, 30].forEach((k) => tree._insert(k));
    const snapshot = tree.getSnapshot();
    // After split, 20 is root, 10 is left child, 30 is right child.
    expect(snapshot.nodes.length).toBe(3); // Total nodes = 3
    expect(tree.collect()).toEqual([20, 10, 30]);
  });

  test('insert with animation', async () => {
    await runIt(tree.insert(10, updateView));
    expect(updateView).toHaveBeenCalledWith(tree.getSnapshot());
    expect(tree.collect()).toEqual([10]);

    await runIt(tree.insert(20, updateView));
    expect(mockAnim.bgcolor).toHaveBeenCalled();
    expect(updateView).toHaveBeenCalledWith(tree.getSnapshot());
    expect(tree.collect()).toEqual([10, 20]);

    await runIt(tree.insert(30, updateView));
    expect(updateView).toHaveBeenCalledWith(tree.getSnapshot());
    expect(tree.collect()).toEqual([20, 10, 30]);
  });

  test('search finds existing value and misses non-existing', async () => {
    [10, 20, 30].forEach((k) => tree._insert(k));
    expect(await runIt(tree.search(30))).toBe(true);
    expect(await runIt(tree.search(40))).toBe(false);
  });

  test('getSnapshot on empty tree', () => {
    const { nodes } = tree.getSnapshot();
    expect(nodes.length).toBe(0);
    expect(tree.collect()).toEqual([]);
  });

  describe.each([
    ['ascending', [10, 20, 30, 40, 50, 60, 70, 80, 90]],
    ['descending', [90, 80, 70, 60, 50, 40, 30, 20, 10]],
    ['mixed', [30, -10, 70, 0, 50, -30, 90, 10, 60]],
  ])('%s insertion order', (_label, keys) => {
    test.each(['animated', 'immediate'])(
      '%s insertion preserves tree invariants after every key',
      async (mode) => {
        for (const key of keys) {
          if (mode === 'animated') {
            await runIt(tree.insert(key, updateView));
            expect(updateView).toHaveBeenCalledWith(tree.getSnapshot());
          } else {
            tree._insert(key);
          }
        }
        const { nodes } = tree.getSnapshot();
        expect(new Set(nodes.map((a) => a.y)).size >= 3).toBe(true);
        expectbTree(tree, keys);
      },
    );
  });

  test.each([
    [10, true],
    [20, true],
    [30, true],
    [40, true],
    [50, true],
    [60, true],
    [70, true],
    [80, true],
    [90, true],
    [0, false],
    [15, false],
    [35, false],
    [95, false],
  ])(
    'search(%s) returns %s without changing the tree',
    async (key, expected) => {
      [10, 20, 30, 40, 50, 60, 70, 80, 90].forEach((value) =>
        tree._insert(value),
      );
      const before = tree.getSnapshot();
      expect(await runIt(tree.search(key))).toBe(expected);
      expect(tree.getSnapshot()).toEqual(before);
    },
  );

  test('search returns false for an empty tree', async () => {
    expect(await runIt(tree.search(99))).toBe(false);
  });
});
