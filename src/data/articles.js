export const articles = [
  {
    id: 'heap-index-math',
    title: 'Complete Binary Trees in Flat Arrays',
    summary:
      'Understand how complete binary trees eliminate pointer overhead and simplify heap traversal.',
    category: 'Data Structures',
    date: '2026-10-08',
  },
  {
    id: 'avl-tree-rotations',
    title: 'AVL Tree Rotations Explained',
    summary:
      'Master the four AVL tree rotations with visual diagrams, balance factor mechanics, and rebalancing steps.',
    category: 'Advanced Trees',
    date: '2026-09-20',
  },
  {
    id: 'deleting-rbt-node',
    title: 'Deletion in a Red-Black Tree',
    summary:
      'A step-by-step breakdown of how Red-Black Trees remove nodes and restore balance through four fixup cases.',
    category: 'Advanced Trees',
    date: '2026-09-16',
  },
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
    title: 'In-Place Sorting Algorithms',
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
    id: 'avl-tree-vs-red-black',
    title: 'AVL Tree vs Red-Black Tree',
    summary:
      'Understand the mechanism of self-balancing Binary Search Trees and how they differ in practice.',
    category: 'Advanced Trees',
    date: '2026-03-03',
  },
  {
    id: 'deleting-bst-node',
    title: 'Deleting a Node in BST',
    summary:
      'Learn how Binary Search Tree preserves the ordering while removing nodes from the tree.',
    category: 'Data Structures',
    date: '2026-03-05',
  },
  {
    id: 'compare-sorting',
    title: 'Compare Sorting Algorithms',
    summary:
      'Visualize and compare multiple sorting algorithms simultaneously with same input array.',
    category: 'Sorting',
    date: '2026-03-28',
  },
  {
    id: 'embed-sorting-algo',
    title: 'Embed Sorting Visualizers',
    summary:
      'Transform your sorting algorithm articles with live, interactive animations that visualize every comparison and swap.',
    category: 'Sorting',
    date: '2026-04-05',
  },
  {
    id: 'embed-graph-algo',
    title: 'Embed Graph Visualizers',
    summary:
      'Integrate dynamic graph visualizations into your content, letting readers explore traversals and shortest paths interactively.',
    category: 'Graph',
    date: '2026-04-28',
  },
  {
    id: 'embed-data-struct',
    title: 'Embed DS Visualizers',
    summary:
      'Enhance your lessons on complex data structures by integrating our interactive visualizers.',
    category: 'Data Structures',
    date: '2026-04-28',
  },
  {
    id: 'lomuto-vs-hoare',
    title: 'Lomuto vs Hoare Partitioning',
    summary:
      'Explore the mechanics, swap efficiency, and trade-offs between the two classic Quicksort partitioning schemes.',
    category: 'Sorting',
    date: '2026-10-05',
  },
].sort((a, b) => b.date.localeCompare(a.date));
