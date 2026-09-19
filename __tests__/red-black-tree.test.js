import redBlackTree, { assignColors } from '@/helpers/redBlackTree';
import { randomKeys } from '@/common/utils';

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

  test('assigns valid Red-Black tree coloring for randomKeys across multiple iterations', () => {
    for (let i = 0; i < 50; i++) {
      const keys = randomKeys();
      const colored = assignColors(keys);
      expect(colored).toHaveLength(keys.length);
      expect(validateTree(colored).valid).toBe(true);
    }
  });

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

/**
 * Drive a generator to completion.
 */
async function drain(gen) {
  let result;
  do result = await gen.next();
  while (!result.done);
  return result.value;
}

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

  test('inserts single node as black root', async () => {
    await drain(tree.insert(50));
    expect(tree.collect()).toHaveLength(1);
    const [[val, color]] = tree.collect((n) => [n.value, n.color]);
    expect(val).toBe(50);
    expect(color).toBe('B');
  });

  test('inserts two nodes — child is red', async () => {
    await drain(tree.insert(50));
    await drain(tree.insert(30));
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('triggers right-rotation rebalance on LL insertion', async () => {
    // Insert in descending order → LL case triggers rotateRight
    await drain(tree.insert(50));
    await drain(tree.insert(30));
    await drain(tree.insert(10));
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('triggers left-rotation rebalance on RR insertion', async () => {
    // Insert in ascending order → RR case triggers rotateLeft
    await drain(tree.insert(10));
    await drain(tree.insert(30));
    await drain(tree.insert(50));
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('triggers LR rotation (left then right)', async () => {
    await drain(tree.insert(50));
    await drain(tree.insert(10));
    await drain(tree.insert(30)); // LR case
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('triggers RL rotation (right then left)', async () => {
    await drain(tree.insert(10));
    await drain(tree.insert(50));
    await drain(tree.insert(30)); // RL case
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('uncle-is-red recolor path', async () => {
    // Insert 4 nodes so that an uncle-is-red recolor happens
    await drain(tree.insert(50));
    await drain(tree.insert(30));
    await drain(tree.insert(70));
    await drain(tree.insert(20)); // uncle (70) is red → recolor
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('deletes a red leaf without fixup', async () => {
    // Build: 50(B) 30(R) 70(R)
    await drain(tree.insert(50));
    await drain(tree.insert(30));
    await drain(tree.insert(70));
    await drain(tree.deleteNode(30)); // red leaf — no fixup needed
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('deletes a black node triggering deleteFixup', async () => {
    // Build a larger tree so black-node deletion requires fixup
    const keys = [50, 30, 70, 20, 40, 60, 80];
    for (const k of keys) await drain(tree.insert(k));
    // Delete a black node (the root's left child area)
    await drain(tree.deleteNode(20));
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('deletes a node with two children via successor', async () => {
    const keys = [50, 30, 70, 20, 40, 60, 80];
    for (const k of keys) await drain(tree.insert(k));
    await drain(tree.deleteNode(30)); // two children → uses in-order successor
    const pairs = tree.collect((n) => [n.value, n.color]);
    expect(validateTree(pairs).valid).toBe(true);
  });

  test('_insert builds tree without animation', () => {
    tree._insert([50, 'B']);
    tree._insert([30, 'R']);
    tree._insert([70, 'R']);
    expect(tree.collect()).toHaveLength(3);
  });
});
