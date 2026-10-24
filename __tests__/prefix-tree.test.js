import prefixTree from '@/helpers/prefixTree';

jest.mock('@/common/utils', () => ({
  sleep: jest.fn().mockResolvedValue(),
  sound: jest.fn(),
}));

async function complete(gen) {
  let result;
  do result = await gen.next();
  while (!result.done);
  return result.value;
}

describe('prefix tree visualization', () => {
  test('shares case-insensitive prefixes and produces a connected layout', () => {
    const tree = prefixTree();
    tree.insert('CAT');
    const snapshot = tree.insert('car');
    expect(snapshot.nodes.map((node) => node.char).join('')).toEqual('catr');
    expect(snapshot.edges).toHaveLength(snapshot.nodes.length - 1);
    expect(
      snapshot.nodes.filter((node) => node.isEnd).map((node) => node.char),
    ).toEqual(['t', 'r']);
    for (const { from, to } of snapshot.edges) {
      expect(to.parent).toBe(from);
      expect(to.y).toBeGreaterThan(from.y);
    }
  });

  test('animated insertion publishes highlights and reuses existing prefixes', async () => {
    const tree = prefixTree();
    tree.insert('cat');
    const frames = [];
    await complete(
      tree.insertAnimated('CAR', (snapshot) => {
        frames.push(snapshot.nodes.map((a) => ({ ...a })));
      }),
    );
    expect(frames).toHaveLength(4);
    expect(frames[0].find((node) => node.char === 'c').highlighted).toBe(true);
    const last = frames[3].find((node) => node.char === 'r');
    expect(last.isEnd).toBe(true);
    expect(last.highlighted).toBe(false);
    expect(tree.snapshot().nodes).toHaveLength(5);
  });

  test('search finds a word and clears its highlights', async () => {
    const tree = prefixTree();
    tree.insert('cat');
    const path = await complete(tree.searchAnimated('CAT', jest.fn()));
    expect(path.at(-1).isEnd).toBe(true);
    expect(path.map((node) => node.char)).toEqual(['c', 'a', 't']);
    expect(path.every((node) => node.highlighted === false)).toBe(true);
  });

  test('missing searches flash the matched prefix and then clear it', async () => {
    const tree = prefixTree();
    tree.insert('cat');
    const highlights = [];
    const result = await complete(
      tree.searchAnimated('car', (snapshot) => {
        highlights.push(snapshot.nodes.map((node) => node.highlighted));
      }),
    );
    expect(result).toBe(false);
    expect(highlights.some((frame) => frame.includes('miss'))).toBe(true);
    expect(highlights.at(-1).every((value) => value === false)).toBe(true);
    expect(await complete(tree.searchAnimated('dog', jest.fn()))).toBe(false);
  });

  test('deletion preserves other words and only prunes unused suffixes', async () => {
    const tree = prefixTree();
    tree.insert('car');
    tree.insert('cart');
    tree.insert('cat');
    const find = (word) => complete(tree.searchAnimated(word, jest.fn()));
    expect(tree.deleteWord(await find('ca'))).toBeNull();
    tree.deleteWord(await find('cart'));
    expect((await find('car')).at(-1).isEnd).toBe(true);
    expect(await find('cart')).toBe(false);
    tree.deleteWord(await find('car'));
    expect((await find('cat')).at(-1).isEnd).toBe(true);
    const snapshot = tree.deleteWord(await find('cat'));
    expect(snapshot.nodes).toHaveLength(1);
    expect(snapshot.edges).toEqual([]);
  });

  test('deleting a prefix word keeps its longer word, and clear resets the tree', async () => {
    const tree = prefixTree();
    tree.insert('car');
    tree.insert('cart');
    tree.deleteWord(await complete(tree.searchAnimated('car', jest.fn())));
    const path = await complete(tree.searchAnimated('cart', jest.fn()));
    expect(path[2].isEnd).toBe(false);
    expect(path[3].isEnd).toBe(true);
    const before = tree.snapshot();
    const cleared = tree.clear();
    expect(cleared.version).toBeGreaterThan(before.version);
    expect(cleared.nodes).toHaveLength(1);
    expect(cleared.nodes[0].char).toBe('');
    expect(cleared.nodes[0].isEnd).toBe(false);
    expect(cleared.nodes[0].parent).toBe(null);
    expect(cleared.edges).toEqual([]);
  });
});
