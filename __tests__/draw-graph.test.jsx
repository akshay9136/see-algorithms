import { fireEvent, screen, waitFor } from '@testing-library/react';
import { clearGraph, renderGraph, testShareLink } from './test-utils/graph';
import { useRouter } from 'next/router';
import Dijkstras from '@/pages/graph/Dijkstras';

const userClick = (el) => {
  return (x, y) => {
    fireEvent.mouseDown(el, { clientX: x, clientY: y });
    fireEvent.click(el, { clientX: x, clientY: y });
  };
};

const userDrag = (el) => {
  return (x, y) => {
    fireEvent.mouseDown(el, { clientX: x, clientY: y });
    fireEvent.mouseMove(el, { clientX: x + 10, clientY: y });
    fireEvent.mouseMove(el, { clientX: x + 20, clientY: y });
  }
};

describe('Draw graph with custom controls', () => {
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
    await clearGraph(container);
    const plane = container.querySelector('#plane');
    const fireClick = userClick(plane);
    fireClick(100, 100);
    fireClick(200, 100);
    let nodes, edges;
    nodes = container.querySelectorAll('.vrtx');
    expect(nodes).toHaveLength(2);
    fireClick(100, 100);
    fireEvent.mouseMove(plane, { clientX: 150, clientY: 100 });
    fireClick(200, 100);
    fireClick(200, 100);
    fireClick(150, 200);
    nodes = container.querySelectorAll('.vrtx');
    expect(nodes).toHaveLength(3);
    edges = container.querySelectorAll('.edge');
    expect(edges).toHaveLength(2);
    userDrag(plane)(150, 200); // drags to x + 20
    fireClick(170, 200);
    fireClick(200, 100);
    nodes = container.querySelectorAll('.vrtx');
    expect(nodes).toHaveLength(3);
    edges = container.querySelectorAll('.edge');
    expect(edges).toHaveLength(3);
  });
});
