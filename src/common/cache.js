export const categories = [
    {
        catname: 'Sorting',
        algorithms: [
            'BubbleSort',
            'InsertionSort',
            'SelectionSort',
            'RadixSort',
            'HeapSort',
            'MergeSort',
            'QuickSort',
        ],
    },
    {
        catname: 'Graph',
        algorithms: [
            'DFS',
            'BFS',
            'PrimsMST',
            'KruskalsMST',
            'Dijkstra',
            'TopSort',
            'Hamiltonian',
        ],
    },
    {
        catname: 'Data Structures',
        algorithms: [
            'BST',
            'BinaryHeap',
            'CircularQueue',
        ],
    },
    {
        catname: 'Other',
        algorithms: ['ConvexHull'],
    }
];

export const metaDescription = {
    BubbleSort: 'Discover how elements are repeatedly compared and swapped to achieve a sorted order in Bubble Sort.',
    InsertionSort: 'Discover how Insertion Sort works by sorting one element at a time, like placing a new card in the right spot of a sorted hand.',
    SelectionSort: 'Explore how Selection Sort finds the smallest item and places it at the correct position in each iteration.',
    RadixSort: 'Discover how numbers are sorted digit by digit (by placing them into buckets) in this unique algorithm called Radix Sort.',
    HeapSort: 'Learn Heap Sort with interactive visuals that show how elements are organized and sorted in a heap structure for a clear understanding.',
    MergeSort: 'See how the Merge Sort algorithm divides and combines data step-by-step with visual aids that make learning this method simple and engaging.',
    QuickSort: 'See how data is partitioned and sorted efficiently in each step of this fast sorting algorithm called Quick Sort.',
    DFS: 'Explore Depth-First Search (DFS) and learn how this graph traversal algorithm works by visiting nodes deeply before backtracking.',
    BFS: 'Explore Breadth-First Search (BFS) and learn how this graph traversal algorithm explores all nodes level by level in a graph.',
    PrimsMST: "Discover how Prim's Algorithm builds a minimum spanning tree by adding the nearest node with minimum weight.",
    KruskalsMST: "Explore how Kruskal's Algorithm finds the minimum spanning tree in a graph by connecting edges in order of increasing weight.",
    Dijkstra: "Discover how Dijkstra's Algorithm finds the shortest path between nodes in a graph using priority queue.",
    TopSort: 'Learn Topological Sorting to order nodes in a directed graph, ensuring that each node appears before its dependencies.',
    BST: 'Learn how data is organized in a sorted manner by a Binary Search Tree (BST), allowing for efficient searching, insertion, and deletion.',
    BinaryHeap: 'Explore the Binary Heap where elements are arranged in a binary tree while maintaining priority.',
    CircularQueue: 'Understand how Circular Queue efficiently manages a fixed-size queue by wrapping around when full.',
    ConvexHull: 'Explore the Convex Hull algorithm to find the smallest convex boundary that encloses a set of points in a plane.'
};
