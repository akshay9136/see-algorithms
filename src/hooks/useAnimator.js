import { useAnimate } from 'motion/react';

export default function useAnimator() {
    const [scope, animate] = useAnimate();

    const cleanup = (node, dx, dy, t = 0.5) => {
        const { txy } = animator;
        if (node) {
            node = node.refresh();
            node.update({ x: node.x + dx, y: node.y - dy });
            txy(node.id, node.x, node.y, t);
            if (node.parent) {
                const { x, y } = node;
                txy(node.eid, x + 25, y + 20, t);
            }
            cleanup(node.left, dx, dy, t);
            cleanup(node.right, dx, dy, t);
        }
    };

    const animator = {
        bgcolor(id, color) {
            return animate(id, { backgroundColor: color });
        },
        tx(id, x, t = 0.5) {
            return animate(id, { x }, { duration: t });
        },
        ty(id, y, t = 0.5) {
            return animate(id, { y }, { duration: t });
        },
        txy(id, x, y, t = 0.5) {
            return animate(id, { x, y }, { duration: t });
        },
        animate,
        cleanup,
    };

    return [scope, animator];
}
