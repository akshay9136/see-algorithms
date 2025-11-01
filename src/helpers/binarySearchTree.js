import binaryTree from '@/common/binaryTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';

const delay = 500;

function binarySearchTree(animator) {
    const Tree = binaryTree(animator);
    const { bgcolor, txy, animate } = animator;

    const smallest = async (node) => {
        await bgcolor(`#node${node.index}`, Colors.compare);
        await sleep(delay);
        await bgcolor(`#node${node.index}`, Colors.white);
        if (!node.left) return node;
        return smallest(node.left);
    };

    const replaceNode = async (node) => {
        const child = await smallest(node.right);
        const { right, parent } = child;
        sound('swap');
        await txy(`#node${child.index}`, node.x, node.y, 0.5);
        node.value = child.value;
        node.index = child.index;
        if (right) {
            return removeNode(child, right);
        } else {
            animate(`#edge${child.key - 1}`, { opacity: 0 });
            parent[child.isLeft ? 'left' : 'right'] = null;
            return parent;
        }
    };

    const removeNode = (node, child) => {
        animate(`#edge${child.key - 1}`, { opacity: 0 });
        child.key = node.key;
        const { parent, isLeft } = node;
        child.parent = parent;
        child.isLeft = isLeft;
        if (parent) {
            parent[isLeft ? 'left' : 'right'] = child;
        } else Tree.root(child);
        sound('swap');
        const dx = node.x - child.x;
        const dy = child.y - node.y;
        cleanup(child, dx, dy);
        postCleanup(child);
        return child;
    };

    const cleanup = (node, dx, dy) => {
        if (node) {
            node.x = node.x + dx;
            node.y = node.y - dy;
            txy(`#node${node.index}`, node.x, node.y, 0.5);
            if (node.parent) {
                const ex = node.x + 25;
                const ey = node.y + 20;
                txy(`#edge${node.key - 1}`, ex, ey, 0.5);
            }
            cleanup(node.left, dx, dy);
            cleanup(node.right, dx, dy);
        }
    };

    const postCleanup = (node) => {
        if (node) {
            Tree.cleanup(node);
            postCleanup(node.left);
            postCleanup(node.right);
        }
    };

    const findNode = async (num, node) => {
        await bgcolor(`#node${node.index}`, Colors.compare);
        await sleep(delay);
        await bgcolor(`#node${node.index}`, Colors.white);
        if (num === node.value) return node;
        const next = num < node.value ? 'left' : 'right';
        if (node[next]) {
            return findNode(num, node[next]);
        }
    };

    return Object.freeze({
        ...Tree,
        _insert(num, node) {
            if (Tree.root()) {
                node = node || Tree.root();
            } else {
                sound('swap');
                return Tree.insert(num);
            }
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            return node[next]
                ? this._insert(num, node[next])
                : Tree.insert(num, node, isLeft);
        },
        async insert(num, node) {
            if (Tree.root()) {
                node = node || Tree.root();
            } else {
                sound('pop');
                return Tree.insert(num);
            }
            await bgcolor(`#node${node.index}`, Colors.compare);
            await sleep(delay);
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
                sound('pop');
                const _node = Tree.insert(num, node, isLeft);
                await sleep(delay);
                await bgcolor(`#node${node.index}`, Colors.white);
                return _node;
            } else {
                await bgcolor(`#node${node.index}`, Colors.white);
                return this.insert(num, node[next]);
            }
        },
        async deleteNode(num) {
            const node = await findNode(num, Tree.root());
            if (!node) return;
            sound('pop');
            animate(`#node${node.index}`, { opacity: 0 });
            const { left, right, parent } = node;
            if (!left && !right) {
                if (!parent) return Tree.root(null);
                animate(`#edge${node.key - 1}`, { opacity: 0 });
                // remove link from parent
                parent[node.isLeft ? 'left' : 'right'] = null;
                return parent;
            } else {
                await sleep(delay);
                return left && right
                    ? replaceNode(node)
                    : removeNode(node, left || right);
            }
        },
    });
}

export default binarySearchTree;
