import { DrawGraph, Plane } from '@/components/common';
import { Box, Stack, Typography, Paper } from '@mui/material';
import { Visualizer as bfsVisualizer } from './BFS';
import { Visualizer as dfsVisualizer } from './DFS';
import { useGraphScope } from '@/hooks';
import { useEffect } from 'react';
import { muteSounds } from '@/common/utils';

export default function BfsVsDfs(props) {
  const [bfsScope, bfsRef] = useGraphScope();
  const [dfsScope, dfsRef] = useGraphScope();

  useEffect(muteSounds, []);

  return (
    <Stack spacing={3}>
      <Typography>
        Compare <strong>Breadth-First Search</strong> and{' '}
        <strong>Depth-First Search</strong> side-by-side to witness their
        distinct traversal patterns in real-time. While <strong>BFS</strong>{' '}
        plunges deep into the graph&apos;s branches before backtracking,{' '}
        <strong>DFS</strong> radiates discovery level-by-level to find the
        shortest path. Sketch your custom graph, choose a starting node, and hit
        the play button to watch these two fundamental algorithms compete on the
        same structure.
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2} ref={bfsRef}>
          <DrawGraph
            {...props}
            scopes={[bfsScope, dfsScope]}
            startHandlers={[bfsVisualizer(bfsScope), dfsVisualizer(dfsScope)]}
            resetHandlers={[
              () => bfsScope?.find('.bfs-path').html(''),
              () => dfsScope?.find('.dfs-path').html(''),
            ]}
          />
          <Box className="alphaGrid bfs-path" />
        </Stack>

        <Stack spacing={2} ref={dfsRef}>
          <Typography variant="h6">DFS Visualizer</Typography>
          <Box>
            <Paper className="resizable" sx={{ mb: 1 }}>
              <Plane />
            </Paper>
          </Box>
          <Box className="alphaGrid dfs-path" />
        </Stack>
      </Box>
    </Stack>
  );
}
