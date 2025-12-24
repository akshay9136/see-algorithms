import { screen, fireEvent } from '@testing-library/react';

export async function runAnimation(numbers) {
  const combobox = screen.getByRole('combobox');
  fireEvent.mouseDown(combobox);
  const option = await screen.findByText(String(numbers.length));
  fireEvent.click(option);
  const header = await screen.findByText(/Enter numbers/i);
  const inputs = header.parentElement.querySelectorAll('input[type="text"]');
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
