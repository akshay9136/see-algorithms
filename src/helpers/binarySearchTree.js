import binaryTree from '@/common/binaryTree';
import { showError, sound } from '../common/utils';
import { Colors } from '../common/constants';

const delay = 500;

function binarySearchTree(animator) {
    const Tree = binaryTree(animator);
    const { bgcolor, txy, animate, cleanup } = animator;

    async function* smallest(node) {
        await bgcolor(node.id, Colors.compare);
        yield delay;
        await bgcolor(node.id, Colors.white);
        if (node.left) {
            return yield* smallest(node.left);
        }
        return node;
    };

    async function* replaceNode(node) {
        const child = yield* smallest(node.right);
        const { id, value, right } = child;
        sound('swap');
        await txy(id, node.x, node.y);
        node.update({ id, value });
        if (right) {
            return removeNode(child, right);
        } else {
            const { eid, parent, isLeft } = child;
            animate(eid, { opacity: 0 });
            child.update({ deleted: true });
            parent[isLeft ? 'left' : 'right'] = null;
            return parent;
        }
    };

    const removeNode = (node, child) => {
        animate(child.eid, { opacity: 0 });
        const { parent, eid, isLeft } = node;
        child.parent = parent;
        child.update({ eid, isLeft });
        node.update({ deleted: true });
        if (parent) {
            parent[isLeft ? 'left' : 'right'] = child;
        } else Tree.root(child);
        sound('swap');
        const dx = node.x - child.x;
        const dy = child.y - node.y;
        cleanup(child, dx, dy);
        Tree.cleanup(child);
        return child;
    };

    async function* findNode(num, node) {
        await bgcolor(node.id, Colors.compare);
        yield delay;
        if (num === node.value) return node;
        const next = num <= node.value ? 'left' : 'right';
        await bgcolor(node.id, Colors.white);
        if (node[next]) {
            return yield* findNode(num, node[next]);
        }
    };

    async function* search(num, node) {
        await bgcolor(node.id, Colors.compare);
        yield delay;
        const next = num <= node.value ? 'left' : 'right';
        if (node[next]) {
            await bgcolor(node.id, Colors.white);
            return yield* search(num, node[next]);
        }
        return node;
    };

    return Object.freeze({
        ...Tree,
        _insert(num, node = Tree.root()) {
            if (!node) {
                sound('swap');
                return Tree.insert(num);
            }
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            return node[next]
                ? this._insert(num, node[next])
                : Tree.insert(num, node, isLeft);
        },
        async *insert(num) {
            if (!Tree.root()) {
                sound('pop');
                return Tree.insert(num);
            }
            const parent = yield* search(num, Tree.root());
            const isLeft = num <= parent.value;
            sound('pop');
            const node = Tree.insert(num, parent, isLeft);
            yield delay;
            await bgcolor(parent.id, Colors.white);
            return node;
        },
        async *deleteNode(num) {
            const node = yield* findNode(num, Tree.root());
            if (!node) {
              showError(`Node (${num}) does not exist.`);
              return;
            }
            animate(node.id, { opacity: 0 });
            sound('pop');
            const { left, right, parent } = node;
            if (!left && !right) {
                if (!parent) return Tree.root(null);
                parent[node.isLeft ? 'left' : 'right'] = null;
                animate(node.eid, { opacity: 0 });
                node.update({ deleted: true });
                return parent;
            } else {
                yield delay;
                if (left && right) {
                    return yield* replaceNode(node);
                }
                return removeNode(node, left || right);
            }
        },
    });
}

export default binarySearchTree;
