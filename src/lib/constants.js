export const SUMMARY_COST = {
  // Simple trees (2 credits)
  BST: 2,
  BinaryHeap: 2,

  // Graph algorithms (3 credits)
  DFS: 3,
  BFS: 3,
  TopSort: 3,
  Dijkstras: 3,
  Prims: 3,

  // Complex trees (5 credits)
  AVL: 5,
  RedBlackTree: 5,
  SplayTree: 5,
  BTree: 5,
  HuffmanCoding: 5,
};

export const PRICING_PLANS = [
  { id: 'basic', price: 4.99, credits: 100, name: 'Basic' },
  { id: 'pro', price: 7.99, credits: 200, name: 'Pro', recommended: true },
  { id: 'premium', price: 14.99, credits: 600, name: 'Premium' },
];

export const INITIAL_CREDITS = 50;
