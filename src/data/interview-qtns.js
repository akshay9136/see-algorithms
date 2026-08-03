/**
 * Centralized registry of technical interview questions for all 28 DSA topics in see-algorithms.
 * Covers concepts, edge cases, complexity analysis, algorithmic comparisons, and real-world applications.
 */

import Link from 'next/link';

export const interviewQuestionsMap = {
  // --- SORTING ---
  BubbleSort: [
    {
      question:
        'How can Bubble Sort be optimized to detect an already sorted array in O(n) time?',
      answer: (
        <>
          By introducing a boolean flag <code>swapped</code> inside the outer
          loop. If an entire inner pass completes without making a single swap,
          the array is already sorted, and we can terminate early.
        </>
      ),
    },
    {
      question: 'Why is Bubble Sort considered a stable sorting algorithm?',
      answer: (
        <>
          Bubble Sort only swaps adjacent elements when one is strictly greater
          than the next. Equal elements are never swapped, preserving their
          relative ordering.
        </>
      ),
    },
    {
      question: 'What is the "rabbits and turtles" problem in Bubble Sort?',
      answer: (
        <>
          Large elements near the beginning ({'"rabbits"'}) move quickly to the
          end in a single pass, but small elements near the end ({'"turtles"'})
          move towards the beginning by only one position per pass.
        </>
      ),
    },
    {
      question:
        'Compare Bubble Sort and Insertion Sort when sorting nearly sorted data.',
      answer: (
        <>
          While both achieve <var>O(n)</var> best-case time complexity on sorted
          data, <Link href="/sorting/InsertionSort">Insertion Sort</Link> makes
          fewer comparisons and assignment operations in practice. Bubble Sort
          requires multiple pass checks and explicit swap logic compared to
          Insertion Sort&apos;s shift operations.
        </>
      ),
    },
  ],

  InsertionSort: [
    {
      question:
        'How does Insertion Sort perform on an array sorted in reverse order?',
      answer: (
        <>
          In reverse-sorted order, every new element must be compared and
          shifted across all previously sorted elements. This triggers the
          maximum number of comparisons <var>n (n - 1) / 2</var> and shifts,
          resulting in worst-case performance <var>O(n²)</var>.
        </>
      ),
    },
    {
      question:
        "Can Binary Search be used to reduce Insertion Sort's overall time complexity to O(n log n)?",
      answer: (
        <>
          Using Binary Search (Binary Insertion Sort) reduces the number of
          comparisons from O(n²) to O(n log n). However, the overall time
          complexity remains <var>O(n²)</var> because shifting elements to
          insert the element into array positions still requires <var>O(n)</var>{' '}
          operations per insertion.
        </>
      ),
    },
    {
      question: 'What makes Insertion Sort an online algorithm?',
      answer: (
        <>
          An online algorithm processes its input piece-by-piece as data streams
          in. Insertion Sort can accept elements one at a time and insert each
          element into its correct relative position within the already
          processed stream without needing the full dataset upfront.
        </>
      ),
    },
  ],

  SelectionSort: [
    {
      question:
        'Why is Selection Sort unstable in its standard array-based implementation?',
      answer: (
        <>
          Selection Sort finds the minimum element in the unsorted sublist and
          swaps it with the element at the beginning of the unsorted sublist.
          This long-distance swap can jump over identical keys, altering their
          original relative order.
        </>
      ),
      codeSnippet: `// Example: [4a, 4b, 2]
// Swap 4a with 2 -> Array becomes [2, 4b, 4a] (4a and 4b relative order broken)`,
    },
    {
      question:
        'How can Selection Sort be extended to perform double selection?',
      answer: (
        <>
          Double Selection Sort finds both the minimum and maximum elements in a
          single pass of the unsorted sublist, placing the minimum at the start
          and the maximum at the end. This reduces the required passes from{' '}
          <var>n</var> to <var>n / 2</var>, though overall complexity remains{' '}
          <var>O(n²)</var>.
        </>
      ),
    },
    {
      question: "Why doesn't Selection Sort adapt to sorted data?",
      answer: (
        <>
          Selection Sort always takes <var>O(n²)</var> time regardless of
          whether the array is already sorted, reverse-sorted, or random. The
          algorithm must complete all comparisons in the unsorted scan to
          confirm it has found the true minimum value.
        </>
      ),
    },
  ],

  HeapSort: [
    {
      question:
        'How does Heap Sort construct a Max-Heap in O(n) time instead of O(n log n)?',
      answer: (
        <>
          Building a heap bottom-up starting from the last non-leaf node (n / 2
          - 1 down to 0) and calling <code>heapify</code> takes <var>O(n)</var>{' '}
          time. Mathematically, the height of nodes near the bottom is small
          (most nodes are leaves requiring 0 swaps).
        </>
      ),
    },
    {
      question:
        "Why is Quick Sort often faster than Heap Sort in practice despite Heap Sort's guaranteed O(n log n)?",
      answer: (
        <>
          Heap Sort suffers from poor CPU cache locality. Parent and child
          elements are separated by index multiplications (<var>2i + 1</var>,{' '}
          <var>2i + 2</var>), causing frequent cache misses. Quick Sort accesses
          contiguous memory sequentially during partitioning.
        </>
      ),
    },
    {
      question: 'Why is Heap Sort not a stable sorting algorithm?',
      answer: (
        <>
          The heap restructuring (sifting up and down) and swapping the root
          element with the last element of the heap rearranges non-adjacent
          elements across large array strides, disrupting original order among
          duplicate keys.
        </>
      ),
    },
    {
      question:
        'What role does Heap Sort play in Introsort (Introspective Sort)?',
      answer: (
        <>
          Introsort starts with Quick Sort for performance. It monitors the
          recursion depth, and if recursion depth exceeds <var>2 * log₂ n</var>{' '}
          — indicating bad pivot choices leading towards <var>O(n²)</var>,
          Introsort switches dynamically to Heap Sort to guarantee{' '}
          <var>O(n log n)</var> worst-case time.
        </>
      ),
    },
  ],

  RadixSort: [
    {
      question:
        'Why is stability important for the intermediate sorting algorithm used in Radix Sort?',
      answer: (
        <>
          LSD (Least Significant Digit) Radix Sort processes digits from right
          to left. When sorting by a higher-order digit, equal digits rely on
          the preserved relative ordering established by lower-order digit
          passes. Instability in intermediate passes would corrupt previous
          digit sorting.
        </>
      ),
    },
    {
      question:
        'Can Radix Sort be used directly for floating-point numbers or negative integers?',
      answer: (
        <>
          Not directly without transformation. Negative integers require
          shifting numbers by adding an offset bias or separating sign bits.
          IEEE 754 floating-point numbers require bit-level manipulation so
          sign/exponent/mantissa map to monotonic unsigned integer ordering.
        </>
      ),
    },
  ],

  MergeSort: [
    {
      question:
        'Why is Merge Sort preferred for sorting linked lists over Quick Sort or Heap Sort?',
      answer: (
        <>
          <Link href="/data-structures/LinkedList">Linked list</Link> elements
          can be merged in-place by updating pointer references without
          allocating auxiliary arrays (<var>O(1)</var> extra space).
          Additionally, slow random access in linked lists makes Quick Sort
          partitioning and Heap index arithmetic inefficient.
        </>
      ),
    },
    {
      question:
        'Explain the Space Complexity of recursive Merge Sort for arrays vs linked lists.',
      answer: (
        <>
          For arrays, standard Merge Sort requires <var>O(n)</var> auxiliary
          memory for temporary buffer arrays, plus O(log n) call stack space.
          For singly linked lists, pointer manipulation reduces auxiliary space
          to <var>O(log n)</var> (stack frames only).
        </>
      ),
    },
    {
      question:
        'How can Merge Sort be parallelized for multi-core distributed processing (e.g. MapReduce)?',
      answer: (
        <>
          Because divide-and-conquer sub-problems are completely independent,
          array halves can be dispatched to separate threads/nodes in parallel.
          Sub-results are merged hierarchically as nodes complete computation.
        </>
      ),
    },
  ],

  QuickSort: [
    {
      question: "What causes Quick Sort's O(n²) worst-case time complexity?",
      answer: (
        <>
          The worst-case occurs when the pivot chosen is consistently the
          smallest or largest element (e.g. picking first or last element on
          sorted or reverse-sorted data), resulting in highly unbalanced
          partitions.
        </>
      ),
    },
    {
      question:
        "Compare Hoare's partitioning scheme with Lomuto's partitioning scheme.",
      answer: (
        <>
          Lomuto uses one direction scan, makes 3x more swaps on average, and
          degrades to <var>O(n²)</var> when all elements are equal. Hoare uses
          two converging pointers from both ends, makes far fewer swaps, and
          efficiently handles duplicate element arrays.
        </>
      ),
    },
    {
      question: 'How Quick Sort handle arrays with many duplicate elements?',
      answer: (
        <>
          Standard Quick Sort can perform poorly when many duplicate elements
          are present because they may lead to unbalanced partitions and
          unnecessary recursive calls. Three-way partitioning improves
          performance by grouping equal elements together, reducing recursion on
          duplicate values.
        </>
      ),
    },
    {
      question: 'Why is Quick Sort often faster than Merge Sort in practice?',
      answer:
        'Quick Sort generally performs better due to better cache locality (working in-place on contiguous memory) and smaller constant factors in its operations (fewer data movements compared to Merge Sort’s copying to temporary arrays).',
    },
  ],

  // --- GRAPH ---
  DFS: [
    {
      question:
        'How is DFS used to detect cycles in Directed graphs vs Undirected graphs?',
      answer: (
        <>
          In directed graphs, a cycle exists if DFS encounters a node currently
          in the active recursion stack. In undirected graphs, a cycle exists if
          DFS encounters an already visited neighbor that is not the direct
          parent node.
        </>
      ),
    },
    {
      question:
        'Explain the Time and Space complexity of DFS for an adjacency list vs adjacency matrix representation.',
      answer: (
        <>
          Adjacency List: Time <var>O(V + E)</var>, Space <var>O(V)</var>{' '}
          (visited array + recursion stack). Adjacency Matrix: Time{' '}
          <var>O(V²)</var>, because scanning adjacent neighbors requires
          iterating over all <var>V</var> entries per vertex.
        </>
      ),
    },
    {
      question:
        'What happens if DFS is executed recursively on a graph with 100,000 linear vertices? How to mitigate?',
      answer: (
        <>
          Deep linear graph traversals using recursion cause Stack Overflow
          errors due to call stack limit bounds. Mitigation: Convert recursive
          DFS to Iterative DFS using an explicit <code>stack</code> data
          structure.
        </>
      ),
    },
    {
      question: 'How does DFS assist in Topological Sorting?',
      answer: (
        <>
          <Link href="/graph/TopSort">Topological Sort</Link> pushes nodes to a
          stack upon completing their post-order DFS traversal. Popping the
          stack produces a valid topological order for a Directed Acyclic Graph
          (DAG).
        </>
      ),
    },
  ],

  BFS: [
    {
      question:
        'Why does BFS guarantee the shortest path in an unweighted graph while DFS does not?',
      answer: (
        <>
          BFS explores nodes level-by-level in increasing order of distance from
          the source using a FIFO queue. The first time a target vertex is
          reached, the path taken must be the minimum edge distance path.{' '}
          <Link href="/graph/DFS">DFS</Link> delves deep down single branches
          without distance guarantees.
        </>
      ),
    },
    {
      question:
        "What is 0-1 BFS and when should it be used instead of Dijkstra's Algorithm?",
      answer: (
        <>
          When graph edge weights are restricted to only 0 or 1, 0-1 BFS uses a
          Double-Ended Queue (Deque). Weight-0 edges push to the front of the
          deque (<code>push_front</code>), and weight-1 edges push to the back (
          <code>push_back</code>). This runs in <var>O(V + E)</var> time, faster
          than Dijkstra&apos;s <var>O((V + E) log V)</var>.
        </>
      ),
    },
    {
      question:
        'Compare Bidirectional BFS with standard BFS for searching web graph relationships.',
      answer: (
        <>
          Standard BFS searches outwards from source up to distance <var>d</var>
          , expanding{' '}
          <var>
            O(b<sup>d</sup>)
          </var>{' '}
          nodes (where <var>b</var> is branching factor). Bidirectional BFS runs
          two simultaneous searches from source and target. They meet in the
          middle, expanding{' '}
          <var>
            O(2 * b<sup>d/2</sup>)
          </var>{' '}
          nodes, exponentially saving memory and time.
        </>
      ),
    },
    {
      question:
        'How can memory consumption in BFS become a critical bottleneck for dense graphs?',
      answer: (
        <>
          The queue size in BFS reaches the maximum width of the graph (the
          frontier layer). For complete or dense graphs, the queue can hold{' '}
          <var>O(V)</var> nodes concurrently, consuming high memory compared to
          DFS which holds only <var>O(H)</var> height nodes.
        </>
      ),
    },
  ],

  'bfs-vs-dfs': [
    {
      question:
        'When should you strictly choose BFS over DFS for solving tree/graph problems?',
      answer: (
        <>
          Choose BFS when seeking the shortest path in unweighted graphs,
          finding nodes closest to the root/source, or doing level-order
          processing. Choose DFS when analyzing graph connectivity, finding path
          existence in deep trees, cycle detection, or topological ordering.
        </>
      ),
    },
    {
      question:
        'Compare Space Complexity between BFS and DFS on a balanced binary tree of height H and N nodes.',
      answer: (
        <>
          DFS maximum stack size is proportional to tree height{' '}
          <var>O(H) = O(log N)</var>. BFS queue holds the bottom leaf level,
          which contains <var>N/2</var> nodes, making its memory complexity{' '}
          <var>O(N)</var>. DFS is vastly more memory-efficient on balanced wide
          trees.
        </>
      ),
    },
    {
      question:
        'How do BFS and DFS handle infinite graphs or game state trees?',
      answer: (
        <>
          Standard DFS will get trapped in infinite depth branches and never
          terminate. Standard BFS will eventually find the shortest goal
          solution if it exists, but will run out of memory due to exponential
          layer growth. Iterative Deepening DFS (IDDFS) combines both benefits.
        </>
      ),
    },
  ],

  Prims: [
    {
      question:
        "What fundamental greedy choice property guarantees the correctness of Prim's algorithm?",
      answer: (
        <>
          The Cut Property: For any cut (partition of vertices into two sets{' '}
          <var>S</var> and <var>V - S</var>), the minimum weight edge crossing
          the cut must belong to the Minimum Spanning Tree (MST). Prim&apos;s
          iteratively grows a single tree set <var>S</var> by adding the
          lightest crossing edge.
        </>
      ),
    },
    {
      question:
        "Compare Prim's algorithm performance using Adjacency List + Min-Heap vs Fibonacci Heap.",
      answer: (
        <>
          Binary Min-Heap implementation yields <var>O((V + E) log V)</var>. A
          Fibonacci Heap optimizes <code>decrease_key</code> operations to
          amortized <var>O(1)</var>, improving overall time complexity to{' '}
          <var>O(E + V log V)</var>, which is superior for dense graphs where{' '}
          <var>E ≈ V²</var>.
        </>
      ),
    },
    {
      question:
        "How does Prim's algorithm behave if the graph contains negative edge weights or disconnected components?",
      answer: (
        <>
          Prim&apos;s algorithm works correctly with negative edge weights
          (unlike Dijkstra). However, if the graph is disconnected, Prim&apos;s
          will only build an MST for the connected component containing the
          starting node. To span all components, Prim&apos;s must be launched on
          each unvisited component (Minimum Spanning Forest).
        </>
      ),
    },
    {
      question:
        "Where is Prim's algorithm applied in network infrastructure engineering?",
      answer: (
        <>
          Designing physical fiber-optic cables, electrical power grids, water
          supply pipe connections, and telecommunication layout networks to
          minimize physical infrastructure construction costs.
        </>
      ),
    },
  ],

  Kruskals: [
    {
      question:
        "What is the role of the Disjoint Set Union (DSU) in Kruskal's algorithm?",
      answer: (
        <>
          Kruskal&apos;s algorithm sorts all edges by weight and greedily
          considers them. DSU efficiently checks whether the endpoints of a
          candidate edge belong to the same connected component (
          <code>find</code>) to avoid forming cycles, and merges components (
          <code>union</code>).
        </>
      ),
    },
    {
      question:
        "Compare Prim's vs Kruskal's algorithm for sparse graphs vs dense graphs.",
      answer: (
        <>
          Kruskal&apos;s is faster for sparse graphs (<var>E ≈ V</var>) because
          edge sorting is quick. Prim&apos;s (especially with adjacency lists or
          Fibonacci heaps) performs better on dense graphs (<var>E ≈ V²</var>)
          where handling all <var>V²</var> edges in DSU is slower.
        </>
      ),
    },
  ],

  Boruvkas: [
    {
      question:
        "How does Borůvka's algorithm differ fundamentally from Prim's and Kruskal's algorithms?",
      answer: (
        <>
          Borůvka&apos;s algorithm is a parallel-friendly algorithm. In each
          phase, every connected component simultaneously finds its cheapest
          outgoing edge. All identified minimum edges are added to the MST at
          once, reducing the number of components by at least half each
          iteration.
        </>
      ),
    },
    {
      question:
        "What is the time complexity of Borůvka's algorithm and why is it well-suited for GPUs & parallel compute?",
      answer: (
        <>
          Borůvka&apos;s algorithm runs in <var>O(E log V)</var> time. Because
          each component searches for its minimum outgoing edge independently of
          other components, these searches can be executed concurrently in
          parallel threads across multiple GPU cores.
        </>
      ),
    },
  ],

  Dijkstras: [
    {
      question:
        "Why does Dijkstra's algorithm fail or produce incorrect results on graphs with negative edge weights?",
      answer: (
        <>
          Dijkstra&apos;s algorithm makes a greedy assumption: once a node is
          popped from the Min-Priority Queue, its shortest distance is finalized
          and will never decrease. A negative edge encountered later could
          reveal a shorter path to an already finalized node, invalidating
          Dijkstra&apos;s greedy guarantee.
        </>
      ),
    },
    {
      question:
        "What is the time complexity of Dijkstra's algorithm using a Min-Heap vs an unsorted array?",
      answer: (
        <>
          Min-Heap implementation: <var>O((V + E) log V)</var>. Unsorted Array
          implementation: <var>O(V²)</var>. Array implementation is actually
          faster for complete/extremely dense graphs where <var>E ≈ V²</var>,
          while Min-Heap excels on sparse graphs.
        </>
      ),
    },
    {
      question:
        "How is Dijkstra's algorithm adapted in real-world GPS navigation systems (e.g. Google Maps)?",
      answer: (
        <>
          Raw Dijkstra is too slow on worldwide road networks. GPS systems use
          A* Search with geometric heuristics, Contraction Hierarchies (CH), and
          Multi-Level Dijkstra to precompute highway routes and answer shortest
          path queries in milliseconds.
        </>
      ),
    },
  ],

  TopSort: [
    {
      question:
        'Why can Topological Sort only be performed on a Directed Acyclic Graph (DAG)?',
      answer: (
        <>
          If a graph contains a directed cycle (e.g. <var>A → B → C → A</var>),
          there is a circular dependency where no node can be placed first.
          Topological sorting orders vertices linearly such that for every
          directed edge <var>u → v</var>, <var>u</var> appears before{' '}
          <var>v</var>.
        </>
      ),
    },
    {
      question:
        "Explain Kahn's algorithm for Topological Sort using in-degree.",
      answer: (
        <>
          Kahn&apos;s algorithm computes the in-degree of all vertices. Vertices
          with in-degree 0 are pushed into a stack. As vertices are popped and
          added to the topological order, the in-degree of their neighbors is
          decremented. If a neighbor reaches 0 in-degree, it is added to the
          stack.
        </>
      ),
    },
    {
      question:
        'How do build automation tools (e.g. Webpack, Make, Bazel) utilize Topological Sort?',
      answer: (
        <>
          Build tools model package dependencies as a DAG. Topological sort
          determines the exact compilation order so that every module/library is
          compiled after all of its dependencies have been built.
        </>
      ),
    },
  ],

  Hamiltonian: [
    {
      question:
        'What is the difference between an Eulerian Path and a Hamiltonian Path?',
      answer: (
        <>
          An Eulerian Path visits every EDGE in the graph exactly once (solvable
          in <var>O(E)</var> time). A Hamiltonian Path visits every VERTEX in
          the graph exactly once (an NP-complete problem with no known
          polynomial-time solution).
        </>
      ),
    },
    {
      question:
        'How does the Traveling Salesperson Problem (TSP) relate to the Hamiltonian Cycle?',
      answer: (
        <>
          The Hamiltonian Cycle problem asks if a cycle visiting every vertex
          once exists in an unweighted graph. TSP is the weighted optimization
          version: finding the Hamiltonian Cycle with the minimum total edge
          cost weight.
        </>
      ),
    },
  ],

  Eulerian: [
    {
      question:
        'What is the difference between an Eulerian Path and an Eulerian Cycle?',
      answer: (
        <>
          An <strong>Eulerian Path</strong> visits every <em>edge</em> in a
          graph exactly once and exists if exactly <strong>0 or 2</strong>{' '}
          vertices have an odd degree. An <strong>Eulerian Cycle</strong> is an
          Eulerian Path that starts and ends at the same vertex, which requires
          every vertex to have an even degree (0 odd degree vertices).
        </>
      ),
    },
  ],

  // --- DATA STRUCTURES ---
  CircularQueue: [
    {
      question:
        'How does a Circular Queue solve the limitation of a standard array-based Linear Queue?',
      answer: (
        <>
          In a linear array queue, dequeuing elements leaves empty spaces at the
          front that cannot be reused without shifting elements. A Circular
          Queue wraps the rear and front pointers around using modulo arithmetic{' '}
          <code>(index + 1) % n</code>, utilizing memory efficiently.
        </>
      ),
    },
    {
      question:
        'How do you distinguish between an Empty state and a Full state in a Circular Queue?',
      answer: (
        <>
          Without a counter variable, both empty and full conditions make{' '}
          <code>front == rear</code>. Two solutions: maintain an explicit
          counter, or keep one array slot intentionally empty so{' '}
          <code>(rear + 1) % n == front</code> indicates full, while{' '}
          <code>front == rear</code> indicates empty.
        </>
      ),
    },
    {
      question:
        'Where are Ring Buffers (Circular Queues) deployed in low-level operating systems and audio drivers?',
      answer: (
        <>
          Used in CPU hardware interrupt queues, network socket packet buffers,
          keyboard buffer inputs, and real-time audio sample streaming where
          data streams continuously between producer and consumer threads.
        </>
      ),
    },
  ],

  LinkedList: [
    {
      question:
        'Compare array access vs Linked List access in terms of memory cache performance.',
      answer: (
        <>
          Arrays store elements in contiguous memory blocks, enabling{' '}
          <var>O(1)</var> index access and excellent CPU spatial cache
          prefetching. Linked list nodes are allocated dynamically across heap
          memory, leading to memory fragmentation and frequent CPU cache misses.
        </>
      ),
    },
    {
      question:
        "How do you detect a cycle in a Linked List using Floyd's Cycle-Finding algorithm (Tortoise and Hare)?",
      answer: (
        <>
          Use two pointers: <code>slow</code> moving 1 step at a time, and{' '}
          <code>fast</code> moving 2 steps at a time. If the list has a cycle,{' '}
          <code>fast</code> will eventually catch up and meet <code>slow</code>{' '}
          inside the loop.
        </>
      ),
      codeSnippet: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow == fast) return true; // Cycle detected
}
return false;`,
    },
    {
      question:
        'How do you reverse a Linked List in-place in O(n) time and O(1) space?',
      answer: (
        <>
          Maintain three pointers: <code>prev</code> (initialized to{' '}
          <code>null</code>), <code>curr</code> (head), and <code>next</code>.
          Iterate through the list:
        </>
      ),
      codeSnippet: `let prev = null, cur = head;
while (cur) {
  let next = cur.next;
  cur.next = prev;
  prev = cur, cur = next;
}
head = prev;`,
    },
  ],

  DoublyLinkedList: [
    {
      question:
        'What are the main advantages and memory trade-offs of a Doubly Linked List?',
      answer: (
        <>
          Advantage: Enables bidirectional traversal and <var>O(1)</var> node
          deletion when a node reference is given (no need to scan for the
          previous node). Trade-off: Each node requires extra memory to store a{' '}
          <code>prev</code> pointer (8 bytes on 64-bit systems).
        </>
      ),
    },
    {
      question:
        'How is a Doubly Linked List used in conjunction with a Hash Map to implement an LRU Cache?',
      answer: (
        <>
          The Hash Map maps keys to Doubly linked list nodes for <var>O(1)</var>{' '}
          key lookup. The Doubly Linked List maintains access order: recently
          accessed nodes are moved to the head in O(1) time, and the least
          recently used node is evicted from the tail in O(1) time.
        </>
      ),
    },
  ],

  BinaryHeap: [
    {
      question:
        'How is a complete Binary Heap represented efficiently using an array without explicit child pointers?',
      answer: (
        <>
          For a parent at index <var>i</var> in a 0-indexed array, left child is
          at <var>2i + 1</var>, right child is at <var>2i + 2</var>, and parent
          is at <var>(i - 1) / 2</var>. This eliminates the need for explicit
          child pointers, reducing memory usage.
        </>
      ),
    },
    {
      question:
        'What is the time complexity of insert, extract, and peek operations in a Binary Heap?',
      answer: (
        <>
          <code>peek()</code>: <var>O(1)</var> (root element).{' '}
          <code>insert()</code>: <var>O(log n)</var> (heapify-up).{' '}
          <code>extract()</code>: <var>O(log n)</var> (replace root with last
          element and heapify-down).
        </>
      ),
    },
    {
      question:
        'How do you find the K largest elements in an unsorted stream of N elements efficiently?',
      answer: (
        <>
          Maintain a Min-Heap of size <var>K</var>. Iterate through the stream:
          if an element is larger than the root of the Min-Heap, replace the
          root and heapify. Final Min-Heap contains the <var>K</var> largest
          elements in <var>O(N log K)</var> time and <var>O(K)</var> space.
        </>
      ),
    },
  ],

  BST: [
    {
      question:
        'What is the worst-case time complexity for search, insertion, and deletion in a standard BST?',
      answer: (
        <>
          Worst case is <var>O(n)</var>, occurring when elements are inserted in
          sorted or reverse-sorted order, causing the tree to degenerate into a
          linear linked list (skewed tree). Average case for balanced BST is{' '}
          <var>O(log n)</var>.
        </>
      ),
    },
    {
      question:
        'Describe the three cases encountered when deleting a node from a BST.',
      answer: (
        <>
          1) Leaf node: Remove directly. 2) One child: Replace node with its
          child. 3) Two children: Replace node value with its In-Order Successor
          (smallest value in right subtree), then recursively delete that
          successor node.
        </>
      ),
    },
  ],

  AVL: [
    {
      question: 'What is the balance factor constraint in an AVL Tree?',
      answer: (
        <>
          The balance factor is calculated as:{' '}
          <code>height(leftSubtree) - height(rightSubtree)</code>. In an AVL
          tree, balance factor for every node must be within (
          <var>-1, 0, +1</var>).
        </>
      ),
    },
    {
      question:
        'Explain Left-Right (LR) and Right-Left (RL) double rotations in AVL Trees.',
      answer: (
        <>
          LR imbalance occurs when a node is left-heavy, but its left child is
          right-heavy. Fixed by first performing a Left Rotation on the left
          child, followed by a Right Rotation on the imbalanced parent node.
        </>
      ),
    },
  ],

  RedBlackTree: [
    {
      question:
        "Why does Java's TreeMap use Red-Black Tree as its underlying data structure?",
      answer: (
        <>
          Red-Black Trees guarantee at most <var>2</var> rotations for insertion
          and <var>3</var> rotations for deletion. This predictable low
          rebalancing cost during tree mutations gives consistent, fast dynamic
          insert/delete operations for general standard libraries.
        </>
      ),
    },
  ],

  'avl-tree-vs-rbt': [
    {
      question:
        'Summarize the primary balance criteria of AVL and Red-Black Trees.',
      answer: (
        <>
          AVL enforces strict height balance (height difference between subtrees{' '}
          <var>≤ 1</var>). Red-Black enforces color rules ensuring the longest
          path from root to leaf is no more than twice the length of the
          shortest path.
        </>
      ),
    },
  ],

  SplayTree: [
    {
      question: 'How does "splaying" provide amortized O(log n) performance?',
      answer: (
        <>
          Splaying moves an accessed node to the root of the tree through a
          series of rotations, keeping frequently accessed elements near the
          root. While a single operation can take O(n), amortized cost over a
          sequence of <var>M</var> operations is guaranteed to be{' '}
          <var>O(M log n)</var>.
        </>
      ),
    },
    {
      question:
        'What is a major advantage of Splay Trees regarding auxiliary memory metadata?',
      answer: (
        <>
          Splay Trees do not store any extra balance information (like height in
          AVL or color bits in Red-Black). This saves node memory footprint
          while maintaining self-balancing properties.
        </>
      ),
    },
  ],

  BTree: [
    {
      question:
        'Why are B-Trees and B+ Trees heavily utilized in database disk indexes and File Systems?',
      answer: (
        <>
          Disk I/O is thousands of times slower than RAM access. B-Trees have
          huge branching factors (hundreds of keys per node), matching disk
          block sizes. This reduces tree height to 3-4 levels for millions of
          records, minimizing disk seek reads.
        </>
      ),
    },
    {
      question:
        'What is the primary difference between a B-Tree and a B+ Tree?',
      answer: (
        <>
          In a B-Tree, keys and data pointers are stored in both internal nodes
          and leaf nodes. In a B+ Tree, internal nodes store only routing search
          keys, while all actual data records are stored in leaf nodes. B+ Tree
          leaf nodes are linked sequentially for fast range queries.
        </>
      ),
    },
  ],

  // --- OTHER ---
  ConvexHull: [
    {
      question:
        "Explain Graham's Scan algorithm for finding the Convex Hull of a set of 2D points.",
      answer: (
        <>
          1) Find the point with the lowest Y-coordinate (anchor). 2) Sort
          remaining points by polar angle relative to the anchor. 3) Iterate
          through sorted points using a stack: push points and pop non-left
          turns (cross product ≤ 0) until all points are processed in{' '}
          <var>O(n log n)</var> time.
        </>
      ),
    },
    {
      question:
        "Compare Jarvis March with Graham's Scan in terms of worst-case complexity.",
      answer: (
        <>
          Graham&apos;s Scan is <var>O(n log n)</var> due to initial polar angle
          sorting. Jarvis March runs in <var>O(n * h)</var> time, where{' '}
          <var>h</var> is the number of vertices on the Convex Hull. When{' '}
          <var>h</var> is small (h &lt; log n), Jarvis March is faster, but
          degrades to <var>O(n²)</var> if all points lie on the hull.
        </>
      ),
    },
    {
      question:
        'Where is the Convex Hull algorithm applied in autonomous robotics and spatial GIS systems?',
      answer: (
        <>
          Used in collision detection (enclosing robot body shapes in minimal
          bounding convex hulls), GIS geographical boundary enclosing, pattern
          recognition, and image processing shape analysis.
        </>
      ),
    },
  ],

  HuffmanCoding: [
    {
      question:
        'How does Huffman Coding construct a prefix-free optimal binary code for data compression?',
      answer: (
        <>
          Counts character frequencies, pushes symbol leaf nodes to a
          Min-Priority Queue. Repeatedly extracts the two smallest frequency
          nodes, combines them into a parent node with sum frequency, and
          re-inserts it. Leaves form prefix codes where frequent characters
          receive shorter bit sequences.
        </>
      ),
    },
    {
      question:
        'What is the time complexity of building a Huffman Tree for N distinct characters?',
      answer: (
        <>
          Building the tree takes <var>O(N log N)</var> time using a
          Min-Priority Queue, as there are <var>N - 1</var> merge steps, each
          requiring queue insertion and extraction taking <var>O(log N)</var>{' '}
          time. If frequencies are pre-sorted, it can be built in{' '}
          <var>O(N)</var> using two linear queues.
        </>
      ),
    },
  ],
};
