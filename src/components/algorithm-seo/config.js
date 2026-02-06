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
        'algorithms, visualization, sorting, data structures, computer science, programming, education, interactive learning, bubble sort, quick sort, merge sort, binary search tree, graph algorithms',
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
    keywords:
      'bubble sort, sorting visualizer, algorithm animation, step-by-step, custom input sorting, interactive bubble sort, computer science education, python sort, java sort',
  },
  QuickSort: {
    title: 'Quick Sort Visualizer | Divide & Conquer with Custom Input',
    description:
      'The best Quick Sort visualization. Watch the pivot partition strategy in real-time. Use custom arrays to see worst-case scenarios. Learn O(n log n) logic.',
    keywords:
      'quick sort, quicksort visualizer, divide and conquer, pivot partition, algorithm animation, custom array sorting, interactive learning, recursion visualizer, best sorting algorithm',
  },
  MergeSort: {
    title: 'Merge Sort Visualizer | Stable Sort with Recursive Steps',
    description:
      'Interactive Merge Sort guide. Visualize the divide and conquer process step-by-step. Great for understanding recursion and stable sorting. O(n log n).',
    keywords:
      'merge sort, mergesort visualizer, stable sort, recursion visualization, divide and conquer, algorithm animation, interactive sorting, python merge sort, java merge sort',
  },
  InsertionSort: {
    title: 'Insertion Sort Visualizer | Adaptive Sort for Small Datasets',
    description:
      'Watch Insertion Sort build a sorted array one item at a time. Perfect for understanding adaptive sorting on nearly sorted data. Interactive & Step-by-Step.',
    keywords:
      'insertion sort, online algorithm, adaptive sort, sorting visualizer, step-by-step animation, o(n^2), algorithm guide, simple sorting methods, insertion sort python',
  },
  SelectionSort: {
    title: 'Selection Sort Visualizer | In-Place Comparison Sorting',
    description:
      'Visualize Selection Sort finding minimums. Simple, interactive animation to understand in-place comparison sorting and O(n²) complexity.',
    keywords:
      'selection sort, in-place sort, comparison sort, sorting visualizer, algorithm animation, computer science basics, interactive learning, selection sort python, selection sort cpp',
  },
  HeapSort: {
    title: 'Heap Sort Visualizer | Interactive Binary Heap Operations',
    description:
      'Master Heap Sort. Visualize the heapify process and heap operations (extract-max) in real-time. Understand priority queues and O(n log n) sorting.',
    keywords:
      'heap sort, heapsort visualizer, binary heap, priority queue, heapify animation, max heap, min heap, data structure visualization, algorithm guide, heap sort python',
  },
  RadixSort: {
    title: 'Radix Sort Visualizer | Non-Comparison Integer Sorting',
    description:
      'Visualize Radix Sort. See how numbers are sorted by digit buckets without comparison. Understand linear O(nk) time complexity with animations.',
    keywords:
      'radix sort, integer sort, bucket sort, non-comparison sort, counting sort, sorting visualizer, algorithm animation, linear time sorting, fast integer sorting',
  },
  BFS: {
    title: 'Breadth-First Search Visualizer | BFS on Custom Graphs',
    description:
      'Interactive BFS tool. Draw your own graphs and watch Breadth-First Search find the shortest path level-by-level. Perfect for graph theory students.',
    keywords:
      'BFS, breadth first search, graph visualizer, shortest path, custom graph, graph traversal, queue, level order, interactive graph, bfs python',
  },
  DFS: {
    title: 'Depth-First Search Visualizer | DFS & Maze Solving',
    description:
      'Visualize DFS exploring graphs. Draw custom graphs to see recursion and backtracking in action. Understand stack-based traversal and maze solving.',
    keywords:
      'DFS, depth first search, graph visualizer, recursion, backtracking, stack, connected components, maze solver, custom graph, dfs python',
  },
  TopSort: {
    title: 'Topological Sort Visualizer | DAG Dependency Resolution',
    description:
      'Visualize Topological Sorting on your own Directed Acyclic Graphs (DAGs). Understand dependency resolution and task scheduling algorithms.',
    keywords:
      'topological sort, kahn algorithm, DAG, directed acyclic graph, dependency ordering, task scheduling, graph visualizer, interactive top sort, graph algorithms',
  },
  Dijkstras: {
    title: "Dijkstra's Algorithm Visualizer | Shortest Path on Weighted Graphs",
    description:
      "The best Dijkstra's visualization. Draw weighted graphs, set start/end nodes, and watch the greedy shortest path algorithm. Detailed step-by-step mode.",
    keywords:
      'dijkstras algorithm, shortest path visualizer, weighted graph, greedy algorithm, priority queue, pathfinding, interactive graph, dijkstra python, route planning',
  },
  Prims: {
    title: "Prim's Algorithm Visualizer | Minimum Spanning Tree (MST)",
    description:
      "Visualize Prim's algorithm building MSTs. Draw custom weighted graphs and watch the greedy strategy connect nodes with minimum cost.",
    keywords:
      'prims algorithm, MST, minimum spanning tree, greedy strategy, weighted graph, network design, graph visualizer, interactive mst, prims python',
  },
  Kruskals: {
    title: "Kruskal's Algorithm Visualizer | MST with Union-Find",
    description:
      "Interactive Kruskal's visualization. See how it selects edges and uses Union-Find to avoid cycles while building a Minimum Spanning Tree.",
    keywords:
      'kruskals algorithm, MST, minimum spanning tree, union find, disjoint set, graph visualizer, edge selection, greedy algorithm, kruskals python',
  },
  Boruvkas: {
    title: "Borůvka's Algorithm Visualizer | Parallel MST Construction",
    description:
      "Visualize Borůvka's algorithm. Watch components merge in parallel to form a Minimum Spanning Tree. Advanced graph theory visualization.",
    keywords:
      'boruvkas algorithm, MST, minimum spanning tree, component merging, parallel algorithm, graph visualizer, boruvka step-by-step, advanced graph algorithms',
  },
  Hamiltonian: {
    title: 'Hamiltonian Path Visualizer | Backtracking & NP-Complete',
    description:
      'Visualize the Hamiltonian Path problem. Draw graphs and watch backtracking algorithms attempt to visit every node exactly once.',
    keywords:
      'hamiltonian path, hamiltonian cycle, np-complete, backtracking visualizer, traveling salesman, graph theory, custom graph, algorithm challenge',
  },
  LinkedList: {
    title: 'Linked List Visualizer | Interactive Insert, Delete, Traverse',
    description:
      'Interactive Linked List guide. Add, remove, and traverse nodes in real-time. Understand pointers and memory allocation visually.',
    keywords:
      'linked list, singly linked list, doubly linked list, node pointer, data structure visualizer, memory management, interactive list, algorithm basic',
  },
  CircularQueue: {
    title: 'Circular Queue Visualizer | Ring Buffer FIFO Operations',
    description:
      'Visualize Circular Queue (Ring Buffer) mechanics. See how pointers wrap around in a fixed-size array. ideal for understanding standard buffers.',
    keywords:
      'circular queue, ring buffer, fifo, queue operations, buffer management, array visualizer, data structure animation, enqueue dequeue, memory efficiency',
  },
  BinaryHeap: {
    title: 'Binary Heap Visualizer | Interactive Min/Max Heap',
    description:
      'Visualize Binary Heaps. Insert values and watch heapify-up/down operations maintain the heap property. Compare Min-Heap and Max-Heap behavior.',
    keywords:
      'binary heap, priority queue, min heap, max heap, heapify, complete binary tree, array representation, data structure visualizer, heap sort preparation',
  },
  BST: {
    title: 'BST Visualizer | Binary Search Tree Operations',
    description:
      'Interactive BST tool. Insert, search, and delete nodes. visualizing how the tree structure changes. Understand O(log n) vs O(n) cases.',
    keywords:
      'BST, binary search tree, tree traversal, search algorithm, node insertion, data structure visualizer, tree balancing concepts, interactive bst',
  },
  AVL: {
    title: 'AVL Tree Visualizer | Self-Balancing Rotations',
    description:
      'Watch AVL Trees balance themselves. Visualize LL, RR, LR, and RL rotations in real-time as you insert nodes. Master self-balancing logic.',
    keywords:
      'avl tree, self-balancing tree, tree rotation, height balanced, bst, data structure visualizer, interactive avl, balance factor, algorithm animation',
  },
  RedBlackTree: {
    title: 'Red-Black Tree Visualizer | Coloring & Rotation Steps',
    description:
      'Master Red-Black Trees. Insert nodes and watch the recoloring and rotation rules maintain balance. The standard for implemented libraries.',
    keywords:
      'red-black tree, rbt, tree coloring, tree rotation, self-balancing bst, data structure visualizer, interactive red black tree, balanced search tree',
  },
  SplayTree: {
    title: 'Splay Tree Visualizer | Move-to-Front Splaying',
    description:
      'Visualize Splay Trees. Access nodes and watch them bubble to the root via splaying operations. Understand cache optimization and locality.',
    keywords:
      'splay tree, self-adjusting tree, splaying, amortization, cache locality, data structure visualizer, interactive tree, recently accessed, move-to-front',
  },
  ConvexHull: {
    title: 'Convex Hull Visualizer | Graham Scan & Jarvis March',
    description:
      'Computational Geometry made easy. Draw points and watch Graham Scan or Jarvis March algorithms wrap them in a Convex Hull.',
    keywords:
      'convex hull, computational geometry, graham scan, jarvis march, polygon wrapping, geometric algorithms, algorithm visualizer, interactive geometry',
  },
  HuffmanCoding: {
    title: 'Huffman Coding Visualizer | Build Prefix Trees',
    description:
      'Visualize Huffman Coding. Enter text and watch the optimal prefix tree being built. Understand lossless compression step-by-step.',
    keywords:
      'huffman coding, data compression, prefix tree, greedy algorithm, encoding, lossless compression, algorithm visualizer, interactive huffman, binary tree',
  },
};

export const getSeoConfig = (algoId) => {
  const config = metaConfigs[algoId];
  if (!config) {
    const algoName = algoId.replace(/([A-Z])/g, ' $1').trim();
    return {
      title: `${algoName} - See Algorithms`,
      description: `Learn ${algoName} algorithm with interactive visualization and step-by-step explanation.`,
      keywords: `${algoName.toLowerCase()}, algorithm, visualization, computer science, programming`,
    };
  }
  return config;
};
