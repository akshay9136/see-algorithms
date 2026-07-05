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
  { id: 'basic', usd: 4.99, inr: 199, credits: 100, name: 'Basic' },
  { id: 'pro', usd: 7.99, inr: 299, credits: 200, name: 'Pro', recommended: true },
  { id: 'premium', usd: 14.99, inr: 499, credits: 400, name: 'Premium' },
];

export const INITIAL_CREDITS = 50;
