import binaryTree from '@/common/binaryTree';
import { sound } from '../common/utils';
import { Colors } from '../common/constants';

const delay = 400;

function binaryHeap(animator) {
    const Tree = binaryTree(animator);
    const { bgcolor, animate, txy } = animator;

    const getLargest = (node, n) => {
        const { left, right } = node;
        if (left && left.key < n) {
            if (left.value > node.value) node = left;
        }
        if (right && right.key < n) {
            if (right.value > node.value) node = right;
        }
        return node;
    };

    async function* heapify(node, n) {
        await bgcolor(node.id, Colors.compare);
        const max = getLargest(node, n);
        if (max !== node) {
            yield delay / 2;
            await bgcolor(max.id, Colors.compare);
            await Tree.swapNodes(node, max);
            yield delay / 2;
            await bgcolor(node.id, Colors.white);
            yield* heapify(max, n);
        } else {
            yield delay;
            await bgcolor(node.id, Colors.white);
        }
    }

    async function* heapifyUp(node) {
        await bgcolor(node.id, Colors.compare);
        yield delay / 2;
        const parent = node.parent;
        if (parent && node.value > parent.value) {
            await bgcolor(parent.id, Colors.compare);
            await Tree.swapNodes(node, parent);
            yield delay / 2;
            await bgcolor(node.id, Colors.white);
            yield* heapifyUp(parent);
        } else {
            await bgcolor(node.id, Colors.white);
        }
    }

    function findLast(root) {
        const queue = [root];
        let last = null;
        while (queue.length) {
            last = queue.shift();
            if (last.left) queue.push(last.left);
            if (last.right) queue.push(last.right);
        }
        return last;
    }

    async function* extract() {
        const root = Tree.root();
        animate(root.id, { opacity: 0 });
        const last = findLast(root);
        const { id, value, parent, isLeft } = last;
        yield delay * 2;
        if (root.key !== last.key) {
            sound('swap');
            await txy(id, root.x, root.y);
            await txy(`#key${Tree.size() - 1}`, -20, 0, 0);
            animate(last.eid, { opacity: 0 });
            root.update({ id, value });
            last.update({ deleted: true });
            parent[isLeft ? 'left' : 'right'] = null;
            yield delay * 2;
            yield* heapify(root, Tree.size());
        } else {
            Tree.root(null);
        }
    }

    return {
        ...Tree,
        heapify,
        heapifyUp,
        extract,
    };
}

export default binaryHeap;
