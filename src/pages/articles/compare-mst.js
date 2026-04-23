import { DrawGraph, Plane } from '@/components/common';
import { Box, Stack, Typography, Paper } from '@mui/material';
import { Visualizer as Prims } from '../graph/Prims';
import { Visualizer as Kruskals } from '../graph/Kruskals';
import { Visualizer as Boruvkas } from '../graph/Boruvkas';
import { useEffect } from 'react';
import { useGraphScope } from '@/hooks';
import { muteSounds } from '@/common/utils';

export default function CompareMst(props) {
  const [primsScope, primsRef] = useGraphScope();
  const [kruskalsScope, kruskalsRef] = useGraphScope();
  const [boruvkasScope, boruvkasRef] = useGraphScope();

  useEffect(muteSounds, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" color="warning.main">
        Compare MST Algorithms
      </Typography>

      <Typography variant="body1">
        Compare <strong>Minimum Spanning Tree</strong> algorithms side-by-side
        and witness how three distinct greedy strategies explore the same graph
        to find its MST. While <strong>Prim&apos;s</strong> grows a single tree
        vertex by vertex, <strong>Kruskal&apos;s</strong> builds the MST by
        sorting and selecting the cheapest edges globally, and{' '}
        <strong>Borůvka&apos;s</strong> focuses on connecting closest components
        in parallel steps. Sketch your custom weighted graph and hit the play
        button to see these foundational algorithms in action.
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap">
        <Box ref={primsRef}>
          <DrawGraph
            {...props}
            scopes={[primsScope, kruskalsScope, boruvkasScope]}
            startHandlers={[
              Prims(primsScope),
              Kruskals(kruskalsScope),
              Boruvkas(boruvkasScope),
            ]}
            weighted={true}
            allowDirected={false}
          />
        </Box>

        <Box ref={kruskalsRef}>
          <Typography variant="h6" sx={{ mb: 2, ml: 0.5 }}>
            Kruskal&apos;s MST Visualizer
          </Typography>
          <Paper className="resizable" sx={{ mb: 1 }}>
            <Plane />
          </Paper>
        </Box>

        <Box ref={boruvkasRef}>
          <Typography variant="h6" sx={{ mb: 2, ml: 0.5 }}>
            Boruvka&apos;s MST Visualizer
          </Typography>
          <Paper className="resizable" sx={{ mb: 1 }}>
            <Plane />
          </Paper>
        </Box>
      </Box>
    </Stack>
  );
}
