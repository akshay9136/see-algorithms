const unevenBranches = {
  id: 'uneven-branches',
  name: 'A cycle with uneven branches',
  prompt: 'Start at A and compare the order in which BFS and DFS visit the vertices.',
  source: 'A',
  positions: [[100, 210], [225, 110], [225, 310], [350, 110], [475, 110], [350, 310]],
  edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4], [2, 5]],
};

const convergingPaths = {
  id: 'converging-paths',
  name: 'Two paths to the same vertex',
  prompt: 'Start at A. Which branch discovers D first in each traversal?',
  source: 'A',
  positions: [[115, 210], [265, 110], [265, 310], [420, 210], [535, 210]],
  edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
};

const traversalExamples = [unevenBranches, convergingPaths];

export const graphExamples = {
  BFS: traversalExamples,
  DFS: traversalExamples,
  'bfs-vs-dfs': traversalExamples,
  Dijkstras: [
    {
      id: 'cheap-detour',
      name: 'A cheap detour',
      prompt: 'From A to C, which costs less? The direct edge, or the route through B?',
      source: 'A',
      positions: [[135, 275], [295, 120], [455, 275]],
      edges: [[0, 2, 9], [0, 1, 2], [1, 2, 3]],
    },
    {
      id: 'equal-cost-routes',
      name: 'Equal-cost routes',
      prompt: 'From A, both routes to D cost 6. Watch which predecessor the visualizer keeps.',
      source: 'A',
      positions: [[115, 210], [265, 110], [265, 310], [420, 210]],
      edges: [[0, 1, 2], [0, 2, 3], [1, 3, 4], [2, 3, 3]],
    },
  ],
  TopSort: [
    {
      id: 'two-starts',
      name: 'Two starting vertices',
      prompt: 'A and B have no prerequisites. Predict two valid topological orders.',
      directed: true,
      positions: [[110, 110], [110, 285], [305, 195], [305, 285], [495, 195]],
      edges: [[0, 2], [1, 2], [1, 3], [2, 4], [3, 4]],
    },
    {
      id: 'diamond-dependencies',
      name: 'Diamond dependencies',
      prompt: 'Which tasks can run in either order before D becomes available?',
      directed: true,
      positions: [[115, 210], [265, 110], [265, 310], [420, 210]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 3]],
    },
  ],
};

export const treeExamples = {
  search: [
    {
      id: 'delete-root',
      name: 'Delete the root with two children',
      prompt: 'Delete 40 and watch how the tree finds its in-order successor.',
      keys: [40, 20, 70, 10, 30, 55, 80, 50],
      operation: 'Delete',
      value: 40,
    },
    {
      id: 'promote-child',
      name: 'Delete a node with one child',
      prompt: 'Delete 60 and watch how its only child and that child’s subtree move.',
      keys: [40, 20, 60, 70, 65, 80],
      operation: 'Delete',
      value: 60,
    },
  ],
  avl: [
    {
      id: 'left-right-rotation',
      name: 'Left-right rotation',
      prompt: 'Insert 20 and watch the tree rebalance in two rotations.',
      keys: [30, 10],
      operation: 'Insert',
      value: 20,
    },
    {
      id: 'right-left-rotation',
      name: 'Right-left rotation',
      prompt: 'Insert 20 and watch which subtree rotates first.',
      keys: [10, 30],
      operation: 'Insert',
      value: 20,
    },
  ],
  'red-black': [
    {
      id: 'red-uncle',
      name: 'Recolor after insertion',
      prompt: 'Insert 10 and watch how the tree fixes two consecutive red nodes.',
      keys: [[40, 'B'], [20, 'R'], [60, 'R']],
      operation: 'Insert',
      value: 10,
    },
    {
      id: 'red-black-triangle',
      name: 'Rotate after insertion',
      prompt: 'Insert 20 between 10 and 30 and watch how the tree restores its color rules.',
      keys: [[30, 'B'], [10, 'R']],
      operation: 'Insert',
      value: 20,
    },
  ],
  splay: [
    {
      id: 'zig-zig-search',
      name: 'Zig-zig after a search',
      prompt: 'Search for 10 and watch two rotations in the same direction bring it to the root.',
      keys: [40, 20, 60, 10],
      operation: 'Search',
      value: 10,
    },
    {
      id: 'zig-zag-search',
      name: 'Zig-zag after a search',
      prompt: 'Search for 30 and watch two rotations in opposite directions bring it to the root.',
      keys: [40, 20, 60, 30],
      operation: 'Insert',
      value: 30,
    },
  ],
};

export function createExampleGraph({ positions, edges, directed = false }) {
  const points = positions.map(([x, y]) => ({ x, y }));
  const matrix = points.map(() => ({}));
  const weights = points.map(() => ({}));
  const segments = edges.map(([from, to, weight], index) => {
    matrix[from][to] = index;
    if (weight !== undefined) weights[from][to] = weight;
    if (!directed) {
      matrix[to][from] = index;
      if (weight !== undefined) weights[to][from] = weight;
    }
    return [from, to];
  });
  return { points, segments, matrix, weights, directed };
}
