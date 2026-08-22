import { SITE_URL } from '@/utils/constants';

export const defaultSeoConfig = {
  title: 'See Algorithms - Interactive Algorithm Visualizations',
  description:
    'Learn algorithms through interactive visualizations. Step-by-step animations for sorting, searching, graph algorithms, and data structures. Perfect for students and educators.',
  canonical: SITE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'See Algorithms',
    title: 'See Algorithms - Interactive Algorithm Visualizations',
    description:
      'Learn algorithms through interactive visualizations. Step-by-step animations for sorting, searching, graph algorithms, and data structures.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
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
      content: 'Akshay Karande',
    },
    {
      property: 'article:author',
      content: `${SITE_URL}/author`,
    },
  ],
  additionalLinkTags: [
    { rel: 'icon', href: '/favicon.png' },
    { rel: 'manifest', href: '/manifest.json' },
  ],
};

export const metaConfigs = {
  BubbleSort: {
    title: 'Bubble Sort Visualizer | Simple Sorting Algorithm',
    description:
      'Visualize Bubble Sort with full control. Pause, step through swaps, and use your own numbers. Master this O(n²) algorithm with our interactive tool.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom numbers in the input field, or use the randomly generated array.' },
      { name: 'Start the animation', text: 'Click Play to start the Bubble Sort animation and watch adjacent elements being compared and swapped.' },
      { name: 'Pause and step', text: 'Use Pause to freeze the animation, then Step to advance one comparison at a time and inspect each swap.' },
      { name: 'Observe the pattern', text: 'Notice how the largest unsorted element "bubbles up" to its final position after each pass.' },
    ],
  },
  QuickSort: {
    title: 'Quick Sort Visualizer | Divide & Conquer Algorithm',
    description:
      'Visualize Quick Sort step-by-step. Watch pivot partition strategy in real-time, use custom arrays, and understand O(n log n) sorting with an interactive tool.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom numbers or use the default random array.' },
      { name: 'Start the animation', text: 'Click Play to start Quick Sort. The visualizer highlights the pivot element and shows the partitioning process.' },
      { name: 'Watch partitioning', text: 'Observe how elements smaller than the pivot move left and larger ones move right, dividing the problem recursively.' },
      { name: 'Step through recursion', text: 'Use the Step control to advance one operation at a time and understand the divide-and-conquer strategy.' },
    ],
  },
  MergeSort: {
    title: 'Merge Sort Visualizer | Stable Sort with Recursion',
    description:
      'Interactive Merge Sort guide. Visualize the divide and conquer process step-by-step. Great for understanding recursion and stable O(n log n) sorting.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom numbers or use the default random array.' },
      { name: 'Start the animation', text: 'Click Play to watch the array split recursively into halves.' },
      { name: 'Observe the merge phase', text: 'Watch sorted sub-arrays merge back together in sorted order — this is where comparisons happen.' },
      { name: 'Pause to inspect', text: 'Pause and step through to understand how two sorted halves are merged into one.' },
    ],
  },
  InsertionSort: {
    title: 'Insertion Sort Visualizer | Adaptive Sorting Algorithm',
    description:
      'Watch Insertion Sort build a sorted array one item at a time. Perfect for understanding adaptive sorting on nearly sorted data. Interactive O(n²) guide.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom numbers or use the default random array.' },
      { name: 'Start the animation', text: 'Click Play to start. Watch how each element is picked and inserted into its correct position in the already-sorted portion.' },
      { name: 'Observe shifting', text: 'Notice how elements shift right to make room for the inserted element.' },
      { name: 'Step through manually', text: 'Use Step to advance one insertion at a time and see how the sorted region grows from left to right.' },
    ],
  },
  SelectionSort: {
    title: 'Selection Sort Visualizer | In-Place Comparison Sort',
    description:
      'Visualize Selection Sort finding minimums. Simple, interactive animation to understand in-place comparison sorting and O(n²) complexity.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom numbers or use the default random array.' },
      { name: 'Start the animation', text: 'Click Play to watch Selection Sort scan for the minimum element in the unsorted region.' },
      { name: 'Observe swaps', text: 'The visualizer highlights the current minimum and swaps it into place at the start of the unsorted portion.' },
      { name: 'Step through passes', text: 'Use Step to advance one selection at a time and watch the sorted region grow.' },
    ],
  },
  HeapSort: {
    title: 'Heap Sort Visualizer | Sorting with Binary Heap',
    description:
      'Master Heap Sort. Visualize the heapify process and heap operations (extract-max) in real-time. Understand priority queues and O(n log n) sorting.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom numbers or use the default random array.' },
      { name: 'Watch heapify', text: 'Click Play to observe the array being transformed into a max-heap. The largest element moves to the root.' },
      { name: 'Observe extraction', text: 'Watch the root (maximum element) get swapped to the end, then the heap property is restored via heapify-down.' },
      { name: 'Step through', text: 'Use Step to advance one heap operation at a time and understand the connection between the heap array and tree structure.' },
    ],
  },
  RadixSort: {
    title: 'Radix Sort Visualizer | Digit-By-Digit Integer Sort',
    description:
      'Visualize Radix Sort. See how numbers are sorted by digit buckets without comparison. Understand linear O(nk) time complexity with animations.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom integers or use the default random array.' },
      { name: 'Watch digit passes', text: 'Click Play to see Radix Sort process numbers digit by digit, starting from the least significant digit.' },
      { name: 'Observe bucketing', text: 'Elements are placed into digit buckets (0–9) and collected back in order after each digit pass.' },
      { name: 'Count the passes', text: 'Notice how the number of passes equals the number of digits in the largest number.' },
    ],
  },
  BFS: {
    title: 'Breadth-First Search Visualizer | Graph Traversal | BFS',
    description:
      'Interactive BFS tool. Draw your own graphs and watch Breadth-First Search find the shortest path level-by-level. Perfect for graph theory students.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Click on the canvas to add nodes. Drag between nodes to add edges. Use the toolbar to toggle directed/undirected mode.' },
      { name: 'Select a source node', text: 'Click on a node to set it as the BFS starting point.' },
      { name: 'Start BFS', text: 'Click Play to start the Breadth-First Search animation. Watch nodes get visited level by level.' },
      { name: 'Observe the frontier', text: 'BFS explores all neighbors at the current depth before moving deeper — notice how it finds shortest paths.' },
    ],
  },
  DFS: {
    title: 'Depth-First Search Visualizer | Graph Traversal | DFS',
    description:
      'Visualize DFS exploring graphs. Draw custom graphs to see recursion and backtracking in action. Understand stack-based traversal and maze solving.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Click on the canvas to add nodes. Drag between nodes to add edges.' },
      { name: 'Select a source node', text: 'Click a node to set it as the DFS starting point.' },
      { name: 'Start DFS', text: 'Click Play to start the Depth-First Search. Watch it dive deep into one branch before backtracking.' },
      { name: 'Observe backtracking', text: 'When DFS hits a dead end, it backtracks to the previous node and explores the next unvisited neighbor.' },
    ],
  },
  TopSort: {
    title: 'Topological Sort Visualizer | DAG Dependency Resolution',
    description:
      'Visualize Topological Sorting on your own Directed Acyclic Graphs (DAGs). Understand dependency resolution and task scheduling algorithms.',
    howToSteps: [
      { name: 'Draw a DAG', text: 'Create a Directed Acyclic Graph by adding nodes and directed edges. Ensure there are no cycles.' },
      { name: 'Start Topological Sort', text: 'Click Play to run the algorithm. It uses DFS to produce a linear ordering of all vertices.' },
      { name: 'Read the ordering', text: 'The resulting order guarantees every directed edge goes from an earlier node to a later one — useful for dependency resolution.' },
    ],
  },
  Dijkstras: {
    title: "Dijkstra's Algorithm Visualizer | Shortest Path Finder",
    description:
      "Visualize Dijkstra's algorithm step-by-step. Draw weighted graphs, set custom source, and watch the greedy shortest-path finder. Interactive graph tool.",
    howToSteps: [
      { name: 'Draw a weighted graph', text: 'Add nodes and edges. Click an edge to set its weight. The visualizer supports both directed and undirected graphs.' },
      { name: 'Select a source node', text: 'Click a node to set it as the source for Dijkstra\'s algorithm.' },
      { name: "Run Dijkstra's", text: "Click Play to start. Watch the algorithm greedily select the next closest unvisited node and relax its neighbors' distances." },
      { name: 'Read shortest paths', text: 'After completion, each node shows its shortest distance from the source. Highlighted edges form the shortest path tree.' },
    ],
  },
  Prims: {
    title: "Prim's Algorithm Visualizer | Greedy MST Construction",
    description:
      "Visualize Prim's algorithm building MSTs. Draw custom weighted graphs and watch the greedy strategy connect nodes with minimum cost.",
    howToSteps: [
      { name: 'Draw a weighted graph', text: 'Add nodes and undirected edges with weights.' },
      { name: 'Select a starting node', text: 'Click a node to set the MST starting vertex.' },
      { name: "Run Prim's", text: "Click Play. The algorithm greedily adds the minimum-weight edge connecting a visited node to an unvisited node." },
      { name: 'See the MST grow', text: 'Watch the Minimum Spanning Tree grow edge by edge until all nodes are connected.' },
    ],
  },
  Kruskals: {
    title: "Kruskal's Algorithm Visualizer | MST with Union-Find",
    description:
      "Interactive Kruskal's visualization. See how it selects edges and uses Union-Find to avoid cycles while building a Minimum Spanning Tree.",
    howToSteps: [
      { name: 'Draw a weighted graph', text: 'Add nodes and edges with weights.' },
      { name: "Start Kruskal's", text: "Click Play. The algorithm sorts all edges by weight and considers them in order." },
      { name: 'Watch cycle detection', text: 'Each edge is added to the MST only if it does not form a cycle — detected using the Union-Find data structure.' },
      { name: 'See the MST', text: 'The algorithm terminates when all nodes are connected with minimum total edge weight.' },
    ],
  },
  Boruvkas: {
    title: "Borůvka's Algorithm Visualizer | Parallel MST Construction",
    description:
      "Visualize Borůvka's algorithm. Watch components merge in parallel to form a Minimum Spanning Tree. Advanced graph theory visualization.",
    howToSteps: [
      { name: 'Draw a weighted graph', text: 'Add nodes and weighted edges.' },
      { name: "Start Borůvka's", text: 'Click Play. Each node starts as its own component.' },
      { name: 'Watch parallel merging', text: 'In each round, every component finds its cheapest outgoing edge and adds it — all components merge simultaneously.' },
      { name: 'Observe convergence', text: "The algorithm terminates when all components have merged into one — the Minimum Spanning Tree." },
    ],
  },
  Hamiltonian: {
    title: 'Hamiltonian Path Visualizer | Backtracking & NP-Complete',
    description:
      'Visualize the Hamiltonian Path. Draw graphs and watch backtracking algorithms attempt to visit every node exactly once. Interactive graph tool.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Add nodes and edges. The algorithm will search for a path visiting every node exactly once.' },
      { name: 'Start the search', text: 'Click Play to begin the backtracking search for a Hamiltonian Path.' },
      { name: 'Watch backtracking', text: 'The algorithm tries each possible next node. When it hits a dead end, it backtracks and tries a different route.' },
      { name: 'See the result', text: 'If a Hamiltonian Path exists, the visualizer highlights it. If not, it shows that no such path is possible.' },
    ],
  },
  Eulerian: {
    title: 'Eulerian Cycle Visualizer | Graph Theory Algorithm',
    description:
      'Visualize the Eulerian Cycle algorithm. Draw graphs and watch backtracking algorithms find a path visiting every edge exactly once.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Add nodes and edges. An Eulerian Cycle exists when all vertices have even degree.' },
      { name: 'Start the search', text: 'Click Play to start finding the Eulerian Cycle.' },
      { name: 'Watch edge traversal', text: 'The algorithm traverses each edge exactly once, forming a closed cycle that starts and ends at the same node.' },
    ],
  },
  LinkedList: {
    title: 'Linked List Visualizer | Insert, Delete, Traverse',
    description:
      'Interactive Linked List guide. Insert, delete, and traverse nodes in real-time. Understand pointers and memory allocation visually.',
    howToSteps: [
      { name: 'Insert a node', text: 'Type a value and click Insert to add a node to the linked list. The visualizer shows the new node connected by a pointer.' },
      { name: 'Delete a node', text: 'Enter a value and click Delete to remove the node. Watch how the pointer is redirected to bypass the deleted node.' },
      { name: 'Traverse the list', text: 'Click Traverse to animate movement through the linked list from head to tail.' },
    ],
  },
  DoublyLinkedList: {
    title: 'Doubly Linked List Visualizer | Forward and Backward Traversal',
    description:
      'Visualize Doubly Linked List in real-time. Learn bidirectional traversal, node insertion, and deletion with interactive pointer animations.',
    howToSteps: [
      { name: 'Insert a node', text: 'Enter a value and insert a node. The visualizer shows both forward (next) and backward (prev) pointer connections.' },
      { name: 'Delete a node', text: 'Delete a node and watch both the next and prev pointers update to bypass the removed node.' },
      { name: 'Traverse forward and backward', text: 'Use traverse controls to step through the list in both directions and observe bidirectional pointer links.' },
    ],
  },
  CircularQueue: {
    title: 'Circular Queue Visualizer | Ring Buffer FIFO Operations',
    description:
      'Visualize Circular Queue (Ring Buffer) mechanics. See how pointers wrap around in a fixed-size array. Ideal for understanding standard buffers.',
    howToSteps: [
      { name: 'Enqueue elements', text: 'Click Enqueue to add elements to the rear of the circular queue. The rear pointer advances.' },
      { name: 'Watch wrapping', text: 'When the rear reaches the end of the array, it wraps around to the front — demonstrating the circular structure.' },
      { name: 'Dequeue elements', text: 'Click Dequeue to remove elements from the front. The front pointer advances circularly.' },
      { name: 'Observe full/empty states', text: 'The visualizer highlights when the queue is full (all slots occupied) or empty (front equals rear).' },
    ],
  },
  BinaryHeap: {
    title: 'Binary Heap Visualizer | Interactive Min/Max Heap',
    description:
      'Visualize Binary Heaps. Insert values and watch heapify-up/down operations maintain the heap property. Compare Min-Heap and Max-Heap behavior.',
    howToSteps: [
      { name: 'Insert a value', text: 'Enter a number and click Insert. The value is added at the last position, then heapify-up restores the heap property.' },
      { name: 'Watch heapify-up', text: 'The inserted element bubbles up by swapping with its parent until the parent is greater (Max-Heap) or smaller (Min-Heap).' },
      { name: 'Extract the root', text: 'Click Extract to remove the root (max or min). The last element moves to root, then heapify-down restores the heap.' },
      { name: 'Toggle heap type', text: 'Switch between Max-Heap and Min-Heap to see how the heap property differs.' },
    ],
  },
  BST: {
    title: 'Binary Search Tree Visualizer | Interactive BST Operations',
    description:
      'Interactive BST tool. Insert, search, and delete nodes and visualize how the tree structure changes. Understand O(log n) vs O(n) search.',
    howToSteps: [
      { name: 'Insert nodes', text: 'Enter values and click Insert. The visualizer places each node according to the BST rule: smaller values go left, larger go right.' },
      { name: 'Search for a value', text: 'Enter a value and click Search. Watch the algorithm compare and traverse left or right until it finds the node.' },
      { name: 'Delete a node', text: 'Enter a value and delete it. The visualizer demonstrates the three BST deletion cases: leaf, one child, or two children.' },
      { name: 'Observe the structure', text: 'Notice how sorted insertions can create a skewed tree (like a linked list), demonstrating the need for self-balancing trees.' },
    ],
  },
  AVL: {
    title: 'AVL Tree Visualizer | Self-Balancing Rotations | BST',
    description:
      'Watch AVL Trees balance themselves. Visualize LL, RR, LR, and RL rotations in real-time as you insert nodes. Master self-balancing logic.',
    howToSteps: [
      { name: 'Insert nodes', text: 'Enter values and click Insert. The visualizer shows each node being placed in BST order.' },
      { name: 'Watch balance checks', text: 'After each insertion, the AVL Tree checks balance factors (height difference) for each ancestor node.' },
      { name: 'Observe rotations', text: 'When a node becomes imbalanced, a rotation (LL, RR, LR, or RL) is triggered to restore balance.' },
      { name: 'Compare with BST', text: 'Try inserting sorted values (1, 2, 3, ...). The AVL Tree stays balanced while a regular BST would degenerate.' },
    ],
  },
  RedBlackTree: {
    title: 'Red-Black Tree Visualizer | Coloring & Rotations | BST',
    description:
      'Master Red-Black Trees. Insert nodes and watch the recoloring and rotation rules maintain balance. Understand O(log n) search.',
    howToSteps: [
      { name: 'Insert nodes', text: 'Enter values and click Insert. New nodes are always inserted as red initially.' },
      { name: 'Watch recoloring', text: 'If inserting a red node violates the Red-Black properties, recoloring (changing node colors) may resolve the violation.' },
      { name: 'Watch rotations', text: 'When recoloring alone is insufficient, left or right rotations restructure the tree to restore Red-Black properties.' },
      { name: 'Observe soft balance', text: 'Unlike AVL Trees, Red-Black Trees tolerate slight imbalance — notice how the tree height stays within bounds despite relaxed rules.' },
    ],
  },
  SplayTree: {
    title: 'Splay Tree Visualizer | Self-Adjusting Binary Tree',
    description:
      'Visualize Splay Trees. Access nodes and watch them bubble to the root via splaying operations. Understand cache optimization and locality.',
    howToSteps: [
      { name: 'Insert nodes', text: 'Enter values and insert nodes. Each inserted node is splayed to the root.' },
      { name: 'Access a node', text: 'Enter a value and click Access. The accessed node rotates up to the root via a series of zig, zig-zig, or zig-zag operations.' },
      { name: 'Observe locality', text: 'Recently accessed nodes stay near the root, giving Splay Trees excellent performance for temporal locality of reference.' },
    ],
  },
  BTree: {
    title: 'B-Tree Visualizer | Multi-Way Search Tree',
    description:
      'Visualize B-Trees (order 3). Insert keys and watch nodes split and keys promote to maintain balance. Understand multi-way search trees.',
    howToSteps: [
      { name: 'Insert keys', text: 'Enter integer values and click Insert. Keys are placed in sorted order within the appropriate node.' },
      { name: 'Watch node splits', text: 'When a node exceeds maximum capacity, it splits: the median key promotes to the parent, and two new child nodes are created.' },
      { name: 'Observe balance', text: 'B-Trees always remain perfectly balanced — all leaf nodes are at the same depth after every operation.' },
    ],
  },
  ConvexHull: {
    title: 'Convex Hull Visualizer | Jarvis March Wrapping',
    description:
      'Interactive tool for Convex Hull. Add points and watch Jarvis March algorithm wrap them in a hull step-by-step. Computational geometry guide.',
    howToSteps: [
      { name: 'Add points', text: 'Click anywhere on the canvas to add points in a 2D plane.' },
      { name: 'Start Jarvis March', text: 'Click Play to run the Jarvis March (Gift Wrapping) algorithm.' },
      { name: 'Watch the wrap', text: 'The algorithm starts from the leftmost point and repeatedly selects the most counterclockwise point, "wrapping" around the point set.' },
      { name: 'See the hull', text: 'The resulting polygon is the convex hull — the smallest convex boundary enclosing all input points.' },
    ],
  },
  HuffmanCoding: {
    title: 'Huffman Coding Visualizer | Data Compression Algorithm',
    description:
      'Visualize Huffman Coding. Enter frequencies and watch the optimal prefix tree being built. Understand lossless compression step-by-step.',
    howToSteps: [
      { name: 'Enter character frequencies', text: 'Input characters and their frequencies (how often they appear in data).' },
      { name: 'Build the Huffman Tree', text: 'Click Build. The two nodes with lowest frequency merge into a parent node repeatedly until one tree remains.' },
      { name: 'Read the codes', text: 'Traverse the tree: left edges are 0, right edges are 1. Each leaf\'s path from root gives its Huffman code.' },
      { name: 'Verify compression', text: 'Notice how frequent characters get shorter codes — this is the core of Huffman\'s optimal prefix-free encoding.' },
    ],
  },
  'inplace-sorting': {
    title: 'In-place Sorting Algorithms | Minimize Extra Space',
    description:
      'Understand how in-place sorting algorithms minimize extra space while reorganizing data. Learn about the trade-offs and nuances.',
  },
  'shortest-path-vs-mst': {
    title: 'Shortest Path vs MST Algorithms | Difference in Objectives',
    description:
      'Visualize the difference between Shortest Path and MST algorithms. Understand the objectives of these algorithms and how they are different.',
  },
  'why-sorting-matters': {
    title: 'Why Sorting is Important | Real-World Applications',
    description:
      'Understand the importance of sorting algorithms and how they are used in real-world applications. Perfect for students and educators.',
  },
  'stable-sorting': {
    title: 'Stable Sorting Algorithms | Maintaining Original Order',
    description:
      'Learn how algorithms maintain original order when sorting data with duplicate keys. Understand the importance of stability in sorting algorithms.',
  },
  'quick-sort-illusion': {
    title: 'When Quicksort Slows Down | Pivot Selection | Sorting',
    description:
      'Learn how already sorted data can slow down Quicksort. Understand the importance of pivot selection and how it affects the performance.',
  },
  'avl-tree-vs-red-black': {
    title: 'AVL Tree vs Red-Black Tree | Self-Balancing Trees',
    description:
      'Learn the difference between AVL Trees and Red-Black Trees. Understand the self-balancing mechanisms and how they differ in practice.',
  },
  'deleting-bst-node': {
    title: 'Deleting a Node in BST | Three Possible Cases',
    description:
      'Learn how a Binary Search Tree removes nodes while maintaining its ordering. Explore the three situations that arise and how each case works.',
  },
  'compare-sorting': {
    title: 'Compare Sorting Algorithms | Real-Time Visualization',
    description:
      'Compare multiple sorting algorithms in real-time. Watch how different approaches sort the same list of numbers simultaneously.',
  },
  'embed-sorting': {
    title: 'Embed Sorting Visualizers | Educational Tool',
    description:
      'Learn how to embed interactive sorting animations into your blog, Notion, or website. Perfect for technical articles and tutorials.',
  },
  'embed-graph': {
    title: 'Embed Graph Visualizers | Interactive Pathfinding',
    description:
      'Transform your graph theory articles with interactive visualizers. Learn how to embed dynamic animations into your blog, Notion, or website.',
  },
  'embed-data-struct': {
    title: 'Embed DS Visualizers | Interactive Tree Visuals',
    description:
      'Learn how to embed interactive data structure animations into your blog, Notion, or website. Perfect for technical articles and tutorials.',
  },
  'bfs-vs-dfs': {
    title: 'Compare BFS and DFS | Graph Traversal Algorithms',
    description:
      'Visualize Breadth-First Search and Depth-First Search side-by-side. Explore their diverging patterns and search strategies with an interactive tool.',
  },
  'avl-tree-vs-rbt': {
    title: 'AVL Tree vs Red-Black Tree | Self-Balancing Trees',
    description:
      'Compare the trade-offs between AVL Tree and Red-Black Tree. Watch how each structure rebalances itself during insertions in real-time.',
  },
};

export const getSeoConfig = (pageId, pathname) => {
  const config = metaConfigs[pageId];

  if (!config) {
    if (pathname === '/articles') {
      return {
        title: 'Articles (See Algorithms) | Deep-dive into DSA',
        description:
          'Learn about sorting efficiency, self-balancing trees, graph theory, and more through interactive articles and visual guides.',
      };
    }
    return defaultSeoConfig;
  }

  return config;
};
