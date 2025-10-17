import { Colors } from './constants';
import { Point } from './graph';

const dx = 40, dy = 60;

const nodeAngle = ({ x, parent, isLeft }) => {
    const dx = Math.abs(x - parent.x);
    const a = Math.atan2(dy, dx) * (180 / Math.PI);
    return [Math.hypot(dy, dx), isLeft ? -a : -(180 - a)];
};

const _findNode = (node, fn) => {
    if (!node) return;
    if (fn(node)) return node;
    return _findNode(node.left, fn) || _findNode(node.right, fn);
};

function binaryTree({ tx, txy, bgcolor, animate }) {
    var root, onLeft;
    var arr = [];

    const findNode = (fn) => _findNode(root, fn);

    const createNode = (node) => {
        const p = node.parent;
        if (node.isLeft) {
            p.left = node;
            node.x = p.x - dx;
        } else {
            p.right = node;
            node.x = p.x + dx;
        }
        node.y = p.y + dy;
        node.index = arr.length;
        node.key = arr.length;
        arr.push(node);
        return node;
    };

    const append = (node, t = 0) => {
        const [width, rotate] = nodeAngle(node);
        const ei = node.key - 1;
        animate(`#edge${ei}`, { width }, { duration: t });
        animate(`#edge${ei}`, { rotate }, { duration: t });
    };

    const shiftNode = (node, d, isSubroot = false) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(`#node${node.index}`, x2);
        tx(`#edge${node.key - 1}`, x2 + 25);
        node.x = x2;
        if (isSubroot) append(node);
        shiftNode(node.left, d);
        shiftNode(node.right, d);
        cleanup(node);
    };

    const cleanup = (node) => {
        const closer = findNode((nx) => {
            if (nx.parent !== node.parent) {
                const d = Point.distance(node, nx);
                if (d < 30) return true;
            }
            return false;
        });
        if (closer) {
            const subroot = findSubroot(
                closer.isLeft === onLeft ? node.parent : closer.parent
            );
            shiftNode(subroot, 60, true);
        }
    };

    const findSubroot = (node) => {
        if (node.isLeft === onLeft) return node;
        return findSubroot(node.parent);
    };

    const setNodePath = (node) => {
        if (node.parent === root) {
            onLeft = node.isLeft;
            return;
        }
        setNodePath(node.parent);
    };

    return Object.freeze({
        node: (i) => arr[i],
        findNode,
        cleanup,
        append,
        swapNodes(a, b) {
            let tmp = a.value;
            a.value = b.value;
            b.value = tmp;
            tmp = a.index;
            a.index = b.index;
            b.index = tmp;
            return Promise.all([
                txy(`#node${a.index}`, a.x, a.y, 1),
                txy(`#node${b.index}`, b.x, b.y, 1),
            ]);
        },
        insert(value, parent, isLeft) {
            if (!root) {
                const [x, y] = [300, 50];
                root = { value, index: 0, key: 0, x, y };
                txy(`#node${0}`, x, y);
                animate(`#node${0}`, { opacity: 1 });
                arr.push(root);
                return root;
            }
            const node = createNode({ value, parent, isLeft });
            setNodePath(node);
            cleanup(node);
            txy(`#node${node.index}`, node.x, node.y);
            txy(`#edge${node.index - 1}`, node.x + 25, node.y + 20);
            append(node);
            animate(`#node${node.index}`, { opacity: 1 });
            bgcolor(`#edge${node.index - 1}`, Colors.stroke);
            return node;
        },
        root(node) {
            if (node !== undefined) root = node;
            return root;
        },
    });
}

export default binaryTree;
