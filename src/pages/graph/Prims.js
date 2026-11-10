import {
  ComplexityTable,
  DrawGraph,
  ListItems,
  Section,
} from '@/components/common';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useAlgorithm, useGraphScope, useSummary } from '@/hooks';
import { hasValue, sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';
import Link from 'next/link';

export default function Prims() {
  const [algorithm] = useAlgorithm(`
MST = empty set
mark src as visited
while MST does not span all vertices:
    (u, v) = cheapest edge where
             u ∈ visited and v ∉ visited
    add edge (u, v) to MST
    mark v as visited
`);

  return (
    <Stack spacing={3}>
      <Typography>
        <strong>Prim&apos;s Algorithm</strong> builds a Minimum Spanning Tree
        (MST) by starting with a single node and &quot;growing&quot; the tree
        outward. At every step, it finds the cheapest edge that connects a node
        inside the growing tree to a node outside of it. This greedy approach
        continues until all nodes are part of the tree, ensuring the total
        weight of all edges is as low as possible. It is perfect for problems
        like designing cost-effective road, fiber-optic, or electrical utility
        networks.
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
            <li>Initialize an empty set of edges for the MST.</li>
            <li>
              Start with an arbitrary vertex and mark it as visited (part of
              MST).
            </li>
            <li>
              Find the cheapest edge connecting a vertex in the MST to a vertex
              outside the MST.
            </li>
            <li>
              Add this edge to the MST and mark the new vertex as visited.
            </li>
            <li>Repeat until all vertices are part of the MST.</li>
          </ListItems>
        </Stack>
      </Box>
      <Divider />
      <Visualizer />

      <Divider />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="How It Works">
            <Typography paragraph>
              Prim&apos;s algorithm maintains two disjoint sets of vertices:
              those already included in the growing Minimum Spanning Tree, and
              those not yet added. Starting from a chosen root vertex, the
              algorithm continually examines all edges spanning the{' '}
              <strong>boundary</strong> between the tree and the remaining
              vertices. The minimum-weight edge crossing this cut is guaranteed
              to belong to the MST.
            </Typography>
            <Typography>
              In practical implementations, a priority queue tracks the minimum
              known distance from the MST to each outside vertex. Whenever a new
              vertex is absorbed into the tree, the distances to its adjacent
              unvisited neighbors are updated via <strong>decrease-key</strong>{' '}
              operations.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Prim&apos;s algorithm is particularly effective for{' '}
              <strong>dense graphs</strong> where the number of edges E
              approaches V². While a standard binary heap yields O(E log V)
              runtime, implementing Prim&apos;s with a{' '}
              <strong>Fibonacci heap</strong> reduces the amortized cost of{' '}
              decrease-key operations to strictly O(1). This brings Prim&apos;s
              overall runtime down to O(E + V log V), which is asymptotically
              optimal and significantly outperforms{' '}
              <Link href="/graph/Kruskals">Kruskal&apos;s algorithm</Link> on
              dense networks.
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
    type: 'With Binary Heap',
    complexity: 'O(E log V)',
    description:
      'Extract-min and decrease-key operations on a binary heap take O(log V) across all edges and vertices.',
  },
  {
    type: 'With Fibonacci Heap',
    complexity: 'O(E + V log V)',
    description:
      'Fibonacci heap achieves O(1) amortized decrease-key operations, making Prim’s asymptotically optimal for dense graphs.',
  },
  {
    type: 'Adjacency Matrix',
    complexity: 'O(V²)',
    description:
      'Simple linear array scan for minimum edge; optimal for extremely dense graphs where E ≈ V².',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(V + E)',
    description:
      'Stores graph adjacency structure and priority queue entries for all vertices.',
  },
];

var n, w, queue, mst;

export function Visualizer() {
  const [summary, explain, abortSummary] = useSummary();
  const [scope, graphRef] = useGraphScope();
  const delay = 1000;

  async function* start(src) {
    scope.find('.cost').each(function () {
      this.setAttribute('value', this.value);
      this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    w = scope.costMatrix();
    queue = [];
    mst = [];
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    scope.node(src).attr('stroke', Colors.visited);
    scope.node(src).attr('fill', Colors.visited);
    yield delay;
    yield* explore(src);
  }

  async function* explore(i) {
    mst.push(i);
    w[i] = w[i] || [];
    let flag = 0.5;
    for (let j = 0; j < n; j++) {
      if (mst.includes(j)) {
        queue[n * j + i] = Infinity;
        continue;
      }
      if (hasValue(w[i][j])) {
        queue[n * i + j] = w[i][j];
        const ei = Graph.edgeIndex(i, j);
        scope.path(ei).attr('stroke', Colors.enqueue);
        scope.node(j).attr('stroke', Colors.enqueue);
        scope.node(j).attr('fill', Colors.enqueue);
        flag = 1;
      }
    }
    yield delay * flag;
    yield* dequeue();
  }

  async function* dequeue() {
    const min = queue.reduce((a, b) => (b < a ? b : a), Infinity);
    if (min === Infinity) return;
    const k = queue.indexOf(min);
    // eslint-disable-next-line
    queue[k] = Infinity;
    const i = Math.floor(k / n);
    const j = k % n;
    if (mst.includes(j)) return dequeue();
    sound('pop');
    yield* scope.spanEdge(i, j);
    scope.node(j).attr('fill', Colors.visited);
    if (mst.length < n) {
      yield delay;
      yield* explore(j);
    }
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={4} ref={graphRef}>
      <DrawGraph
        scope={scope}
        onStart={start}
        onClear={abortSummary}
        weighted={true}
        allowDirected={false}
        explain={(source) => {
          const matrix = scope.costMatrix();
          explain({ matrix, source });
        }}
      />
      {summary}
    </Box>
  );
}
