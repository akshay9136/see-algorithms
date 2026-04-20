import { DrawGraph, Plane } from '@/components/common';
import { Box, Stack, Typography, Paper } from '@mui/material';
import { Visualizer as dfsVisualizer } from './DFS';
import { Visualizer as bfsVisualizer } from './BFS';
import { useGraphScope } from '@/hooks';
import { useEffect } from 'react';
import { muteSounds } from '@/common/utils';

export default function DfsVsBfs(props) {
  const [dfsScope, dfsRef] = useGraphScope();
  const [bfsScope, bfsRef] = useGraphScope();

  useEffect(muteSounds, []);

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        Compare <strong>Depth-First Search</strong> and{' '}
        <strong>Breadth-First Search</strong> side-by-side to witness their
        distinct traversal patterns in real-time. While <strong>DFS</strong>{' '}
        plunges deep into the graph&apos;s branches before backtracking,{' '}
        <strong>BFS</strong> radiates discovery level-by-level to find the
        shortest path. Sketch your custom graph, choose a starting node, and hit
        the play button to watch these two fundamental algorithms compete on the
        same structure.
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap">
        <Stack spacing={2} ref={dfsRef}>
          <DrawGraph
            {...props}
            scopes={[dfsScope, bfsScope]}
            startHandlers={[dfsVisualizer(dfsScope), bfsVisualizer(bfsScope)]}
            resetHandlers={[
              () => dfsScope?.find('.dfs-path').html(''),
              () => bfsScope?.find('.bfs-path').html(''),
            ]}
          />
          <Box className="alphaGrid dfs-path" />
        </Stack>

        <Stack spacing={2} ref={bfsRef}>
          <Typography variant="h6">BFS Visualizer</Typography>
          <Box>
            <Paper className="resizable" sx={{ mb: 1 }}>
              <Plane />
            </Paper>
          </Box>
          <Box className="alphaGrid bfs-path" />
        </Stack>
      </Box>
    </Stack>
  );
}
