import binaryTree from '@/common/binaryTree';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import $ from 'jquery';

const delay = 1000;

function huffmanTree(animator) {
    const Tree = binaryTree(animator);
    const { animate, ty, bgcolor } = animator;
    const steps = [], coding = {};
    let maxLevel = 0;

    const renderTree = (_node, parent, isLeft) => {
        if (_node) {
            const { value, char, left, right } = _node;
            const node = Tree.insert(value, parent, isLeft);
            animate(node.id, { opacity: 0 });
            if (parent) {
                $(node.eid).css('opacity', 0);
                const data = (parent.data || '') + (isLeft ? '0' : '1');
                node.update({ data, level: parent.level + 1 });
                if (node.level > maxLevel) maxLevel++;
            } else {
                node.update({ level: 0 });
            }
            if (!left && !right) {
                bgcolor(node.id, Colors.enqueue);
                coding[char] = node.data;
                $(`#nodeBf${node.key}`).text(char);
            } else {
                steps[_node.step] = node;
            }
            renderTree(left, node, true);
            renderTree(right, node);
        }
    };

    const levelDown = (level) => {
        for (let i = 0; Tree.node(i); i++) {
            const node = Tree.node(i);
            node.update({ y: node.y + level * 60 });
            ty(node.id, node.y);
            if (node.parent) ty(node.eid, node.y + 20);
        }
    };

    const isParent = (node) => !!(node.left || node.right);

    async function* renderSteps(root) {
        renderTree(root);
        levelDown(-maxLevel);
        steps.reverse();
        for (const node of steps) {
            const { left, right } = node;
            if (!isParent(left) || !isParent(right)) {
                animate(left.id, { opacity: 1 });
                animate(right.id, { opacity: 1 });
                yield delay;
            }
            if (node.level < maxLevel) {
                levelDown(1);
                maxLevel--;
            }
            sound('pop');
            await animate(node.id, { opacity: 1 });
            animate(left.eid, { opacity: 1 });
            animate(right.eid, { opacity: 1 });
            yield delay;
        }
    }

    return { renderSteps, coding };
}

export default huffmanTree;
