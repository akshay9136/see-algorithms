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

export const SITE_AUTHOR = {
  name: 'Akshay Karande',
  url: 'https://see-algorithms.com/author',
  github: 'https://github.com/akshay9136',
};

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person-akshay`,
  name: SITE_AUTHOR.name,
  url: SITE_AUTHOR.url,
  sameAs: [SITE_AUTHOR.github],
  jobTitle: 'Software Engineer & Educator',
  worksFor: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'See Algorithms',
    url: SITE_URL,
  },
  knowsAbout: [
    'Algorithms',
    'Data Structures',
    'Computer Science Education',
    'Interactive Visualizations',
    'Sorting Algorithms',
    'Graph Algorithms',
    'Self-Balancing Trees',
  ],
  description:
    'Software Engineer and Educator who built See Algorithms to make algorithm learning accessible through interactive visualizations.',
};
