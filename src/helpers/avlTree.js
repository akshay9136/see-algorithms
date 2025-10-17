import binaryTree from '@/common/binaryTree';
import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

const delay = 500;

function avlTree(animator) {
    const Tree = binaryTree(animator);
    const { bgcolor, tx, txy, animate } = animator;

    const height = (node) => (node ? node.height : -1);

    const updateHeight = (node) => {
        node.height = 1 + Math.max(height(node.left), height(node.right));
    };

    const getBalanceFactor = (node) => height(node.left) - height(node.right);

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

    const rotateLeft = (node) => {
        const { left, right, parent } = node;
        const ll = left.left;
        const dx = left.x - ll.x;
        const dy = ll.y - left.y;
        left.x = node.x;
        left.y = node.y;
        txy(`#node${left.index}`, left.x, left.y, 1);
        left.parent = parent;
        node.parent = left;
        node.isLeft = false;
        if (parent) parent.left = left;
        if (right) {
            const dx = right.x - node.x;
            const dy = right.y - node.y;
            node.x = right.x;
            node.y = right.y;
            node.key = left.key;
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
            cleanup(right, dx, -dy);
        } else {
            node.x = node.x + dx;
            node.y = node.y + dy;
            node.key = left.key;
            txy(`#node${node.index}`, node.x, node.y, 1);
            tx(`#edge${node.key - 1}`, node.x + 25, 1);
            Tree.append(node, 1);
        }
        if (left.right) {
            let lr = left.right;
            lr.x = node.x - 40;
            tx(`#node${lr.index}`, lr.x);
            tx(`#edge${lr.key - 1}`, lr.x + 25);
            lr.parent = node;
            lr.isLeft = true;
            node.left = lr;
            Tree.append(lr, 1);
        }
        cleanup(ll, dx, dy);
    };

    const rotateRight = (node) => {
        // To do
    };

    const rebalance = async (node) => {
        if (!node) return;
        await bgcolor(`#node${node.index}`, Colors.compare);
        await sleep(delay);
        updateHeight(node);
        const nodeBf = getBalanceFactor(node);
        $(`#nodeBf${node.index} `).text(nodeBf);
        await sleep(delay);
        let rotated = false;

        if (nodeBf > 1) {
            const childBf = getBalanceFactor(node.left);
            if (childBf > 0) {
                console.log('LL');
                rotateLeft(node);
            } else {
                console.log('RL');
                rotateRight(node.left);
                await sleep(delay);
                rotateLeft(node);
            }
            rotated = true;
        } else if (nodeBf < -1) {
            const childBf = getBalanceFactor(node.right);
            if (childBf < 0) {
                rotateRight(node);
            } else {
                rotateLeft(node.right);
                await sleep(delay);
                rotateRight(node);
            }
            rotated = true;
        }
        if (rotated) await sleep(delay);
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

    return Object.freeze({
        ...Tree,
        _insert(num, node) {
            if (Tree.root()) {
                node = node || Tree.root();
            } else {
                return Tree.insert(num);
            }
            const isLeft = num <= node.value;
            const next = isLeft ? 'left' : 'right';
            if (!node[next]) {
                Tree.insert(num, node, isLeft);
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
