import { Box, Typography } from '@mui/material';
import { Node, Edge } from '@/components/common';
import { charAt } from '@/common/utils';
import { memo } from 'react';

function UnionFind({ size, scope }) {
  const nArray = Array(size).fill(null);

  return (
    <Box
      width={size * 70}
      height={size * 60}
      minWidth={500}
      minHeight={300}
      ref={scope}
      position="relative"
    >
      <Typography variant="h6" textAlign="center">
        Union-Find
      </Typography>

      {nArray.map((_, i) => (
        <Edge key={i} index={i} />
      ))}

      {nArray.map((_, i) => (
        <Node
          key={i}
          index={i}
          value={charAt(65 + i)}
          animate={{ x: i * 66 + 24, y: 32 }}
          style={{ scale: 0.9, margin: 0 }}
        />
      ))}
    </Box>
  );
}

export default memo(UnionFind);
