import { act, fireEvent, render, within } from '@testing-library/react';
import DSInput from '@/components/common/ds-input';
import TreeInput from '@/components/common/tree-input';
import { newIterator } from '@/common/iterator';

jest.mock('@/common/iterator', () => ({ newIterator: jest.fn() }));

let iterators;
beforeEach(() => {
  jest.clearAllMocks();
  iterators = [];
  newIterator.mockImplementation(() => {
    let finish;
    const running = new Promise((resolve) => {
      finish = resolve;
    });
    const iterator = {
      start: jest.fn(() => running),
      stop: jest.fn(),
      exit: jest.fn(),
      finish,
    };
    iterators.push(iterator);
    return iterator;
  });
});

const buttons = [
  { text: 'Insert', validate: true, onClick: jest.fn() },
  { text: 'Delete', validate: true, onClick: jest.fn() },
];

function mount(props = {}) {
  const view = render(<TreeInput buttons={buttons} value={42} {...props} />);
  return { ...view, controls: within(view.container) };
}

function play(controls, name = 'Play') {
  fireEvent.click(controls.getByRole('button', { name }));
}

test('plain DSInput starts operations directly from their buttons', async () => {
  const view = render(<DSInput buttons={buttons} value={42} />);
  const controls = within(view.container);
  expect(controls.queryByRole('group', { name: 'Tree operation' })).toBeNull();
  expect(controls.getByTitle('Pause/Play')).toBeDisabled();
  fireEvent.click(controls.getByRole('button', { name: 'Insert' }));
  expect(newIterator).toHaveBeenCalledTimes(1);
  expect(controls.getByTitle('Pause/Play')).toBeEnabled();
  await act(() => iterators[0].finish());
  expect(controls.getByRole('button', { name: 'Insert' })).toBeEnabled();
});

test('the shared hook keeps plain and selector inputs independent', async () => {
  const plain = render(<DSInput buttons={buttons} value={42} />);
  const controls = within(plain.container);
  const selector = mount();
  fireEvent.click(controls.getByRole('button', { name: 'Insert' }));
  play(selector.controls);
  fireEvent.click(controls.getByTitle('Pause/Play'));
  expect(iterators[0].stop).toHaveBeenCalledTimes(1);
  expect(iterators[1].stop).not.toHaveBeenCalled();
  plain.unmount();
  expect(iterators[0].exit).toHaveBeenCalledTimes(1);
  expect(iterators[1].exit).not.toHaveBeenCalled();
  await act(() => iterators.forEach((iterator) => iterator.finish()));
  expect(selector.controls.getByRole('button', { name: 'Play' })).toBeEnabled();
});

test('pausing, resuming, and unmounting affect only the owning input', async () => {
  const [first, second] = [mount(), mount()];
  play(first.controls);
  play(second.controls);
  expect(iterators).toHaveLength(2);
  play(first.controls, 'Pause');
  expect(first.controls.getByRole('button', { name: 'Play' })).toBeEnabled();
  expect(iterators[0].stop).toHaveBeenCalledTimes(1);
  expect(iterators[1].stop).not.toHaveBeenCalled();
  expect(second.controls.getByRole('button', { name: 'Pause' })).toBeEnabled();
  play(first.controls);
  expect(iterators[0].start).toHaveBeenCalledTimes(2);
  first.unmount();
  expect(iterators[0].exit).toHaveBeenCalledTimes(1);
  expect(iterators[1].exit).not.toHaveBeenCalled();
  await act(() => iterators.forEach((iterator) => iterator.finish()));
  expect(second.controls.getByRole('button', { name: 'Play' })).toBeEnabled();
});

test('comparison playback completes only after all animations finish', async () => {
  const { controls } = mount({ allButtons: [...buttons, ...buttons] });
  play(controls);
  expect(newIterator).toHaveBeenCalledTimes(2);
  await act(() => iterators[0].finish());
  expect(controls.getByRole('button', { name: 'Pause' })).toBeEnabled();
  expect(controls.getByRole('button', { name: 'Insert' })).toBeDisabled();
  await act(() => iterators[1].finish());
  expect(controls.getByRole('button', { name: 'Play' })).toBeEnabled();
  expect(controls.getByRole('button', { name: 'Insert' })).toBeEnabled();
});
