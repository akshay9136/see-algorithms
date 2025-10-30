import binarySearchTree from './binarySearchTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

const delay = 500;
const dx = 40, dy = 60;

function avlTree(animator) {
    const Tree = binarySearchTree(animator);
    const { bgcolor, tx, txy } = animator;

    const height = (node) => (node ? node.height : -1);

    const balanceFactor = (node) => {
        return height(node.left) - height(node.right);
    };

    const updateHeight = (node) => {
        node.height = 1 + Math.max(height(node.left), height(node.right));
        $(`#nodeBf${node.index}`).text(balanceFactor(node));
    };

    const cleanup = (node, dx, dy) => {
        if (node) {
            node.x = node.x + dx;
            node.y = node.y - dy;
            Tree.cleanup(node);
            txy(`#node${node.index}`, node.x, node.y, 1);
            if (node.parent) {
                const ex = node.x + 25;
                const ey = node.y + 20;
                txy(`#edge${node.key - 1}`, ex, ey, 1);
            }
            cleanup(node.left, dx, dy);
            cleanup(node.right, dx, dy);
        }
    };

    const rotateStep1 = (node, left) => {
        const { parent, isLeft, key } = node;
        if (parent) {
            parent[isLeft ? 'left' : 'right'] = left;
        } else Tree.root(left);
        left.x = node.x;
        left.y = node.y;
        txy(`#node${left.index}`, left.x, left.y, 1);
        left.parent = parent;
        left.isLeft = isLeft;
        node.parent = left;
        node.key = left.key;
        left.key = key;
    };

    const rotateStep2 = (node, right) => {
        if (right) {
            const dx = right.x - node.x;
            const dy = right.y - node.y;
            node.x = right.x;
            node.y = right.y;
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
            cleanup(right, dx, -dy);
        } else {
            node.x = node.x + (node.isLeft ? -dx : dx);
            node.y = node.y + dy;
            Tree.cleanup(node);
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
        }
    }
    
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
            lr.x = node.x - dx;
            tx(`#node${lr.index}`, lr.x, 1);
            tx(`#edge${lr.key - 1}`, lr.x + 25, 1);
            lr.parent = node;
            lr.isLeft = true;
            node.left = lr;
            Tree.append(lr, 1);
        }
        cleanup(ll, lx, ly);
        updateHeight(node);
        updateHeight(left);
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
            rl.x = node.x + dx;
            tx(`#node${rl.index}`, rl.x, 1);
            tx(`#edge${rl.key - 1}`, rl.x + 25, 1);
            rl.parent = node;
            rl.isLeft = false;
            node.right = rl;
            Tree.append(rl, 1);
        }
        cleanup(rr, rx, ry);
        updateHeight(node);
        updateHeight(right);
    };

    const rebalance = async (node) => {
        if (!node) return;
        await bgcolor(`#node${node.index}`, Colors.compare);
        await sleep(delay);
        updateHeight(node);
        let nodeBf = balanceFactor(node);
        if (nodeBf > 1) {
            await sleep(delay);
            const childBf = balanceFactor(node.left);
            if (childBf > 0) {
                rotateLeft(node);
            } else {
                rotateRight(node.left);
                await sleep(delay * 2);
                rotateLeft(node);
            }
        } else if (nodeBf < -1) {
            await sleep(delay);
            const childBf = balanceFactor(node.right);
            if (childBf < 0) {
                rotateRight(node);
            } else {
                rotateLeft(node.right);
                await sleep(delay * 2);
                rotateRight(node);
            }
        }
        await sleep(delay);
        await bgcolor(`#node${node.index}`, Colors.white);
        await sleep(delay);
        await rebalance(node.parent);
    };

    const backtrack = (node) => {
        if (node) {
            updateHeight(node);
            backtrack(node.parent);
        }
    }

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
            $(`#nodeBf${node.index}`).text(0);
            await sleep(delay * 2);
            await rebalance(node.parent);
        },
        async deleteNode(num) {
            const affected = await Tree.deleteNode(num);
            await sleep(delay * 2);
            await rebalance(affected);
        }
    });
}

export default avlTree;
