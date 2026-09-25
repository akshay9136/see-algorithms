import { DrawGraph, Plane } from '@/components/common';
import { Box, Stack, Typography, Paper } from '@mui/material';
import { algoAnimation as bfsAnimation } from './BFS';
import { algoAnimation as dfsAnimation } from './DFS';
import { useGraphScope } from '@/hooks';
import { useEffect } from 'react';
import { muteSounds } from '@/common/utils';
import Link from 'next/link';

export default function BFSvsDFS() {
  return (
    <Stack spacing={3}>
      <Typography>
        Compare <strong>Breadth-First Search</strong> and{' '}
        <strong>Depth-First Search</strong> side-by-side to witness their
        distinct traversal patterns in real-time. While{' '}
        <Link href="/graph/BFS">BFS</Link> plunges deep into the graph&apos;s
        branches before backtracking, <Link href="/graph/DFS">DFS</Link>{' '}
        radiates discovery level-by-level to find the shortest path. Sketch your
        custom graph, choose a starting node, and hit the play button to watch
        these two fundamental algorithms compete on the same structure.
      </Typography>

      <Visualizer />
    </Stack>
  );
}

export function Visualizer() {
  const [bfsScope, bfsRef] = useGraphScope();
  const [dfsScope, dfsRef] = useGraphScope();

  useEffect(muteSounds, []);

  return (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Stack spacing={2} ref={bfsRef}>
        <DrawGraph
          scopes={[bfsScope, dfsScope]}
          startHandlers={[bfsAnimation(bfsScope), dfsAnimation(dfsScope)]}
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
  );
}
