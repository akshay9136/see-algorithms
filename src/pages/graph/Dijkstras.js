import { DrawGraph } from '@/components/common';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { charAt, hasValue, sound, svgElement } from '@/common/utils';
import { useAlgorithm, useGraphScope, useSummary } from '@/hooks';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';
import Link from 'next/link';

export default function Dijkstras(props) {
  const [summary, explain, abortSummary] = useSummary();
  const [scope, graphRef] = useGraphScope();

  const [algorithm] = useAlgorithm(`
dist = map vertex -> Infinity
dist[src] = 0
heap = new MinHeap()
heap.insert(src, 0)
while heap is not empty:
    (u, d) = heap.extract()
    if u is not visited:
        relax(u, d)
`);

  const [relaxAlgo] = useAlgorithm(`
function relax(u, d):
    mark u as visited
    for each neighbor v of u:
        alt = d + weight(u, v)
        if alt < dist[v]:
            dist[v] = alt
            heap.insert(v, alt)
`);

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        <strong>Dijkstra&apos;s Algorithm</strong> finds the shortest path from
        a source node to all other nodes in a graph with non-negative weights.
        It uses a <Link href="/data-structures/BinaryHeap">priority queue</Link>{' '}
        to explore nodes in order of increasing distance. This algorithm works
        by maintaining a set of visited nodes and, at each step, selecting the
        unvisited node with the smallest known distance to visit next. This
        process continues until all nodes have been visited, making it essential
        for network routing problems. Unlike{' '}
        <Link href="/articles/shortest-path-vs-mst">MST algorithms</Link>,
        Dijkstra’s focuses on optimal paths from a single source.
      </Typography>
      <Typography variant="h6" component="h2">
        Pseudocode
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
        {algorithm}
        {relaxAlgo}
      </Box>
      <br />
      <Box display="flex" gap={3} flexWrap="wrap" ref={graphRef}>
        <DrawGraph
          {...props}
          scope={scope}
          onStart={Visualizer(scope)}
          onClear={abortSummary}
          weighted={true}
          explain={(source) => {
            const matrix = scope.costMatrix();
            explain({ matrix, source });
          }}
        />
        <Divider orientation="vertical" flexItem />
        {summary}
      </Box>
    </Stack>
  );
}

const svgLabel = (index, text) => {
  const p = Graph.point(index);
  const props = {
    class: 'vtag',
    x: p.x + 20,
    y: p.y - 12,
    fill: '#404040',
    'font-size': 14,
    'font-weight': 'bold',
  };
  return svgElement('text', props, text);
};

const delay = 1000;

export function Visualizer(scope) {
  var n, v, w, d, prev;

  async function* start(src) {
    scope.find('.cost').each(function () {
      this.setAttribute('value', this.value);
      this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    v = [src];
    w = scope.costMatrix();
    d = [];
    d[src] = 0;
    prev = [];
    for (let i = 0; i < n; i++) {
      const label = svgLabel(i, charAt(65 + i));
      scope.find('.vgrp').eq(i).append(label);
      if (i !== src) {
        const symbol = '<tspan font-family="Georgia, serif">&infin;</tspan>';
        scope.find('.vlbl').eq(i).html(symbol);
        d[i] = Infinity;
      } else {
        scope.find('.vlbl').eq(i).text('0');
        scope.find('.vlbl').eq(i).css('font-size', 14);
      }
    }
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    scope.node(src).attr('stroke', Colors.visited);
    scope.node(src).attr('fill', Colors.visited);
    sound('pop');
    yield delay;
    yield* relax(src);
  }

  async function* relax(i) {
    let flag = 1;
    w[i] = w[i] || [];
    for (let j = 0; j < n; j++) {
      if (v.includes(j)) continue;
      const ei = Graph.edgeIndex(i, j);

      if (hasValue(ei) && d[i] + w[i][j] < d[j]) {
        d[j] = d[i] + w[i][j];
        const ej = Graph.edgeIndex(prev[j], j);
        scope.path(ei).attr('stroke', Colors.enqueue);
        scope.path(ej).attr('stroke', Colors.rejected);
        scope.node(j).attr('stroke', Colors.enqueue);
        scope.node(j).attr('fill', Colors.enqueue);
        scope.find('.vlbl').eq(j).text(d[j]);
        scope.find('.vlbl').eq(j).css('font-size', 14);
        prev[j] = i;
        flag = 2;
      }
    }
    d[i] = Infinity;
    yield delay * flag;
    yield* select();
  }

  async function* select() {
    const min = d.reduce((a, b) => (b < a ? b : a), Infinity);
    const j = d.indexOf(min);
    const i = prev[j];
    v.push(j);
    sound('pop');
    yield* scope.spanEdge(i, j);
    scope.node(j).attr('fill', Colors.visited);
    if (v.length < n) {
      yield delay;
      yield* relax(j);
    }
  }

  return start;
}
