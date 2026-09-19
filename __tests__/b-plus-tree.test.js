import bPlusTree from '@/helpers/bPlusTree';

jest.mock('@/common/utils', () => ({
  sound: jest.fn(),
  sleep: jest.fn().mockResolvedValue(),
}));

/**
 * Drive a generator to completion.
 */
async function drain(gen) {
  let result;
  do result = await gen.next();
  while (!result.done);
  return result.value;
}

describe('bPlusTree helper', () => {
  let tree, mockAnim, updateView;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnim = {
      bgcolor: jest.fn().mockResolvedValue(),
    };
    tree = bPlusTree(mockAnim);
    updateView = jest.fn();
    const bTreeDiv = document.createElement('div');
    bTreeDiv.id = 'bPlusTree';
    document.body.appendChild(bTreeDiv);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('_insert adds elements and splits leaves correctly', () => {
    // B+ tree ORDER is 3, max keys in leaf is 2 before split.
    [10, 20, 30].forEach((k) => tree._insert(k));

    const snapshot = tree.getSnapshot();
    // For B+ tree order 3: Inserting 10, 20 into root leaf.
    // Inserting 30 splits the leaf. We should have a root and two leaves.
    expect(snapshot.nodes.length).toBe(3);
    // Leaf links should connect the two leaves
    expect(snapshot.leafLinks.length).toBe(1);

    // groups by leaf node
    const leaves = tree.collect();
    expect(leaves.length).toBe(2);
    expect(leaves[0]).toEqual([10, 20]);
    expect(leaves[1]).toEqual([30]);
  });

  test('insert with animation', async () => {
    await drain(tree.insert(10, updateView));
    expect(updateView).toHaveBeenCalled();

    await drain(tree.insert(20, updateView));
    expect(mockAnim.bgcolor).toHaveBeenCalled();

    await drain(tree.insert(30, updateView));
    const leaves = tree.collect();
    expect(leaves.length).toBe(2);
  });

  test('search finds existing value and misses non-existing', async () => {
    [10, 20, 30].forEach((k) => tree._insert(k));

    expect(await drain(tree.search(30))).toBe(true);
    expect(await drain(tree.search(40))).toBe(false);
  });

  test('getSnapshot on empty tree', () => {
    const { nodes } = tree.getSnapshot();
    expect(nodes.length).toBe(0);
    expect(tree.collect()).toEqual([]);
  });

  test('handles multiple leaf splits and internal splits', async () => {
    // Insert enough keys to trigger multiple leaf splits and an internal split
    const keys = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    for (const key of keys) {
      await drain(tree.insert(key, updateView));
    }
    const leaves = tree.collect();
    // All keys must appear exactly once across all leaf nodes
    const allKeys = leaves.flat();
    expect(allKeys.sort((a, b) => a - b)).toEqual(keys);
  });

  test('search returns false on empty tree', async () => {
    expect(await drain(tree.search(99))).toBe(false);
  });

  test('search in a leaf node after multiple inserts', async () => {
    [5, 15, 25, 35, 45].forEach((k) => tree._insert(k));
    expect(await drain(tree.search(5))).toBe(true);
    expect(await drain(tree.search(99))).toBe(false);
  });
});
