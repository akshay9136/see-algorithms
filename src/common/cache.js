import { makeVar } from '@apollo/client';

export const userAuthVar = makeVar(null);

export const categoriesVar = makeVar([
    {
        catName: 'Sorting',
        algorithms: [
            { algoName: 'Bubble Sort', pathId: 'bubble-sort' },
            { algoName: 'Insertion Sort', pathId: 'insertion-sort' },
            { algoName: 'Selection Sort', pathId: 'selection-sort' },
            { algoName: 'Radix Sort', pathId: 'radix-sort' },
            { algoName: 'Heap Sort', pathId: 'heap-sort' },
            { algoName: 'Merge Sort', pathId: 'merge-sort' },
            { algoName: 'Quick Sort', pathId: 'quick-sort' },
        ],
    },
    {
        catName: 'Graph',
        algorithms: [
            { algoName: 'Depth First Search', pathId: 'dfs' },
            { algoName: 'Breadth First Search', pathId: 'bfs' },
            { algoName: "Prim's MST", pathId: 'prims' },
            { algoName: "Kruskal's MST", pathId: 'kruskals' },
            { algoName: "Dijkstra's Shortest Path", pathId: 'dijkstras' },
            { algoName: 'Topological Sorting', pathId: 'top-sort' },
        ],
    },
    {
        catName: 'Data Structures',
        algorithms: [
            { algoName: 'Binary Search Tree', pathId: 'bst' },
            { algoName: 'Binary Heap', pathId: 'binary-heap' },
            { algoName: 'Circular Queue', pathId: 'circular-queue' },
        ],
    },
    {
        catName: 'Other',
        algorithms: [
            { algoName: 'Convex Hull', pathId: 'convex-hull' },
        ],
    }
]);

export const dataArrayVar = makeVar([]);
