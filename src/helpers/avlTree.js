import binarySearchTree from './binarySearchTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

const delay = 500;
const dx = 40, dy = 60;

function avlTree(animator, setCurrentStep) {
    const Tree = binarySearchTree(animator);
    const { bgcolor, tx, txy, cleanup } = animator;

    const height = (node) => (node ? node.height : -1);

    const balanceFactor = (node) => {
        return height(node.left) - height(node.right);
    };

    const updateHeight = (node) => {
        node.height = 1 + Math.max(height(node.left), height(node.right));
        $(`#nodeBf${node.key}`).text(balanceFactor(node));
    };

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

    const rotateLeft = async (node) => {
        const { left, right } = node;
        let ll = left.left;
        let lx = dx, ly = dy;
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
        updateHeight(node);
        updateHeight(left);
        await sleep(delay * 3);
    };

    const rotateRight = async (node) => {
        const { left, right } = node;
        let rr = right.right;
        let rx = dx, ry = dy;
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
        updateHeight(node);
        updateHeight(right);
        await sleep(delay * 3);
    };

    const rebalance = async (node) => {
        if (!node) return;
        bgcolor(node.id, Colors.compare);
        setCurrentStep('1,2');
        await sleep(delay);
        updateHeight(node);
        await sleep(delay);
        let nodeBf = balanceFactor(node);
        if (nodeBf > 1) {
            const childBf = balanceFactor(node.left);
            if (childBf > 0) {
                setCurrentStep('5');
                await rotateLeft(node);
            } else {
                setCurrentStep('7');
                await rotateRight(node.left);
                setCurrentStep('8');
                await rotateLeft(node);
            }
        } else if (nodeBf < -1) {
            const childBf = balanceFactor(node.right);
            if (childBf < 0) {
                setCurrentStep('11');
                await rotateRight(node);
            } else {
                setCurrentStep('13');
                await rotateLeft(node.right);
                setCurrentStep('14');
                await rotateRight(node);
            }
        }
        await bgcolor(node.id, Colors.white);
        setCurrentStep('');
        await sleep(delay);
        await rebalance(node.parent);
    };

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
            node.height = 0;
            backtrack(node);
        },
        async insert(num) {
            const node = await Tree.insert(num);
            node.height = 0;
            $(`#nodeBf${node.key}`).text(0);
            await sleep(delay * 2);
            await rebalance(node.parent);
        },
        async deleteNode(num) {
            const affected = await Tree.deleteNode(num);
            await sleep(delay * 2);
            await rebalance(affected);
        },
    });
}

export default avlTree;
