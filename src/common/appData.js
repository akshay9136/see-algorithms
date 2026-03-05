import { groupBy } from './utils';

export const algorithms = [
    { id: 'BubbleSort', name: 'Bubble Sort', category: 'Sorting' },
    { id: 'InsertionSort', name: 'Insertion Sort', category: 'Sorting' },
    { id: 'SelectionSort', name: 'Selection Sort', category: 'Sorting' },
    { id: 'HeapSort', name: 'Heap Sort', category: 'Sorting' },
    { id: 'RadixSort', name: 'Radix Sort', category: 'Sorting' },
    { id: 'MergeSort', name: 'Merge Sort', category: 'Sorting' },
    { id: 'QuickSort', name: 'Quick Sort', category: 'Sorting' },
    { id: 'DFS', name: 'Depth First Search', category: 'Graph' },
    { id: 'BFS', name: 'Breadth First Search', category: 'Graph' },
    { id: 'Prims', name: "Prim's Algorithm", category: 'Graph' },
    { id: 'Kruskals', name: "Kruskal's Algorithm", category: 'Graph' },
    { id: 'Boruvkas', name: "Borůvka's Algorithm", category: 'Graph' },
    { id: 'Dijkstras', name: "Dijkstra's Algorithm", category: 'Graph' },
    { id: 'TopSort', name: 'Topological Sorting', category: 'Graph' },
    { id: 'Hamiltonian', name: 'Hamiltonian Cycle', category: 'Graph' },
    {
        id: 'CircularQueue',
        name: 'Circular Queue',
        category: 'Data Structures',
    },
    { id: 'LinkedList', name: 'Linked List', category: 'Data Structures' },
    { id: 'BinaryHeap', name: 'Binary Heap', category: 'Data Structures' },
    { id: 'BST', name: 'Binary Search Tree', category: 'Data Structures' },
    { id: 'AVL', name: 'AVL Tree', category: 'Data Structures' },
    { id: 'RedBlackTree', name: 'Red-Black Tree', category: 'Data Structures' },
    { id: 'SplayTree', name: 'Splay Tree', category: 'Data Structures' },
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
    },
    {
        id: 'inplace-sorting',
        title: 'In-place Sorting Algorithms',
        summary:
            'Understand how in-place sorting algorithms minimize extra space while reorganizing data.',
        category: 'Sorting',
        date: '2026-02-24',
    },
    {
        id: 'stable-sorting',
        title: 'Stable Sorting Algorithms',
        summary:
            'Understand the importance of maintaining original order when sorting data with duplicate keys.',
        category: 'Sorting',
        date: '2026-02-25',
    },
    {
        id: 'shortest-path-vs-mst',
        title: 'Shortest Path vs MST',
        summary:
            'Learn the difference in objectives of Shortest Path and Minimum Spanning Tree algorithms.',
        category: 'Graph',
        date: '2026-02-26',
    },
    {
        id: 'quick-sort-illusion',
        title: 'When Quicksort Slows Down',
        summary:
            'Speed in sorting algorithms is the consequence of structural balance and careful decisions.',
        category: 'Sorting',
        date: '2026-02-28',
    },
    {
        id: 'avl-tree-vs-rb-tree',
        title: 'AVL Tree vs Red-Black Tree',
        summary:
            'Understand the mechanism of self-balancing Binary Search Trees and how they differ in practice.',
        category: 'Data Structures',
        date: '2026-03-03',
    },
    {
        id: 'deleting-bst-node',
        title: 'Deleting a Node in BST',
        summary:
            'Learn how Binary Search Tree preserves the search propery while removing nodes from the tree.',
        category: 'Data Structures',
        date: '2026-03-05',
    },
]
.sort((a, b) => b.date.localeCompare(a.date));
