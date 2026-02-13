export const defaultSeoConfig = {
  title: 'See Algorithms - Interactive Algorithm Visualizations',
  description:
    'Learn algorithms through interactive visualizations. Step-by-step animations for sorting, searching, graph algorithms, and data structures. Perfect for students and educators.',
  canonical: 'https://see-algorithms.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://see-algorithms.com',
    siteName: 'See Algorithms',
    title: 'See Algorithms - Interactive Algorithm Visualizations',
    description:
      'Learn algorithms through interactive visualizations. Step-by-step animations for sorting, searching, graph algorithms, and data structures.',
    images: [
      {
        url: 'https://see-algorithms.com/og-image.png',
        width: 1400,
        height: 720,
        alt: 'See Algorithms Visualization',
      },
    ],
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content:
        'algorithms, visualization, sorting, data structures, computer science, programming, education, interactive learning, binary search tree, graph algorithms',
    },
    {
      name: 'author',
      content: 'See Algorithms',
    },
    {
      property: 'article:author',
      content: 'https://see-algorithms.com/about',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

export const metaConfigs = {
  BubbleSort: {
    title: 'Bubble Sort Visualizer | Simple Sorting Algorithm',
    description:
      'Visualize Bubble Sort with full control. Pause, step through swaps, and use your own numbers. Master this O(n²) algorithm with our interactive tool.',
  },
  QuickSort: {
    title: 'Quick Sort Visualizer | Divide & Conquer Algorithm',
    description:
      'Visualize Quick Sort step-by-step. Watch pivot partition strategy in real-time, use custom arrays, and understand O(n log n) sorting with an interactive tool.',
  },
  MergeSort: {
    title: 'Merge Sort Visualizer | Stable Sort with Recursion',
    description:
      'Interactive Merge Sort guide. Visualize the divide and conquer process step-by-step. Great for understanding recursion and stable O(n log n) sorting.',
  },
  InsertionSort: {
    title: 'Insertion Sort Visualizer | Adaptive Sorting Algorithm',
    description:
      'Watch Insertion Sort build a sorted array one item at a time. Perfect for understanding adaptive sorting on nearly sorted data. Interactive O(n²) guide.',
  },
  SelectionSort: {
    title: 'Selection Sort Visualizer | In-Place Comparison Sort',
    description:
      'Visualize Selection Sort finding minimums. Simple, interactive animation to understand in-place comparison sorting and O(n²) complexity.',
  },
  HeapSort: {
    title: 'Heap Sort Visualizer | Sorting with Binary Heap',
    description:
      'Master Heap Sort. Visualize the heapify process and heap operations (extract-max) in real-time. Understand priority queues and O(n log n) sorting.',
  },
  RadixSort: {
    title: 'Radix Sort Visualizer | Digit-By-Digit Integer Sort',
    description:
      'Visualize Radix Sort. See how numbers are sorted by digit buckets without comparison. Understand linear O(nk) time complexity with animations.',
  },
  BFS: {
    title: 'Breadth-First Search Visualizer | Graph Traversal | BFS',
    description:
      'Interactive BFS tool. Draw your own graphs and watch Breadth-First Search find the shortest path level-by-level. Perfect for graph theory students.',
  },
  DFS: {
    title: 'Depth-First Search Visualizer | Graph Traversal | DFS',
    description:
      'Visualize DFS exploring graphs. Draw custom graphs to see recursion and backtracking in action. Understand stack-based traversal and maze solving.',
  },
  TopSort: {
    title: 'Topological Sort Visualizer | DAG Dependency Resolution',
    description:
      'Visualize Topological Sorting on your own Directed Acyclic Graphs (DAGs). Understand dependency resolution and task scheduling algorithms.',
  },
  Dijkstras: {
    title: "Dijkstra's Algorithm Visualizer | Shortest Path Finder",
    description:
      "Visualize Dijkstra's algorithm step-by-step. Draw weighted graphs, set custom source, and watch the greedy shortest-path finder. Interactive graph tool.",
  },
  Prims: {
    title: "Prim's Algorithm Visualizer | Greedy MST Construction",
    description:
      "Visualize Prim's algorithm building MSTs. Draw custom weighted graphs and watch the greedy strategy connect nodes with minimum cost.",
  },
  Kruskals: {
    title: "Kruskal's Algorithm Visualizer | MST with Union-Find",
    description:
      "Interactive Kruskal's visualization. See how it selects edges and uses Union-Find to avoid cycles while building a Minimum Spanning Tree.",
  },
  Boruvkas: {
    title: "Borůvka's Algorithm Visualizer | Parallel MST Construction",
    description:
      "Visualize Borůvka's algorithm. Watch components merge in parallel to form a Minimum Spanning Tree. Advanced graph theory visualization.",
  },
  Hamiltonian: {
    title: 'Hamiltonian Path Visualizer | Backtracking & NP-Complete',
    description:
      'Visualize the Hamiltonian Path. Draw graphs and watch backtracking algorithms attempt to visit every node exactly once. Interactive graph tool.',
  },
  LinkedList: {
    title: 'Linked List Visualizer | Insert, Delete, Traverse',
    description:
      'Interactive Linked List guide. Insert, delete, and traverse nodes in real-time. Understand pointers and memory allocation visually.',
  },
  CircularQueue: {
    title: 'Circular Queue Visualizer | Ring Buffer FIFO Operations',
    description:
      'Visualize Circular Queue (Ring Buffer) mechanics. See how pointers wrap around in a fixed-size array. Ideal for understanding standard buffers.',
  },
  BinaryHeap: {
    title: 'Binary Heap Visualizer | Interactive Min/Max Heap',
    description:
      'Visualize Binary Heaps. Insert values and watch heapify-up/down operations maintain the heap property. Compare Min-Heap and Max-Heap behavior.',
  },
  BST: {
    title: 'Binary Search Tree Visualizer | Interactive BST Operations',
    description:
      'Interactive BST tool. Insert, search, and delete nodes and visualize how the tree structure changes. Understand O(log n) vs O(n) search.',
  },
  AVL: {
    title: 'AVL Tree Visualizer | Self-Balancing Rotations | BST',
    description:
      'Watch AVL Trees balance themselves. Visualize LL, RR, LR, and RL rotations in real-time as you insert nodes. Master self-balancing logic.',
  },
  RedBlackTree: {
    title: 'Red-Black Tree Visualizer | Coloring & Rotations | BST',
    description:
      'Master Red-Black Trees. Insert nodes and watch the recoloring and rotation rules maintain balance. Understand O(log n) search.',
  },
  SplayTree: {
    title: 'Splay Tree Visualizer | Self-Adjusting Binary Tree',
    description:
      'Visualize Splay Trees. Access nodes and watch them bubble to the root via splaying operations. Understand cache optimization and locality.',
  },
  ConvexHull: {
    title: 'Convex Hull Visualizer | Jarvis March Wrapping',
    description:
      'Interactive tool for Convex Hull. Add points and watch Jarvis March algorithm wrap them in a hull step-by-step. Computational geometry guide.',
  },
  HuffmanCoding: {
    title: 'Huffman Coding Visualizer | Data Compression Algorithm',
    description:
      'Visualize Huffman Coding. Enter frequencies and watch the optimal prefix tree being built. Understand lossless compression step-by-step.',
  },
};

export const getSeoConfig = (algoId) => {
  const config = metaConfigs[algoId];
  if (!config) {
    const algoName = algoId.replace(/([A-Z])/g, ' $1').trim();
    return {
      title: `${algoName} Visualizer | See Algorithms`,
      description: `Interactive ${algoName} visualizer. Step-by-step animation and custom input. Learn the algorithm with See Algorithms.`,
    };
  }
  return config;
};
