import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Visualizer as BFS } from '../BFS';
import { Visualizer as DFS } from '../DFS';
import { Visualizer as BFSvsDFS } from '../bfs-vs-dfs';
import { Visualizer as Prims } from '../Prims';
import { Visualizer as Kruskals } from '../Kruskals';
import { Visualizer as Boruvkas } from '../Boruvkas';
import { Visualizer as Dijkstras } from '../Dijkstras';
import { Visualizer as TopSort } from '../TopSort';
import { Visualizer as Hamiltonian } from '../Hamiltonian';
import { Visualizer as Eulerian } from '../Eulerian';

const algorithms = {
  BFS,
  DFS,
  'bfs-vs-dfs': BFSvsDFS,
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
