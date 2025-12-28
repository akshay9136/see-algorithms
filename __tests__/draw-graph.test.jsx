import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  clearGraph,
  renderGraph,
  testShareLink,
  userClick,
  userDrag,
} from './test-utils/graph';
import Dijkstras from '@/pages/graph/Dijkstras';
import { useRouter } from 'next/router';

describe('Graph visualization editor', () => {
  var container;

  beforeEach(async () => {
    useRouter.mockReturnValue({
      query: {},
      isReady: true,
      pathname: '/graph/Dijkstras',
    });
    container = await renderGraph(Dijkstras);
  });

  testShareLink();

  test('shows alert if graph is empty', async () => {
    await clearGraph(container);
    const button = screen.getByRole('button', { name: /play/i });
    fireEvent.click(button);
    await screen.findByRole('presentation');
  });

  test('shows alert if source is missing', async () => {
    const input = screen.queryByLabelText('Source');
    fireEvent.change(input, { target: { value: '' } });
    const button = screen.getByRole('button', { name: /play/i });
    fireEvent.click(button);
    await screen.findByRole('presentation');
  });

  test('renders directed graph', async () => {
    const checkbox = screen.getByLabelText('Directed');
    fireEvent.click(checkbox);
    await waitFor(() => {
      const edge = container.querySelector('.edge');
      expect(edge.hasAttribute('marker-end')).toBe(true);
    });
    fireEvent.click(checkbox);
    await waitFor(() => {
      const edge = container.querySelector('.edge');
      expect(edge.hasAttribute('marker-end')).toBe(false);
    });
  });

  test('draws graph using mouse events', async () => {
    const checkbox = screen.getByLabelText('Directed');
    fireEvent.click(checkbox);
    const selectAll = (query) => container.querySelectorAll(query);
    await clearGraph(container);
    const plane = container.querySelector('#plane');
    const fireClick = userClick(plane);
    fireClick(100, 100);
    fireClick(200, 100);
    expect(selectAll('.vrtx')).toHaveLength(2);
    fireClick(100, 100);
    fireEvent.mouseMove(plane, { clientX: 150, clientY: 100 });
    fireClick(200, 100);
    fireClick(200, 100);
    fireClick(150, 200);
    expect(selectAll('.vrtx')).toHaveLength(3);
    expect(selectAll('.edge')).toHaveLength(2);
    userDrag(plane)(150, 200); // drags to x + 20
    fireClick(170, 200);
    fireClick(200, 100);
    expect(selectAll('.vrtx')).toHaveLength(3);
    expect(selectAll('.edge')).toHaveLength(3);
  });
});
