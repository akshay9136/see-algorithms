import { screen, fireEvent, render } from '@testing-library/react';
import App from '../../mocks/context';

const numbers = [4, 1, 7, 3, 9, 2, 6, 8, 5];

export async function runAnimation(container) {
  fireEvent.mouseDown(screen.getByRole('combobox'));
  const option = await screen.findByText(String(numbers.length));
  fireEvent.click(option);
  const inputs = container.querySelectorAll('input[type="text"]');
  expect(inputs.length).toBe(numbers.length);

  numbers.forEach((v, i) => {
    const event = { target: { value: String(v) } };
    fireEvent.change(inputs[i], event);
  });
  // click the play button to start animation
  const playBtn = await screen.findByRole('button', { name: /play/i });
  fireEvent.click(playBtn);
  await screen.findByTestId('PauseIcon');
  // animation is running
  await screen.findByTestId('PlayArrowIcon');
  // animation ended
}

export function testAnimation(Component) {
  test('renders in correct order after animation', async () => {
    const { container } = render(<Component />);
    await runAnimation(container);
    const nodes = container.querySelectorAll('.numbox');
    expect(
      Array.from(nodes)
        .slice(0, numbers.length)
        .map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
}

export async function validateInput(Component) {
  const { container } = render(<App Component={Component} />);
  fireEvent.mouseDown(screen.getByRole('combobox'));
  const option = await screen.findByText(String(numbers.length));
  fireEvent.click(option);
  const input = container.querySelector('input[type="text"]');
  fireEvent.change(input, { target: { value: '' } });

  const button = screen.getByRole('button', { name: /play/i });
  fireEvent.click(button);
  await screen.findByRole('presentation');
}
