import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import { charAt, createCell, hasValue, sound } from '@/common/utils';
import { useAlgorithm, useGraphScope, useSummary } from '@/hooks';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';
import Link from 'next/link';

export default function BFS(props) {
  const [summary, explain, abortSummary] = useSummary();
  const [scope, graphRef] = useGraphScope();

  const [algorithm] = useAlgorithm(`
queue = new Queue()
queue.enq(src)
mark src as visited
while queue is not empty:
    u = queue.deq()
    for each neighbor v of u:
        if v is not visited:
            queue.enq(v)
            mark v as visited
`);

  return (
    <Stack spacing={3}>
      <Typography>
        <strong>Breadth-First Search (BFS)</strong> explores a graph much like
        finding connections in a social network. Starting from a source node, it
        first visits all of its direct friends (neighbors), then all of their
        friends, and so on, level by level. It uses a <strong>queue</strong> to
        keep track of who to visit next, ensuring it doesn&apos;t go too deep
        down one path. This makes it perfect for finding the{' '}
        <Link href="/graph/Dijkstras">shortest path</Link> in an unweighted
        graph.
      </Typography>

      <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
        <Stack spacing={2} pt={0.5}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {algorithm}
        </Stack>
        <Stack spacing={2} ref={graphRef}>
          <DrawGraph
            {...props}
            scope={scope}
            onStart={Visualizer(scope)}
            onClear={() => {
              scope?.find('.bfs-path').html('');
              abortSummary();
            }}
            explain={(source) => {
              const { matrix } = Graph.skeleton();
              explain({ matrix, source });
            }}
          />
          <Box className="alphaGrid bfs-path" />
          <br />
          {summary}
        </Stack>
      </Box>
    </Stack>
  );
}

const delay = 800;

export function Visualizer(scope) {
  var v, i, prev, queue;

  async function* start(source) {
    v = [source];
    queue = [];
    prev = [];
    i = source;
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    scope.node(i).attr('stroke', Colors.visited);
    scope.node(i).attr('fill', Colors.visited);
    const row = scope.find('.bfs-path');
    row.append(createCell(charAt(65 + i)));
    scope.setColor('.cell:eq(0)', Colors.visited);
    yield delay;
    yield* explore(0);
  }

  async function* explore(j) {
    if (j < Graph.totalPoints()) {
      const ei = Graph.edgeIndex(i, j);
      if (hasValue(ei)) {
        if (!v.includes(j)) {
          scope.path(ei).attr('stroke', Colors.enqueue);
          scope.node(j).attr('stroke', Colors.enqueue);
          scope.node(j).attr('fill', Colors.enqueue);
          queue.push(j);
          v.push(j);
          prev[j] = i;
          const row = scope.find('.bfs-path');
          row.append(createCell(charAt(65 + j)));
          sound('pop');
          yield delay;
        }
      }
      yield* explore(j + 1);
    } else {
      yield delay / 2;
      yield* visit();
    }
  }

  async function* visit() {
    scope.node(i).attr('fill', Colors.vertex);
    yield delay / 2;
    if (queue.length) {
      i = queue.shift();
      sound('pop');
      scope.setColor(`.cell:eq(${v.indexOf(i)})`, Colors.visited);
      yield* scope.spanEdge(prev[i], i);
      scope.node(i).attr('fill', Colors.visited);
      yield delay;
      yield* explore(0);
    }
  }

  return start;
}
