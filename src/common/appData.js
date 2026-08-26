import { groupBy } from './utils';

export const algorithms = [
  { id: 'BubbleSort', name: 'Bubble Sort', category: 'Sorting' },
  { id: 'InsertionSort', name: 'Insertion Sort', category: 'Sorting' },
  { id: 'SelectionSort', name: 'Selection Sort', category: 'Sorting' },
  { id: 'HeapSort', name: 'Heap Sort', category: 'Sorting' },
  { id: 'MergeSort', name: 'Merge Sort', category: 'Sorting' },
  { id: 'QuickSort', name: 'Quick Sort', category: 'Sorting' },
  { id: 'RadixSort', name: 'Radix Sort', category: 'Sorting' },
  { id: 'DFS', name: 'Depth First Search', category: 'Graph' },
  { id: 'BFS', name: 'Breadth First Search', category: 'Graph' },
  { id: 'bfs-vs-dfs', name: 'BFS vs DFS', category: 'Graph' },
  {
    id: 'Prims',
    name: "Prim's Algorithm",
    category: 'Finding MST',
    path: '/graph/Prims',
  },
  {
    id: 'Kruskals',
    name: "Kruskal's Algorithm",
    category: 'Finding MST',
    path: '/graph/Kruskals',
  },
  {
    id: 'Boruvkas',
    name: "Borůvka's Algorithm",
    category: 'Finding MST',
    path: '/graph/Boruvkas',
  },
  { id: 'Dijkstras', name: "Dijkstra's Algorithm", category: 'Graph' },
  { id: 'TopSort', name: 'Topological Sorting', category: 'Graph' },
  { id: 'Hamiltonian', name: 'Hamiltonian Cycle', category: 'Graph' },
  { id: 'Eulerian', name: 'Eulerian Cycle', category: 'Graph' },
  {
    id: 'CircularQueue',
    name: 'Circular Queue',
    category: 'Data Structures',
  },
  { id: 'LinkedList', name: 'Linked List', category: 'Data Structures' },
  {
    id: 'DoublyLinkedList',
    name: 'Doubly Linked List',
    category: 'Data Structures',
  },
  { id: 'BinaryHeap', name: 'Binary Heap', category: 'Data Structures' },
  { id: 'BST', name: 'Binary Search Tree', category: 'Data Structures' },
  {
    id: 'AVL',
    name: 'AVL Tree',
    category: 'Advanced Trees',
    path: '/data-structures/AVL',
  },
  {
    id: 'RedBlackTree',
    name: 'Red-Black Tree',
    category: 'Advanced Trees',
    path: '/data-structures/RedBlackTree',
  },
  {
    id: 'avl-tree-vs-rbt',
    name: 'AVL vs Red-Black',
    title: 'AVL Tree vs Red-Black Tree',
    category: 'Advanced Trees',
    path: '/data-structures/avl-tree-vs-rbt',
  },
  {
    id: 'SplayTree',
    name: 'Splay Tree',
    category: 'Advanced Trees',
    path: '/data-structures/SplayTree',
  },
  {
    id: 'BTree',
    name: 'B-Tree',
    category: 'Advanced Trees',
    path: '/data-structures/BTree',
  },
  { id: 'ConvexHull', name: 'Convex Hull', category: 'Other' },
  { id: 'HuffmanCoding', name: 'Huffman Coding', category: 'Other' },
];

export const categories = groupBy(algorithms, 'category');

export const articles = [
  {
    id: 'why-sorting-matters',
    title: 'Why Sorting is Important',
    summary:
      'Understanding why sorting matters is more important than memorizing how sorting works.',
    category: 'Sorting',
    date: '2026-02-24',
    quickAnswer:
      'Sorting is important because it transforms unstructured data into ordered sequences, enabling faster searching (e.g., binary search), efficient data processing, and is foundational to nearly all advanced algorithms and real-world systems.',
    faqs: [
      {
        q: 'Why is sorting important in computer science?',
        a: 'Sorting is important because ordered data enables efficient algorithms. Binary search, for example, only works on sorted data and reduces search time from O(n) to O(log n). Sorting is also a one-time cost that makes many downstream operations — grouping, filtering, aggregation, and duplicate detection — significantly faster.',
      },
      {
        q: 'Where is sorting used in real life?',
        a: 'Sorting is used everywhere: search engines rank results, e-commerce platforms order products by price, operating systems schedule tasks by priority, and databases use sorted indexes (B-trees) internally. Many advanced algorithms also assume sorted input.',
      },
      {
        q: 'Why do we study sorting algorithms if languages have built-in sort?',
        a: 'Sorting algorithms teach fundamental computer science concepts: comparison, swapping, recursion, divide-and-conquer, and algorithmic trade-offs. Understanding them builds intuition for analyzing any algorithm\'s efficiency and helps you choose the right tool for specific data patterns.',
      },
    ],
  },
  {
    id: 'inplace-sorting',
    title: 'In-Place Sorting Algorithms',
    summary:
      'Understand how in-place sorting algorithms minimize extra space while reorganizing data.',
    category: 'Sorting',
    date: '2026-02-24',
    quickAnswer:
      'An in-place sorting algorithm rearranges elements within the original array without allocating significant extra memory — typically using only O(1) auxiliary space. Examples include Bubble Sort, Insertion Sort, Selection Sort, and Heap Sort.',
    faqs: [
      {
        q: 'What does in-place mean in sorting algorithms?',
        a: 'An in-place sorting algorithm sorts data by modifying the original array directly, using only a constant amount of extra memory (a few variables for indexing or swapping). It does not create a separate copy of the data to store the sorted result.',
      },
      {
        q: 'Which sorting algorithms are in-place?',
        a: 'Bubble Sort, Insertion Sort, Selection Sort, and Heap Sort are classic in-place sorting algorithms. They rearrange elements inside the same array without needing an auxiliary array. Quick Sort is also typically considered in-place despite using O(log n) stack space for recursion.',
      },
      {
        q: 'Is Merge Sort in-place?',
        a: 'No, the standard Merge Sort implementation is not in-place. It allocates an additional array to merge sorted halves, giving it O(n) space complexity. In-place variants of Merge Sort exist but are significantly more complex and slower in practice.',
      },
      {
        q: 'Why does in-place sorting matter?',
        a: 'In-place sorting is crucial for memory-constrained environments — embedded systems, large dataset processing, or situations where allocating extra memory is expensive. Sorting in-place avoids the overhead of creating unnecessary copies of data.',
      },
    ],
  },
  {
    id: 'stable-sorting',
    title: 'Stable Sorting Algorithms',
    summary:
      'Understand the importance of maintaining original order when sorting data with duplicate keys.',
    category: 'Sorting',
    date: '2026-02-25',
    quickAnswer:
      'A stable sorting algorithm preserves the relative order of elements that compare as equal. If two items have the same key, a stable sort guarantees the one that appeared first in the input will still appear first in the output.',
    faqs: [
      {
        q: 'What is a stable sorting algorithm?',
        a: 'A stable sorting algorithm preserves the relative order of elements with equal keys. If two objects have the same sorting key and one appears before the other in the input, a stable sort guarantees that same order in the output. This matters when sorting objects with multiple attributes.',
      },
      {
        q: 'Which sorting algorithms are stable?',
        a: 'Bubble Sort, Insertion Sort, and Merge Sort are stable sorting algorithms. Selection Sort, Quick Sort, and Heap Sort are typically unstable — they may swap equal elements into a different order during sorting.',
      },
      {
        q: 'Why does stability in sorting matter?',
        a: 'Stability matters when sorting complex objects by multiple criteria. For example, if you first sort employees by department, then by salary, a stable sort ensures employees with the same salary remain in department order. Unstable sorts can lose this structure.',
      },
    ],
  },
  {
    id: 'shortest-path-vs-mst',
    title: 'Shortest Path vs MST',
    summary:
      'Learn the difference in objectives of Shortest Path and Minimum Spanning Tree algorithms.',
    category: 'Graph',
    date: '2026-02-26',
    quickAnswer:
      'Shortest Path algorithms find the minimum-cost route between two specific vertices, while Minimum Spanning Tree (MST) algorithms find the cheapest way to connect all vertices in a graph. They solve fundamentally different problems.',
    faqs: [
      {
        q: 'What is the difference between Shortest Path and Minimum Spanning Tree?',
        a: 'Shortest Path algorithms (like Dijkstra\'s) find the minimum-cost path from one source vertex to a destination. MST algorithms (like Prim\'s or Kruskal\'s) find the set of edges with minimum total weight that connects all vertices without cycles. They have different objectives and do not necessarily produce the same graph structure.',
      },
      {
        q: 'Can the shortest path tree and minimum spanning tree be the same?',
        a: 'Not necessarily. A shortest path tree minimizes distance from one source, which can differ from the MST that minimizes total edge weight globally. An edge optimal for connecting all vertices cheaply may not lie on the shortest route from a specific source.',
      },
      {
        q: 'When should I use Shortest Path vs MST?',
        a: 'Use Shortest Path algorithms (Dijkstra\'s, Bellman-Ford) when you need optimal routing between specific nodes — navigation, network packet delivery. Use MST algorithms (Prim\'s, Kruskal\'s) when you need cost-efficient infrastructure connecting everything — laying cables, building roads, or network design.',
      },
    ],
  },
  {
    id: 'quick-sort-illusion',
    title: 'When Quicksort Slows Down',
    summary:
      'Speed in sorting algorithms is the consequence of structural balance and careful decisions.',
    category: 'Sorting',
    date: '2026-02-28',
    quickAnswer:
      'Quicksort slows down when its pivot choice produces highly unbalanced partitions — especially on already-sorted or nearly-sorted input with a naive pivot strategy. This degrades performance from O(n log n) to O(n²).',
    faqs: [
      {
        q: 'Why is Quicksort slow on sorted arrays?',
        a: 'When the first or last element is chosen as the pivot (a common beginner implementation), a sorted array always gives the pivot the minimum or maximum value. This creates one empty partition and one with almost all elements, making recursion linear in depth instead of logarithmic — turning O(n log n) into O(n²).',
      },
      {
        q: 'What is the worst case for Quicksort?',
        a: 'The worst case for Quicksort is O(n²) time complexity. It occurs when pivot selection consistently produces maximally unbalanced partitions — e.g., always picking the smallest or largest element. This happens with naive pivot strategies on sorted, reverse-sorted, or duplicate-heavy input.',
      },
      {
        q: 'How do you avoid Quicksort worst case?',
        a: 'Three common techniques prevent Quicksort\'s worst case: (1) randomized pivot selection — choose a random element as pivot; (2) median-of-three — pick the median of the first, middle, and last elements; (3) three-way partitioning for duplicate-heavy data. Modern implementations often use introspective sort (Introsort) that falls back to Heap Sort on deep recursion.',
      },
    ],
  },
  {
    id: 'avl-tree-vs-red-black',
    title: 'AVL Tree vs Red-Black Tree',
    summary:
      'Understand the mechanism of self-balancing Binary Search Trees and how they differ in practice.',
    category: 'Advanced Trees',
    date: '2026-03-03',
    quickAnswer:
      'AVL Trees maintain strict balance (height difference ≤ 1) for faster lookups, while Red-Black Trees use color rules for softer balance that requires fewer rotations during insertions and deletions. AVL is better for read-heavy workloads; Red-Black suits write-heavy ones.',
    faqs: [
      {
        q: 'What is the difference between AVL Tree and Red-Black Tree?',
        a: 'AVL Trees enforce strict balance: for every node, the height of left and right subtrees must differ by at most 1. Red-Black Trees use a coloring scheme (red/black nodes) with relaxed rules that allow slight imbalance. AVL Trees are more balanced so lookups are faster; Red-Black Trees require fewer rotations on insertions/deletions so updates are faster.',
      },
      {
        q: 'Which is faster: AVL Tree or Red-Black Tree?',
        a: 'For searches (lookups), AVL Trees are typically faster because their stricter balance produces shorter paths. For insertions and deletions, Red-Black Trees are typically faster because their relaxed balance rules require fewer rotations. Both have O(log n) complexity for all operations.',
      },
      {
        q: 'When should I use a Red-Black Tree over an AVL Tree?',
        a: 'Use a Red-Black Tree when insertions and deletions are frequent — it is the standard choice in most programming language standard libraries (Java TreeMap, C++ std::map, Linux kernel). Use an AVL Tree when your application is read-heavy and lookup speed is the primary concern.',
      },
      {
        q: 'Do AVL Tree and Red-Black Tree use rotations?',
        a: 'Yes, both use rotations (left and right) to restore balance after insertions and deletions. AVL Trees may perform more rotations per operation because they enforce stricter balance. Red-Black Trees combine rotations with recoloring and typically perform fewer restructuring operations overall.',
      },
    ],
  },
  {
    id: 'deleting-bst-node',
    title: 'Deleting a Node in BST',
    summary:
      'Learn how Binary Search Tree preserves the ordering while removing nodes from the tree.',
    category: 'Data Structures',
    date: '2026-03-05',
    quickAnswer:
      'Deleting a node from a BST has three cases: (1) leaf node — simply remove it; (2) one child — replace the node with its child; (3) two children — replace the node\'s value with its inorder successor or predecessor, then delete that successor/predecessor.',
    faqs: [
      {
        q: 'How do you delete a node from a Binary Search Tree?',
        a: 'BST deletion has three cases: if the node is a leaf, just remove it. If it has one child, replace the node with that child. If it has two children, find the inorder successor (minimum of the right subtree) or inorder predecessor (maximum of the left subtree), copy its value into the current node, then delete the successor/predecessor — which always reduces to case 1 or 2.',
      },
      {
        q: 'What is the inorder successor in a BST?',
        a: 'The inorder successor of a node is the node with the smallest value greater than the current node. In a BST, it is found by going to the right child and then traversing as far left as possible. The inorder successor always has at most one child (no left child), making it straightforward to delete after replacing.',
      },
      {
        q: 'What is the time complexity of BST deletion?',
        a: 'BST deletion is O(h) where h is the height of the tree. In a balanced BST, h = O(log n), giving O(log n) deletion. In a skewed (degenerated) BST, h = O(n), degrading to O(n). Self-balancing trees like AVL Trees and Red-Black Trees guarantee O(log n) height after every operation.',
      },
    ],
  },
  {
    id: 'compare-sorting',
    title: 'Compare Sorting Algorithms',
    summary:
      'Visualize and compare multiple sorting algorithms simultaneously with same input array.',
    category: 'Sorting',
    date: '2026-03-28',
    quickAnswer:
      'See Algorithms lets you run multiple sorting algorithms side by side on the same input — compare Bubble Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort, and Selection Sort simultaneously to observe their different swap patterns and strategies.',
    faqs: [
      {
        q: 'Which sorting algorithm is the fastest?',
        a: 'There is no single fastest sorting algorithm — it depends on input size, data patterns, and memory constraints. Quicksort and Merge Sort are O(n log n) and fastest in practice for most cases. Insertion Sort outperforms them on small or nearly-sorted arrays. Radix Sort can achieve O(n) for fixed-width integers but is not comparison-based.',
      },
      {
        q: 'How do sorting algorithms compare in terms of complexity?',
        a: 'Simple algorithms (Bubble, Insertion, Selection) are O(n²) time but easy to implement. Divide-and-conquer algorithms (Merge Sort, Quick Sort, Heap Sort) achieve O(n log n). Radix Sort achieves O(nk) for integers. Space complexity varies: Merge Sort uses O(n) auxiliary space; others like Heap Sort and Quick Sort (iterative) use O(1) or O(log n).',
      },
      {
        q: 'What is the difference between Merge Sort and Quick Sort?',
        a: 'Merge Sort is stable, uses O(n) extra space, and guarantees O(n log n) in all cases. Quick Sort is in-place, uses O(log n) stack space, averages O(n log n) but degrades to O(n²) in the worst case. In practice, Quick Sort is often faster due to better cache performance despite the worst-case risk.',
      },
    ],
  },
  {
    id: 'embed-sorting',
    title: 'Embed Sorting Visualizers',
    summary:
      'Transform your sorting algorithm articles with live, interactive animations that visualize every comparison and swap.',
    category: 'Sorting',
    date: '2026-04-05',
    quickAnswer:
      'See Algorithms sorting visualizers can be embedded into any website, blog, or Notion page using a simple iframe. The embed URL follows the pattern: https://see-algorithms.com/sorting/embed/{Algorithm}.',
    faqs: [
      {
        q: 'How do I embed a sorting visualizer on my website?',
        a: 'Use a standard HTML iframe with the See Algorithms embed URL as the src. The pattern is: <iframe src="https://see-algorithms.com/sorting/embed/MergeSort" width="100%" height="400px" frameborder="0"></iframe>. Replace MergeSort with any supported algorithm name.',
      },
      {
        q: 'Which sorting algorithms can be embedded?',
        a: 'All major sorting algorithms are available: BubbleSort, InsertionSort, SelectionSort, QuickSort, MergeSort, HeapSort, and RadixSort. Each has a dedicated embed page at /sorting/embed/{Algorithm}.',
      },
      {
        q: 'Can I embed a sorting visualizer in Notion?',
        a: 'Yes. In Notion, use the Embed block and paste the sorting visualizer URL (e.g., https://see-algorithms.com/sorting/embed/BubbleSort). Notion will render it as an interactive iframe directly in your page.',
      },
    ],
  },
  {
    id: 'embed-graph',
    title: 'Embed Graph Visualizers',
    summary:
      'Integrate dynamic graph visualizations into your content, letting readers explore traversals and shortest paths interactively.',
    category: 'Graph',
    date: '2026-04-28',
    quickAnswer:
      'See Algorithms graph visualizers (BFS, DFS, Dijkstra\'s, Prim\'s, Kruskal\'s, and more) can be embedded in any webpage using an iframe with the URL pattern: https://see-algorithms.com/graph/embed/{Algorithm}.',
    faqs: [
      {
        q: 'How do I embed a graph algorithm visualizer?',
        a: 'Use an HTML iframe with the graph embed URL. The pattern is: <iframe src="https://see-algorithms.com/graph/embed/BFS" width="100%" height="600px" frameborder="0"></iframe>. Available algorithms include BFS, DFS, Dijkstras, Prims, Kruskals, Boruvkas, TopSort, Hamiltonian, and Eulerian.',
      },
      {
        q: 'Can I embed a custom graph layout?',
        a: 'Yes. Go to the algorithm\'s main page, draw your custom graph with nodes and edges, set weights if needed, and click the Share Graph icon. This generates a unique URL encoding your graph structure. Use that URL as the iframe src to embed your custom graph.',
      },
    ],
  },
  {
    id: 'embed-data-struct',
    title: 'Embed DS Visualizers',
    summary:
      'Enhance your lessons on complex data structures by integrating our interactive visualizers.',
    category: 'Data Structures',
    date: '2026-04-28',
    quickAnswer:
      'See Algorithms data structure visualizers (BST, AVL Tree, Red-Black Tree, Linked List, Binary Heap, and more) can be embedded using an iframe with the URL pattern: https://see-algorithms.com/data-structures/embed/{DataStructure}.',
    faqs: [
      {
        q: 'How do I embed a data structure visualizer?',
        a: 'Use an HTML iframe with the data structure embed URL. The pattern is: <iframe src="https://see-algorithms.com/data-structures/embed/BST" width="100%" height="600px" frameborder="0"></iframe>. Available structures include CircularQueue, LinkedList, BinaryHeap, BST, AVL, RedBlackTree, SplayTree, and BTree.',
      },
      {
        q: 'Can I embed a pre-built tree structure?',
        a: 'Yes. Go to the data structure\'s main page, build your tree by inserting nodes, then click the share icon on the control panel. This copies a unique URL containing your tree state. Use that URL as the iframe src to embed your custom pre-built tree.',
      },
    ],
  },
].sort((a, b) => b.date.localeCompare(a.date));
