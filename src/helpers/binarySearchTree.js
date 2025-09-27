import binaryTree from '@/common/binaryTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';

var delay = 500;

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
        sound('swap');
        await txy(`#node${child.index}`, node.x, node.y, 0.5);
        node.value = child.value;
        node.index = child.index;
        if (child.right) {
            removeNode(child, 'right');
        } else {
            animate(`#edge${child.key - 1}`, { opacity: 0 });
            const parent = child.parent;
            if (child.isLeft) parent.left = null;
            else parent.right = null;
        }
    };

    const removeNode = (node, hand) => {
        const child = node[hand];
        animate(`#edge${child.key - 1}`, { opacity: 0 });
        child.key = node.key;
        if (node.parent) {
            child.parent = node.parent;
            node.parent[node.isLeft ? 'left' : 'right'] = child;
        } else {
            child.parent = null;
            Tree.root(child);
        }
        const dx = node.x - child.x;
        const dy = child.y - node.y;
        cleanup(child, dx, dy);
    };

    const cleanup = (node, dx, dy) => {
        if (node) {
            node.x = node.x + dx;
            node.y = node.y - dy;
            Tree.cleanup(node);
            txy(`#node${node.index}`, node.x, node.y);
            if (node.parent) {
                txy(`#edge${node.key - 1}`, node.x + 25, node.y + 20);
            }
            cleanup(node.left, dx, dy);
            cleanup(node.right, dx, dy);
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
            if (!Tree.root()) return Tree.insert(num);
            else node = node || Tree.root();
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
                Tree.insert(num, node, isLeft);
            } else {
                this._insert(num, node[next]);
            }
        },
        async insert(num, node) {
            if (!Tree.root()) {
                sound('swap');
                return Tree.insert(num);
            }
            else node = node || Tree.root();
            await bgcolor(`#node${node.index}`, Colors.compare);
            await sleep(delay);
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
                sound('swap');
                Tree.insert(num, node, isLeft);
                await sleep(delay);
                await bgcolor(`#node${node.index}`, Colors.white);
            } else {
                await bgcolor(`#node${node.index}`, Colors.white);
                await this.insert(num, node[next]);
            }
        },
        async findAndRemove(num) {
            const node = await findNode(num, Tree.root());
            if (!node) return;
            sound('pop');
            animate(`#node${node.index}`, { opacity: 0 });
            const { left, right, parent } = node;
            if (!left && !right) {
                if (!parent) return Tree.root(null);
                animate(`#edge${node.key - 1}`, { opacity: 0 });
                if (node.isLeft) parent.left = null;
                else parent.right = null;
            } else {
                await sleep(delay);
                return left && right
                    ? replaceNode(node)
                    : removeNode(node, left ? 'left' : 'right');
            }
        },
    });
}

export default binarySearchTree;
