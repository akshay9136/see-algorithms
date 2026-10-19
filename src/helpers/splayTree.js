import searchTree from '../common/searchTree';
import { showError, sound } from '../common/utils';
import { Colors } from '../common/constants';

const delay = 500;

function splayTree(animator) {
    const Tree = searchTree(animator);
    const { bgcolor, animate, cleanup } = animator;

    function* rotateRight(node) {
        Tree.rotateRight(node.refresh());
        yield delay * 2;
    }

    function* rotateLeft(node) {
        Tree.rotateLeft(node.refresh());
        yield delay * 2;
    }

    async function* splayNode(node) {
        if (!node) return;

        while (node.parent) {
            const parent = node.parent;
            const pop = parent.parent;
            if (!pop) {
                // Zig or Zag
                if (node.isLeft) {
                    yield* rotateRight(parent);
                } else {
                    yield* rotateLeft(parent);
                }
            } else {
                if (node.isLeft && parent.isLeft) {
                    // Zig-Zig
                    yield* rotateRight(pop);
                    yield* rotateRight(parent);
                } else if (!node.isLeft && !parent.isLeft) {
                    // Zag-Zag
                    yield* rotateLeft(pop);
                    yield* rotateLeft(parent);
                } else if (node.isLeft && !parent.isLeft) {
                    // Zig-Zag
                    yield* rotateRight(parent);
                    yield* rotateLeft(pop);
                } else {
                    // Zag-Zig
                    yield* rotateLeft(parent);
                    yield* rotateRight(pop);
                }
            }
            node = node.refresh();
        }
        yield delay;
        await bgcolor(node.id, Colors.white);
    }

    const promoteRoot = (node, x, y) => {
        node.parent = null;
        Tree.root(node);
        cleanup(node, x - node.x, node.y - y);
        Tree.cleanup(node.refresh());
        sound('swap');
    };

    async function* largest() {
        let next = Tree.root();
        while (next.right) {
            await bgcolor(next.id, Colors.compare);
            yield delay;
            await bgcolor(next.id, Colors.white);
            next = next.right;
        }
        await bgcolor(next.id, Colors.compare);
        return next;
    }

    return Object.freeze({
        ...Tree,

        async *insert(num) {
            const node = yield* Tree.insert(num);
            yield delay;
            await bgcolor(node.id, Colors.compare);
            yield delay;
            yield* splayNode(node);
        },

        async *search(num) {
            const node = yield* Tree.findNode(num);
            if (node.value !== num) {
                showError(`Node (${num}) not found.`);
            } else {
                await bgcolor(node.id, Colors.sorted);
            }
            yield delay;
            yield* splayNode(node);
            return node.refresh();
        },

        async *deleteNode(num) {
            const node = yield* this.search(num);
            if (node.value !== num) return node;
            sound('pop');
            const { left, right, x, y } = node;
            node.left = null;
            node.right = null;
            node.update({ deleted: true });
            if (left) {
                left.parent = null;
                animate(left.eid, { opacity: 0 });
            }
            if (right) {
                right.parent = null;
                animate(right.eid, { opacity: 0 });
            }
            animate(node.id, { opacity: 0 });
            yield delay * 2;
            if (!left) {
                right ? promoteRoot(right, x, y) : Tree.root(null);
                yield delay;
                return Tree.root();
            }
            promoteRoot(left, x, y);
            yield delay * 2;
            const target = yield* largest();
            yield delay;
            yield* splayNode(target);
            yield delay;
            const root = Tree.root();
            if (right) {
                // The largest key on the left has no right child, so the
                // entire right subtree can be joined without changing order.
                const subtree = right.refresh();
                root.right = subtree;
                subtree.parent = root;
                subtree.update({ isLeft: false });
                cleanup(
                    subtree,
                    root.x + 40 - subtree.x,
                    subtree.y - root.y - 60,
                );
                sound('pop');
                const child = right.refresh();
                animate(child.eid, { opacity: 1 });
                Tree.append(child);
                Tree.cleanup(root);
                yield delay;
            }
            return root.refresh();
        },
    });
}

export default splayTree;
