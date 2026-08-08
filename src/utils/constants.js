export const SITE_URL = 'https://see-algorithms.com';

export const SUMMARY_COST = {
  // Simple trees/graphs (3 credits)
  BST: 3,
  BinaryHeap: 3,

  // Complex trees/graphs (5 credits)
  DFS: 5,
  BFS: 5,
  Dijkstras: 5,
  Prims: 5,
  TopSort: 5,
  Eulerian: 5,
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
