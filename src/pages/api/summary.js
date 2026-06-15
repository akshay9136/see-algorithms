import { GoogleGenAI } from '@google/genai';
import { withAuth, withRequestBody } from '@/lib/middlewares';
import { summaryCount } from '@/lib/firebase-utils';
import prompts from '@/lib/prompts';
import compose from 'ramda/src/compose';

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
  DFS: prompts.graphAlgorithm('Depth-First Search (using stack)'),
  TopSort: prompts.graphAlgorithm('Topological Sorting (using stack)'),
  Dijkstras: prompts.graphAlgorithm('Dijkstras Shortest Path'),
  Prims: prompts.graphAlgorithm('Prims Minimum Spanning Tree'),
};

async function handler(req, res) {
  const { data, algoId } = req.body;
  try {
    const buildPrompt = promptBuilders[algoId];
    if (!buildPrompt) {
      return res.status(400).send('Invalid request');
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(data),
    });
    res.on('finish', () => summaryCount(algoId));
    res.status(200).send(response.text);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('AI request failed');
  }
}

export default compose(
  withAuth,
  withRequestBody('data', 'algoId'),
)(handler);
