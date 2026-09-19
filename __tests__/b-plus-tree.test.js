import bPlusTree from '@/helpers/bPlusTree';

jest.mock('@/common/utils', () => ({
  sound: jest.fn(),
  sleep: jest.fn().mockResolvedValue(),
}));

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
    // bPlusTree ORDER is 3, max keys in leaf is 2 before split.
    tree._insert(10);
    tree._insert(20);
    tree._insert(30);

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

    const leaves = tree.collect();
    expect(leaves.length).toBe(2);
  });

  test('search finds existing value and misses non-existing in leaf', async () => {
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
