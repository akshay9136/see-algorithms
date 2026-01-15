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
    { id: 'CircularQueue', name: 'Circular Queue', category: 'Data Structures' },
    { id: 'LinkedList', name: 'Linked List', category: 'Data Structures' },
    { id: 'BinaryHeap', name: 'Binary Heap', category: 'Data Structures' },
    { id: 'BST', name: 'Binary Search Tree', category: 'Data Structures' },
    { id: 'AVL', name: 'AVL Tree', category: 'Data Structures' },
    { id: 'RedBlackTree', name: 'Red-Black Tree', category: 'Data Structures' },
    { id: 'ConvexHull', name: 'Convex Hull', category: 'Other' },
    { id: 'HuffmanCoding', name: 'Huffman Coding', category: 'Other' },
];

export const categories = groupBy(algorithms, 'category');
