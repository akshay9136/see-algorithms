import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import { charAt, createCell, hasValue, showError, sound } from '@/common/utils';
import { useGraphScope } from '@/hooks';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';

export default function Hamiltonian(props) {
  const [scope, graphRef] = useGraphScope();

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        A <strong>Hamiltonian Cycle</strong> is a path in a graph that
        visits every node exactly once and returns to the starting node.
        It is closely related to Travelling Salesman Problem, where the
        goal is to find the shortest possible Hamiltonian cycle.
        Hamiltonian cycles are useful in routing, scheduling, and
        circuit design.
      </Typography>
      <Stack spacing={2} ref={graphRef}>
        <DrawGraph
          {...props}
          scope={scope}
          onStart={Visualizer(scope)}
          onClear={() => {
            scope?.find('.ham-path').html('');
          }}
          allowDirected={false}
        />
        <Box className="alphaGrid ham-path" />
      </Stack>
    </Stack>
  );
}

const delay = 1000;

export function Visualizer(scope) {
  var src, v;

  async function* start(source) {
    v = Array(Graph.totalPoints()).fill(0);
    src = source;
    v[src] = 1;
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    scope.node(src).attr('stroke', Colors.visited);
    scope.node(src).attr('fill', Colors.visited);
    const row = scope.find('.ham-path');
    row.append(createCell(charAt(65 + src)));
    sound('pop');
    yield* findCycle(src);

    if (v.indexOf(0) > -1) showError('Cycle not found.');
  }

  async function* findCycle(i) {
    if (v.indexOf(0) === -1) {
      const ei = Graph.edgeIndex(i, src);
      if (hasValue(ei)) {
        yield* scope.spanEdge(i, src);
        return true;
      }
    }
    yield delay;
    for (let j = 0; j < Graph.totalPoints(); j++) {
      if (hasValue(Graph.edgeIndex(i, j))) {
        if (v[j] > 0) continue;
        const row = scope.find('.ham-path');
        row.append(createCell(charAt(65 + j)));
        sound('pop');
        yield* scope.spanEdge(i, j);
        v[j] = 1;
        if (yield* findCycle(j)) return true;
        v[j] = 0;
        sound('pop');
        row.children().last().remove();
        yield* backtrack(i, j);
        yield delay;
      }
    }
  }

  function* backtrack(i, j) {
    const ei = Graph.edgeIndex(i, j);
    scope.find('.edge').eq(ei).attr('stroke', Colors.enqueue);
    scope.node(j).attr('stroke', Colors.enqueue);
    const edge = scope.cloneEdge(i, j);
    const d = edge.getTotalLength();
    const t = d / 50;
    const seg = Graph.segments()[ei];

    function* span(dash) {
      if (dash < d) {
        edge.setAttribute('stroke-dasharray', `${d - dash} ${dash}`);
        if (i !== seg[0]) {
          edge.setAttribute('stroke-dashoffset', d - dash);
        }
        yield 20;
        yield* span(dash + t);
      } else edge.remove();
    }
    yield* span(2);
  }

  return start;
}
