import { screen, fireEvent, waitFor } from '@testing-library/react';

export async function insertNode(value) {
  const header = await screen.findByText(/Enter a number/i);
  const input = header.parentElement.querySelector('input[type="text"]');
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
  const header = await screen.findByText(/Enter a number/i);
  const input = header.parentElement.querySelector('input[type="text"]');
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
