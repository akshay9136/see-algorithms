import bTree from '@/helpers/bTree';

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

describe('bTree helper', () => {
  let tree, mockAnim, updateView;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnim = {
      bgcolor: jest.fn().mockResolvedValue(),
    };
    tree = bTree(mockAnim);
    updateView = jest.fn();
    // Mock DOM for computeLayout
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
    await drain(tree.insert(10, updateView));
    expect(updateView).toHaveBeenCalled();

    await drain(tree.insert(20, updateView));
    expect(mockAnim.bgcolor).toHaveBeenCalled();

    await drain(tree.insert(30, updateView));
    expect(tree.collect()).toEqual([20, 10, 30]);
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

  test('handles multiple splits (deep tree)', async () => {
    // Inserting 7 keys triggers multiple internal node splits
    const keys = [10, 20, 30, 40, 50, 60, 70];
    for (const key of keys) {
      await drain(tree.insert(key, updateView));
    }
    expect(tree.collect()).toContain(40); // root after balanced splits
    expect(tree.collect().length).toBe(keys.length);
  });

  test('search returns false for an empty tree', async () => {
    expect(await drain(tree.search(99))).toBe(false);
  });
});
