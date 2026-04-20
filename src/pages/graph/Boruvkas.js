import { DrawGraph } from '@/components/common';
import { Stack, Typography } from '@mui/material';
import { sound } from '@/common/utils';
import { useGraphScope } from '@/hooks';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';

export default function Boruvkas(props) {
  const [scope, graphRef] = useGraphScope();

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        <strong>Borůvka&apos;s Algorithm</strong> is a greedy approach
        to find a Minimum Spanning Tree (MST) in a graph. It works by
        repeatedly selecting the cheapest edge connecting two components
        and adding all such edges at once. By merging multiple
        components in every iteration, the algorithm quickly reduces the
        number of components until the entire graph becomes a single
        connected tree.
      </Typography>
      <Stack ref={graphRef}>
        <DrawGraph
          {...props}
          scope={scope}
          onStart={Visualizer(scope)}
          weighted={true}
          allowDirected={false}
          customSource={false}
        />
      </Stack>
    </Stack>
  );
}

const delay = 1000;

export function Visualizer(scope) {
  var union, parent, w;

  async function* start() {
    scope.find('.vrtx').attr('stroke', Colors.visited);
    scope.find('.edge').attr('stroke', Colors.rejected);
    yield delay;
    const n = Graph.totalPoints();
    union = [];
    parent = [];
    for (let i = 0; i < n; i++) {
      union[i] = new Set();
      union[i].add(i);
      parent[i] = i;
    }
    w = scope.costMatrix();
    yield* connect();
  }

  async function* connect() {
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
    const rest = union.filter((set) => set.size > 0);
    if (rest.length > 1) yield* connect();
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

  return start;
}
