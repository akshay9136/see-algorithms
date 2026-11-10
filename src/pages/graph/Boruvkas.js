import { Alert, Box, Divider, Stack, Typography } from '@mui/material';
import {
  AdUnit,
  ComplexityTable,
  DrawGraph,
  ListItems,
  Section,
} from '@/components/common';
import {
  useAlgorithm,
  useAnimator,
  useBreakpoints,
  useGraphScope,
} from '@/hooks';
import { unionFindLayout } from '@/helpers/unionFind';
import { useState } from 'react';
import { Colors } from '@/common/constants';
import { sound } from '@/common/utils';
import UnionFind from '@/components/union-find';
import Graph from '@/common/graph';
import Link from 'next/link';

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
  const { lgup, xldown } = useBreakpoints();

  return (
    <Stack spacing={3}>
      <Typography>
        <strong>Borůvka&apos;s Algorithm</strong> is the oldest known Minimum
        Spanning Tree (MST) algorithm, invented by Otakar Borůvka in 1926. It
        works by repeatedly selecting the cheapest edge connecting two
        components and adding all such edges at once. By merging multiple
        components in every iteration, the algorithm quickly reduces the number
        of components until the entire graph becomes a single connected tree.
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
              Initialize each vertex as its own isolated{' '}
              <strong>component</strong> (using Union-Find).
            </li>
            <li>Find the cheapest outgoing edge for every active component.</li>
            <li>
              Add all identified cheapest edges to the MST, deduplicating if two
              components pick the same edge.
            </li>
            <li>Merge (union) the connected components together.</li>
            <li>Repeat until only one component remains — the full MST.</li>
          </ListItems>
        </Stack>
      </Box>
      <Divider />

      <Box display="flex" gap={3}>
        <Visualizer />
        {lgup && xldown && <AdUnit sx={{ maxWidth: 300 }} />}
      </Box>
      <Divider />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="How It Works">
            <Typography>
              Borůvka&apos;s algorithm begins with every vertex as an
              independent tree component. In each phase, every component
              identifies its lowest-weight edge connecting it to an outside
              component. All selected minimum edges are simultaneously added to
              the MST, and connected components are merged using a{' '}
              <strong>Union-Find</strong> data structure. Because every
              component is guaranteed to merge with at least one other component
              during each phase, the total number of components decreases by at
              least half each time, guaranteeing termination in at most{' '}
              <strong>log₂ V</strong> phases.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Borůvka&apos;s algorithm is uniquely well-suited for parallel and
              distributed computing (such as GPUs, multi-core clusters, and
              MapReduce). Unlike{' '}
              <Link href="/graph/Prims">Prim&apos;s algorithm</Link> (which
              expands a single component one edge at a time), Borůvka&apos;s
              components evaluate their cheapest edges independently without
              shared state conflicts, allowing massive concurrency across
              thousands of cores.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>
    </Stack>
  );
}

const complexityData = [
  {
    type: 'Sequential Time',
    complexity: 'O(E log V)',
    description:
      'Runs in at most log₂ V phases, with each phase inspecting all E edges.',
  },
  {
    type: 'Parallel Time',
    complexity: 'O(log² V)',
    description:
      'Cheapest-edge searches run in parallel across components on multi-core / GPU architectures.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(V + E)',
    description:
      'Stores the graph structure and Union-Find parent/rank arrays tracking components.',
  },
];

var n, w, layout;

export function Visualizer() {
  const [scope1, { txy, bgcolor, animate }] = useAnimator();
  const [scope, graphRef] = useGraphScope();
  const [iteration, setIteration] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [size, setSize] = useState(0);
  const delay = 1000;

  async function* start() {
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke-dasharray', '8,4');
    yield delay / 2;
    scope.find('.vrtx').attr('stroke', Colors.visited);
    n = Graph.totalPoints();
    setIteration?.(0);
    setRemaining?.(n);
    layout = unionFindLayout(n);
    setSize(n);
    w = scope.costMatrix();
    yield delay;
    yield* connect(1);
  }

  async function* connect(i) {
    setIteration?.(i);
    const min = {};
    for (const [u, v] of Graph.segments()) {
      const x1 = layout.findRoot(v);
      const x2 = layout.findRoot(u);
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
    if (layout.setsCount() > 1) yield* connect(i + 1);
  }

  async function animateEdge(node) {
    const dx = node.x - node.parent.x;
    const dy = node.y - node.parent.y;
    const width = Math.sqrt(dx * dx + dy * dy);
    const rotate = Math.atan2(dy, dx) * (180 / Math.PI);
    const { x, y } = node.parent;
    await animate(
      `.edge${node.id}`,
      { width, rotate, x, y, opacity: 1 },
      { duration: 0.5 },
    );
  }

  async function union(x1, x2) {
    const mergedNodes = layout.merge(x1, x2);
    await Promise.all(
      mergedNodes.map((node) => {
        const p = [txy(`.node${node.id}`, node.x - 20, node.y - 18)];
        if (node.parent) p.push(animateEdge(node));
        return Promise.all(p);
      }),
    );
    sound('pop');
  }

  function* merge(minEdges) {
    for (const { u, v } of minEdges) {
      const x1 = layout.findRoot(v);
      const x2 = layout.findRoot(u);
      if (x1 !== x2) {
        yield* highlight(x2);
        union(x1, x2);
        yield* scope.spanEdge(u, v);
        setRemaining?.(layout.setsCount());

        yield* highlight(x1);
        scope.find('.vrtx').attr('fill', Colors.vertex);
        for (let i = 0; i < n; i++) {
          bgcolor(`.node${i}`, Colors.white);
        }
        yield delay;
      }
    }
  }

  function* highlight(x) {
    for (let i = 0; i < n; i++) {
      if (layout.findRoot(i) === x) {
        scope.node(i).attr('fill', Colors.visited);
        bgcolor(`.node${i}`, Colors.visited);
      }
    }
    yield delay;
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={3} ref={graphRef}>
      <Stack>
        <DrawGraph
          scope={scope}
          onStart={start}
          onClear={() => {
            setIteration(0);
            setRemaining(0);
            setSize(0);
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
      <UnionFind size={size} scope={scope1} />
    </Box>
  );
}
