import { Colors } from './constants';
import { Points } from './graph';

const dx = 40, dy = 60;

const nodeAngle = ({ x, parent, isLeft }) => {
    const dx = Math.abs(x - parent.x);
    const a = Math.atan2(dy, dx) * (180 / Math.PI);
    return [Math.hypot(dy, dx), isLeft ? -a : -(180 - a)];
};

const _findNode = (node, fn) => {
    if (node) {
        if (fn(node)) return node;
        const { left, right } = node;
        return _findNode(left, fn) || _findNode(right, fn);
    }
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
        node.key = arr.length;
        node.id = `#node${node.key}`;
        node.eid = `#edge${node.key - 1}`;
        arr.push(node);
        return node;
    };

    const append = (node, td = 0.3) => {
        const [width, rotate] = nodeAngle(node);
        animate(node.eid, { width }, { duration: td });
        animate(node.eid, { rotate }, { duration: td });
    };

    const shiftNode = (node, d, td) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(node.id, x2, td);
        tx(node.eid, x2 + 25, td);
        node.x = x2;
        shiftNode(node.left, d, td);
        shiftNode(node.right, d, td);
    };

    const shiftRoot = (node, d, fromLeft, td) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(node.id, x2, td);
        if (node.parent) tx(node.eid, x2 + 25, td);
        node.x = x2;
        if (onLeft && !fromLeft) shiftNode(node.left, d, td);
        if (!onLeft && fromLeft) shiftNode(node.right, d, td);
        if (node.left) append(node.left, td);
        if (node.right) append(node.right, td);
        // shift parent till root
        shiftRoot(node.parent, d, node.isLeft, td);
    };

    const cleanup = (node, td = 0.3) => {
        const closer = findNode((nx) => {
            if (nx.parent !== node.parent) {
                const d = Points.distance(node, nx);
                if (d < 33) return true;
            }
            return false;
        });
        if (closer) {
            const diff = node.isLeft ? closer.x - node.x : node.x - closer.x;
            const dx = diff + 60;
            node = closer.isLeft === onLeft ? node : closer;
            const rx = findSubroot(node.parent);
            shiftNode(rx, dx, td);
            shiftRoot(rx.parent, dx / 2, rx.isLeft, td);
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
            let temp = a.value;
            a.value = b.value;
            b.value = temp;
            temp = a.id;
            a.id = b.id;
            b.id = temp;
            return Promise.all([
                txy(a.id, a.x, a.y, 1),
                txy(b.id, b.x, b.y, 1),
            ]);
        },
        insert(value, parent, isLeft) {
            if (!root) {
                const el = document.getElementById('binaryTree');
                const rect = el.getBoundingClientRect();
                const x1 = rect.width / 2.5;
                const id = `#node${0}`;
                root = { value, id, key: 0, x: x1, y: 50 };
                txy(id, x1, 50);
                animate(id, { opacity: 1 });
                arr.push(root);
                return root;
            }
            const node = createNode({ value, parent, isLeft });
            setNodePath(node);
            cleanup(node);
            txy(node.id, node.x, node.y);
            txy(node.eid, node.x + 25, node.y + 20);
            append(node);
            animate(node.id, { opacity: 1 });
            bgcolor(node.eid, Colors.stroke);
            return node;
        },
        root(node) {
            if (node !== undefined) root = node;
            return root;
        },
    });
}

export default binaryTree;
