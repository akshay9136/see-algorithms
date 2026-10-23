import { motion, useDragControls } from 'motion/react';
import { memo } from 'react';

const Draggable = memo(
  function ({ children }) {
    const dragControls = useDragControls();

    return (
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        style={{ 
            width: '100%', 
            height: '100%', 
            touchAction: 'none', 
            userSelect: 'none',
            WebkitUserSelect: 'none',
        }}
      >
        <motion.div
          drag
          dragConstraints={{ top: -100, bottom: 50, left: -200, right: 200 }}
          dragElastic={0.2} // adds a slight spring resistance when reaching boundaries
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            cursor: 'grab',
          }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

export default Draggable;
