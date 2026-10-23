import { useRef, useState } from 'react';

/**
 * Provides animation speed control for all visualizations.
 *
 * @returns {object}
 *   - speed {number}  - current multiplier (0.5 | 1 | 2 | 4)
 *   - setSpeed {function}      - update the speed
 *   - scaleDelay {function}    - convert a base delay (ms) → effective delay
 *
 * Speed semantics:
 *   Higher speed → shorter delay  →  scaleDelay = baseDelay / speed
 *   e.g. 0.5x → delay x 2 (slower), 2x → delay / 2 (faster)
 *
 * scaleDelay reads from a ref so it always reflects the CURRENT speed,
 * even when captured inside an iterator closure created before the speed changed.
 */
export default function useAnimationSpeed() {
    const [speed, setSpeed] = useState(1);

    // Keep a ref in sync with the latest local state value.
    const speedRef = useRef(speed);
    speedRef.current = speed;

    // Stable function reference — always divides by the current ref value.
    const scaleDelay = (baseDelay) => Math.round(baseDelay / speedRef.current);

    return { speed, setSpeed, scaleDelay };
}
