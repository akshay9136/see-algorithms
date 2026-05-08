import { GoogleGenAI } from '@google/genai';
import { withAuth } from '@/lib/middlewares';
import prompts from '@/lib/prompts';

const ai = new GoogleGenAI({});

const promptBuilders = {
  BST: prompts.searchTree('Binary Search Tree'),
  AVL: prompts.searchTree('AVL Tree'),
  RedBlackTree: prompts.searchTree('Red-Black Tree'),
  SplayTree: prompts.searchTree('Splay Tree'),
  BTree: prompts.bTree,
  BinaryHeap: prompts.binaryHeap,
  HuffmanCoding: prompts.huffmanCoding,
  BFS: prompts.graphAlgorithm('Breadth-First Search'),
  DFS: prompts.graphAlgorithm('Depth-First Search'),
  TopSort: prompts.graphAlgorithm('Topological Sorting (using stack)'),
  Dijkstras: prompts.graphAlgorithm('Dijkstras Shortest Path'),
  Prims: prompts.graphAlgorithm('Prims Minimum Spanning Tree'),
};

export default withAuth(async function (req, res) {
  try {
    const { data, pathname } = req.body;
    const algorithm = pathname.split('/')[2];
    const buildPrompt = promptBuilders[algorithm];
    if (!buildPrompt) {
      return res.status(400).send('Invalid request');
    }
    const prompt = buildPrompt(data);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.status(200).send(response.text);
  } catch (err) {
    console.error(err.message, pathname);
    res.status(500).send('AI request failed');
  }
});
