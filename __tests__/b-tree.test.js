import bTree from '@/helpers/bTree';

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

    // Mock DOM for computeLayout
    const bTreeDiv = document.createElement('div');
    bTreeDiv.id = 'bTree';
    document.body.appendChild(bTreeDiv);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('_insert adds elements and splits correctly', () => {
    // bTree ORDER is 3, so max keys per node is 2 before split.
    tree._insert(10);
    tree._insert(20);
    tree._insert(30);

    const snapshot = tree.getSnapshot();
    // After split, 20 is root, 10 is left child, 30 is right child.
    expect(snapshot.nodes.length).toBe(3); // Total nodes = 3
    expect(tree.collect()).toEqual([20, 10, 30]);
  });

  test('insert with animation', async () => {
    let gen = tree.insert(10, updateView);
    let res = await gen.next();
    while (!res.done) res = await gen.next();

    expect(updateView).toHaveBeenCalled();

    gen = tree.insert(20, updateView);
    res = await gen.next();
    while (!res.done) res = await gen.next();

    expect(mockAnim.bgcolor).toHaveBeenCalled();

    gen = tree.insert(30, updateView);
    res = await gen.next();
    while (!res.done) res = await gen.next();

    expect(tree.collect()).toEqual([20, 10, 30]);
  });

  test('search finds existing value and misses non-existing', async () => {
    tree._insert(10);
    tree._insert(20);
    tree._insert(30);

    let gen = tree.search(30);
    let res = await gen.next();
    while (!res.done) res = await gen.next();
    expect(res.value).toBe(true);

    gen = tree.search(40);
    res = await gen.next();
    while (!res.done) res = await gen.next();
    expect(res.value).toBe(false);
  });

  test('getSnapshot on empty tree', () => {
    const { nodes } = tree.getSnapshot();
    expect(nodes.length).toBe(0);
    expect(tree.collect()).toEqual([]);
  });
});
