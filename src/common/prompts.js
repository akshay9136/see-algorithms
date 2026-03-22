export const bstPrompt = (name) => (nodes, operation, value) => {
    const json = JSON.stringify(nodes);
    return `
You are explaining the steps to someone observing a visualization of ${name}.

Context:
- A BST is created by inserting values in this array (Do not explain this): ${json}.
- Operation being performed: ${operation}, with value: ${value}

Instructions:
- Explain how this operation will be performed step by step.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;
};

export const graphAlgoPrompt = (name) => (data) => {
    return `
You are explaining a graph algorithm to someone observing a visualization of ${name}.

Graph Input: ${JSON.stringify(data)}

Instructions:
- Explain the algorithm step by step as it processes the adjacency matrix.
- Use alphabets (A, B, C, D, ..) for the vertices.
- Keep the explaination concise (within 200 words). Use past tense.
- Highlight important actions.`;
};
