import { Box, Stack } from '@mui/material';
import { DrawGraph } from '@/components/common';
import { useRouter } from 'next/router';
import { useGraphScope } from '@/hooks';
import { Visualizer as BFS } from '@/pages/graph/BFS';
import { Visualizer as DFS } from '@/pages/graph/DFS';
import { Visualizer as Prims } from '@/pages/graph/Prims';
import { Visualizer as Kruskals } from '@/pages/graph/Kruskals';
import { Visualizer as Boruvkas } from '@/pages/graph/Boruvkas';
import { Visualizer as Dijkstras } from '@/pages/graph/Dijkstras';
import { Visualizer as TopSort } from '@/pages/graph/TopSort';
import { Visualizer as Hamiltonian } from '@/pages/graph/Hamiltonian';

const algorithms = {
  BFS: {
    Visualizer: BFS,
    helper: <Box className="alphaGrid bfs-path" />,
  },
  DFS: {
    Visualizer: DFS,
    helper: <Box className="alphaGrid dfs-path" />,
  },
  Prims: {
    Visualizer: Prims,
    props: { weighted: true, allowDirected: false },
  },
  Kruskals: {
    Visualizer: Kruskals,
    props: { weighted: true, allowDirected: false, customSource: false },
  },
  Boruvkas: {
    Visualizer: Boruvkas,
    props: { weighted: true, allowDirected: false, customSource: false },
  },
  Dijkstras: {
    Visualizer: Dijkstras,
    props: { weighted: true },
  },
  TopSort: {
    Visualizer: TopSort,
    helper: <Box className="alphaGrid top-sort" />,
    props: { allowDirected: false, customSource: false },
  },
  Hamiltonian: {
    Visualizer: Hamiltonian,
    helper: <Box className="alphaGrid ham-path" />,
    props: { allowDirected: false },
  },
};

export default function EmbedAlgorithm() {
  const router = useRouter();
  const { algorithm: key } = router.query;
  const config = algorithms[key];

  if (!config) {
    return <div>Algorithm not found</div>;
  }

  return <GraphVisualizer {...config} />;
}

function GraphVisualizer({ Visualizer, helper, props }) {
  const [scope, graphRef] = useGraphScope();

  return (
    <Stack spacing={3} ref={graphRef} position="relative">
      <DrawGraph
        scope={scope}
        onStart={Visualizer(scope)}
        onClear={() => {
          if (helper) {
            scope?.find('.alphaGrid').html('');
          }
        }}
        {...props}
      />
      {helper}
      <a
        href="https://see-algorithms.com"
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Stack>
  );
}
