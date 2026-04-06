const binarySearchTree = (name) => ({ keys, operation, input }) => {
    const json = JSON.stringify(keys);
    return `
You are explaining the steps to someone observing a visualization of ${name}.

Context:
- The current BST is formed by inserting values of this array: ${json}.
- Operation being performed: ${operation}, with value: ${input}

Instructions:
- Explain how this operation will be performed step by step.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;
};

const binaryHeap = ({ keys, operation, input }) => `
You are explaining the steps to someone observing a visualization of Binary Heap.

Context:
- A max-heap is represented by the values in this array: ${JSON.stringify(keys)}.
- Operation being performed: ${operation}, ${operation === 'Insert' ? `with value: ${input}` : ''}

Instructions:
- Explain how this operation will be performed.
- Keep the explaination short and step wise. Use past tense.
- Highlight important actions.`;

const bTree = ({ keys, operation, input }) => `
You are explaining the steps to someone observing a visualization of B-Tree (order 3).

Context:
- The current B-Tree contains these keys (level-order): ${JSON.stringify(keys)}.
- Operation being performed: ${operation}, with value: ${input}

Instructions:
- Explain how the ${operation} is performed step by step.
- If a node split occurs, explain the process.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;

const graphAlgorithm = (name) => (data) => `
You are explaining a graph algorithm to someone observing a visualization of ${name}.

Graph Input: ${JSON.stringify(data)}

Instructions:
- Explain the algorithm step by step as it processes the adjacency matrix.
- Use alphabets (A, B, C, D, ..) for the vertices.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;

const huffmanCoding = (data) => `
You are explaining an algorithm to someone observing a visualization of Huffman Coding.

Input: ${JSON.stringify(data)}

Instructions:
- Explain the construction of the Huffman Tree and generation of codes using above input.
- Keep the explaination short and concise. Use past tense.
- Highlight important actions.`;

export default {
    binarySearchTree,
    binaryHeap,
    bTree,
    graphAlgorithm,
    huffmanCoding,
}
