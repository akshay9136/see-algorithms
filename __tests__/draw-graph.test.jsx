import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  clearGraph,
  renderGraph,
  testShareLink,
  userClick,
  userDrag,
} from './test-utils/graph';
import Dijkstras from '@/pages/graph/Dijkstras';

describe('Graph visualization editor', () => {
  var container,
    selectAll = (query) => container.querySelectorAll(query);

  beforeEach(async () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.3);
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
    const input = screen.queryByLabelText('Src');
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
    const plane = container.querySelector('.plane');
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

  test('undo and redo operations', async () => {
    await clearGraph(container);
    const plane = container.querySelector('.plane');
    const fireClick = userClick(plane);
    fireClick(100, 100);
    fireClick(200, 100);
    expect(selectAll('.vrtx')).toHaveLength(2);
    fireClick(100, 100);
    fireEvent.mouseMove(plane, { clientX: 150, clientY: 100 });
    fireClick(200, 100);
    expect(selectAll('.edge')).toHaveLength(1);

    // Undo edge addition
    fireEvent.click(screen.getByTitle('Undo'));
    await waitFor(() => {
      expect(selectAll('.edge')).toHaveLength(0);
      expect(selectAll('.vrtx')).toHaveLength(2);
    });
    // Undo vertex addition
    fireEvent.click(screen.getByTitle('Undo'));
    await waitFor(() => {
      expect(selectAll('.vrtx')).toHaveLength(1);
    });
    // Redo vertex addition
    fireEvent.click(screen.getByTitle('Redo'));
    await waitFor(() => {
      expect(selectAll('.vrtx')).toHaveLength(2);
      expect(selectAll('.edge')).toHaveLength(0);
    });
    // Redo edge addition
    fireEvent.click(screen.getByTitle('Redo'));
    await waitFor(() => {
      expect(selectAll('.edge')).toHaveLength(1);
    });
  });

  test('renders saved data', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
    });
    const savedData = {
      id: '123',
      createdAt: new Date().toISOString(),
      data: '{"points":[{"x":100,"y":100},{"x":200,"y":100},{"x":150,"y":200}],"segments":[[0,1],[1,2]],"matrix":[[null,0,null],[0,null,1],[null,1,null]],"weights":[[null,5,null],[5,null,10],[null,10,null]],"directed":false}',
    };
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([savedData]) }),
    );
    container = await renderGraph(Dijkstras);
    const openBtn = await screen.findByText('Saved Data');
    fireEvent.click(openBtn);
    const items = await screen.findAllByRole('button');
    const savedItem = items.find((btn) => btn.textContent.includes('202'));
    fireEvent.click(savedItem);

    await waitFor(() => {
      expect(selectAll('.vrtx')).toHaveLength(3);
      expect(selectAll('.edge')).toHaveLength(2);
    });
  });
});
