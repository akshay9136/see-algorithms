import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import App from '../../mocks/context';

export async function renderTree(Component) {
  const { container } = render(<App Component={Component} />);
  await waitFor(() => {
    // wait till the tree is rendered
    const node = container.querySelector('#node0');
    expect(node?.dataset).toBeDefined();
  });
  return container;
}

export function testShareLink(Component) {
  test('copies sharable link to clipboard', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });
    await renderTree(Component);
    const button = screen.getByTestId('ShareIcon');
    fireEvent.click(button);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    await screen.findByRole('presentation');
  });
}

export async function insertNode(value) {
  const input = screen.getByLabelText(/Enter a number/i);
  const event = { target: { value: String(value) } };
  fireEvent.change(input, event);

  // click the insert button to start animation
  const button = await screen.findByRole('button', { name: /insert/i });
  fireEvent.click(button);
  await waitFor(() => expect(button).toBeDisabled());
  // animation is running
  await waitFor(() => expect(button).not.toBeDisabled());
  // animation ended
}

export async function deleteNode(value) {
  const input = screen.getByLabelText(/Enter a number/i);
  const event = { target: { value: String(value) } };
  fireEvent.change(input, event);

  // click the delete button to start animation
  const button = await screen.findByRole('button', { name: /delete/i });
  fireEvent.click(button);
  await waitFor(() => expect(button).toBeDisabled());
  // animation is running
  await waitFor(() => expect(button).not.toBeDisabled());
  // animation ended
}
