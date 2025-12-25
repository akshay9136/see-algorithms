import { render, waitFor } from '@testing-library/react';
import { runAnimation, testAnimation } from './test-utils/graph';
import { useRouter } from 'next/router';
import DFS from '@/pages/graph/DFS';
import BFS from '@/pages/graph/BFS';
import Dijkstras from '@/pages/graph/Dijkstras';
import Prims from '@/pages/graph/Prims';
import Kruskals from '@/pages/graph/Kruskals';
import Boruvkas from '@/pages/graph/Boruvkas';
import TopSort from '@/pages/graph/TopSort';
import App from '../mocks/context';

describe('Depth first search visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjQwMywieSI6NjZ9LHsieCI6MjQ4LCJ5IjoyODh9LHsieCI6NDAzLCJ5IjozOTh9LHsieCI6NTU4LCJ5IjoyODh9LHsieCI6NTU4LCJ5IjozOTh9LHsieCI6NDAzLCJ5IjoxNzd9LHsieCI6MjQ4LCJ5Ijo2Nn0seyJ4IjoyNDgsInkiOjM5OH1dLCJzZWdtZW50cyI6W1swLDVdLFswLDZdLFs1LDFdLFs1LDJdLFs1LDNdLFsxLDddLFsyLDRdLFsxLDJdLFszLDRdLFs1LDZdLFs2LDFdXSwibWF0cml4IjpbW251bGwsbnVsbCxudWxsLG51bGwsbnVsbCwwLDFdLFtudWxsLG51bGwsNyxudWxsLG51bGwsMiwxMCw1XSxbbnVsbCw3LG51bGwsbnVsbCw2LDNdLFtudWxsLG51bGwsbnVsbCxudWxsLDgsNF0sW251bGwsbnVsbCw2LDhdLFswLDIsMyw0LG51bGwsbnVsbCw5XSxbMSwxMCxudWxsLG51bGwsbnVsbCw5XSxbbnVsbCw1XV0sImRpcmVjdGVkIjpmYWxzZSwid2VpZ2h0cyI6W1tudWxsLG51bGwsbnVsbCxudWxsLG51bGwsMSwxXSxbbnVsbCxudWxsLDEsbnVsbCxudWxsLDEsMSwxXSxbbnVsbCwxLG51bGwsbnVsbCwxLDFdLFtudWxsLG51bGwsbnVsbCxudWxsLDEsMV0sW251bGwsbnVsbCwxLDFdLFsxLDEsMSwxLG51bGwsbnVsbCwxXSxbMSwxLG51bGwsbnVsbCxudWxsLDFdLFtudWxsLDFdXX0=';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/DFS',
    });
  });

  testAnimation(DFS, (container) => {
    const row = container.querySelector('#stack');
    const values = Array.from(row.children).map((el) => el.textContent);
    expect(values).toEqual(['G', 'A', 'B', 'F', 'C', 'D', 'E', 'H']);
  });
});

describe('Breadth first search visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjQwMywieSI6NjZ9LHsieCI6MjQ4LCJ5IjoyODh9LHsieCI6NDAzLCJ5IjozOTh9LHsieCI6NTU4LCJ5IjoyODh9LHsieCI6NTU4LCJ5IjozOTh9LHsieCI6NDAzLCJ5IjoxNzd9LHsieCI6MjQ4LCJ5Ijo2Nn0seyJ4IjoyNDgsInkiOjM5OH1dLCJzZWdtZW50cyI6W1swLDVdLFswLDZdLFs1LDFdLFs1LDJdLFs1LDNdLFsxLDddLFsyLDRdLFsxLDJdLFszLDRdLFs1LDZdLFs2LDFdXSwibWF0cml4IjpbW251bGwsbnVsbCxudWxsLG51bGwsbnVsbCwwLDFdLFtudWxsLG51bGwsNyxudWxsLG51bGwsMiwxMCw1XSxbbnVsbCw3LG51bGwsbnVsbCw2LDNdLFtudWxsLG51bGwsbnVsbCxudWxsLDgsNF0sW251bGwsbnVsbCw2LDhdLFswLDIsMyw0LG51bGwsbnVsbCw5XSxbMSwxMCxudWxsLG51bGwsbnVsbCw5XSxbbnVsbCw1XV0sImRpcmVjdGVkIjpmYWxzZSwid2VpZ2h0cyI6W1tudWxsLG51bGwsbnVsbCxudWxsLG51bGwsMSwxXSxbbnVsbCxudWxsLDEsbnVsbCxudWxsLDEsMSwxXSxbbnVsbCwxLG51bGwsbnVsbCwxLDFdLFtudWxsLG51bGwsbnVsbCxudWxsLDEsMV0sW251bGwsbnVsbCwxLDFdLFsxLDEsMSwxLG51bGwsbnVsbCwxXSxbMSwxLG51bGwsbnVsbCxudWxsLDFdLFtudWxsLDFdXX0=';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/BFS',
    });
  });

  testAnimation(BFS, (container) => {
    const row = container.querySelector('#queue');
    const values = Array.from(row.children).map((el) => el.textContent);
    expect(values).toEqual(['G', 'A', 'B', 'F', 'C', 'H', 'D', 'E']);
  });
});

describe('Dijkstras algorithm visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjI0OCwieSI6NjZ9LHsieCI6NTU4LCJ5Ijo2Nn0seyJ4IjoyNDgsInkiOjE3N30seyJ4IjoyNDgsInkiOjI4OH0seyJ4Ijo0MDMsInkiOjM5OH0seyJ4Ijo0MDMsInkiOjY2fSx7IngiOjkzLCJ5IjoyODh9LHsieCI6MjQ4LCJ5IjozOTh9XSwic2VnbWVudHMiOltbMCwyXSxbMCw1XSxbMiwzXSxbMiw2XSxbNSwxXSxbMyw0XSxbMyw3XSxbMiw1XSxbMyw2XSxbNyw2XV0sIm1hdHJpeCI6W1tudWxsLG51bGwsMCxudWxsLG51bGwsMV0sW251bGwsbnVsbCxudWxsLG51bGwsbnVsbCw0XSxbMCxudWxsLG51bGwsMixudWxsLDcsM10sW251bGwsbnVsbCwyLG51bGwsNSxudWxsLDgsNl0sW251bGwsbnVsbCxudWxsLDVdLFsxLDQsN10sW251bGwsbnVsbCwzLDgsbnVsbCxudWxsLG51bGwsOV0sW251bGwsbnVsbCxudWxsLDYsbnVsbCxudWxsLDldXSwiZGlyZWN0ZWQiOmZhbHNlLCJ3ZWlnaHRzIjpbW251bGwsbnVsbCw1LG51bGwsbnVsbCwxMF0sW251bGwsbnVsbCxudWxsLG51bGwsbnVsbCwyM10sWzUsbnVsbCxudWxsLDEyLG51bGwsMjEsMjRdLFtudWxsLG51bGwsMTIsbnVsbCwzMCxudWxsLDgsOV0sW251bGwsbnVsbCxudWxsLDMwXSxbMTAsMjMsMjFdLFtudWxsLG51bGwsMjQsOCxudWxsLG51bGwsbnVsbCwzXSxbbnVsbCxudWxsLG51bGwsOSxudWxsLG51bGwsM11dfQ==';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/Dijkstras',
    });
  });

  testAnimation(Dijkstras, (container) => {
    const row = container.querySelector('#dist > div');
    const values = Array.from(row.children).map((el) => el.textContent);
    // A:25, B:58, C:20, D:8, E:38, F:35, G:0, H:3
    expect(values).toEqual(['25', '58', '20', '8', '38', '35', '0', '3']);
  });
});

describe('Prims algorithm visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjI0OCwieSI6MTc3fSx7IngiOjI0OCwieSI6Mzk4fSx7IngiOjkzLCJ5IjozOTh9LHsieCI6NTU4LCJ5IjoxNzd9LHsieCI6NDAzLCJ5IjoxNzd9LHsieCI6NTU4LCJ5Ijo2Nn0seyJ4Ijo5MywieSI6Mjg4fSx7IngiOjQwMywieSI6Mjg4fV0sInNlZ21lbnRzIjpbWzAsMV0sWzAsNF0sWzAsNl0sWzAsN10sWzEsMl0sWzQsM10sWzQsNV0sWzEsNl0sWzcsM10sWzcsNF1dLCJtYXRyaXgiOltbbnVsbCwwLG51bGwsbnVsbCwxLG51bGwsMiwzXSxbMCxudWxsLDQsbnVsbCxudWxsLG51bGwsN10sW251bGwsNF0sW251bGwsbnVsbCxudWxsLG51bGwsNSxudWxsLG51bGwsOF0sWzEsbnVsbCxudWxsLDUsbnVsbCw2LG51bGwsOV0sW251bGwsbnVsbCxudWxsLG51bGwsNl0sWzIsN10sWzMsbnVsbCxudWxsLDgsOV1dLCJkaXJlY3RlZCI6ZmFsc2UsIndlaWdodHMiOltbbnVsbCwzMCxudWxsLG51bGwsMTEsbnVsbCw5LDIwXSxbMzAsbnVsbCw5LG51bGwsbnVsbCxudWxsLDI1XSxbbnVsbCw5XSxbbnVsbCxudWxsLG51bGwsbnVsbCwxOCxudWxsLG51bGwsMTFdLFsxMSxudWxsLG51bGwsMTgsbnVsbCw3LG51bGwsMTRdLFtudWxsLG51bGwsbnVsbCxudWxsLDddLFs5LDI1XSxbMjAsbnVsbCxudWxsLDExLDE0XV19';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/Prims',
    });
  });

  testAnimation(Prims);
});

describe('Kruskals algorithm visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjI0OCwieSI6MTc3fSx7IngiOjI0OCwieSI6Mzk4fSx7IngiOjkzLCJ5IjozOTh9LHsieCI6NTU4LCJ5IjoxNzd9LHsieCI6NDAzLCJ5IjoxNzd9LHsieCI6NTU4LCJ5Ijo2Nn0seyJ4Ijo5MywieSI6Mjg4fSx7IngiOjQwMywieSI6Mjg4fV0sInNlZ21lbnRzIjpbWzAsMV0sWzAsNF0sWzAsNl0sWzAsN10sWzEsMl0sWzQsM10sWzQsNV0sWzEsNl0sWzcsM10sWzcsNF1dLCJtYXRyaXgiOltbbnVsbCwwLG51bGwsbnVsbCwxLG51bGwsMiwzXSxbMCxudWxsLDQsbnVsbCxudWxsLG51bGwsN10sW251bGwsNF0sW251bGwsbnVsbCxudWxsLG51bGwsNSxudWxsLG51bGwsOF0sWzEsbnVsbCxudWxsLDUsbnVsbCw2LG51bGwsOV0sW251bGwsbnVsbCxudWxsLG51bGwsNl0sWzIsN10sWzMsbnVsbCxudWxsLDgsOV1dLCJkaXJlY3RlZCI6ZmFsc2UsIndlaWdodHMiOltbbnVsbCwzMCxudWxsLG51bGwsMTEsbnVsbCw5LDIwXSxbMzAsbnVsbCw5LG51bGwsbnVsbCxudWxsLDI1XSxbbnVsbCw5XSxbbnVsbCxudWxsLG51bGwsbnVsbCwxOCxudWxsLG51bGwsMTFdLFsxMSxudWxsLG51bGwsMTgsbnVsbCw3LG51bGwsMTRdLFtudWxsLG51bGwsbnVsbCxudWxsLDddLFs5LDI1XSxbMjAsbnVsbCxudWxsLDExLDE0XV19';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/Kruskals',
    });
  });

  testAnimation(Kruskals);
});

describe('Boruvkas algorithm visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjI0OCwieSI6MTc3fSx7IngiOjI0OCwieSI6Mzk4fSx7IngiOjkzLCJ5IjozOTh9LHsieCI6NTU4LCJ5IjoxNzd9LHsieCI6NDAzLCJ5IjoxNzd9LHsieCI6NTU4LCJ5Ijo2Nn0seyJ4Ijo5MywieSI6Mjg4fSx7IngiOjQwMywieSI6Mjg4fV0sInNlZ21lbnRzIjpbWzAsMV0sWzAsNF0sWzAsNl0sWzAsN10sWzEsMl0sWzQsM10sWzQsNV0sWzEsNl0sWzcsM10sWzcsNF1dLCJtYXRyaXgiOltbbnVsbCwwLG51bGwsbnVsbCwxLG51bGwsMiwzXSxbMCxudWxsLDQsbnVsbCxudWxsLG51bGwsN10sW251bGwsNF0sW251bGwsbnVsbCxudWxsLG51bGwsNSxudWxsLG51bGwsOF0sWzEsbnVsbCxudWxsLDUsbnVsbCw2LG51bGwsOV0sW251bGwsbnVsbCxudWxsLG51bGwsNl0sWzIsN10sWzMsbnVsbCxudWxsLDgsOV1dLCJkaXJlY3RlZCI6ZmFsc2UsIndlaWdodHMiOltbbnVsbCwzMCxudWxsLG51bGwsMTEsbnVsbCw5LDIwXSxbMzAsbnVsbCw5LG51bGwsbnVsbCxudWxsLDI1XSxbbnVsbCw5XSxbbnVsbCxudWxsLG51bGwsbnVsbCwxOCxudWxsLG51bGwsMTFdLFsxMSxudWxsLG51bGwsMTgsbnVsbCw3LG51bGwsMTRdLFtudWxsLG51bGwsbnVsbCxudWxsLDddLFs5LDI1XSxbMjAsbnVsbCxudWxsLDExLDE0XV19';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/Boruvkas',
    });
  });

  testAnimation(Boruvkas);
});

describe('Topological sorting visualization', () => {
  beforeEach(() => {
    const skeleton =
      'eyJwb2ludHMiOlt7IngiOjU1OCwieSI6MTc3fSx7IngiOjI0OCwieSI6NjZ9LHsieCI6MjQ4LCJ5IjoxNzd9LHsieCI6NTU4LCJ5IjoyODh9LHsieCI6OTMsInkiOjI4OH0seyJ4IjoyNDgsInkiOjI4OH0seyJ4Ijo0MDMsInkiOjI4OH0seyJ4Ijo1NTgsInkiOjM5OH1dLCJzZWdtZW50cyI6W1swLDNdLFswLDZdLFszLDddLFs2LDJdLFs2LDVdLFsyLDFdLFsyLDRdLFszLDZdLFs1LDRdLFs2LDddXSwibWF0cml4IjpbW251bGwsbnVsbCxudWxsLDAsbnVsbCxudWxsLDFdLFtudWxsLG51bGwsbnVsbF0sW251bGwsNSxudWxsLG51bGwsNixudWxsLG51bGxdLFtudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCw3LDJdLFtudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sW251bGwsbnVsbCxudWxsLG51bGwsOCxudWxsLG51bGxdLFtudWxsLG51bGwsMyxudWxsLG51bGwsNCxudWxsLDldLFtudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXV0sImRpcmVjdGVkIjp0cnVlLCJ3ZWlnaHRzIjpbW251bGwsbnVsbCxudWxsLDEsbnVsbCxudWxsLDFdLG51bGwsW251bGwsMSxudWxsLG51bGwsMV0sW251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLDEsMV0sbnVsbCxbbnVsbCxudWxsLG51bGwsbnVsbCwxXSxbbnVsbCxudWxsLDEsbnVsbCxudWxsLDEsbnVsbCwxXV19';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/graph/TopSort',
    });
  });

  test('runs animation correctly', async () => {
    const { container } = render(<App Component={TopSort} />);
    await waitFor(() => {
      const nodes = container.querySelectorAll('.vrtx');
      expect(nodes).toHaveLength(8);
    });
    await runAnimation();
    const row = container.querySelector('#sorted');
    const values = Array.from(row.children).map((el) => el.textContent);
    expect(values).toEqual(['A', 'D', 'G', 'H', 'F', 'C', 'E', 'B']);
  });
});
