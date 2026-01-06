import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { Colors } from '@/common/constants';
import App from '../../mocks/context';

export async function runAnimation(source) {
  const input = screen.queryByLabelText('Source');
  if (input) {
    const event = { target: { value: source } };
    fireEvent.change(input, event);
  }
  // click the play button to start animation
  const button = screen.getByRole('button', { name: /play/i });
  fireEvent.click(button);
  await screen.findByTestId('PauseIcon');
  // animation is running
  await screen.findByTestId('PlayArrowIcon');
  // animation ended
}

export async function renderGraph(Component) {
  const { container } = render(<App Component={Component} />);
  await waitFor(() => {
    // wait till the graph is rendered
    const nodes = container.querySelectorAll('.vrtx');
    expect(nodes).toHaveLength(8);
  });
  return container;
}

export function testAnimation(Component, callback) {
  test('runs animation correctly', async () => {
    const container = await renderGraph(Component);
    await runAnimation('G');
    const query = `.edge[stroke="${Colors.visited}"]`;
    const path = container.querySelectorAll(query);
    expect(path).toMatchSnapshot();
    if (callback) callback(container);
  });
}

export function testShareLink() {
  test('copies sharable link to clipboard', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });
    fireEvent.click(screen.getByTestId('ShareIcon'));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    await screen.findByRole('presentation');
  });
}

export async function clearGraph(container) {
  const button = screen.getByRole('button', { name: /clear/i });
  fireEvent.click(button);
  await waitFor(() => {
    expect(container.querySelector('.vrtx')).toBe(null);
    expect(container.querySelector('.edge')).toBe(null);
  });
}

export const userClick = (el) => {
  return (x, y) => {
    fireEvent.mouseDown(el, { clientX: x, clientY: y });
    fireEvent.click(el, { clientX: x, clientY: y });
  };
};

export const userDrag = (el) => {
  return (x, y) => {
    fireEvent.mouseDown(el, { clientX: x, clientY: y });
    fireEvent.mouseMove(el, { clientX: x + 10, clientY: y });
    fireEvent.mouseMove(el, { clientX: x + 20, clientY: y });
    fireEvent.click(el, { clientX: x + 20, clientY: y });
  };
};
