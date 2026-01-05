import binarySearchTree from './binarySearchTree';
import { Colors } from '../common/constants';
import { sound } from '../common/utils';
import $ from 'jquery';

const delay = 500;
const dx = 40, dy = 60;

function redBlackTree(animator) {
    const Tree = binarySearchTree(animator);
    const { bgcolor, tx, txy, animate, cleanup } = animator;

    const rotateStep1 = (node, left) => {
        const { parent, isLeft, eid } = node;
        if (parent) {
            parent[isLeft ? 'left' : 'right'] = left;
        } else Tree.root(left);
        left.x = node.x;
        left.y = node.y;
        txy(left.id, left.x, left.y, 1);
        left.parent = parent;
        left.isLeft = isLeft;
        node.parent = left;
        node.eid = left.eid;
        left.eid = eid;
    };

    const rotateStep2 = (node, right) => {
        if (right) {
            const dx = right.x - node.x;
            const dy = right.y - node.y;
            node.x = right.x;
            node.y = right.y;
            txy(node.id, node.x, node.y, 1);
            tx(node.eid, node.x + 25, 1);
            Tree.append(node, 1);
            cleanup(right, dx, -dy, 1);
        } else {
            node.x = node.x + (node.isLeft ? -dx : dx);
            node.y = node.y + dy;
            txy(node.id, node.x, node.y, 1);
            tx(node.eid, node.x + 25, 1);
            Tree.cleanup(node, 1);
            Tree.append(node, 1);
        }
    };

    const postCleanup = (node) => {
        if (node) {
            Tree.cleanup(node, 1);
            postCleanup(node.left);
            postCleanup(node.right);
        }
    };

    function* rotateLeft(node) {
        const { left, right } = node;
        let ll = left.left;
        let lx = dx,
            ly = dy;
        if (ll) {
            lx = left.x - ll.x;
            ly = ll.y - left.y;
        }
        sound('swap');
        rotateStep1(node, left);
        node.isLeft = false;
        node.left = null;
        const lr = left.right;
        left.right = node;
        rotateStep2(node, right);
        if (lr) {
            const rlx = node.x - dx;
            lr.parent = node;
            lr.isLeft = true;
            node.left = lr;
            cleanup(lr, rlx - lr.x, 0, 1);
            Tree.append(lr, 1);
            postCleanup(lr);
        }
        cleanup(ll, lx, ly, 1);
        if (ll) Tree.append(ll, 1);
        postCleanup(ll);
        yield delay * 2;
        updateColor(node, 'R');
        updateColor(left, 'B');
        yield delay;
    }

    function* rotateRight(node) {
        const { left, right } = node;
        let rr = right.right;
        let rx = dx,
            ry = dy;
        if (rr) {
            rx = right.x - rr.x;
            ry = rr.y - right.y;
        }
        sound('swap');
        rotateStep1(node, right);
        node.isLeft = true;
        node.right = null;
        const rl = right.left;
        right.left = node;
        rotateStep2(node, left);
        if (rl) {
            const lrx = node.x + dx;
            rl.parent = node;
            rl.isLeft = false;
            node.right = rl;
            cleanup(rl, lrx - rl.x, 0, 1);
            Tree.append(rl, 1);
            postCleanup(rl);
        }
        cleanup(rr, rx, ry, 1);
        if (rr) Tree.append(rr, 1);
        postCleanup(rr);
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
                        yield* rotateLeft(pop);
                    } else {
                        yield* rotateRight(parent);
                        yield* rotateLeft(pop);
                    }
                } else {
                    if (node.isLeft) {
                        yield* rotateLeft(parent);
                        yield* rotateRight(pop);
                    } else {
                        yield* rotateRight(pop);
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
        $(`#nodeBf${node.key}`).text(color);
        node.color = color;
        animate(`#nodeBf${node.key}`, {
            backgroundColor: color === 'R' ? '#ff0000' : '#000',
            color: 'white',
        });
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
