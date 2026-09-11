import binarySearchTree from './searchTree';
import { Colors } from '../common/constants';

const delay = 500;

function redBlackTree(animator) {
    const Tree = binarySearchTree(animator);
    const { bgcolor, scope } = animator;

    function* rotateRight(node) {
        const left = node.left;
        Tree.rotateRight(node);
        yield delay * 2;
        updateColor(node, 'R');
        updateColor(left, 'B');
        yield delay;
    }

    function* rotateLeft(node) {
        const right = node.right;
        Tree.rotateLeft(node);
        yield delay * 2;
        updateColor(node, 'R');
        updateColor(right, 'B');
        yield delay;
    }

    async function* rebalance(node) {
        if (!node) return;
        const parent = node.parent;
        if (node.color === 'R' && parent.color === 'R') {
            yield delay;
            await bgcolor(node.id, Colors.compare);
            const pop = parent.parent;
            const uncle = pop[parent.isLeft ? 'right' : 'left'];
            yield delay;
            if (!uncle || uncle.color === 'B') {
                if (parent.isLeft) {
                    if (node.isLeft) {
                        yield* rotateRight(pop);
                    } else {
                        yield* rotateLeft(parent);
                        yield* rotateRight(pop);
                    }
                } else {
                    if (node.isLeft) {
                        yield* rotateRight(parent);
                        yield* rotateLeft(pop);
                    } else {
                        yield* rotateLeft(pop);
                    }
                }
                await bgcolor(node.id, Colors.white);
            } else {
                updateColor(parent, 'B');
                updateColor(uncle, 'B');
                yield delay;
                if (pop.parent) {
                    updateColor(pop, 'R');
                    yield delay;
                }
                await bgcolor(node.id, Colors.white);
                yield* rebalance(pop);
            }
        }
    }

    const updateColor = (node, color) => {
        const tagId = node.id.replace('.node', '.tag');
        const element = scope.current.querySelector(tagId);
        if (element) {
            element.textContent = color;
            element.style.color = Colors.white;
            element.style.backgroundColor =
              color === 'R' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';
        }
        node.update({ color });
    };

    const findNodeSilent = (num) => {
        let node = Tree.root();
        while (node) {
            if (num === node.value) return node;
            node = num < node.value ? node.left : node.right;
        }
        return null;
    };

    const findSuccessor = (node) => {
        let curr = node.right;
        while (curr && curr.left) curr = curr.left;
        return curr;
    };

    async function* deleteFixup(node, dbIsLeft) {
        while (node) {
            let sibling = node[dbIsLeft ? 'right' : 'left'];
            if (!sibling) break;

            // Case 1: Sibling is red
            if (sibling.color === 'R') {
                await bgcolor(sibling.id, Colors.compare);
                yield delay;
                updateColor(node, 'R');
                updateColor(sibling, 'B');
                yield delay;
                if (dbIsLeft) Tree.rotateLeft(node);
                else Tree.rotateRight(node);
                yield delay * 2;
                await bgcolor(sibling.id, Colors.white);
                sibling = node[dbIsLeft ? 'right' : 'left'];
                if (!sibling) break;
            }

            // Sibling is black — highlight it
            await bgcolor(sibling.id, Colors.compare);
            yield delay;

            const nearChild = sibling[dbIsLeft ? 'left' : 'right'];
            const farChild = sibling[dbIsLeft ? 'right' : 'left'];
            const nearIsBlack = !nearChild || nearChild.color === 'B';
            const farIsBlack = !farChild || farChild.color === 'B';

            if (nearIsBlack && farIsBlack) {
                // Case 2: Both children of sibling are black
                updateColor(sibling, 'R');
                await bgcolor(sibling.id, Colors.white);
                yield delay;
                if (node.color === 'R') {
                    updateColor(node, 'B');
                    yield delay;
                    break;
                }
                if (!node.parent) break;
                dbIsLeft = node.isLeft;
                node = node.parent;
                continue;
            }

            if (farIsBlack) {
                // Case 3: Near child is red, far child is black
                updateColor(nearChild, 'B');
                updateColor(sibling, 'R');
                yield delay;
                if (dbIsLeft) Tree.rotateRight(sibling);
                else Tree.rotateLeft(sibling);
                yield delay * 2;
                await bgcolor(sibling.id, Colors.white);
                sibling = node[dbIsLeft ? 'right' : 'left'];
                await bgcolor(sibling.id, Colors.compare);
                yield delay;
            }

            // Case 4: Far child is red
            const newFarChild = sibling[dbIsLeft ? 'right' : 'left'];
            updateColor(sibling, node.color);
            updateColor(node, 'B');
            if (newFarChild) updateColor(newFarChild, 'B');
            yield delay;
            await bgcolor(sibling.id, Colors.white);
            if (dbIsLeft) Tree.rotateLeft(node);
            else Tree.rotateRight(node);
            yield delay * 2;
            break;
        }

        // Ensure root is always black
        const root = Tree.root();
        if (root && root.color === 'R') {
            updateColor(root, 'B');
            yield delay;
        }
    }

    return Object.freeze({
        ...Tree,

        _insert(num, color) {
            const node = Tree._insert(num);
            updateColor(node, color);
        },

        async *insert(num) {
            const node = yield* Tree.insert(num);
            updateColor(node, node.parent ? 'R' : 'B');
            yield delay;
            yield* rebalance(node);
        },

        async *deleteNode(num) {
            const target = findNodeSilent(num);
            if (!target) {
                yield* Tree.deleteNode(num);
                return;
            }

            const hasTwoChild = Boolean(target.left && target.right);
            const physicalNode = hasTwoChild ? findSuccessor(target) : target;

            // Save state of the physically removed node before BST deletion mutates the tree
            const deletedColor = physicalNode.color;
            const hasChild = Boolean(physicalNode.left || physicalNode.right);
            const wasLeft = physicalNode.isLeft;

            const affected = yield* Tree.deleteNode(num);
            if (!affected) return;

            yield delay;

            // After two-children deletion, the successor's DOM element
            // at the target position still shows its old color tag.
            // Sync it with the color inherited from the deleted node.
            if (hasTwoChild) {
                const replacement = target.refresh();
                updateColor(replacement, replacement.color);
                yield delay;
            }

            // Deleting a red node preserves all Red-Black properties
            if (deletedColor === 'R') return affected;

            // Black node deletion requires rebalancing / recoloring
            if (hasChild) {
                // Affected child must be red — recolor to black
                await bgcolor(affected.id, Colors.compare);
                yield delay;
                updateColor(affected, 'B');
                await bgcolor(affected.id, Colors.white);
            } else {
                // Black leaf removed — double-black fixup needed
                yield* deleteFixup(affected, wasLeft);
            }

            return affected;
        },
    });
}

export default redBlackTree;
