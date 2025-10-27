import { groupBy } from './utils';

export const algorithms = [
    {
        id: 'BubbleSort',
        name: 'Bubble Sort',
        category: 'Sorting',
        meta: 'Discover how elements are repeatedly compared and swapped to achieve a sorted order in Bubble Sort.',
    },
    {
        id: 'InsertionSort',
        name: 'Insertion Sort',
        category: 'Sorting',
        meta: 'Discover how Insertion Sort works by sorting one element at a time, like placing a new card in the right spot of a sorted hand.',
    },
    {
        id: 'SelectionSort',
        name: 'Selection Sort',
        category: 'Sorting',
        meta: 'Explore how Selection Sort finds the smallest item and places it at the correct position in each iteration.',
    },
    {
        id: 'RadixSort',
        name: 'Radix Sort',
        category: 'Sorting',
        meta: 'Discover how numbers are sorted digit by digit (by placing them into buckets) in this unique algorithm called Radix Sort.',
    },
    {
        id: 'HeapSort',
        name: 'Heap Sort',
        category: 'Sorting',
        meta: 'Learn Heap Sort with interactive visuals that show how elements are organized and sorted in a heap structure for a clear understanding.',
    },
    {
        id: 'MergeSort',
        name: 'Merge Sort',
        category: 'Sorting',
        meta: 'See how the Merge Sort algorithm divides and combines data step-by-step with visual aids that make learning this method simple and engaging.',
    },
    {
        id: 'QuickSort',
        name: 'Quick Sort',
        category: 'Sorting',
        meta: 'See how data is partitioned and sorted efficiently in each step of this fast sorting algorithm called Quick Sort.',
    },
    {
        id: 'DFS',
        name: 'Depth First Search',
        category: 'Graph',
        meta: 'Explore Depth-First Search (DFS) and learn how this graph traversal algorithm works by visiting nodes deeply before backtracking.',
    },
    {
        id: 'BFS',
        name: 'Breadth First Search',
        category: 'Graph',
        meta: 'Explore Breadth-First Search (BFS) and learn how this graph traversal algorithm explores all nodes level by level in a graph.',
    },
    {
        id: 'PrimsMST',
        name: "Prim's Algorithm",
        category: 'Graph',
        meta: "Discover how Prim's Algorithm builds a minimum spanning tree by adding the nearest node with minimum weight.",
    },
    {
        id: 'KruskalsMST',
        name: "Kruskal's Algorithm",
        category: 'Graph',
        meta: "Explore how Kruskal's Algorithm finds the minimum spanning tree in a graph by connecting edges in order of increasing weight.",
    },
    {
        id: 'Dijkstra',
        name: "Dijkstra's Algorithm",
        category: 'Graph',
        meta: "Discover how Dijkstra's Algorithm finds the shortest path between nodes in a graph using priority queue.",
    },
    {
        id: 'TopSort',
        name: 'Topological Sorting',
        category: 'Graph',
        meta: 'Learn Topological Sorting to order nodes in a directed graph, ensuring that each node appears before its dependencies.',
    },
    {
        id: 'Hamiltonian',
        name: 'Hamiltonian Cycle',
        category: 'Graph',
        meta: 'Learn about Hamiltonian Cycle, a path in a graph that visits each vertex exactly once and returns to the starting point.',
    },
    {
        id: 'BST',
        name: 'Binary Search Tree',
        category: 'Data Structures',
        meta: 'Learn how data is organized in a sorted manner by a Binary Search Tree (BST), allowing for efficient searching, insertion, and deletion.',
    },
    {
        id: 'AVL',
        name: 'AVL Tree',
        category: 'Data Structures',
        meta: 'Learn about AVL Trees, a self-balancing binary search tree that maintains a balanced height to ensure efficient search.',
    },
    {
        id: 'BinaryHeap',
        name: 'Binary Heap',
        category: 'Data Structures',
        meta: 'Explore the Binary Heap where elements are arranged in a binary tree while maintaining priority.',
    },
    {
        id: 'CircularQueue',
        name: 'Circular Queue',
        category: 'Data Structures',
        meta: 'Understand how Circular Queue efficiently manages a fixed-size queue by wrapping around when full.',
    },
    {
        id: 'ConvexHull',
        name: 'Convex Hull',
        category: 'Other',
        meta: 'Explore the Convex Hull algorithm to find the smallest convex boundary that encloses a set of points in a plane.',
    },
    {
        id: 'HuffmanCoding',
        name: 'Huffman Coding',
        category: 'Other',
        meta: 'Learn about Huffman Coding, a lossless compression technique that reduces file size by assigning shorter codes to frequent symbols.',
    },
];

export const categories = groupBy(algorithms, 'category');
