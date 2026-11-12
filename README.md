# See Algorithms

[See Algorithms](https://see-algorithms.com/) is an interactive learning site for algorithms and data structures. Step through sorting and graph algorithms, or build your own data structures to see how their operations work.

![Stars](https://img.shields.io/github/stars/akshay9136/see-algorithms?style=flat)
![Forks](https://img.shields.io/github/forks/akshay9136/see-algorithms?style=flat)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=akshay9136.see-algorithms)
![Website](https://img.shields.io/website?url=https://see-algorithms.com)
![Deploy](https://vercelbadge.vercel.app/api/akshay9136/see-algorithms?style=flat)
![Coverage](https://codecov.io/gh/akshay9136/see-algorithms/branch/main/graph/badge.svg)

<img src="https://see-algorithms.com/gifs/preview.gif" width="70%" />

### 🚀 Features

- **Visual Learning:** Stop guessing what happens inside the loop. Our visualizer isolates and highlights the algorithm's exact decisions as they occur.
- **Playback Control:** Don't just watch — control the flow. Pause, resume, and step through animations at your own pace to truly understand the algorithm's behavior.
- **Custom Inputs:** Move beyond static examples. Draw custom directed or undirected graphs, edit weights, create binary trees, or input your own numbers to sort.
- **Share Insights:** Created a tricky graph or a specific tree structure? Generate a unique URL to share your exact visualization setup with peers or students instantly.

### 📚 Algorithms Covered

1. **Sorting Algorithms:** Bubble Sort, Insertion Sort, Selection Sort, Heap Sort, Merge Sort, Quick Sort, Radix Sort
2. **Graph Algorithms:** Depth-First Search (DFS), Breadth-First Search (BFS), Dijkstra’s Algorithm, Topological Sorting, Hamiltonian Cycle, Eulerian Cycle
3. **Minimum Spanning Trees:** Prim’s, Kruskal’s, and Borůvka’s algorithms
4. **Data Structures:** Linked List, Circular Queue, Trie (Prefix Tree), Binary Heap, Binary Search Tree (BST),AVL Tree, Red-Black Tree, Splay Tree, B-Tree, B+ Tree
5. **Other Algorithms:** Convex Hull, Huffman Coding

## Local Development

Use Node.js 24 or later. CI runs on Node.js 24.

```bash
git clone https://github.com/akshay9136/see-algorithms.git
cd see-algorithms
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app uses Next.js, React 19, and Material UI 7. `npm run dev` uses Turbopack. Run `npm run dev:webpack` to develop with Webpack. Production builds use Webpack. Nunito is bundled locally in `src/fonts`.

## Validation

Run these commands from the repository root before opening a pull request.

```bash
npm run lint
npm test -- --runInBand
npm run build
```

ESLint uses the flat configuration in `eslint.config.mjs`. React Compiler is disabled, and selected compiler-readiness rules report warnings. The production build also runs an SSR style check and generates the sitemap.

## Contributing

1. Fork the repository and create a branch for your change.
2. For a new visualizer, add its route and update the catalog in `src/common/appData.js`.
3. Open the affected routes locally and test them thoroughly. Run the validation commands above.
4. Push your branch to your fork and open a pull request. Include a screenshot or short recording for visible changes.

## 📬 Contact

If you have any questions, suggestions, or feedback, feel free to reach out.

Email: hello@see-algorithms.com

## ⭐ Support

If you find this project helpful, please consider giving it a star ⭐ on GitHub. Your support is greatly appreciated!
