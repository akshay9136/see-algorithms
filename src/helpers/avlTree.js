import binaryTree from '@/common/binaryTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

const delay = 500;
const dx = 40, dy = 60;

function avlTree(animator) {
    const Tree = binaryTree(animator);
    const { bgcolor, tx, txy } = animator;

    const height = (node) => (node ? node.height : -1);

    const balanceFactor = (node) => height(node.left) - height(node.right);

    const updateHeight = (node) => {
        node.height = 1 + Math.max(height(node.left), height(node.right));
        $(`#nodeBf${node.index}`).text(balanceFactor(node));
    };

    const smallest = async (node) => {
        await bgcolor(`#node${node.index}`, Colors.compare);
        await sleep(delay);
        await bgcolor(`#node${node.index}`, Colors.white);
        if (!node.left) return node;
        return smallest(node.left);
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

    const rotateLeft = async (node) => {
        const { left, right, parent, key } = node;
        if (!parent) Tree.root(left);
        let lx = dx, ly = dy;
        if (left.left) {
            lx = left.x - left.left.x;
            ly = left.left.y - left.y;
        }
        left.x = node.x;
        left.y = node.y;
        txy(`#node${left.index}`, left.x, left.y, 1);
        left.parent = parent;
        left.isLeft = node.isLeft;
        node.parent = left;
        node.left = null;
        node.key = left.key;
        left.key = key;
        if (parent) {
            if (node.isLeft) parent.left = left;
            else parent.right = left;
        }
        const lr = left.right;
        left.right = node;
        node.isLeft = false;
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
            node.x = node.x + dx;
            node.y = node.y + dy;
            Tree.cleanup(node);
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
        }
        if (lr) {
            lr.x = node.x - dx;
            tx(`#node${lr.index}`, lr.x, 1);
            tx(`#edge${lr.key - 1}`, lr.x + 25, 1);
            lr.parent = node;
            lr.isLeft = true;
            node.left = lr;
            Tree.append(lr, 1);
        }
        cleanup(left.left, lx, ly);
        updateHeight(node);
        updateHeight(left);
    };

    const rotateRight = async (node) => {
        const { left, right, parent, key } = node;
        if (!parent) Tree.root(right);
        let rx = dx, ry = dy;
        if (right.right) {
            rx = right.x - right.right.x;
            ry = right.right.y - right.y;
        }
        right.x = node.x;
        right.y = node.y;
        txy(`#node${right.index}`, right.x, right.y, 1);
        right.parent = parent;
        right.isLeft = node.isLeft
        node.parent = right;
        node.right = null;
        node.key = right.key;
        right.key = key;
        if (parent) {
            if (node.isLeft) parent.left = right;
            else parent.right = right;
        }
        const rl = right.left;
        right.left = node;
        node.isLeft = true;
        if (left) {
            const dx = left.x - node.x;
            const dy = left.y - node.y;
            node.x = left.x;
            node.y = left.y;
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
            cleanup(left, dx, -dy);
        } else {
            node.x = node.x - dx;
            node.y = node.y + dy;
            Tree.cleanup(node);
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
        }
        if (rl) {
            rl.x = node.x + dx;
            tx(`#node${rl.index}`, rl.x, 1);
            tx(`#edge${rl.key - 1}`, rl.x + 25, 1);
            rl.parent = node;
            rl.isLeft = false;
            node.right = rl;
            Tree.append(rl, 1);
        }
        cleanup(right.right, rx, ry);
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

    const findNode = async (num, node) => {
        await bgcolor(`#node${node.index}`, Colors.compare);
        await sleep(delay);
        await bgcolor(`#node${node.index}`, Colors.white);
        if (num === node.value) return node;
        const next = num < node.value ? 'left' : 'right';
        if (node[next]) {
            return findNode(num, node[next]);
        }
    };

    const backtrack = (node) => {
        if (node) {
            updateHeight(node);
            backtrack(node.parent);
        }
    }

    return Object.freeze({
        ...Tree,
        _insert(num, node) {
            if (Tree.root()) {
                node = node || Tree.root();
            } else {
                Tree.insert(num);
                $(`#nodeBf${0}`).text(0);
                return;
            }
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
                const child = Tree.insert(num, node, isLeft);
                child.height = 0;
                backtrack(child);
            } else {
                this._insert(num, node[next]);
            }
        },
        async insert(num, node) {
            if (Tree.root()) {
                node = node || Tree.root();
            } else {
                sound('swap');
                await Tree.insert(num);
                $(`#nodeBf${0}`).text(0);
                return;
            }
            await bgcolor(`#node${node.index}`, Colors.compare);
            await sleep(delay);
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
                sound('swap');
                const child = Tree.insert(num, node, isLeft);
                child.height = 0;
                $(`#nodeBf${child.index}`).text(0);
                await sleep(delay);
                await bgcolor(`#node${node.index}`, Colors.white);
                await sleep(delay);
                await rebalance(child.parent);
            } else {
                await bgcolor(`#node${node.index}`, Colors.white);
                await this.insert(num, node[next]);
            }
        },
    });
}

export default avlTree;
