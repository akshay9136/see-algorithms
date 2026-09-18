import { assignColors } from '@/helpers/redBlackTree';
import { randomKeys } from '@/common/utils';

function validateRedBlackTree(pairs) {
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
    expect(validateRedBlackTree(res).valid).toBe(true);
  });

  test('colors two nodes with black root and red child', () => {
    const res1 = assignColors([20, 10]);
    expect(res1).toEqual([[20, 'B'], [10, 'R']]);
    expect(validateRedBlackTree(res1).valid).toBe(true);
    const res2 = assignColors([20, 30]);
    expect(res2).toEqual([[20, 'B'], [30, 'R']]);
    expect(validateRedBlackTree(res2).valid).toBe(true);
  });

  test('colors three balanced nodes with black root and red children', () => {
    const res = assignColors([20, 10, 30]);
    expect(res).toEqual([[20, 'B'], [10, 'R'], [30, 'R']]);
    expect(validateRedBlackTree(res).valid).toBe(true);
  });

  test('assigns valid Red-Black tree coloring for randomKeys across multiple iterations', () => {
    for (let i = 0; i < 50; i++) {
      const keys = randomKeys();
      const colored = assignColors(keys);
      expect(colored).toHaveLength(keys.length);
      expect(validateRedBlackTree(colored).valid).toBe(true);
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
      expect(validateRedBlackTree(colored).valid).toBe(true);
    }
  });
});
