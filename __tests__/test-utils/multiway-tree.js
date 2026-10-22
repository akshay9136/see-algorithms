import { Numbers } from './common';

/**
 * Check the public snapshot as a tree, rather than relying on node counts alone.
 */
export function expectbTree(tree, expected, isBPlus) {
  const { nodes, keys, edges, leafLinks } = tree.getSnapshot();
  const sorted = Numbers.sortAsc(expected);
  expect(nodes.length).toBeGreaterThan(0);
  expect(edges.length).toBe(nodes.length - 1);
  const visited = new Set();
  const leaves = [];

  function visit(node, lower = -Infinity, upper = Infinity) {
    expect(visited.has(node.id)).toBe(false);
    visited.add(node.id);
    const values = keys
      .filter((key) => key.nodeId === node.id)
      .map((key) => key.value);

    expect(values.length >= 1).toBe(true);
    expect(values.length <= 2).toBe(true);
    expect(values).toEqual(Numbers.sortAsc(values));

    for (const value of values) {
      expect(value >= lower && value < upper).toBe(true);
    }
    const children = nodes.filter((child) =>
      edges.some((edge) => edge.id === `${node.id}-${child.id}`),
    );
    if (!children.length) {
      if (isBPlus) expect(node.isLeaf).toBe(true);
      leaves.push(node);
      return values;
    }
    const subtrees = children.map((child, i) => {
      expect(child.y).toBeGreaterThan(node.y);
      const nextLower = i === 0 ? lower : values[i - 1];
      const nextUpper = i === values.length ? upper : values[i];
      return visit(child, nextLower, nextUpper);
    });

    if (isBPlus) {
      expect(node.isLeaf).toBe(false);
      expect(values).toEqual(subtrees.slice(1).map((subtree) => subtree[0]));
      return subtrees.flat();
    }
    return subtrees.flatMap((subtree, i) =>
      i < values.length ? [...subtree, values[i]] : subtree,
    );
  }

  expect(visit(nodes[0])).toEqual(sorted);
  expect(visited.size).toBe(nodes.length);
  expect(new Set(leaves.map((leaf) => leaf.y)).size).toBe(1);

  if (isBPlus) {
    const leafKeys = leaves.map((leaf) =>
      keys.filter((key) => key.nodeId === leaf.id).map((key) => key.value),
    );
    expect(tree.collect()).toEqual(leafKeys);
    expect(leafLinks.map((link) => link.id)).toEqual(
      leaves.slice(1).map((leaf, i) => `${leaves[i].id}_${leaf.id}`),
    );
  } else {
    expect(Numbers.sortAsc(tree.collect())).toEqual(sorted);
  }
}
