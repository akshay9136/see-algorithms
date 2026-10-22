import redBlackTree, { assignColors } from '@/helpers/redBlackTree';
import { runIt } from './test-utils/iterator';
import { Numbers } from './test-utils/common';

function validateTree(pairs) {
  if (!pairs) return { valid: true };

  class Node {
    constructor(val, color) {
      this.value = val;
      this.color = color;
      this.left = null;
      this.right = null;
    }
  }

  function insert(root, val, color) {
    if (!root) return new Node(val, color);
    if (val < root.value) root.left = insert(root.left, val, color);
    else root.right = insert(root.right, val, color);
    return root;
  }

  let root = null;
  for (const [val, color] of pairs) root = insert(root, val, color);

  // Property 1: Root must be black
  if (root.color !== 'B') {
    return { valid: false, reason: `Root ${root.value} is not Black` };
  }

  // - No adjacent red nodes
  // - All paths to leaves have same number of black nodes
  function validate(node) {
    if (!node) return { valid: true, bh: 0 };

    if (node.color === 'R') {
      if (
        (node.left && node.left.color === 'R') ||
        (node.right && node.right.color === 'R')
      ) {
        return { valid: false, reason: `Adjacent red nodes at ${node.value}` };
      }
    }

    const left = validate(node.left);
    if (!left.valid) return left;

    const right = validate(node.right);
    if (!right.valid) return right;

    if (left.bh !== right.bh) {
      return { valid: false, reason: `Black height mismatch at ${node.value}` };
    }

    return { valid: true, bh: left.bh + (node.color === 'B' ? 1 : 0) };
  }

  return validate(root);
}

describe('assignColors for Red-Black Tree', () => {
  test('handles empty array', () => {
    expect(assignColors([])).toEqual([]);
    expect(assignColors(null)).toEqual([]);
  });

  test('colors single node black', () => {
    const res = assignColors([42]);
    expect(res).toEqual([[42, 'B']]);
    expect(validateTree(res).valid).toBe(true);
  });

  test('colors two nodes with black root and red child', () => {
    const res1 = assignColors([20, 10]);
    expect(res1).toEqual([
      [20, 'B'],
      [10, 'R'],
    ]);
    expect(validateTree(res1).valid).toBe(true);
    const res2 = assignColors([20, 30]);
    expect(res2).toEqual([
      [20, 'B'],
      [30, 'R'],
    ]);
    expect(validateTree(res2).valid).toBe(true);
  });

  test('colors three balanced nodes with black root and red children', () => {
    const res = assignColors([20, 10, 30]);
    expect(res).toEqual([
      [20, 'B'],
      [10, 'R'],
      [30, 'R'],
    ]);
    expect(validateTree(res).valid).toBe(true);
  });

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 31])(
    'colors a balanced tree of %i keys',
    (size) => {
      function balancedOrder(values) {
        if (!values.length) return [];
        const middle = Math.floor(values.length / 2);
        return [
          values[middle],
          ...balancedOrder(values.slice(0, middle)),
          ...balancedOrder(values.slice(middle + 1)),
        ];
      }
      const keys = balancedOrder(
        Array.from({ length: size }, (_, i) => i - 15),
      );
      const colored = assignColors(keys);
      expect(colored.map(([value]) => value)).toEqual(keys);
      expect(validateTree(colored)).toMatchObject({ valid: true });
    },
  );

  test('produces valid coloring for specific balanced tree orders', () => {
    const testCases = [
      [30, 20, 10, 50, 40],
      [40, 20, 10, 30, 50, 60],
      [40, 20, 10, 30, 60, 50, 70],
      [50, 20, 10, 30, 40, 70, 60, 90, 80],
    ];
    for (const testCase of testCases) {
      const colored = assignColors(testCase);
      expect(validateTree(colored).valid).toBe(true);
    }
  });
});

describe('redBlackTree helper - insert and delete', () => {
  let tree, mockAnim;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnim = {
      bgcolor: jest.fn().mockResolvedValue(),
      animate: jest.fn().mockResolvedValue(),
      txy: jest.fn().mockResolvedValue(),
      tx: jest.fn().mockResolvedValue(),
      ty: jest.fn().mockResolvedValue(),
      cleanup: jest.fn(),
      scope: {
        current: {
          getBoundingClientRect: () => ({ width: 700, height: 500 }),
          querySelector: (query) => {
            // Return a minimal DOM-like stub so updateColor doesn't crash
            const el = document.querySelector(query);
            if (el) return el;
            return { textContent: '', style: {} };
          },
        },
      },
    };
    tree = redBlackTree(mockAnim);
  });

  /**
   * Helper function to validate Red-Black Tree properties
   */
  function expectRedBlackTree(expected) {
    const root = tree.root();
    const values = [];
    const visited = new Set();
    if (root) {
      expect(root.color).toBe('B');
      expect(root.parent).toBeNull();
    }
    function visit(node, parent, lower, upper) {
      if (!node) return 1;
      expect(visited.has(node.key)).toBe(false);
      visited.add(node.key);
      expect(node.deleted).not.toBe(true);
      expect(node.parent?.key ?? null).toBe(parent?.key ?? null);
      expect(node.value).toBeGreaterThan(lower);
      expect(node.value).toBeLessThan(upper);
      expect(['R', 'B']).toContain(node.color);
      if (node.color === 'R') {
        expect(node.left?.color ?? 'B').toBe('B');
        expect(node.right?.color ?? 'B').toBe('B');
      }
      const leftHeight = visit(node.left, node, lower, node.value);
      values.push(node.value);
      const rightHeight = visit(node.right, node, node.value, upper);
      expect(leftHeight).toBe(rightHeight);
      return leftHeight + (node.color === 'B' ? 1 : 0);
    }
    visit(root, null, -Infinity, Infinity);
    expect(values).toEqual(Numbers.sortAsc(expected));
    expect(Numbers.sortAsc(tree.collect())).toEqual(values);
    expect(tree.size()).toBe(expected.length);
  }

  async function insertKeys(keys) {
    const inserted = [];
    for (const key of keys) {
      await runIt(tree.insert(key));
      inserted.push(key);
      expectRedBlackTree(inserted);
    }
  }

  test('inserts a black root and a red child', async () => {
    await insertKeys([50, 30]);
    expect(tree.root().value).toBe(50);
    expect(tree.root().left).toMatchObject({ value: 30, color: 'R' });
  });

  test.each([
    ['LL', [50, 30, 10]],
    ['RR', [10, 30, 50]],
    ['LR', [50, 10, 30]],
    ['RL', [10, 50, 30]],
  ])('%s insertion rotates into a balanced tree', async (_label, keys) => {
    await insertKeys(keys);
    expect(tree.root()).toMatchObject({ value: 30, color: 'B' });
    expect(tree.root().left).toMatchObject({ value: 10, color: 'R' });
    expect(tree.root().right).toMatchObject({ value: 50, color: 'R' });
  });

  test('recolors red parent and uncle without losing keys', async () => {
    await insertKeys([50, 30, 70, 20]);
    expect(tree.root()).toMatchObject({ value: 50, color: 'B' });
    expect(tree.root().left).toMatchObject({ value: 30, color: 'B' });
    expect(tree.root().right).toMatchObject({ value: 70, color: 'B' });
    expect(tree.root().left.left).toMatchObject({ value: 20, color: 'R' });
  });

  test.each([
    ['left leaf, black sibling', [[50, 'B'], [30, 'B'], [70, 'B']], 30],
    ['right leaf, black sibling', [[50, 'B'], [30, 'B'], [70, 'B']], 70],
    ['far red nephew', [[50, 'B'], [30, 'B'], [70, 'B'], [80, 'R']], 30],
    ['near red nephew', [[50, 'B'], [30, 'B'], [70, 'B'], [60, 'R']], 30],
    ['mirrored far red nephew', [[50, 'B'], [30, 'B'], [20, 'R'], [70, 'B']], 70],
    ['mirrored near red nephew', [[50, 'B'], [30, 'B'], [40, 'R'], [70, 'B']], 70],
    ['red sibling', [[50, 'B'], [30, 'B'], [70, 'R'], [60, 'B'], [80, 'B']], 30],
    [
      'propagates double black',
      [[50, 'B'], [30, 'B'], [70, 'B'], [20, 'B'], [40, 'B'], [60, 'B'], [80, 'B']],
      20,
    ],
  ])('deleting a black leaf: %s', async (_label, pairs, deleted) => {
    pairs.forEach((pair) => tree._insert(pair));
    const keys = pairs.map(([value]) => value);
    expectRedBlackTree(keys);
    const target = tree.collect((node) => node).find((node) => node.value === deleted);
    expect(target.color).toBe('B');
    expect(target.left).toBeNull();
    expect(target.right).toBeNull();
    await runIt(tree.deleteNode(deleted));
    expectRedBlackTree(keys.filter((value) => value !== deleted));
  });

  test('deletes a red leaf and preserves the other nodes', async () => {
    await insertKeys([50, 30, 70]);
    expect(tree.root().left.color).toBe('R');
    await runIt(tree.deleteNode(30));
    expectRedBlackTree([50, 70]);
  });

  test('replaces a black node with its red child and colors it black', async () => {
    await insertKeys([50, 30, 70, 20]);
    expect(tree.root().left.color).toBe('B');
    await runIt(tree.deleteNode(30));
    expectRedBlackTree([50, 70, 20]);
    expect(tree.root().left).toMatchObject({ value: 20, color: 'B' });
  });

  test.each([30, 50])(
    'deletes two-child node %i via its successor',
    async (deleted) => {
      const keys = [50, 30, 70, 20, 40, 60, 80];
      await insertKeys(keys);
      await runIt(tree.deleteNode(deleted));
      expectRedBlackTree(keys.filter((value) => value !== deleted));
    },
  );

  test('_insert preserves supplied values, colors, and links', () => {
    const pairs = [[50, 'B'], [30, 'R'], [70, 'R']];
    pairs.forEach((pair) => tree._insert(pair));
    expect(tree.collect((node) => [node.value, node.color])).toEqual(pairs);
    expectRedBlackTree([50, 30, 70]);
  });
});
