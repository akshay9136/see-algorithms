import { Colors } from '@/common/constants';
import { sound } from '@/common/utils';

const ORDER = 3;
const KEY_WIDTH = 50;
const KEY_HEIGHT = 40;
const NODE_PAD = 2;
const NODE_GAP = 24;
const LEVEL_GAP = 80;
const TOP_Y = 40;

const delay = 500;

function bTree({ bgcolor }) {
    var root, nextId = 0;

    function createNode(keys = [], children = []) {
        const node = {
            id: `#node${nextId++}`,
            keys: keys.slice(),
            children: children.slice(),
            parent: null,
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
        const { children } = node;
        if (children.length === 0) return nodeW;
        let childrenW = 0;
        children.forEach((child, i) => {
            childrenW += subtreeWidth(child);
            if (i > 0) childrenW += NODE_GAP;
        });
        return Math.max(nodeW, childrenW);
    }

    function assignPositions(node, left, depth) {
        const subtreeW = subtreeWidth(node);
        const nodeW = nodeWidth(node);
        node.y = TOP_Y + depth * LEVEL_GAP;
        const { children } = node;

        if (children.length === 0) {
            node.x = left + (subtreeW - nodeW) / 2;
            return;
        }

        let childrenW = 0;
        children.forEach((child, i) => {
            childrenW += subtreeWidth(child);
            if (i > 0) childrenW += NODE_GAP;
        });

        let childLeft = left;
        if (childrenW < subtreeW) {
            childLeft += (subtreeW - childrenW) / 2;
        }

        children.forEach((child) => {
            assignPositions(child, childLeft, depth + 1);
            childLeft += subtreeWidth(child) + NODE_GAP;
        });

        const first = children[0];
        const last = children[children.length - 1];
        const span = last.x + nodeWidth(last) - first.x;
        node.x = first.x + (span - nodeW) / 2;
    }

    function computeLayout() {
        const plane = document.getElementById('bTree');
        const rect = plane.getBoundingClientRect();
        const subtreeW = subtreeWidth(root);
        const startX = Math.max(10, (rect.width - subtreeW) / 2);
        assignPositions(root, startX, 0);
    }

    function getSnapshot() {
        if (!root) return { keys: [], nodes: [], edges: [] };
        computeLayout();
        const keys = [], nodes = [], edges = [];

        function collect(node) {
            nodes.push({
                id: node.id,
                x: node.x,
                y: node.y,
                width: nodeWidth(node),
                height: KEY_HEIGHT,
            });
            node.keys.forEach((key, i) => {
                keys.push({
                    value: key,
                    x: node.x + NODE_PAD + i * KEY_WIDTH,
                    y: node.y,
                    nodeId: node.id,
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
        return { keys, nodes, edges };
    }

    function findLeafPath(value) {
        let path = [], node = root;
        while (node) {
            path.push(node);
            if (node.children.length === 0) break;
            let i = 0, keys = node.keys;
            while (i < keys.length && value > keys[i]) i++;
            node = node.children[i];
        }
        return path;
    }

    function insertKey(node, value) {
        let i = 0, keys = node.keys;
        while (i < keys.length && value > keys[i]) i++;
        keys.splice(i, 0, value);
        return i;
    }

    function splitNode(node) {
        const midKey = node.keys[1];
        const rightKeys = node.keys.splice(2);
        node.keys.splice(1); // remove median
        const children = node.children.splice(2);
        const rightNode = createNode(rightKeys, children);

        if (!node.parent) {
            root = createNode([midKey], [node, rightNode]);
        } else {
            const parent = node.parent;
            const idx = parent.children.indexOf(node);
            parent.keys.splice(idx, 0, midKey);
            parent.children.splice(idx + 1, 0, rightNode);
            rightNode.parent = parent;
        }

        return node.parent;
    }

    // Animated insert (generator)
    async function* insert(value, updateView) {
        if (!root) {
            sound('pop');
            root = createNode([value]);
            updateView(getSnapshot());
            yield delay;
            return;
        }
        // Traverse from root to leaf
        const path = findLeafPath(value);
        for (let i = 0; i < path.length; i++) {
            const node = path[i];
            await bgcolor(node.id, Colors.compare);
            yield delay;
            if (i < path.length - 1) {
                await bgcolor(node.id, '#e3f1fc');
            }
        }
        sound('pop');
        // Insert into leaf
        const leaf = path[path.length - 1];
        insertKey(leaf, value);
        updateView(getSnapshot());
        yield delay * 2;
        await bgcolor(leaf.id, '#e3f1fc');
        yield delay;
        // Split as needed
        let node = leaf;
        while (node && node.keys.length > ORDER - 1) {
            sound('swap');
            const parent = splitNode(node);
            updateView(getSnapshot());
            node = parent.keys.length > ORDER - 1 ? parent : null;
            yield delay * 2;
        }
    }

    return Object.freeze({
        // Instant insert (no animation)
        _insert(value) {
            if (!root) {
                root = createNode([value]);
                return;
            }
            const path = findLeafPath(value);
            const leaf = path[path.length - 1];
            insertKey(leaf, value);
            let node = leaf;
            while (node && node.keys.length > ORDER - 1) {
                node = splitNode(node);
            }
        },
        insert,
        collect() {
            if (!root) return [];
            const result = [];
            const queue = [root];
            while (queue.length) {
                const node = queue.shift();
                result.push(...node.keys);
                node.children.forEach((c) => queue.push(c));
            }
            return result;
        },
        getSnapshot,
    });
}

export default bTree;
