import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import { charAt, createCell, hasValue, sound } from '@/common/utils';
import { useAlgorithm, useGraphScope, useSummary } from '@/hooks';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';

export default function DFS(props) {
  const [summary, explain, abortSummary] = useSummary();
  const [scope, graphRef] = useGraphScope();

  const [algorithm] = useAlgorithm(`
stack = new Stack()
stack.push(src)
mark src as visited
while stack is not empty:
    u = stack.pop()
    for each neighbor v of u:
        if v is not visited:
            stack.push(v)
            mark v as visited
`);

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        <strong>Depth-First Search (DFS)</strong> explores a graph by
        going as deep as possible along each branch before{' '}
        <strong>backtracking</strong>. Think of it as navigating a maze
        by following one path to its end before trying another. It uses
        a <strong>stack</strong> (often via recursion) to keep track of
        its path, making it highly effective for cycle detection,
        pathfinding, and solving puzzles.
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
              scope?.find('.dfs-path').html('');
              abortSummary();
            }}
            explain={(source) => {
              const { matrix } = Graph.skeleton();
              explain({ matrix, source });
            }}
          />
          <Box className="alphaGrid dfs-path" />
          <br />
          {summary}
        </Stack>
      </Box>
    </Stack>
  );
}

const delay = 800;

export function Visualizer(scope) {
  var v, stack, prev, i;

  async function* start(src) {
    v = [src];
    stack = [];
    prev = [];
    i = src;
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    scope.node(i).attr('stroke', Colors.visited);
    scope.node(i).attr('fill', Colors.visited);
    const row = scope.find('.dfs-path');
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
          sound('pop');
          scope.path(ei).attr('stroke', Colors.enqueue);
          scope.node(j).attr('stroke', Colors.enqueue);
          scope.node(j).attr('fill', Colors.enqueue);
          stack.push(j);
          v.push(j);
          prev[j] = i;
          const row = scope.find('.dfs-path');
          row.append(createCell(charAt(65 + j)));
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
    if (stack.length) {
      i = stack.pop();
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
