import binarySearchTree from './binarySearchTree';
import { Colors } from '../common/constants';
import $ from 'jquery';

const delay = 500;

function bianryAvlTree(animator, setCurrentStep) {
    const Tree = binarySearchTree(animator);
    const { bgcolor } = animator;

    const height = (node) => (node ? node.height : -1);

    const balanceFactor = (node) => {
        return height(node.left) - height(node.right);
    };

    const updateHeight = (node) => {
        const h = 1 + Math.max(height(node.left), height(node.right));
        node.update({ height: h });
        $(`#nodeBf${node.key}`).text(balanceFactor(node));
    };

    function* rotateRight(node) {
        const left = node.left;
        Tree.rotateRight(node);
        yield delay * 2;
        updateHeight(node);
        updateHeight(left);
        yield delay;
    }

    function* rotateLeft(node) {
        const right = node.right;
        Tree.rotateLeft(node);
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
