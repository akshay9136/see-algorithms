import { charAt } from '@/common/utils';

const NODE_W = 36; // effective node width used for leaf x-spacing
const V_GAP = 60; // vertical gap between levels
const H_GAP = 30; // horizontal gap between siblings

/**
 * Assign x/y positions to every node via a simple recursive layout.
 */
function layoutTree(node, depth, leftOffset) {
  if (!node) return leftOffset;
  node.y = depth * V_GAP + 50;

  if (node.children.size === 0) {
    node.x = leftOffset + NODE_W / 2;
    return leftOffset + NODE_W + H_GAP;
  }

  let cur = leftOffset;
  for (const child of node.children.values()) {
    cur = layoutTree(child, depth + 1, cur);
  }
  node.x = (leftOffset + cur - H_GAP) / 2;
  return cur;
}

export function unionFindLayout(size) {
  const parent = [];
  const union = [];
  const treeNodes = {};

  for (let i = 0; i < size; i++) {
    union[i] = new Set([i]);
    parent[i] = i;
    treeNodes[i] = {
      id: i,
      char: charAt(65 + i),
      children: new Map(),
      parent: null,
      x: i * 66 + 44,
      y: 50,
    };
  }

  function findRoot(u) {
    return parent[u] === u ? u : findRoot(parent[u]);
  }

  function merge(x1, x2) {
    const root1 = treeNodes[x1];
    const root2 = treeNodes[x2];

    root1.children.set(x2, root2);
    root2.parent = root1;

    // Find all current roots in the forest
    const roots = [];
    Object.values(treeNodes).forEach((node) => {
      if (!node.parent) roots.push(node);
    });

    // Sort roots by their current X position to maintain visual left-to-right order
    roots.sort((a, b) => a.x - b.x);

    // Layout the entire forest side-by-side
    let curX = 26; // Initial left offset to align with i * 66 + 44
    for (const root of roots) {
      curX = layoutTree(root, 0, curX);
    }

    union[x1] = new Set([...union[x1], ...union[x2]]);
    union[x2] = new Set();
    parent[x2] = x1;

    return Object.values(treeNodes);
  }

  function setsCount() {
    return union.filter((set) => set.size > 0).length;
  }

  return { findRoot, merge, setsCount };
}
