import { sleep, sound } from '../common/utils';

const NODE_W = 32; // effective node width used for leaf x-spacing
const V_GAP = 60; // vertical gap between levels
const H_GAP = 40; // horizontal gap between siblings

/**
 * Assign x/y positions to every node via a simple recursive layout.
 */
function layoutTrie(node, depth, leftOffset) {
  if (!node) return leftOffset;
  node.y = depth * V_GAP + 50;

  if (node.children.size === 0) {
    node.x = leftOffset + NODE_W / 2;
    return leftOffset + NODE_W + H_GAP;
  }
  let cur = leftOffset;
  for (const child of node.children.values()) {
    cur = layoutTrie(child, depth + 1, cur);
  }
  node.x = (leftOffset + cur - H_GAP) / 2;
  return cur;
}

/** Flat list of all nodes (for rendering) */
function collectNodes(node, out = []) {
  if (!node) return out;
  out.push(node);
  for (const child of node.children.values()) {
    collectNodes(child, out);
  }
  return out;
}

/** Flat list of all edges (parent → child) */
function collectEdges(node, out = []) {
  if (!node) return out;
  for (const child of node.children.values()) {
    out.push({ from: node, to: child });
    collectEdges(child, out);
  }
  return out;
}

/**
 * Trie helper that works purely with React state.
 * Returns immutable snapshots after each mutation so React re-renders correctly.
 */
export default function prefixTree() {
  let root = createNode('', null);
  let version = 0; // bump on every mutation to force re-render

  function createNode(char, parent) {
    return {
      id: Math.random().toString(36).slice(2),
      char,
      isEnd: false,
      highlighted: false,
      parent,
      children: new Map(),
      x: 0,
      y: 0,
    };
  }

  function snapshot() {
    version++;
    layoutTrie(root, 0, 40);
    return {
      nodes: collectNodes(root),
      edges: collectEdges(root),
      version,
    };
  }

  function insert(word) {
    let cur = root;
    for (const ch of word.toLowerCase()) {
      if (!cur.children.has(ch)) {
        cur.children.set(ch, createNode(ch, cur));
      }
      cur = cur.children.get(ch);
    }
    cur.isEnd = true;
    sound('pop');
    return snapshot();
  }

  async function* insertAnimated(word, setSnapshot) {
    let cur = root;
    for (const ch of word.toLowerCase()) {
      // check if new
      if (!cur.children.has(ch)) {
        cur.children.set(ch, createNode(ch, cur));
      }
      cur = cur.children.get(ch);
      cur.highlighted = true;
      setSnapshot(snapshot());
      await sleep(400);
      cur.highlighted = false;
    }
    cur.isEnd = true;
    sound('pop');
    setSnapshot(snapshot());
  }

  async function* searchAnimated(word, setSnapshot) {
    let cur = root;
    let path = [];
    for (const ch of word.toLowerCase()) {
      if (!cur.children.has(ch)) {
        // not found — flash red
        for (const n of path) n.highlighted = 'miss';
        setSnapshot(snapshot());
        await sleep(800);
        for (const n of path) n.highlighted = false;
        setSnapshot(snapshot());
        return false;
      }
      cur = cur.children.get(ch);
      cur.highlighted = true;
      path.push(cur);
      setSnapshot(snapshot());
      await sleep(400);
    }
    // mark found
    for (const n of path) n.highlighted = 'found';
    sound('pop');
    setSnapshot(snapshot());
    await sleep(800);
    for (const n of path) n.highlighted = false;
    setSnapshot(snapshot());
    return path;
  }

  function deleteWord(path) {
    const last = path[path.length - 1];
    if (!last.isEnd) return null; // not a complete word
    last.isEnd = false;
    // prune leaf-only nodes upward
    for (let i = path.length - 1; i >= 0; i--) {
      const node = path[i];
      const { children, parent } = node;
      if (children.size === 0 && !node.isEnd) {
        parent.children.delete(node.char);
      } else break;
    }
    return snapshot();
  }

  function clear() {
    root = createNode('', null);
    return snapshot();
  }

  return {
    insert,
    insertAnimated,
    searchAnimated,
    deleteWord,
    clear,
    snapshot,
  };
}
