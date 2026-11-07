import { fireEvent, render, screen } from '@testing-library/react';
import { usePrefixTree } from '@/hooks/data-structures';
import { Visualizer } from '@/pages/data-structures/PrefixTree';

jest.mock('@/hooks/data-structures', () => ({ usePrefixTree: jest.fn() }));

let state;
beforeEach(() => {
  state = {
    word: 'apple',
    setWord: jest.fn(),
    running: false,
    words: ['apple'],
    canUndo: true,
    canRedo: false,
    handlers: {
      insert: jest.fn(),
      search: jest.fn(),
      deleteWord: jest.fn(),
      clearState: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
    },
  };
  usePrefixTree.mockImplementation(() => state);
});

test('selection waits for Play or Enter and retains the active operation', () => {
  render(<Visualizer />);
  const input = screen.getByLabelText('Enter a word:');
  const insert = screen.getByRole('button', { name: 'Insert' });
  const search = screen.getByRole('button', { name: 'Search' });
  const play = screen.getByRole('button', { name: 'Play' });

  expect(insert).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(play);
  expect(state.handlers.insert).toHaveBeenCalledTimes(1);
  fireEvent.click(search);
  fireEvent.click(search);
  expect(search).toHaveAttribute('aria-pressed', 'true');
  expect(state.handlers.search).not.toHaveBeenCalled();
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(state.handlers.search).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  fireEvent.click(play);
  expect(state.handlers.deleteWord).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
  expect(state.handlers.undo).toHaveBeenCalledTimes(1);
});

test('disables unavailable operations and locks controls while running', () => {
  const view = render(<Visualizer />);
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  state = { ...state, words: [] };
  view.rerender(<Visualizer />);
  expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled();
  fireEvent.keyDown(screen.getByLabelText('Enter a word:'), { key: 'Enter' });
  expect(state.handlers.deleteWord).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'Insert' }));
  expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
  state = { ...state, running: true };
  view.rerender(<Visualizer />);
  expect(screen.getByLabelText('Enter a word:')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Insert' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled();
});
