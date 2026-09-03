import { Colors } from '@/common/constants';
import { sound } from '@/common/utils';

const ORDER = 3; // max keys per node
const KEY_WIDTH = 50;
const KEY_HEIGHT = 40;
const NODE_PAD = 2;
const NODE_GAP = 24;
const LEVEL_GAP = 80;
const TOP_Y = 40;

const delay = 500;
const leafColor = '#e8f5e9'; // green-tinted for leaves
const internalColor = '#e3f1fc'; // blue-tinted for internal nodes

function bPlusTree({ bgcolor }) {
    var root = null;
    var nextId = 0;
    // Pointer to leftmost leaf (for linked-list rendering)
    var firstLeaf = null;

    function createNode(keys = [], children = [], isLeaf = false) {
        const node = {
            id: `#bplus${nextId++}`,
            keys: keys.slice(),
            children: children.slice(),
            parent: null,
            isLeaf,
            next: null,
            prev: null,
            x: 0,
            y: 0,
        };
        children.forEach((child) => {
            if (child) child.parent = node;
        });
        return node;
    }

    function nodeWidth(node) {
        return node.keys.length * KEY_WIDTH + NODE_PAD * 2;
    }

    function subtreeWidth(node) {
        if (!node) return 0;
        const nodeW = nodeWidth(node);
        if (node.isLeaf) return nodeW;
        let childrenW = 0;
        node.children.forEach((child, i) => {
            childrenW += subtreeWidth(child);
            if (i > 0) childrenW += NODE_GAP;
        });
        return Math.max(nodeW, childrenW);
    }

    function assignPositions(node, left, depth) {
        const subtreeW = subtreeWidth(node);
        const nodeW = nodeWidth(node);
        node.y = TOP_Y + depth * LEVEL_GAP;

        if (node.isLeaf) {
            node.x = left + (subtreeW - nodeW) / 2;
            return;
        }

        let childrenW = 0;
        node.children.forEach((child, i) => {
            childrenW += subtreeWidth(child);
            if (i > 0) childrenW += NODE_GAP;
        });

        let childLeft = left;
        if (childrenW < subtreeW) {
            childLeft += (subtreeW - childrenW) / 2;
        }

        node.children.forEach((child) => {
            assignPositions(child, childLeft, depth + 1);
            childLeft += subtreeWidth(child) + NODE_GAP;
        });

        const first = node.children[0];
        const last = node.children[node.children.length - 1];
        const span = last.x + nodeWidth(last) - first.x;
        node.x = first.x + (span - nodeW) / 2;
    }

    function computeLayout() {
        if (!root) return;
        const plane = document.getElementById('bPlusTree');
        if (!plane) return;
        const rect = plane.getBoundingClientRect();
        const subtreeW = subtreeWidth(root);
        const startX = Math.max(10, (rect.width - subtreeW) / 2);
        assignPositions(root, startX, 0);
    }

    function getSnapshot() {
        if (!root) return { keys: [], nodes: [], edges: [], leafLinks: [] };
        computeLayout();
        const keys = [], nodes = [], edges = [], leafLinks = [];

        function collect(node) {
            nodes.push({
                id: node.id,
                x: node.x,
                y: node.y,
                width: nodeWidth(node),
                height: KEY_HEIGHT,
                isLeaf: node.isLeaf,
            });
            node.keys.forEach((key, i) => {
                keys.push({
                    value: key,
                    x: node.x + NODE_PAD + i * KEY_WIDTH,
                    y: node.y,
                    nodeId: node.id,
                    isLeaf: node.isLeaf,
                });
            });
            node.children.forEach((child, i) => {
                edges.push({
                    id: `${node.id}-${child.id}`,
                    x1: node.x + NODE_PAD + i * KEY_WIDTH,
                    y1: node.y + KEY_HEIGHT,
                    x2: child.x + nodeWidth(child) / 2,
                    y2: child.y,
                });
                collect(child);
            });
        }

        collect(root);

        // Horizontal leaf-chain links
        let leaf = firstLeaf;
        while (leaf && leaf.next) {
            const b = leaf.next;
            leafLinks.push({
                id: `${leaf.id}_${b.id}`,
                x1: leaf.x + nodeWidth(leaf),
                y1: leaf.y + KEY_HEIGHT / 2,
                x2: b.x,
                y2: b.y + KEY_HEIGHT / 2,
            });
            leaf = leaf.next;
        }

        return { keys, nodes, edges, leafLinks };
    }

    function findLeaf(value) {
        let node = root;
        while (node && !node.isLeaf) {
            let i = 0, keys = node.keys;
            while (i < keys.length && value >= keys[i]) i++;
            node = node.children[i];
        }
        return node;
    }

    function findLeafPath(value) {
        const path = [];
        let node = root;
        while (node) {
            path.push(node);
            if (node.isLeaf) break;
            let i = 0, keys = node.keys;
            while (i < keys.length && value >= keys[i]) i++;
            node = node.children[i];
        }
        return path;
    }

    function insertIntoLeaf(leaf, value) {
        let i = 0, keys = leaf.keys;
        while (i < keys.length && value > keys[i]) i++;
        keys.splice(i, 0, value);
    }

    function splitLeaf(leaf) {
        const mid = Math.ceil(leaf.keys.length / 2);
        const rightKeys = leaf.keys.splice(mid);
        const rightLeaf = createNode(rightKeys, [], true);
        // Re-link leaf chain
        rightLeaf.next = leaf.next;
        rightLeaf.prev = leaf;
        if (leaf.next) leaf.next.prev = rightLeaf;
        leaf.next = rightLeaf;
        const promotedKey = rightLeaf.keys[0]; // copy, not move

        if (!leaf.parent) {
            root = createNode([promotedKey], [leaf, rightLeaf], false);
            leaf.parent = root;
            rightLeaf.parent = root;
        } else {
            const parent = leaf.parent;
            const idx = parent.children.indexOf(leaf);
            parent.keys.splice(idx, 0, promotedKey);
            parent.children.splice(idx + 1, 0, rightLeaf);
            rightLeaf.parent = parent;
        }

        return leaf.parent;
    }

    function splitInternal(node) {
        const mid = Math.floor(node.keys.length / 2);
        const promotedKey = node.keys[mid];
        const rightKeys = node.keys.splice(mid + 1);
        node.keys.splice(mid); // remove median from left
        const rightChildren = node.children.splice(mid + 1);
        const rightNode = createNode(rightKeys, rightChildren, false);
        rightChildren.forEach((c) => (c.parent = rightNode));

        if (!node.parent) {
            root = createNode([promotedKey], [node, rightNode], false);
            node.parent = root;
            rightNode.parent = root;
        } else {
            const parent = node.parent;
            const idx = parent.children.indexOf(node);
            parent.keys.splice(idx, 0, promotedKey);
            parent.children.splice(idx + 1, 0, rightNode);
            rightNode.parent = parent;
        }

        return node.parent;
    }

    // ── Instant insert (no animation) ──
    function _insert(value) {
        if (!root) {
            root = createNode([value], [], true);
            firstLeaf = root;
            return;
        }
        const leaf = findLeaf(value);
        insertIntoLeaf(leaf, value);

        if (leaf.keys.length > ORDER - 1) {
            let parent = splitLeaf(leaf);
            while (parent && parent.keys.length > ORDER - 1) {
                parent = splitInternal(parent);
            }
        }
    }

    // ── Animated insert (generator) ──
    async function* insert(value, updateView) {
        if (!root) {
            sound('pop');
            root = createNode([value], [], true);
            firstLeaf = root;
            updateView(getSnapshot());
            yield delay;
            return;
        }
        const path = findLeafPath(value);

        for (let i = 0; i < path.length; i++) {
            const node = path[i];
            await bgcolor(node.id, Colors.compare);
            yield delay;
            if (i < path.length - 1) {
                await bgcolor(node.id, node.isLeaf ? leafColor : internalColor);
            }
        }
        sound('pop');
        const leaf = path[path.length - 1];
        insertIntoLeaf(leaf, value);
        updateView(getSnapshot());
        yield delay * 2;
        await bgcolor(leaf.id, leafColor);
        yield delay;

        if (leaf.keys.length > ORDER - 1) {
            sound('swap');
            let parent = splitLeaf(leaf);
            updateView(getSnapshot());
            yield delay * 2;
            while (parent && parent.keys.length > ORDER - 1) {
                sound('swap');
                parent = splitInternal(parent);
                updateView(getSnapshot());
                yield delay * 2;
            }
        }
    }

    // ── Animated search (generator) ──
    async function* search(value) {
        let node = root;
        while (node) {
            await bgcolor(node.id, Colors.compare);
            yield delay;
            if (node.isLeaf) {
                const found = node.keys.includes(value);
                if (found) {
                    sound('pop');
                    await bgcolor(node.id, Colors.sorted);
                    yield delay;
                    await bgcolor(node.id, leafColor);
                } else {
                    await bgcolor(node.id, leafColor);
                }
                return found;
            }
            let i = 0, keys = node.keys;
            while (i < keys.length && value >= keys[i]) i++;
            await bgcolor(node.id, internalColor);
            node = node.children[i];
        }
        return false;
    }

    return Object.freeze({
        _insert,
        insert,
        search,
        collect() {
            if (!root) return [];
            // collect from leaf chain
            let result = [];
            let leaf = firstLeaf;
            while (leaf) {
                result.push(...leaf.keys);
                leaf = leaf.next;
            }
            return result;
        },
        getSnapshot,
    });
}

export default bPlusTree;
