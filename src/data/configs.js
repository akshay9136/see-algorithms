export const metaConfigs = {
  BubbleSort: {
    title: 'Bubble Sort Visualizer | Simple Sorting Algorithm',
    description:
      'Explore how Bubble Sort repeatedly compares adjacent elements and swaps them into order. Step through every comparison and swap with interactive animations.',
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
      'Explore how Quick Sort partitions elements around a pivot and recursively sorts subarrays. Step through pivot selection and swaps with interactive animations.',
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
      'Explore how Merge Sort recursively divides arrays into halves and merges sorted sublists. Step through recursive splitting and merging in real time.',
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
      'Explore how Insertion Sort builds a sorted array by inserting each element into place. Step through shifting and placement with interactive animations.',
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
      'Explore how Selection Sort repeatedly scans for the minimum element and places it into position. Step through each selection pass with interactive animations.',
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
      'Explore how Heap Sort builds a binary max-heap and systematically extracts the root. Step through heapify passes and array swaps with interactive animations.',
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
      'Explore how Radix Sort processes numbers digit by digit without direct comparisons. Step through bucketing passes and collection with interactive animations.',
    howToSteps: [
      { name: 'Enter your input', text: 'Type custom integers or use the default random array.' },
      { name: 'Watch digit passes', text: 'Click Play to see Radix Sort process numbers digit by digit, starting from the least significant digit.' },
      { name: 'Observe bucketing', text: 'Elements are placed into digit buckets (0–9) and collected back in order after each digit pass.' },
      { name: 'Count the passes', text: 'Notice how the number of passes equals the number of digits in the largest number.' },
    ],
  },
  DFS: {
    title: 'Depth-First Search Visualizer | Graph Traversal | DFS',
    description:
      'Explore how Depth-First Search explores graph branches deeply before backtracking. Step through stack traversal and unvisited paths with interactive animations.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Click on the canvas to add nodes. Drag between nodes to add edges.' },
      { name: 'Select a source node', text: 'Click a node to set it as the DFS starting point.' },
      { name: 'Start DFS', text: 'Click Play to start the Depth-First Search. Watch it dive deep into one branch before backtracking.' },
      { name: 'Observe backtracking', text: 'When DFS hits a dead end, it backtracks to the previous node and explores the next unvisited neighbor.' },
    ],
  },
  BFS: {
    title: 'Breadth-First Search Visualizer | Graph Traversal | BFS',
    description:
      'Explore how Breadth-First Search traverses graphs level by level. Watch queue operations and explore shortest paths step-by-step with interactive animations.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Click on the canvas to add nodes. Drag between nodes to add edges. Use the toolbar to toggle directed/undirected mode.' },
      { name: 'Select a source node', text: 'Click on a node to set it as the BFS starting point.' },
      { name: 'Start BFS', text: 'Click Play to start the Breadth-First Search animation. Watch nodes get visited level by level.' },
      { name: 'Observe the frontier', text: 'BFS explores all neighbors at the current depth before moving deeper — notice how it finds shortest paths.' },
    ],
  },
  Dijkstras: {
    title: "Dijkstra's Algorithm Visualizer | Shortest Path Finder",
    description:
      "Explore how Dijkstra's algorithm finds shortest paths in weighted graphs. Step through greedy node selection and distance relaxation in real time.",
    howToSteps: [
      { name: 'Draw a weighted graph', text: 'Add nodes and edges. Click an edge to set its weight. The visualizer supports both directed and undirected graphs.' },
      { name: 'Select a source node', text: 'Click a node to set it as the source for Dijkstra\'s algorithm.' },
      { name: "Run Dijkstra's", text: "Click Play to start. Watch the algorithm greedily select the next closest unvisited node and relax its neighbors' distances." },
      { name: 'Read shortest paths', text: 'After completion, each node shows its shortest distance from the source. Highlighted edges form the shortest path tree.' },
    ],
  },
  TopSort: {
    title: 'Topological Sort Visualizer | DAG Dependency Resolution',
    description:
      'Explore how Topological Sort produces a linear ordering of DAG vertices. Step through dependency resolution and vertex ordering with interactive animations.',
    howToSteps: [
      { name: 'Draw a DAG', text: 'Create a Directed Acyclic Graph by adding nodes and directed edges. Ensure there are no cycles.' },
      { name: 'Start Topological Sort', text: 'Click Play to run the algorithm. It uses DFS to produce a linear ordering of all vertices.' },
      { name: 'Read the ordering', text: 'The resulting order guarantees every directed edge goes from an earlier node to a later one — useful for dependency resolution.' },
    ],
  },
  Hamiltonian: {
    title: 'Hamiltonian Path Visualizer | Backtracking & NP-Complete',
    description:
      'Explore how the Hamiltonian Path algorithm searches for a tour visiting every vertex once. Step through backtracking exploration with interactive animations.',
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
      'Explore how Eulerian Path algorithm finds a trail traversing every edge exactly once. Step through degree checks and edge walks with interactive animations.',
    howToSteps: [
      { name: 'Draw your graph', text: 'Add nodes and edges. An Eulerian Cycle exists when all vertices have even degree.' },
      { name: 'Start the search', text: 'Click Play to start finding the Eulerian Cycle.' },
      { name: 'Watch edge traversal', text: 'The algorithm traverses each edge exactly once, forming a closed cycle that starts and ends at the same node.' },
    ],
  },
  Prims: {
    title: "Prim's Algorithm Visualizer | Greedy MST Construction",
    description:
      "Explore how Prim's algorithm builds a minimum spanning tree by adding the cheapest adjacent edge. Step through greedy MST growth with interactive animations.",
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
      "Explore how Kruskal's algorithm builds an MST by connecting edges in increasing weight without cycles. Step through Union-Find checks in real time.",
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
      "Explore how Borůvka's algorithm builds an MST by selecting cheapest outgoing edges in parallel. Step through component merging with interactive animations.",
    howToSteps: [
      { name: 'Draw a weighted graph', text: 'Add nodes and weighted edges.' },
      { name: "Start Borůvka's", text: 'Click Play. Each node starts as its own component.' },
      { name: 'Watch parallel merging', text: 'In each round, every component finds its cheapest outgoing edge and adds it — all components merge simultaneously.' },
      { name: 'Observe convergence', text: "The algorithm terminates when all components have merged into one — the Minimum Spanning Tree." },
    ],
  },
  LinkedList: {
    title: 'Linked List Visualizer | Insert, Delete, Traverse',
    description:
      'Explore how a Linked List links sequential nodes with pointer references. Step through node insertion, deletion, and traversal with interactive animations.',
    howToSteps: [
      { name: 'Insert a node', text: 'Type a value and click Insert to add a node to the linked list. The visualizer shows the new node connected by a pointer.' },
      { name: 'Insert at head', text: 'Type a value and click Insert at Head to add a node to the beginning of the linked list. Watch how the head pointer is updated.' },
      { name: 'Insert at tail', text: 'Type a value and click Insert at Tail to add a node to the end of the linked list. Watch how the tail pointer is updated.' },
      { name: 'Delete a node', text: 'Enter a value and click Delete to remove the node. Watch how the pointer is redirected to bypass the deleted node.' },
    ],
  },
  DoublyLinkedList: {
    title: 'Doubly Linked List Visualizer | Forward and Backward Traversal',
    description:
      'Explore how a Doubly Linked List connects nodes with two-way pointers. Step through forward and backward traversal, insertion, and deletion in real time.',
    howToSteps: [
      { name: 'Insert a node', text: 'Enter a value and insert a node. The visualizer shows both forward (next) and backward (prev) pointer connections.' },
      { name: 'Insert at head', text: 'Type a value and click Insert at Head to add a node to the beginning of the doubly linked list. Watch how the head pointer is updated.' },
      { name: 'Insert at tail', text: 'Type a value and click Insert at Tail to add a node to the end of the doubly linked list. Watch how the tail pointer is updated.' },
      { name: 'Delete a node', text: 'Delete a node and watch both the next and prev pointers update to bypass the removed node.' },
    ],
  },
  CircularQueue: {
    title: 'Circular Queue Visualizer | Ring Buffer FIFO Operations',
    description:
      'Explore how a Circular Queue connects its tail back to head in a ring buffer. Step through enqueue, dequeue, and pointer wrap-around in real time.',
    howToSteps: [
      { name: 'Enqueue elements', text: 'Click Enqueue to add elements to the rear of the circular queue. The rear pointer advances.' },
      { name: 'Watch wrapping', text: 'When the rear reaches the end of the array, it wraps around to the front — demonstrating the circular structure.' },
      { name: 'Dequeue elements', text: 'Click Dequeue to remove elements from the front. The front pointer advances circularly.' },
    ],
  },
  PrefixTree: {
    title: 'Trie (Prefix Tree) Visualizer | Interactive Animation',
    description:
      'Explore how a Trie (Prefix Tree) stores strings by sharing common prefix paths. Step through word insertion, search, and pruning with interactive animations.',
    howToSteps: [
      { name: 'Insert a word', text: 'Type a word and click Insert. Each character becomes a node; characters shared with existing words reuse the same branch.' },
      { name: 'Observe shared prefixes', text: 'Insert words with common prefixes (e.g. "car", "card", "care"). Notice how the shared prefix path is stored only once.' },
      { name: 'Search for a word', text: 'Type a word and click Search. The visualizer highlights each traversed node — blue for found, red for not found.' },
      { name: 'Delete a word', text: 'Delete removes the end-of-word marker and prunes any nodes that are no longer part of another word.' },
    ],
  },
  BinaryHeap: {
    title: 'Binary Heap Visualizer | Interactive Min/Max Heap',
    description:
      'Explore how a Binary Heap maintains heap order for fast min or max access. Step through heapify-up and heapify-down operations with interactive animations.',
    howToSteps: [
      { name: 'Insert a value', text: 'Enter a number and click Insert. The value is added at the last position, then heapify-up restores the heap property.' },
      { name: 'Watch heapify-up', text: 'The inserted element bubbles up by swapping with its parent until the parent is greater (Max-Heap) or smaller (Min-Heap).' },
      { name: 'Extract the root', text: 'Click Extract to remove the root (max or min). The last element moves to root, then heapify-down restores the heap.' },
    ],
  },
  BST: {
    title: 'Binary Search Tree Visualizer | Interactive BST Operations',
    description:
      'Explore how a Binary Search Tree arranges smaller left keys and larger right keys. Step through node insertion, search, and deletion in real time.',
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
      'Explore how an AVL Tree maintains balanced height using automatic tree rotations. Step through LL, RR, LR, and RL rotations with interactive animations.',
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
      'Explore how a Red-Black Tree balances search depth using node colors and rotations. Step through recoloring and balancing cases with interactive animations.',
    howToSteps: [
      { name: 'Insert nodes', text: 'Enter values and click Insert. New nodes are always inserted as red initially.' },
      { name: 'Watch recoloring', text: 'If inserting a red node violates the Red-Black properties, recoloring (changing node colors) may resolve the violation.' },
      { name: 'Watch rotations', text: 'When recoloring alone is insufficient, left or right rotations restructure the tree to restore Red-Black properties.' },
      { name: 'Observe soft balance', text: 'Unlike AVL Trees, Red-Black Trees tolerate slight imbalance — notice how the tree height stays within bounds despite relaxed rules.' },
    ],
  },
  SplayTree: {
    title: 'Splay Tree Visualization | Rotations & Time Complexity',
    description:
      'Learn how a splay tree works with interactive visualization, Zig, Zig-Zig and Zig-Zag examples, amortized O(log n) complexity, and practical use cases.',
    howToSteps: [
      { name: 'Insert nodes', text: 'Enter values and insert nodes. Each inserted node is splayed to the root.' },
      { name: 'Search for a node', text: 'Enter a value and click Search. A matching node rotates to the root through Zig, Zig-Zig, or Zig-Zag steps. If no key matches, the last visited node is splayed.' },
      { name: 'Observe locality', text: 'Recently accessed nodes stay near the root, giving Splay Trees excellent performance for temporal locality of reference.' },
    ],
  },
  BTree: {
    title: 'B-Tree Visualizer | Multi-Way Search Tree',
    description:
      'Explore how a B-Tree organizes multi-way keys and splits overflowing nodes. Step through key insertion, node splits, and promotions in real time.',
    howToSteps: [
      { name: 'Insert keys', text: 'Enter integer values and click Insert. Keys are placed in sorted order within the appropriate node.' },
      { name: 'Watch node splits', text: 'When a node exceeds maximum capacity, it splits: the median key promotes to the parent, and two new child nodes are created.' },
      { name: 'Observe balance', text: 'B-Trees always remain perfectly balanced — all leaf nodes are at the same depth after every operation.' },
    ],
  },
  'B+Tree': {
    title: 'B+ Tree Visualizer | Multi-Way Search Tree',
    description:
      'Explore how a B+ Tree stores keys in linked leaves for high-throughput range scans. Step through copy-up splits and promotions with interactive animations.',
    howToSteps: [
      { name: 'Insert keys', text: 'Enter integer values and click Insert. Keys are routed through internal nodes and always land in a leaf node.' },
      { name: 'Watch leaf splits', text: 'When a leaf overflows, it splits: the smallest key of the right half is copied (not moved) up to the parent, so the key stays in the leaf.' },
      { name: 'Observe the leaf chain', text: 'All leaf nodes are linked left-to-right (shown by dashed green arrows), enabling fast range scans without re-traversing the tree.' },
      { name: 'Observe balance', text: 'B+ Trees always remain perfectly balanced — all leaf nodes are at the same depth after every operation.' },
    ],
  },
  ConvexHull: {
    title: 'Convex Hull Visualizer | Jarvis March Wrapping',
    description:
      'Explore how the Convex Hull algorithm wraps the smallest polygon around 2D points. Step through Jarvis March wrapping steps with interactive animations.',
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
      'Explore how Huffman Coding compresses data by assigning shorter codes to frequent symbols. Step through optimal prefix tree construction in real time.',
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
  'embed-sorting-algo': {
    title: 'Embed Sorting Visualizers | Educational Tool',
    description:
      'Learn how to embed interactive sorting animations into your blog, Notion, or website. Perfect for technical articles and tutorials.',
  },
  'embed-graph-algo': {
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
  'b-tree-vs-b+tree': {
    title: 'B-Tree vs B+ Tree | Multi-Way Search Trees',
    description:
      'Compare B-Tree and B+ Tree side-by-side. See how the copy-up vs move-up split difference shapes the two structures with an interactive tool.',
  },
  'deleting-rbt-node': {
    title: 'Deletion in a Red-Black Tree',
    description:
      'Learn how Red-Black Trees delete nodes and fix violations using the double-black concept and four fixup cases — resolved through rotations and recoloring.',
  },
  'avl-tree-rotations': {
    title: 'AVL Tree Rotations | LL, RR, LR, RL',
    description:
      'Understand AVL tree rotations with step-by-step diagrams. Learn how Left, Right, Left-Right, and Right-Left rotations restore balance in O(1) time.',
  },
  'lomuto-vs-hoare': {
    title: 'Lomuto vs Hoare Partitioning | Quicksort',
    description:
      'Compare Lomuto and Hoare partitioning schemes in Quicksort. Learn about pointer movement, swap efficiency, and handling duplicate keys.',
  },
  'heap-index-math': {
    title: 'Complete Binary Trees in Flat Arrays',
    description:
      'Understand the index math behind binary heaps. Learn why implicit complete binary trees eliminate pointer overhead and simplify heap traversal.',
  },
};
