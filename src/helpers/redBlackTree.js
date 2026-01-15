import binarySearchTree from './binarySearchTree';
import { Colors } from '../common/constants';
import { sound } from '../common/utils';
import $ from 'jquery';

const delay = 500;
const dx = 40, dy = 60;

function redBlackTree(animator) {
    const Tree = binarySearchTree(animator);
    const { bgcolor, tx, txy, animate, cleanup } = animator;

    const rotateStep1 = (node, child) => {
        const { parent, isLeft, x, y, eid } = node;
        if (parent) {
            parent[isLeft ? 'left' : 'right'] = child;
        } else Tree.root(child);
        node.parent = child;
        node.update({ eid: child.eid, isLeft: !child.isLeft });
        child.parent = parent;
        child.update({ x, y, eid, isLeft });
        txy(child.id, x, y, 1);
    };

    const rotateStep2 = (node, child) => {
        if (child) {
            const { x: cx, y: cy } = child;
            const dx = cx - node.x;
            const dy = cy - node.y;
            txy(node.id, cx, cy, 1);
            tx(node.eid, cx + 25, 1);
            node.update({ x: cx, y: cy });
            Tree.append(node, 1);
            cleanup(child, dx, -dy, 1);
        } else {
            const x2 = node.x + (node.isLeft ? -dx : dx);
            const y2 = node.y + dy;
            txy(node.id, x2, y2, 1);
            tx(node.eid, x2 + 25, 1);
            node.update({ x: x2, y: y2 });
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

    function* rotateRight(node) {
        const { left, right } = node;
        let ll = left.left;
        let lx = dx, ly = dy;
        if (ll) {
            lx = left.x - ll.x;
            ly = ll.y - left.y;
        }
        sound('swap');
        rotateStep1(node, left);
        node.left = null;
        const lr = left.right;
        left.right = node;
        rotateStep2(node, right);
        if (lr) {
            const rlx = node.x - dx;
            lr.parent = node;
            lr.update({ isLeft: true });
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

    function* rotateLeft(node) {
        const { left, right } = node;
        let rr = right.right;
        let rx = dx, ry = dy;
        if (rr) {
            rx = right.x - rr.x;
            ry = rr.y - right.y;
        }
        sound('swap');
        rotateStep1(node, right);
        node.right = null;
        const rl = right.left;
        right.left = node;
        rotateStep2(node, left);
        if (rl) {
            const lrx = node.x + dx;
            rl.parent = node;
            rl.update({ isLeft: false });
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
        $(`#nodeBf${node.key}`).text(color);
        node.update({ color });
        animate(`#nodeBf${node.key}`, {
            backgroundColor: color === 'R' ? '#ff0000' : '#000',
            color: '#fff',
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
