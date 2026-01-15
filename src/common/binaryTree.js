import { Colors } from './constants';
import { Points } from './graph';

const dx = 40, dy = 60;

const nodeAngle = ({ x, parent, isLeft }) => {
    const dx = Math.abs(x - parent.x);
    const a = Math.atan2(dy, dx) * (180 / Math.PI);
    return [Math.hypot(dy, dx), isLeft ? -a : -(180 - a)];
};

function binaryTree({ tx, txy, bgcolor, animate }) {
    var root, onLeft;
    var arr = [];

    const Node = (key) => {
        if (!arr[key]) return null;
        return {
            ...arr[key],

            get left() {
                return Node(arr[key].left);
            },
            get right() {
                return Node(arr[key].right);
            },
            get parent() {
                return Node(arr[key].parent);
            },
            set left(c) {
                arr[key] = { ...arr[key], left: c?.key };
            },
            set right(c) {
                arr[key] = { ...arr[key], right: c?.key };
            },
            set parent(p) {
                arr[key] = { ...arr[key], parent: p?.key };
            },
            update(b) {
                arr[key] = { ...arr[key], ...b };
                Object.assign(this, b);
            },
            refresh() {
                return Node(key);
            },
        };
    };

    const append = (node, td = 0.3) => {
        const [width, rotate] = nodeAngle(node);
        animate(node.eid, { width }, { duration: td });
        animate(node.eid, { rotate }, { duration: td });
    };

    const findNode = (fn) => arr.map((a) => Node(a.key)).find(fn);

    const cleanup = (node, td = 0.3) => {
        const closer = findNode((a) => {
            if (a.key !== node.key && !a.deleted) {
                const d = Points.distance(node, a);
                if (d < 36) return true;
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

    const shiftNode = (node, d, td) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(node.id, x2, td);
        tx(node.eid, x2 + 25, td);
        node.update({ x: x2 });
        shiftNode(node.left, d, td);
        shiftNode(node.right, d, td);
    };

    const shiftRoot = (node, d, fromLeft, td) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(node.id, x2, td);
        node.update({ x: x2 });
        if (node.parent) tx(node.eid, x2 + 25, td);
        if (onLeft && !fromLeft) shiftNode(node.left, d, td);
        if (!onLeft && fromLeft) shiftNode(node.right, d, td);
        if (node.left) append(node.left, td);
        if (node.right) append(node.right, td);
        // shift parent till root
        shiftRoot(node.parent, d, node.isLeft, td);
    };

    const setNodePath = (node) => {
        if (node.parent.key === root) {
            onLeft = node.isLeft;
            return;
        }
        setNodePath(node.parent);
    };

    return Object.freeze({
        node: (i) => Node(i),
        findNode,
        cleanup,
        append,
        swapNodes(a, b) {
            const { id, value } = a;
            a.update({ id: b.id, value: b.value });
            b.update({ id, value });
            return Promise.all([
                txy(a.id, a.x, a.y, 1),
                txy(b.id, b.x, b.y, 1),
            ]);
        },
        insert(value, parent, isLeft) {
            if (!parent) {
                const div = document.getElementById('binaryTree');
                const rect = div.getBoundingClientRect();
                const x1 = rect.width / 2.5;
                const id = `#node${0}`;
                const node = { value, id, key: 0, x: x1, y: 50 };
                txy(id, x1, 50);
                animate(id, { opacity: 1 });
                arr.push(node);
                root = 0;
                return this.root();
            }
            const key = arr.length;
            const p = parent.refresh();
            arr.push({
                id: `#node${key}`,
                eid: `#edge${key - 1}`,
                key,
                value,
                isLeft,
                x: isLeft ? p.x - dx : p.x + dx,
                y: p.y + dy,
            });
            const node = Node(key);
            if (isLeft) p.left = node;
            else p.right = node;
            node.parent = p;
            txy(node.id, node.x, node.y);
            txy(node.eid, node.x + 25, node.y + 20);
            append(node);
            setNodePath(node);
            cleanup(node);
            animate(node.id, { opacity: 1 });
            bgcolor(node.eid, Colors.stroke);
            return node.refresh();
        },
        root(node) {
            if (node !== undefined) root = node?.key;
            return Node(root);
        },
        slice() {
            return { arr: arr.slice(), root };
        },
        reset(data) {
            arr = data.arr;
            root = data.root;
        },
    });
}

export default binaryTree;
