import binarySearchTree from './binarySearchTree';
import { Colors } from '../common/constants';
import { sound } from '../common/utils';
import $ from 'jquery';

const delay = 500;
const dx = 40, dy = 60;

function bianryAvlTree(animator, setCurrentStep) {
    const Tree = binarySearchTree(animator);
    const { bgcolor, tx, txy, cleanup } = animator;

    const height = (node) => (node ? node.height : -1);

    const balanceFactor = (node) => {
        return height(node.left) - height(node.right);
    };

    const updateHeight = (node) => {
        const h = 1 + Math.max(height(node.left), height(node.right));
        node.update({ height: h });
        $(`#nodeBf${node.key}`).text(balanceFactor(node));
    };

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
        updateHeight(node);
        updateHeight(left);
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
        updateHeight(node);
        updateHeight(right);
        yield delay;
    }

    async function* rebalance(node) {
        if (!node) return;
        bgcolor(node.id, Colors.compare);
        setCurrentStep('1,2');
        yield delay;
        updateHeight(node);
        yield delay;
        const nodeBf = balanceFactor(node);
        if (nodeBf > 1) {
            const childBf = balanceFactor(node.left);
            if (childBf > 0) {
                setCurrentStep('5');
                yield* rotateRight(node);
            } else {
                setCurrentStep('7');
                yield* rotateLeft(node.left);
                setCurrentStep('8');
                yield* rotateRight(node);
            }
        } else if (nodeBf < -1) {
            const childBf = balanceFactor(node.right);
            if (childBf < 0) {
                setCurrentStep('11');
                yield* rotateLeft(node);
            } else {
                setCurrentStep('13');
                yield* rotateRight(node.right);
                setCurrentStep('14');
                yield* rotateLeft(node);
            }
        }
        setCurrentStep('');
        await bgcolor(node.id, Colors.white);
        yield delay;
        yield* rebalance(node.parent);
    }

    const backtrack = (node) => {
        if (node) {
            updateHeight(node);
            backtrack(node.parent);
        }
    };

    return Object.freeze({
        ...Tree,
        _insert(num, _node) {
            const node = Tree._insert(num, _node);
            backtrack(node);
        },
        async *insert(num) {
            const node = yield* Tree.insert(num);
            node.update({ height: 0 });
            $(`#nodeBf${node.key}`).text(0);
            yield delay * 2;
            yield* rebalance(node.parent);
        },
        async *deleteNode(num) {
            const affected = yield* Tree.deleteNode(num);
            yield delay * 2;
            yield* rebalance(affected);
        },
    });
}

export default bianryAvlTree;
