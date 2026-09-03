import db, { summaryCount } from '@/utils/firebase-utils';
import { withAuth, withRequestBody } from '@/utils/middlewares';
import { INITIAL_CREDITS, SUMMARY_COST } from '@/utils/constants';
import { GoogleGenAI } from '@google/genai';
import prompts from '@/utils/prompts';
import compose from 'ramda/src/compose';

export const maxDuration = 60;

const ai = new GoogleGenAI({});

const promptBuilders = {
  BST: prompts.searchTree('Binary Search Tree'),
  AVL: prompts.searchTree('AVL Tree'),
  RedBlackTree: prompts.searchTree('Red-Black Tree'),
  SplayTree: prompts.searchTree('Splay Tree'),
  BTree: prompts.bTree,
  'B+Tree': prompts.bPlusTree,
  BinaryHeap: prompts.binaryHeap,
  HuffmanCoding: prompts.huffmanCoding,
  BFS: prompts.graphAlgorithm('Breadth-First Search'),
  DFS: prompts.graphAlgorithm('Depth-First Search (using stack)'),
  TopSort: prompts.graphAlgorithm('Topological Sorting (using stack)'),
  Dijkstras: prompts.graphAlgorithm('Dijkstras Shortest Path'),
  Prims: prompts.graphAlgorithm('Prims Minimum Spanning Tree'),
  Eulerian: prompts.graphAlgorithm('Eulerian Cycle'),
};

async function handler(req, res, user) {
  const { data, algoId } = req.body;

  const buildPrompt = promptBuilders[algoId];
  const summaryCost = SUMMARY_COST[algoId] || 3;

  if (!buildPrompt) {
    return res.status(400).send('Invalid request');
  }

  const userRef = db.collection('users').doc(user.userId);
  const usageRef = db.collection('creditsUsed').doc();

  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const credits = userDoc.data().credits ?? INITIAL_CREDITS;
    if (credits < summaryCost) {
      return res.status(402).send('Insufficient credits');
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Credit check failed');
  }

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: buildPrompt(data),
    });
  } catch (err) {
    console.error(err.message);
    return res.status(err.status).send('AI request failed');
  }

  try {
    await db.runTransaction(async (txn) => {
      const userDoc = await txn.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const credits = userDoc.data().credits ?? INITIAL_CREDITS;
      if (credits < summaryCost) {
        throw new Error('Insufficient credits');
      }

      const remaining = credits - summaryCost;
      txn.update(userRef, { credits: remaining });

      txn.set(usageRef, {
        summaryCost,
        remaining,
        algoId,
        userId: user.userId,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error('Transaction failed:', err.message);
  }

  res.on('finish', () => summaryCount(algoId));
  res.status(200).send(response.text);
}

export default compose(withAuth, withRequestBody('data', 'algoId'))(handler);
