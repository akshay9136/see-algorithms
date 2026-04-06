import { GoogleGenAI } from '@google/genai';
import prompts from '@/common/prompts';

const ai = new GoogleGenAI({});

const promptBuilders = {
  BST: prompts.binarySearchTree('Binary Search Tree'),
  AVL: prompts.binarySearchTree('AVL Tree'),
  RedBlackTree: prompts.binarySearchTree('Red-Black Tree'),
  SplayTree: prompts.binarySearchTree('Splay Tree'),
  BTree: prompts.bTree,
  BinaryHeap: prompts.binaryHeap,
  HuffmanCoding: prompts.huffmanCoding,
  BFS: prompts.graphAlgorithm('Breadth-First Search'),
  DFS: prompts.graphAlgorithm('Depth-First Search'),
  TopSort: prompts.graphAlgorithm('Topological Sorting (using stack)'),
  Dijkstras: prompts.graphAlgorithm('Dijkstras Shortest Path'),
  Prims: prompts.graphAlgorithm('Prims Minimum Spanning Tree'),
};

export default async function (req, res) {
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
    console.error({
      title: 'AI request failed',
      message: err.message,
      page: pathname,
    });
    res.status(500).send('AI request failed');
  }
}
