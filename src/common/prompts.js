export const bstPrompt = (name) => (nodes, operation, value) => {
    const json = JSON.stringify(nodes);
    return `
You are explaining the steps to someone observing a visualization of ${name}.

Context:
- The current BST is formed by inserting values of this array: ${json}.
- Operation being performed: ${operation}, with value: ${value}

Instructions:
- Explain how this operation will be performed step by step.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;
};

export const bTreePrompt = (keys, value) => `
You are explaining the steps to someone observing a visualization of B-Tree (order 3).

Context:
- The current B-Tree contains these keys (level-order): ${JSON.stringify(keys)}.
- Operation being performed: Insert, with value: ${value}

Instructions:
- Explain how the insertion is performed step by step.
- If a node split occurs, explain the process.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;

export const graphAlgoPrompt = (name) => (data) => `
You are explaining a graph algorithm to someone observing a visualization of ${name}.

Graph Input: ${JSON.stringify(data)}

Instructions:
- Explain the algorithm step by step as it processes the adjacency matrix.
- Use alphabets (A, B, C, D, ..) for the vertices.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;
