import binaryTree from '@/common/binaryTree';
import { Colors } from '../common/constants';
import { sleep } from '../common/utils';

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
        await txy(`#node${child.index}`, node.x, node.y, 0.5);
        node.value = child.value;
        node.index = child.index;
        if (child.right) {
            await sleep(delay);
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
            txy(`#node${node.index}`, node.x, node.y);
            if (node.parent) {
                txy(`#edge${node.key - 1}`, node.x + 25, node.y + 20);
            }
            cleanup(node.left, dx, dy);
            cleanup(node.right, dx, dy);
            Tree.cleanup(node);
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
        async insert(num, node) {
            if (!Tree.root()) return Tree.insert(num);
            else node = node || Tree.root();
            await bgcolor(`#node${node.index}`, Colors.compare);
            await sleep(delay);
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
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
            animate(`#node${node.index}`, { opacity: 0 });
            await sleep(800);
            const { left, right, parent } = node;
            if (!left && !right) {
                if (!parent) return Tree.root(null);
                animate(`#edge${node.index - 1}`, { opacity: 0 });
                if (node.isLeft) parent.left = null;
                else parent.right = null;
            } else {
                return left && right
                    ? replaceNode(node)
                    : removeNode(node, left ? 'left' : 'right');
            }
        },
    });
}

export default binarySearchTree;
