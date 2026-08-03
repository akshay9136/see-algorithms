import { DrawGraph } from '@/components/common';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  charAt,
  createCell,
  hasValue,
  sleep,
  sound,
  vertexLabel,
} from '@/common/utils';
import { useGraphScope, useSummary } from '@/hooks';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';

function getDegree(u) {
  let deg = 0;
  Graph.segments().forEach((edge) => {
    if (edge.includes(u)) deg++;
  });
  return deg;
}

function hasOddDegree() {
  for (let u = 0; u < Graph.totalPoints(); u++) {
    if (getDegree(u) % 2 !== 0) return true;
  }
  return false;
}

export default function Eulerian(props) {
  const [summary, explain, abortSummary] = useSummary();
  const [scope, graphRef] = useGraphScope();

  const showDegree = () => {
    for (let u = 0; u < Graph.totalPoints(); u++) {
      const udeg = getDegree(u);
      const label = vertexLabel(Graph.point(u), udeg);
      scope.find('.vgrp').eq(u).append(label);
      if (udeg % 2 !== 0) {
        scope.node(u).attr('fill', '#ed6c02');
      }
    }
  }

  const validateGraph = () => {
    showDegree();
    if (hasOddDegree()) {
      sleep(2000).then(() => {
        scope.find('.vtag').remove();
        scope.find('.vrtx').attr('fill', Colors.vertex);
      });
      return 'Graph has vertices with odd degree. Eulerian cycle does not exist.';
    }
    return '';
  }

  return (
    <Stack spacing={3}>
      <Typography>
        An <strong>Eulerian Cycle</strong> (or Eulerian Circuit) is a path in a
        graph that visits every <strong>edge</strong> exactly once and returns
        to the starting node. In an undirected graph, an Eulerian cycle exists
        if and only if every vertex has an even degree and all vertices with
        non-zero degree belong to a single connected component. It is closely
        related to the famous Seven Bridges of Königsberg problem.
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap">
        <Stack spacing={2} ref={graphRef}>
          <DrawGraph
            {...props}
            scope={scope}
            onStart={Visualizer(scope, explain)}
            onClear={() => {
              scope?.find('.vtag').remove();
              scope?.find('.euler-path').html('');
              abortSummary();
            }}
            validate={validateGraph}
            explain={(source) => {
              if (!hasOddDegree()) {
                const matrix = scope.costMatrix();
                explain({ matrix, source });
              }
            }}
            allowDirected={false}
            allowRefresh={false}
          />
          <Box className="alphaGrid euler-path" />
        </Stack>
        <Divider orientation="vertical" flexItem />
        {summary}
      </Box>
    </Stack>
  );
}

const delay = 1000;

export function Visualizer(scope) {
  var src, visited, eulerPath, totalEdges;

  async function* start(source) {
    totalEdges = Graph.segments().length;
    visited = Array(totalEdges).fill(false);
    src = source;
    scope.find('.vrtx').attr('stroke', Colors.rejected);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    scope.node(src).attr('stroke', Colors.visited);
    scope.node(src).attr('fill', Colors.visited);
    const row = scope.find('.euler-path');
    row.append(createCell(charAt(65 + src)));
    eulerPath = [src];
    sound('pop');
    yield* findCycle(src);
  }

  async function* findCycle(i) {
    if (!visited.includes(false)) return i === src;
    yield delay;
    for (let j = 0; j < Graph.totalPoints(); j++) {
      const ei = Graph.edgeIndex(i, j);
      if (hasValue(ei) && !visited[ei]) {
        visited[ei] = true;
        eulerPath.push(j);
        const row = scope.find('.euler-path');
        row.append(createCell(charAt(65 + j)));
        sound('pop');
        yield* scope.spanEdge(i, j);
        if (yield* findCycle(j)) return true;
        visited[ei] = false;
        eulerPath.pop();
        sound('pop');
        row.children().last().remove();
        yield* backtrack(i, j);
        yield delay;
      }
    }
    return false;
  }

  function* backtrack(i, j) {
    const ei = Graph.edgeIndex(i, j);
    scope.find('.edge').eq(ei).attr('stroke', Colors.enqueue);
    if (!eulerPath.includes(j)) {
      scope.node(j).attr('stroke', Colors.enqueue);
    }
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
