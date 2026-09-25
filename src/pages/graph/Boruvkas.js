import { DrawGraph, ListItems } from '@/components/common';
import { Alert, Box, Divider, Stack, Typography } from '@mui/material';
import { useAlgorithm, useGraphScope } from '@/hooks';
import { useState } from 'react';
import { Colors } from '@/common/constants';
import { sound } from '@/common/utils';
import Graph from '@/common/graph';

export default function Boruvkas() {
  const [algorithm] = useAlgorithm(`
for each vertex v:
    create a component {v}
while components > 1:
    for each component C:
        find cheapest edge leaving C
    add all cheapest edges to MST
    merge connected components
`);

  return (
    <Stack spacing={3}>
      <Typography>
        <strong>Borůvka&apos;s Algorithm</strong> is a greedy approach to find a
        Minimum Spanning Tree (MST) in a graph. It works by repeatedly selecting
        the cheapest edge connecting two components and adding all such edges at
        once. By merging multiple components in every iteration, the algorithm
        quickly reduces the number of components until the entire graph becomes
        a single connected tree.
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {algorithm}
        </Stack>
        <Stack spacing={2} flex={1}>
          <Typography variant="h6" component="h2">
            Step by Step
          </Typography>
          <ListItems component="ol" sx={{ pl: 2 }}>
            <li>
              Initialize each vertex as its own <strong>component</strong>.
            </li>
            <li>
              For each component, find the cheapest edge that connects it to a
              different component.
            </li>
            <li>
              Add all selected cheapest edges to the MST simultaneously, merging
              connected components.
            </li>
            <li>
              Repeat until only <strong>one component</strong> remains — the
              full MST.
            </li>
          </ListItems>
        </Stack>
      </Box>
      <Divider />
      <Visualizer />
    </Stack>
  );
}

var union, parent, w;

export function Visualizer() {
  // const [summary, explain, abortSummary] = useSummary();
  const [scope, graphRef] = useGraphScope();
  const [iteration, setIteration] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const delay = 1000;

  async function* start() {
    scope.find('.vrtx').attr('stroke', Colors.visited);
    scope.find('.edge').attr('stroke', Colors.rejected);
    const n = Graph.totalPoints();
    setIteration?.(0);
    setRemaining?.(n);
    union = [];
    parent = [];
    for (let i = 0; i < n; i++) {
      union[i] = new Set();
      union[i].add(i);
      parent[i] = i;
    }
    w = scope.costMatrix();
    yield delay;
    yield* connect(1);
  }

  async function* connect(i) {
    setIteration?.(i);
    const min = {};
    for (const [u, v] of Graph.segments()) {
      const x1 = findRoot(v);
      const x2 = findRoot(u);
      if (x1 !== x2) {
        const cost = w[u][v];
        if (!min[x1] || cost < min[x1].w) {
          min[x1] = { u, v, w: cost };
        }
        if (!min[x2] || cost < min[x2].w) {
          min[x2] = { u, v, w: cost };
        }
      }
    }
    yield* merge(Object.values(min));
    const rem = union.filter((set) => set.size > 0);
    if (rem.length > 1) yield* connect(i + 1);
  }

  function findRoot(u) {
    if (parent[u] !== u) {
      return findRoot(parent[u]);
    }
    return parent[u];
  }

  function* merge(minEdges) {
    for (const { u, v } of minEdges) {
      const x1 = findRoot(v);
      const x2 = findRoot(u);
      if (x1 !== x2) {
        yield* highlight(x2);
        sound('pop');
        yield* scope.spanEdge(u, v);
        const rem = union.filter((set) => set.size > 0);
        setRemaining?.(rem.length - 1);
        yield* highlight(x1);
        union[x1] = new Set([...union[x1], ...union[x2]]);
        union[x2] = new Set();
        parent[x2] = x1;
        scope.find('.vrtx').attr('fill', Colors.vertex);
        yield delay;
      }
    }
  }

  function* highlight(x) {
    union[x].forEach((v) => {
      scope.node(v).attr('fill', Colors.visited);
    });
    yield delay;
  }

  return (
    <Stack ref={graphRef}>
      <DrawGraph
        scope={scope}
        onStart={start}
        onClear={() => {
          setIteration(0);
          setRemaining(0);
        }}
        weighted={true}
        allowDirected={false}
        customSource={false}
      />
      <Box display="flex" gap={1} mt={2}>
        <Alert
          severity="info"
          variant="outlined"
          icon={false}
          sx={{ fontSize: '1rem', py: 0 }}
        >
          <strong>Iteration: {iteration}</strong>
        </Alert>
        <Alert
          severity="warning"
          variant="outlined"
          icon={false}
          sx={{ fontSize: '1rem', py: 0 }}
        >
          <strong>Components: {remaining}</strong>
        </Alert>
      </Box>
    </Stack>
  );
}
