import { useAnimate } from 'framer-motion';

export default function useAnimator() {
    const [scope, animate] = useAnimate();

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
    };

    return [scope, animator];
}
