import binaryTree from '@/common/binaryTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';

const delay = 500;

function binarySearchTree(animator) {
    const Tree = binaryTree(animator);
    const { bgcolor, txy, animate, cleanup } = animator;

    const smallest = async (node) => {
        await bgcolor(node.id, Colors.compare);
        await sleep(delay);
        await bgcolor(node.id, Colors.white);
        if (!node.left) return node;
        return smallest(node.left);
    };

    const replaceNode = async (node) => {
        const child = await smallest(node.right);
        const { right, parent } = child;
        sound('swap');
        await txy(child.id, node.x, node.y);
        node.value = child.value;
        node.id = child.id;
        if (right) {
            return removeNode(child, right);
        } else {
            animate(child.eid, { opacity: 0 });
            parent[child.isLeft ? 'left' : 'right'] = null;
            return parent;
        }
    };

    const removeNode = (node, child) => {
        animate(child.eid, { opacity: 0 });
        child.eid = node.eid;
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

    const postCleanup = (node) => {
        if (node) {
            Tree.cleanup(node);
            postCleanup(node.left);
            postCleanup(node.right);
        }
    };

    const search = async (num, node, insert) => {
        await bgcolor(node.id, Colors.compare);
        await sleep(delay);
        if (!insert && num === node.value) {
            await bgcolor(node.id, Colors.white);
            return node;
        }
        const next = num <= node.value ? 'left' : 'right';
        if (node[next]) {
            await animate(node[next].eid, {
                height: 3,
                backgroundColor: Colors.compare,
            });
            await bgcolor(node.id, Colors.white);
            return search(num, node[next], insert);
        } else {
            await bgcolor(node.id, Colors.white);
            if (insert) return node;
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
        async insert(num) {
            if (!Tree.root()) {
                sound('pop');
                return Tree.insert(num);
            }
            const parent = await search(num, Tree.root(), true);
            const isLeft = num <= parent.value;
            sound('pop');
            const node = Tree.insert(num, parent, isLeft);
            await sleep(delay);
            animate('.nodeEdge', {
                height: 2,
                backgroundColor: Colors.stroke,
            });
            return node;
        },
        async deleteNode(num) {
            const node = await search(num, Tree.root());
            animate('.nodeEdge', {
                height: 2,
                backgroundColor: Colors.stroke,
            });
            if (!node) return;
            animate(node.id, { opacity: 0 });
            sound('pop');
            const { left, right, parent } = node;
            if (!left && !right) {
                if (!parent) return Tree.root(null);
                parent[node.isLeft ? 'left' : 'right'] = null;
                animate(node.eid, { opacity: 0 });
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
