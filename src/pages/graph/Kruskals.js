import { DrawGraph, ListItems } from '@/components/common';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useAlgorithm, useAnimator, useGraphScope } from '@/hooks';
import { unionFindLayout } from '@/helpers/unionFind';
import { useState } from 'react';
import { Colors } from '@/common/constants';
import { sound } from '@/common/utils';
import UnionFind from '@/components/union-find';
import Graph from '@/common/graph';
import Link from 'next/link';

export default function Kruskals() {
  const [algorithm] = useAlgorithm(`
sort edges by weight (ascending)
MST = empty set
for each vertex v:
    create a disjoint set {v}
for each edge (u, v):
    if find(u) ≠ find(v):
        add (u, v) to MST
        union(u, v)
`);

  return (
    <Stack spacing={3} width="fit-content">
      <Typography>
        <strong>Kruskal&apos;s Algorithm</strong> is another way to find a
        Minimum Spanning Tree (MST) in a graph. It works by iteratively adding
        the cheapest available edge that connects two previously disconnected
        components, without forming a cycle. It is efficient for sparse graphs
        and uses a <strong>Union-Find</strong> data structure to detect cycles.
        Compare it with <Link href="/graph/Prims">Prim’s Algorithm</Link>, which
        grows the MST from a single vertex, or{' '}
        <Link href="/graph/Boruvkas">Borůvka’s Algorithm</Link> which merges
        components in parallel.
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
          <ListItems sx={{ pl: 2 }}>
            <li>Sort all edges in non-decreasing order of their weights.</li>
            <li>Initialize an empty set of edges for the MST.</li>
            <li>
              Initialize a <strong>Disjoint set</strong> structure with each
              vertex in its own set.
            </li>
            <li>
              For each edge (u, v) in the sorted list:
              <ul style={{ marginTop: 8 }}>
                <li>
                  Use <strong>Find</strong> operation to determine the sets of u
                  and v.
                </li>
                <li>
                  If the sets are different, the edge does not form a cycle. Add
                  it to the MST.
                </li>
                <li>
                  Merge the two sets using <strong>Union</strong> operation.
                </li>
              </ul>
            </li>
          </ListItems>
        </Stack>
      </Box>
      <Divider />
      <Visualizer />
    </Stack>
  );
}

var arr, layout;

export function Visualizer() {
  const [scope1, { txy, bgcolor, animate }] = useAnimator();
  const [scope, graphRef] = useGraphScope();
  const [size, setSize] = useState(0);
  const delay = 800;

  if (size === 0) arr = [];

  async function* start() {
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke-dasharray', '8,4');
    yield delay / 2;
    const np = Graph.totalPoints();
    layout = unionFindLayout(np);
    setSize(np);
    arr = [];
    scope.find('.cost').each(function (i) {
      const [u, v] = Graph.segments()[i];
      const w = Number(this.value) || 1;
      arr.push({ u, v, w, i });
    });
    arr.sort((a, b) => a.w - b.w);
    yield delay;
    yield* nextMin(0);
  }

  async function* nextMin(k) {
    const { u, v, i } = arr[k];
    scope.node(u).attr('stroke', Colors.visited);
    scope.node(v).attr('stroke', Colors.visited);
    scope.node(u).attr('fill', Colors.visited);
    scope.node(v).attr('fill', Colors.visited);
    await Promise.all([
      bgcolor(`.node${u}`, Colors.visited),
      bgcolor(`.node${v}`, Colors.visited),
    ]);
    yield delay / 2;
    const x1 = layout.findRoot(v);
    const x2 = layout.findRoot(u);
    if (x1 !== x2) {
      await union(x1, x2);
      if (!arr.length) return;
      scope.path(i).attr('stroke', Colors.visited);
      scope.path(i).attr('stroke-width', 3);
      scope.path(i).removeAttr('stroke-dasharray');
    }
    yield delay;
    scope.node(u).attr('fill', Colors.vertex);
    scope.node(v).attr('fill', Colors.vertex);
    await Promise.all([
      bgcolor(`.node${u}`, Colors.white),
      bgcolor(`.node${v}`, Colors.white),
    ]);
    if (layout.setsCount() > 1) {
      yield delay;
      yield* nextMin(k + 1);
    }
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

  return (
    <Box display="flex" flexWrap="wrap" gap={3} ref={graphRef}>
      <DrawGraph
        scope={scope}
        onStart={start}
        onClear={() => setSize(0)}
        weighted={true}
        allowDirected={false}
        customSource={false}
      />
      <UnionFind size={size} scope={scope1} />
    </Box>
  );
}
