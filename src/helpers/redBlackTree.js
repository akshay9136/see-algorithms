import binarySearchTree from './binarySearchTree';
import { Colors } from '../common/constants';
import $ from 'jquery';

const delay = 500;

function redBlackTree(animator) {
    const Tree = binarySearchTree(animator);
    const { bgcolor } = animator;

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
        $(`#nodeTag${node.key}`).text(color);
        $(`#nodeTag${node.key}`).css({
            backgroundColor: color === 'R' ? '#ff0000' : '#000',
            color: '#fff',
        });
        node.update({ color });
    };

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
            const affected = yield* Tree.deleteNode(num);
            yield delay;
            yield* rebalance(affected);
        },
    });
}

export default redBlackTree;
