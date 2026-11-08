// common instructions for tree operations
const instructions = `Instructions:
- Explain how this operation will be performed step by step.
- Keep the explaination concise (within 300 words). Use past tense.
- Mention any subtle detail (key insight).
- Suggest one specific, valid input change to try out next.
- Highlight important actions.`;

// common instructions from line 2
const commonInst = instructions.split('\n').slice(2).join('\n');

const searchTree = (name) => {
  return ({ keys, operation, input }) => `
You are explaining the steps to someone observing a visualization of ${name}.

Context:
- The BST variant BEFORE the operation, in preorder sequence: ${JSON.stringify(keys)}.
- Operation being performed: ${operation}, with input: ${input}

${instructions}`;
};

const binaryHeap = ({ keys, operation, input }) => `
You are explaining the steps to someone observing a visualization of Binary Heap.

Context:
- A max-heap is represented by the values in this array: ${JSON.stringify(keys)}.
- Operation being performed: ${operation}, ${operation === 'Insert' ? `with input: ${input}` : ''}

${instructions}`;

const prefixTree = ({ words, operation, input }) => `
You are explaining the steps to someone observing a visualization of a Prefix Tree (Trie).

Context:
- The Trie currently contains these words: ${JSON.stringify(words)}.
- Each node in the Trie represents a single character.
- Last character node of any word is colored, indicating end of the word.
- Operation being performed: ${operation}${input ? `, with input: "${input}"` : ''}

${instructions}
- If nodes are shared between words (common prefix), point that out explicitly.`;

const bTree = ({ keys, operation, input }) => `
You are explaining the steps to someone observing a visualization of B-Tree (order 3).

Context:
- The current B-Tree contains these keys (level-order): ${JSON.stringify(keys)}.
- Operation being performed: ${operation}, with input: ${input}

${instructions}
- If a node split occurs, explain the process.`;

const bPlusTree = ({ keys, operation, input }) => `
You are explaining the steps to someone observing a visualization of B+ Tree (order 3).

Context:
- The current B+ Tree leaf nodes (left to right) are: ${JSON.stringify(keys)}.
- Each sub-array represents one leaf node, e.g. [[1,3],[5,7],[9]].
- Operation being performed: ${operation}, with input: ${input}
- On a leaf split 2:1, the right leaf's smallest key is COPIED up to the parent.

${instructions}
- If a leaf splits, describe the copy-up promotion and leaf chain re-linking.`;

const graphAlgorithm = (name) => (data) => `
You are explaining a graph algorithm to someone observing a visualization of ${name}.

Graph Input: ${JSON.stringify(data)}

Instructions:
- Explain the algorithm step by step as it processes the adjacency matrix.
- Use alphabets (A, B, C, D, ..) for the vertices.
- Never mention numeric indices — they are implementation details not visible to the user.
${commonInst}`;

const depthFirstSearch = (data) => `${graphAlgorithm('Depth-First Search')(data)} 
- Simulate the stack. Pop the top vertex, then push its unvisited outgoing neighbors in label order.
- Mark each neighbor visited when you push it.`;

const breadthFirstSearch = (data) => `${graphAlgorithm('Breadth-First Search')(data)}
- Simulate the queue. Dequeue the front vertex, then enqueue its unvisited outgoing neighbors in label order.
- Mark each neighbor visited when you enqueue it.`;

const topologicalSort = (data) => `${graphAlgorithm('Topological Sorting')(data)}
- Use Kahn's algorithm: start by pushing all vertices with in-degree 0.
- Simulate the stack. Pop the top vertex, then decrement the in-degree of its outgoing neighbors.`;

const huffmanCoding = (data) => `
You are explaining an algorithm to someone observing a visualization of Huffman Coding.

Input: ${JSON.stringify(data)}

Instructions:
- Explain the construction of the Huffman Tree and generation of codes using above input.
${commonInst}`;

const prompts = {
  searchTree,
  binaryHeap,
  prefixTree,
  bTree,
  bPlusTree,
  graphAlgorithm,
  depthFirstSearch,
  breadthFirstSearch,
  topologicalSort,
  huffmanCoding,
};

export default prompts;
