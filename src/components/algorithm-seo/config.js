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
      name: 'robots',
      content: 'index,follow',
    },
    {
      name: 'googlebot',
      content: 'index,follow',
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

export const algorithmSeoMap = {
  BubbleSort: {
    title: 'Bubble Sort Visualization - See Algorithms',
    description:
      'Learn Bubble Sort with interactive step-by-step visualization. Understand how this simple sorting algorithm works through animated examples.',
    keywords:
      'bubble sort, sorting algorithm, visualization, animation, algorithm learning, O(n²) complexity',
  },
  QuickSort: {
    title: 'Quick Sort Visualization - See Algorithms',
    description:
      'Master Quick Sort with interactive visualization. Learn the divide-and-conquer sorting algorithm with step-by-step animations.',
    keywords:
      'quick sort, quicksort, sorting algorithm, divide conquer, visualization, O(n log n)',
  },
  MergeSort: {
    title: 'Merge Sort Visualization - See Algorithms',
    description:
      'Understand Merge Sort through interactive visualization. Learn this efficient divide-and-conquer sorting algorithm step by step.',
    keywords:
      'merge sort, mergesort, sorting algorithm, divide conquer, stable sort, O(n log n)',
  },
  HeapSort: {
    title: 'Heap Sort Visualization - See Algorithms',
    description:
      'Learn Heap Sort with interactive visualization. Understand how this comparison-based sorting algorithm uses binary heap data structure.',
    keywords:
      'heap sort, heapsort, sorting algorithm, binary heap, visualization, O(n log n)',
  },
  InsertionSort: {
    title: 'Insertion Sort Visualization - See Algorithms',
    description:
      'Master Insertion Sort with step-by-step visualization. Learn this simple and efficient algorithm for small datasets.',
    keywords:
      'insertion sort, sorting algorithm, visualization, simple sort, adaptive algorithm',
  },
  SelectionSort: {
    title: 'Selection Sort Visualization - See Algorithms',
    description:
      'Understand Selection Sort through interactive visualization. Learn this simple comparison-based sorting algorithm.',
    keywords:
      'selection sort, sorting algorithm, visualization, comparison sort, simple algorithm',
  },
  RadixSort: {
    title: 'Radix Sort Visualization - See Algorithms',
    description:
      'Learn Radix Sort with interactive visualization. Understand this non-comparison integer sorting algorithm.',
    keywords:
      'radix sort, sorting algorithm, non-comparison sort, integer sort, visualization',
  },
  BFS: {
    title: 'Breadth-First Search (BFS) Visualization - See Algorithms',
    description:
      'Learn BFS algorithm with interactive graph visualization. Understand how breadth-first search explores graphs level by level.',
    keywords:
      'breadth first search, BFS, graph algorithm, graph traversal, visualization, shortest path',
  },
  DFS: {
    title: 'Depth-First Search (DFS) Visualization - See Algorithms',
    description:
      'Master DFS algorithm with interactive visualization. Learn how depth-first search explores graphs using stack-based approach.',
    keywords:
      'depth first search, DFS, graph algorithm, graph traversal, visualization, stack',
  },
  Dijkstra: {
    title: "Dijkstra's Visualization - See Algorithms",
    description:
      "Learn Dijkstra's shortest path algorithm with interactive visualization. Understand how to find shortest paths in weighted graphs.",
    keywords:
      'dijkstra algorithm, shortest path, graph algorithm, weighted graph, visualization, greedy algorithm',
  },
  TopSort: {
    title: 'Topological Sorting Visualization - See Algorithms',
    description:
      'Learn Topological Sorting with interactive visualization. Understand how to order vertices in a directed acyclic graph (DAG).',
    keywords:
      'topological sorting, topological ordering, DAG, directed acyclic graph, graph algorithm, visualization',
  },
  PrimsMST: {
    title: "Prim's Minimum Spanning Tree - See Algorithms",
    description:
      "Master Prim's algorithm for finding minimum spanning trees with interactive visualization. Learn this greedy MST algorithm step by step.",
    keywords:
      'prims algorithm, minimum spanning tree, MST, graph algorithm, greedy algorithm, visualization',
  },
  Hamiltonian: {
    title: 'Hamiltonian Path Visualization - See Algorithms',
    description:
      'Learn Hamiltonian path finding with interactive visualization. Understand how to find paths that visit every vertex exactly once.',
    keywords:
      'hamiltonian path, hamiltonian cycle, graph traversal, backtracking, graph algorithm, visualization',
  },
  KruskalsMST: {
    title: "Kruskal's Minimum Spanning Tree - See Algorithms",
    description:
      "Learn Kruskal's algorithm for minimum spanning trees with interactive visualization. Master this union-find based MST algorithm.",
    keywords:
      'kruskals algorithm, minimum spanning tree, MST, union find, graph algorithm, visualization',
  },
  BST: {
    title: 'Binary Search Tree (BST) Visualization - See Algorithms',
    description:
      'Learn Binary Search Tree data structure with interactive visualization. Understand BST operations: insert, delete, search.',
    keywords:
      'binary search tree, BST, data structure, tree visualization, search, insert, delete',
  },
  BinaryHeap: {
    title: 'Binary Heap Visualization - See Algorithms',
    description:
      'Master Binary Heap with interactive visualization. Learn heap operations and understand min-heap and max-heap properties.',
    keywords:
      'binary heap, heap data structure, priority queue, heap operations, visualization',
  },
  CircularQueue: {
    title: 'Circular Queue Visualization - See Algorithms',
    description:
      'Learn Circular Queue data structure with interactive visualization. Understand FIFO operations with efficient space utilization.',
    keywords:
      'circular queue, queue data structure, FIFO, enqueue, dequeue, ring buffer, visualization',
  },
  ConvexHull: {
    title: 'Convex Hull Visualization - See Algorithms',
    description:
      'Learn Convex Hull algorithms with interactive visualization. Understand how to find the smallest convex polygon containing all points.',
    keywords:
      'convex hull, computational geometry, graham scan, jarvis march, polygon, visualization',
  },
  HuffmanCoding: {
    title: 'Huffman Coding Visualization - See Algorithms',
    description:
      'Master Huffman Coding with interactive visualization. Learn this optimal prefix-free encoding algorithm for data compression.',
    keywords:
      'huffman coding, data compression, binary tree, prefix codes, encoding, algorithm visualization',
  },
};

export const getAlgorithmSEO = (algorithm) => {
  const algorithmSEO = algorithmSeoMap[algorithm];
  if (!algorithmSEO) {
    const algoName = algorithm.replace(/([A-Z])/g, ' $1').trim();
    return {
      title: `${algoName} - See Algorithms`,
      description: `Learn ${algoName} algorithm with interactive visualization and step-by-step explanation.`,
      keywords: `${algoName.toLowerCase()}, algorithm, visualization, computer science, programming`,
    };
  }
  return algorithmSEO;
};
