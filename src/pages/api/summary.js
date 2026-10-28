import db, { summaryCount } from '@/utils/firebase-utils';
import { createResponse } from '@/utils/summary';
import { withAuth, withMethod, withRequestBody } from '@/utils/middlewares';
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
  PrefixTree: prompts.prefixTree,
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

  const stream = createResponse(res);

  console.log('BUILD PROMPT', buildPrompt(data))

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: buildPrompt(data),
      config: { abortSignal: stream.signal },
    });

    await stream.writeChunks(response);

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

    res.on('finish', () => summaryCount(algoId));
    stream.complete();
  } catch (err) {
    stream.reject(err);
  } finally {
    stream.dispose();
  }
}

export default compose(
  withMethod('POST'),
  withAuth,
  withRequestBody('data', 'algoId'),
)(handler);
