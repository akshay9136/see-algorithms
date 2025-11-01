import { useAnimate } from 'framer-motion';

export default function useAnimator() {
    const [scope, animate] = useAnimate();

    const cleanup = (node, dx, dy, t = 0.5) => {
        const { txy } = animator;
        if (node) {
            node.x = node.x + dx;
            node.y = node.y - dy;
            txy(`#node${node.index}`, node.x, node.y, t);
            if (node.parent) {
                const ex = node.x + 25;
                const ey = node.y + 20;
                txy(`#edge${node.key - 1}`, ex, ey, t);
            }
            cleanup(node.left, dx, dy);
            cleanup(node.right, dx, dy);
        }
    };

    const animator = {
        bgcolor(id, color) {
            return animate(id, { backgroundColor: color });
        },
        tx(id, x, t) {
            return animate(id, { x }, { duration: t });
        },
        ty(id, y, t) {
            return animate(id, { y }, { duration: t });
        },
        txy(id, x, y, t) {
            return animate(id, { x, y }, { duration: t });
        },
        animate,
        cleanup,
    };

    return [scope, animator];
}
