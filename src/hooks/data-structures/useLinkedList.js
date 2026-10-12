import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edge } from '@/components/common';
import { Colors } from '@/common/constants';
import { motion } from 'motion/react';
import linkedList from '@/helpers/linkedList';
import useLinkedListBase from './useLinkedListBase';

export default function useLinkedList() {
  const { scope, nodes, ...rest } = useLinkedListBase({
    createList: linkedList,
  });

  const animation = (
    <Box ref={scope} className="sorting" overflow="auto">
      {nodes.map((value, i) => (
        <motion.div key={i} id={`box${i}`} style={{ position: 'absolute' }}>
          <ToggleButtonGroup
            size="small"
            sx={{ width: 60, gap: '1px', pointerEvents: 'none' }}
            value="data"
            color={i > 0 ? 'info' : 'warning'}
          >
            <ToggleButton
              value="data"
              sx={{
                fontSize: '1rem',
                width: 45,
                px: 1,
                py: 0.5,
                border: '1px solid',
              }}
            >
              {value}
            </ToggleButton>

            <ToggleButton
              value="next"
              sx={{
                flex: 1,
                bgcolor: Colors.white,
                borderColor: Colors.stroke,
              }}
              id={`next${i}`}
            />
          </ToggleButtonGroup>
        </motion.div>
      ))}
      {nodes.slice(1).map((_, i) => (
        <Edge key={i} index={i} style={{ width: 40 }} />
      ))}
    </Box>
  );

  return { animation, ...rest };
}
