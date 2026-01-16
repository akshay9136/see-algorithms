import { Colors } from './constants';
import { Points } from './graph';
import { sound } from './utils';

const dx = 40, dy = 60;

const nodeAngle = ({ x, parent, isLeft }) => {
    const dx = Math.abs(x - parent.x);
    const a = Math.atan2(dy, dx) * (180 / Math.PI);
    return [Math.hypot(dy, dx), isLeft ? -a : -(180 - a)];
};

function binaryTree({ tx, txy, bgcolor, animate, cleanup }) {
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

    const append = (node, t = 0.3) => {
        if (node) {
            node = node.refresh();
            const [width, rotate] = nodeAngle(node);
            animate(node.eid, { width }, { duration: t });
            animate(node.eid, { rotate }, { duration: t });
        }
    };

    const findNode = (fn) => arr.map((a) => Node(a.key)).find(fn);

    const _cleanup = (node, t = 0.3) => {
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
            const rx = subroot(node.parent);
            shiftNode(rx, dx, t);
            shiftRoot(rx?.parent, dx / 2, rx?.isLeft, t);
        }
    };

    const subroot = (node) => {
        if (node.key !== root) {
            if (node.isLeft === onLeft) return node;
            return subroot(node.parent);
        }
    };

    const shiftNode = (node, d, t) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(node.id, x2, t);
        tx(node.eid, x2 + 25, t);
        node.update({ x: x2 });
        shiftNode(node.left, d, t);
        shiftNode(node.right, d, t);
    };

    const shiftRoot = (node, d, fromLeft, t) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(node.id, x2, t);
        node.update({ x: x2 });
        if (node.parent) tx(node.eid, x2 + 25, t);
        if (onLeft && !fromLeft) shiftNode(node.left, d, t);
        if (!onLeft && fromLeft) shiftNode(node.right, d, t);
        if (node.left) append(node.left, t);
        if (node.right) append(node.right, t);
        // shift parent till root
        shiftRoot(node.parent, d, node.isLeft, t);
    };

    const setNodePath = (node) => {
        if (node.parent.key === root) {
            onLeft = node.isLeft;
            return;
        }
        setNodePath(node.parent);
    };

    const rotateStep1 = (node, child) => {
        const { parent, isLeft, x, y, eid } = node;
        if (parent) {
            parent[isLeft ? 'left' : 'right'] = child;
        } else root = child.key;
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
            append(node, 1);
            cleanup(child, dx, -dy, 1);
        } else {
            const x2 = node.x + (node.isLeft ? -dx : dx);
            const y2 = node.y + dy;
            txy(node.id, x2, y2, 1);
            tx(node.eid, x2 + 25, 1);
            node.update({ x: x2, y: y2 });
            _cleanup(node, 1);
            append(node, 1);
        }
    };

    return Object.freeze({
        node: (i) => Node(i),
        root(node) {
            if (node !== undefined) root = node?.key;
            return Node(root);
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
            _cleanup(node);
            animate(node.id, { opacity: 1 });
            bgcolor(node.eid, Colors.stroke);
            return node.refresh();
        },
        swapNodes(a, b) {
            const { id, value } = a;
            a.update({ id: b.id, value: b.value });
            b.update({ id, value });
            return Promise.all([
                txy(a.id, a.x, a.y, 1),
                txy(b.id, b.x, b.y, 1),
            ]);
        },
        rotateRight(node) {
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
                append(lr, 1);
                this.cleanup(lr);
            }
            cleanup(ll, lx, ly, 1);
            append(ll, 1);
            this.cleanup(ll);
        },
        rotateLeft(node) {
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
                append(rl, 1);
                this.cleanup(rl);
            }
            cleanup(rr, rx, ry, 1);
            append(rr, 1);
            this.cleanup(rr);
        },
        cleanup(node) {
            if (node) {
                _cleanup(node, 1);
                this.cleanup(node.left);
                this.cleanup(node.right);
            }
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
