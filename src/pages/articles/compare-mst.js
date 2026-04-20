import { DrawGraph, Plane } from '@/components/common';
import { Box, Stack, Typography, Paper } from '@mui/material';
import { Visualizer as Boruvkas } from '../graph/Boruvkas';
import { Visualizer as Prims } from '../graph/Prims';
import { useEffect } from 'react';
import { useGraphScope } from '@/hooks';
import { muteSounds } from '@/common/utils';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';

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

const delay = 800;

function Kruskals(scope) {
  var arr, union, parent;

  function findRoot(u) {
    if (parent[u] !== u) {
      return findRoot(parent[u]);
    }
    return parent[u];
  }

  async function* start() {
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay / 2;
    const np = Graph.totalPoints();
    arr = [];
    scope.find('.cost').each(function (i) {
      const [u, v] = Graph.segments()[i];
      const w = Number(this.value) || 1;
      arr.push({ u, v, w, i });
    });
    arr.sort((a, b) => a.w - b.w);
    union = [];
    parent = [];
    for (let i = 0; i < np; i++) {
      union[i] = new Set();
      union[i].add(i);
      parent[i] = i;
    }
    yield* nextMin(0);
  }

  async function* nextMin(k) {
    yield delay;
    const { u, v, i } = arr[k];
    scope.node(u).attr('stroke', Colors.visited);
    scope.node(v).attr('stroke', Colors.visited);
    scope.node(u).attr('fill', Colors.visited);
    scope.node(v).attr('fill', Colors.visited);
    yield delay;
    const x1 = findRoot(v);
    const x2 = findRoot(u);
    if (x1 !== x2) {
      await merge(x1, x2);
      if (!arr.length) return;
      scope.path(i).attr('stroke', Colors.visited);
      scope.path(i).attr('stroke-width', 3);
      scope.path(i).removeAttr('stroke-dasharray');
    }
    yield delay;
    scope.node(u).attr('fill', Colors.vertex);
    scope.node(v).attr('fill', Colors.vertex);
    const rest = union.filter((set) => set.size > 0);
    if (rest.length > 1) yield* nextMin(k + 1);
  }

  async function merge(x1, x2) {
    const y = union[x1].size * 50;
    const promises = [];
    await Promise.all(promises);
    union[x1] = new Set([...union[x1], ...union[x2]]);
    union[x2] = new Set();
    parent[x2] = x1;
  }

  return start;
}
