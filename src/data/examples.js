const unevenBranches = {
  name: 'A cycle with uneven branches',
  prompt: 'Start at A and compare the order in which BFS and DFS visit the vertices.',
  source: 'A',
  positions: [[100, 210], [225, 110], [225, 310], [350, 110], [475, 110], [350, 310]],
  edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4], [2, 5]],
};

const convergingPaths = {
  name: 'Two paths to the same vertex',
  prompt: 'Start at A. Which branch discovers D first in each traversal?',
  source: 'A',
  positions: [[115, 210], [265, 110], [265, 310], [420, 210], [535, 210]],
  edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
};

const wideFrontier = {
  name: 'A wide frontier',
  prompt: 'Start at A. Compare visiting all four neighbors with following B to the deeper vertex F.',
  source: 'A',
  positions: [[110, 220], [270, 90], [270, 180], [270, 270], [270, 360], [440, 90]],
  edges: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5]],
};

const directedReturn = {
  name: 'A directed cycle with an exit',
  prompt: 'Start at A. Follow the arrows and watch how visited vertices prevent an endless trip.',
  source: 'A',
  directed: true,
  positions: [[110, 210], [260, 100], [260, 320], [440, 320], [540, 210]],
  edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]],
};

const weightedBridge = {
  name: 'An expensive bridge',
  prompt: 'See why every spanning tree must include the edge C-D despite the cheaper edges nearby.',
  positions: [[90, 240], [180, 100], [270, 240], [400, 240], [490, 100], [580, 240]],
  edges: [[0, 1, 1], [1, 2, 2], [0, 2, 4], [2, 3, 20], [3, 4, 1], [4, 5, 2], [3, 5, 4]],
};

const tiedCycle = {
  name: 'Several minimum spanning trees',
  prompt: 'All four sides cost 2 and the diagonal costs 7. Predict the total cost and which side will be omitted.',
  positions: [[140, 110], [420, 110], [420, 330], [140, 330]],
  edges: [[0, 1, 2], [1, 2, 2], [2, 3, 2], [3, 0, 2], [0, 2, 7]],
};

const traversalExamples = [unevenBranches, convergingPaths, wideFrontier, directedReturn];

export const graphExamples = {
  BFS: traversalExamples,
  DFS: traversalExamples,
  'bfs-vs-dfs': traversalExamples,
  Dijkstras: [
    {
      name: 'A cheap detour',
      prompt: 'From A to C, which costs less? The direct edge, or the route through B?',
      source: 'A',
      positions: [[135, 275], [295, 120], [455, 275]],
      edges: [[0, 2, 9], [0, 1, 2], [1, 2, 3]],
    },
    {
      name: 'Equal-cost routes',
      prompt: 'Both routes from A to D cost 6. Watch which predecessor the visualizer keeps.',
      source: 'A',
      positions: [[115, 210], [265, 110], [265, 310], [420, 210]],
      edges: [[0, 1, 2], [0, 2, 3], [1, 3, 4], [2, 3, 3]],
    },
    {
      name: 'Revise a tentative distance',
      prompt: 'C is first updated with cost 8, then improved through B. Predict the final cost from A to D.',
      source: 'A',
      directed: true,
      positions: [[100, 230], [260, 100], [300, 320], [490, 230]],
      edges: [[0, 1, 2], [0, 2, 8], [1, 2, 4], [1, 3, 9], [2, 3, 2]],
    },
    {
      name: 'More hops, less cost',
      prompt: 'The direct route A to E costs 12. Predict how four edges of weight 2 change the shortest route.',
      source: 'A',
      positions: [[90, 270], [190, 110], [340, 80], [490, 110], [580, 270]],
      edges: [[0, 4, 12], [0, 1, 2], [1, 2, 2], [2, 3, 2], [3, 4, 2]],
    },
  ],
  Prims: [
    {
      name: 'Grow from an interior vertex',
      prompt: 'Start at C. Predict which cheapest crossing edge is added as the tree grows.',
      source: 'C',
      positions: [[110, 110], [110, 320], [300, 210], [490, 110], [490, 320]],
      edges: [[0, 1, 8], [0, 2, 4], [1, 2, 2], [2, 3, 3], [2, 4, 7], [3, 4, 1]],
    },
    weightedBridge,
    tiedCycle,
  ],
  Kruskals: [
    {
      name: 'Reject a cheap cycle',
      prompt: 'The three cheapest edges form a triangle. Watch why the edge of weight 3 is rejected before D is connected.',
      positions: [[100, 280], [220, 100], [340, 280], [510, 280]],
      edges: [[0, 1, 1], [1, 2, 2], [0, 2, 3], [2, 3, 8], [1, 3, 10]],
    },
    weightedBridge,
    tiedCycle,
  ],
  Boruvkas: [
    {
      name: 'Three pairs merge',
      prompt: 'Each vertex first favors its partner. Watch three components form, then connect in the next round.',
      positions: [[90, 110], [180, 310], [285, 110], [380, 310], [480, 110], [575, 310]],
      edges: [[0, 1, 1], [2, 3, 2], [4, 5, 3], [1, 2, 8], [3, 4, 9], [0, 5, 15]],
    },
    weightedBridge,
    tiedCycle,
  ],
  Eulerian: [
    {
      name: 'Two circuits share a vertex',
      prompt: 'A has degree 4. Predict why a complete Eulerian circuit must revisit A between the two triangles.',
      source: 'A',
      positions: [[300, 220], [120, 100], [120, 340], [480, 100], [480, 340]],
      edges: [[0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [4, 0]],
    },
    {
      name: 'A trail without a circuit',
      prompt: 'A and D have odd degree. Press Play to see the cycle validator rejects this graph.',
      source: 'A',
      positions: [[100, 220], [260, 100], [260, 340], [450, 220]],
      edges: [[0, 1], [1, 2], [2, 0], [0, 3]],
    },
  ],
  Hamiltonian: [
    {
      name: 'A leaf blocks the return',
      prompt: 'D has only one neighbor. Watch the search backtrack and explain why no Hamiltonian cycle can include D.',
      source: 'A',
      positions: [[130, 230], [280, 100], [430, 230], [280, 350]],
      edges: [[0, 1], [1, 2], [2, 0], [1, 3]],
    },
    {
      name: 'Two triangles share a vertex',
      prompt: 'Every vertex has at least two neighbors. Why does the shared vertex A still prevent a Hamiltonian cycle?',
      source: 'A',
      positions: [[300, 220], [120, 100], [120, 340], [480, 100], [480, 340]],
      edges: [[0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [4, 0]],
    },
  ],
  TopSort: [
    {
      name: 'Two starting vertices',
      prompt: 'A and B have no prerequisites. Predict two valid topological orders.',
      directed: true,
      positions: [[110, 110], [110, 285], [305, 195], [305, 285], [495, 195]],
      edges: [[0, 2], [1, 2], [1, 3], [2, 4], [3, 4]],
    },
    {
      name: 'One forced order',
      prompt: 'Each task unlocks exactly one successor. Predict why this graph has just one topological order.',
      directed: true,
      positions: [[90, 220], [210, 220], [330, 220], [450, 220], [570, 220]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    },
    {
      name: 'Wait for every prerequisite',
      prompt: 'D depends on both B and C. Watch its in-degree reach zero only after both prerequisites finish.',
      directed: true,
      positions: [[100, 220], [260, 100], [260, 340], [430, 220], [570, 220]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
    },
  ],
};

export const treeExamples = {
  search: [
    {
      name: 'Delete the root with two children',
      prompt: 'Delete 50 and watch how the tree finds its in-order successor to fill the root.',
      keys: [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93],
      operation: 'Delete',
      value: 50,
    },
    {
      name: 'Delete a node with one child',
      prompt: 'Delete 75 and watch how its only child subtree slides up to take its place.',
      keys: [50, 25, 75, 12, 37, 85, 80, 90],
      operation: 'Delete',
      value: 75,
    },
    {
      name: 'The successor has a right child',
      prompt: 'Delete 50. Successor 56 replaces the root and its right child 62 reconnects to 75.',
      keys: [50, 25, 75, 12, 37, 56, 87, 62, 80],
      operation: 'Delete',
      value: 50,
    },
    {
      name: 'Insert a new leaf',
      prompt: 'Insert 35 and follow the comparisons down to its correct position as a leaf.',
      keys: [50, 25, 75, 12, 37, 62, 87],
      operation: 'Insert',
      value: 35,
    },
  ],
  avl: [
    {
      name: 'Right rotation (LL imbalance)',
      prompt: 'Insert 5 to make the left side two levels deeper. Watch the single right rotation at 30.',
      keys: [30, 20, 40, 10, 25],
      operation: 'Insert',
      value: 5,
    },
    {
      name: 'Left rotation (RR imbalance)',
      prompt: 'Insert 60 to make the right side two levels deeper. Watch the single left rotation at 20.',
      keys: [20, 10, 40, 30, 50],
      operation: 'Insert',
      value: 60,
    },
    {
      name: 'Left-right (LR) rotation',
      prompt: 'Insert 25 to trigger the LR case at 30. Watch the two-rotation rebalance.',
      keys: [30, 10, 40, 5, 20],
      operation: 'Insert',
      value: 25,
    },
    {
      name: 'Right-left (RL) rotation',
      prompt: 'Insert 25 to trigger the RL case at 20. Predict which subtree rotates first.',
      keys: [20, 10, 30, 27, 35],
      operation: 'Insert',
      value: 25,
    },
    {
      name: 'Deletion triggers rebalance',
      prompt: 'Delete 60. The right subtree shrinks and the root becomes left-heavy — watch the right rotation.',
      keys: [40, 20, 60, 10, 30, 50, 70, 5, 15, 25, 35],
      operation: 'Delete',
      value: 60,
    },
    {
      name: 'Cascading rebalance after deletion',
      prompt: 'Delete 10. Watch 20 rotate left, then notice the height drop trigger another left rotation at root 50.',
      keys: [50, 20, 10, 30, 35, 70, 65, 85, 60, 80, 90, 95],
      operation: 'Delete',
      value: 10,
    },
  ],
  'red-black': [
    {
      name: 'Recolor after insertion',
      prompt: 'Insert 10 to create a red-red conflict. Watch uncle 45 recolor and push the red up to 30.',
      keys: [[60, 'B'], [30, 'B'], [80, 'B'], [15, 'R'], [45, 'R'], [70, 'R'], [90, 'R']],
      operation: 'Insert',
      value: 10,
    },
    {
      name: 'LR rotation after insertion',
      prompt: 'Insert 20 between 15 and 30. With a black uncle, watch the zig-zag double rotation restore color rules.',
      keys: [[60, 'B'], [30, 'B'], [80, 'B'], [15, 'R'], [90, 'R']],
      operation: 'Insert',
      value: 20,
    },
    {
      name: 'Delete a black leaf',
      prompt: 'Delete black leaf 10. Watch sibling 30 recolor red and red parent 20 absorb the extra black.',
      keys: [[40, 'B'], [20, 'R'], [60, 'B'], [10, 'B'], [30, 'B'], [50, 'R'], [70, 'R']],
      operation: 'Delete',
      value: 10,
    },
    {
      name: 'Promote a red child on deletion',
      prompt: 'Delete black 20. Watch its only red child 10 take its place and recolor black.',
      keys: [[40, 'B'], [20, 'B'], [60, 'B'], [10, 'R'], [70, 'R']],
      operation: 'Delete',
      value: 20,
    },
    {
      name: 'Fix via sibling rotation',
      prompt: 'Delete 10. Its red-sibling case forces a rotation before the double-black resolves.',
      keys: [[40, 'B'], [20, 'B'], [60, 'B'], [10, 'B'], [30, 'R'], [50, 'B'], [70, 'B'], [25, 'B'], [35, 'B']],
      operation: 'Delete',
      value: 10,
    },
  ],
  splay: [
    {
      name: 'Zig-zig splays a deep left node',
      prompt: 'Search for 10 at the bottom of the left spine. Watch two same-direction rotations bring it to the root.',
      keys: [30, 20, 45, 10, 25, 40, 50],
      operation: 'Search',
      value: 10,
    },
    {
      name: 'Zig-zag splays an inner node',
      prompt: 'Search for 25, a right child of a left child. Watch opposite-direction rotations bring it to the root.',
      keys: [30, 20, 45, 10, 25, 40, 50],
      operation: 'Search',
      value: 25,
    },
    {
      name: 'Single zig to the root',
      prompt: 'Search for 30, a direct child of the root. Watch the single zig rotation.',
      keys: [50, 30, 70, 20, 40, 60, 80],
      operation: 'Search',
      value: 30,
    },
    {
      name: 'Failed search splays the last node',
      prompt: 'Search for missing key 42. Watch the last visited node 40 splay to the root.',
      keys: [50, 30, 70, 20, 40, 60, 80, 35],
      operation: 'Search',
      value: 42,
    },
    {
      name: 'Delete the root and join subtrees',
      prompt: 'Delete 40. Watch 30 (the largest on the left) become root before the right subtree joins.',
      keys: [40, 20, 60, 10, 30, 50, 70],
      operation: 'Delete',
      value: 40,
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
