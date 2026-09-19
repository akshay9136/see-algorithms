import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edge } from '@/components/common';
import linkedList from '@/helpers/linkedList';
import useLinkedListBase from './useLinkedListBase';
import { motion } from 'motion/react';

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
                padding: '4px 8px',
                border: '1px solid',
              }}
            >
              {value}
            </ToggleButton>

            <ToggleButton
              value="next"
              sx={{ flex: 1, border: '1px solid' }}
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
