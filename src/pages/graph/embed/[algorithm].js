import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Visualizer as BFS } from '@/pages/graph/BFS';
import { Visualizer as DFS } from '@/pages/graph/DFS';
import { Visualizer as Prims } from '@/pages/graph/Prims';
import { Visualizer as Kruskals } from '@/pages/graph/Kruskals';
import { Visualizer as Boruvkas } from '@/pages/graph/Boruvkas';
import { Visualizer as Dijkstras } from '@/pages/graph/Dijkstras';
import { Visualizer as TopSort } from '@/pages/graph/TopSort';
import { Visualizer as Hamiltonian } from '@/pages/graph/Hamiltonian';
import { Visualizer as Eulerian } from '@/pages/graph/Eulerian';

const algorithms = {
  BFS,
  DFS,
  Prims,
  Kruskals,
  Boruvkas,
  Dijkstras,
  TopSort,
  Hamiltonian,
  Eulerian,
};

export default function EmbedAlgorithm() {
  const router = useRouter();
  const { algorithm: key } = router.query;
  const Visualizer = algorithms[key];

  if (!router.isReady) return <div>Loading...</div>;
  else if (!Visualizer) {
    return <div>Algorithm not found</div>;
  }

  return (
    <Box position="relative">
      <Visualizer />
      <a
        href={window.location.href.replace('/embed', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Box>
  );
}
