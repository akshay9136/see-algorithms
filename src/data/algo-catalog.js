import { algorithms } from '@/common/appData';

export const getAlgorithmPath = (algo) => {
  if (algo.path) return algo.path;
  const catId = algo.category.split(' ').join('-').toLowerCase();
  return `/${catId}/${algo.id}`;
};

const COMPLEXITY_MAP = {
  BubbleSort: { time: 'O(n²)', difficulty: 'Beginner' },
  InsertionSort: { time: 'O(n²)', difficulty: 'Beginner' },
  SelectionSort: { time: 'O(n²)', difficulty: 'Beginner' },
  HeapSort: { time: 'O(n log n)', difficulty: 'Intermediate' },
  MergeSort: { time: 'O(n log n)', difficulty: 'Intermediate' },
  QuickSort: { time: 'O(n log n)', difficulty: 'Intermediate' },
  RadixSort: { time: 'O(n · k)', difficulty: 'Intermediate' },
  DFS: { time: 'O(V+E)', difficulty: 'Beginner' },
  BFS: { time: 'O(V+E)', difficulty: 'Beginner' },
  Prims: { time: 'O(E log V)', difficulty: 'Intermediate' },
  Kruskals: { time: 'O(E log V)', difficulty: 'Intermediate' },
  Boruvkas: { time: 'O(E log V)', difficulty: 'Advanced' },
  Dijkstras: { time: 'O((V+E) log V)', difficulty: 'Intermediate' },
  TopSort: { time: 'O(V+E)', difficulty: 'Intermediate' },
  Hamiltonian: { time: 'NP-Complete', difficulty: 'Advanced' },
  Eulerian: { time: 'O(V+E)', difficulty: 'Intermediate' },
  CircularQueue: { time: 'O(1)', difficulty: 'Beginner' },
  LinkedList: { time: 'O(1) insert', difficulty: 'Beginner' },
  DoublyLinkedList: { time: 'O(1) insert', difficulty: 'Beginner' },
  PrefixTree: { time: 'O(L)', difficulty: 'Intermediate' },
  BinaryHeap: { time: 'O(log n)', difficulty: 'Intermediate' },
  BST: { time: 'O(log n)', difficulty: 'Beginner' },
  AVL: { time: 'O(log n)', difficulty: 'Advanced' },
  RedBlackTree: { time: 'O(log n)', difficulty: 'Advanced' },
  SplayTree: { time: 'O(log n)', difficulty: 'Advanced' },
  BTree: { time: 'O(log n)', difficulty: 'Advanced' },
  'B+Tree': { time: 'O(log n)', difficulty: 'Advanced' },
  ConvexHull: { time: 'O(n · h)', difficulty: 'Intermediate' },
  HuffmanCoding: { time: 'O(n log n)', difficulty: 'Intermediate' },
};

const descriptions = {
  BubbleSort: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
  InsertionSort: 'Builds a sorted array one element at a time by repeatedly taking the next item and inserting it into place.',
  SelectionSort: 'Divides the array into sorted and unsorted regions, repeatedly finding and placing the smallest remaining item.',
  HeapSort: 'Converts the array into a binary heap, then systematically extracts the root element to build the sorted list.',
  MergeSort: 'Recursively divides the array into halves, sorts each half, and merges the sorted sublists back together.',
  QuickSort: 'Partitions elements around a chosen pivot, then recursively sorts the resulting smaller and larger partitions.',
  RadixSort: 'Processes numbers digit by digit from least to most significant, sorting values without direct key comparisons.',
  DFS: 'Traverses graphs by exploring as far as possible down each branch before backtracking to unvisited paths.',
  BFS: 'Traverses graphs level by level, exploring every neighbor at the current depth before descending deeper.',
  Prims: 'Grows a minimum spanning tree from a starting vertex by greedily adding the cheapest adjacent edge at each step.',
  Kruskals: 'Builds a minimum spanning tree across the entire graph by connecting edges in increasing order of weight without cycles.',
  Boruvkas: 'Constructs a minimum spanning tree by simultaneously selecting the cheapest outgoing edge from every connected component.',
  Dijkstras: 'Finds the shortest path from a starting vertex to all other nodes in a directed or undirected weighted graph.',
  TopSort: 'Produces a linear ordering of vertices in a DAG such that every directed edge uv has vertex u appearing before v.',
  Hamiltonian: 'Determines whether a graph contains a closed tour that visits every vertex exactly once and returns to the start.',
  Eulerian: 'Determines whether a graph contains a continuous trail that traverses every edge exactly once without repeating.',
  CircularQueue: 'Organizes a FIFO buffer into a closed ring, reconnecting the tail back to the head for efficient fixed-size queuing.',
  LinkedList: 'Stores data as a sequential chain of nodes where each element holds its value and a reference to the next node.',
  DoublyLinkedList: 'Maintains nodes with two-way references, enabling efficient forward and backward traversal through the list.',
  PrefixTree: 'An ordered tree that stores strings by sharing common prefixes, providing fast retrieval and auto-completion.',
  BinaryHeap: 'A complete binary tree that maintains the heap order property for instant access to the minimum or maximum element.',
  BST: 'A binary tree where each left child is smaller and each right child is larger than their parent node.',
  AVL: 'A self-balancing binary search tree that maintains height differences of at most one via tree rotations.',
  RedBlackTree: 'A self-balancing search tree using node colors and restructuring rules to guarantee logarithmic search depth.',
  SplayTree: 'A self-adjusting search tree that splays recently accessed nodes to the root for optimized repeated queries.',
  BTree: 'A balanced multi-way tree with broad branching, optimized for reading and writing large blocks of disk storage.',
  'B+Tree': 'A B-tree variant with data exclusively in leaves linked in sequence, optimized for high-throughput range scans.',
  ConvexHull: 'Finds the smallest convex polygon that completely encloses a given set of two-dimensional points.',
  HuffmanCoding: 'Compresses data by assigning shorter bit sequences to frequent characters and longer codes to rarer ones.',
};

const exceptions = ['avl-tree-vs-rbt', 'b-tree-vs-b+tree', 'bfs-vs-dfs'];

export const catalogItems = algorithms
  .filter((algo) => !exceptions.includes(algo.id))
  .map((algo) => {
    const comp = COMPLEXITY_MAP[algo.id] || {};
    return {
      ...algo,
      category: algo.category === 'Finding MST' ? 'Graph' : algo.category,
      path: getAlgorithmPath(algo),
      description: descriptions[algo.id],
      timeComplexity: comp.time,
      difficulty: comp.difficulty,
    };
  });

export const PREVIEW_ITEMS = [
  {
    id: 'AVL',
    title: 'AVL Tree',
    category: 'Advanced Trees',
    path: '/data-structures/AVL',
    gif: '/gifs/avl-tree.gif',
    tagline:
      'Self-balancing binary search tree with LL, RR, LR, and RL rotations.',
  },
  {
    id: 'Dijkstras',
    title: "Dijkstra's Algorithm",
    category: 'Graph',
    path: '/graph/Dijkstras',
    gif: '/gifs/dijkstras-algo.gif',
    tagline:
      'Greedy shortest-path finder on weighted graphs with real-time distance relaxation.',
  },
  {
    id: 'Prims',
    title: "Prim's Algorithm",
    category: 'Finding MST',
    path: '/graph/Prims',
    gif: '/gifs/prims-algo.gif',
    tagline:
      'Greedy Minimum Spanning Tree construction connecting nodes with minimum total cost.',
  },
  {
    id: 'RedBlackTree',
    title: 'Red-Black Tree',
    category: 'Advanced Trees',
    path: '/data-structures/RedBlackTree',
    gif: '/gifs/red-black-tree.gif',
    tagline:
      'Color-balanced binary search tree with rotation and recoloring rules.',
  },
];
