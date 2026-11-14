import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import RedBlackTree from '@/pages/data-structures/RedBlackTree';
import SplayTree from '@/pages/data-structures/SplayTree';
import App from '../mocks/context';

function mount(Component, pathname, query = {}) {
  useRouter.mockReturnValue({
    query,
    isReady: true,
    pathname,
    asPath: pathname,
  });
  return render(<App Component={Component} />);
}

async function chooseExample(name) {
  fireEvent.click(screen.getByRole('button', { name: 'Examples' }));
  const popover = screen.getByRole('dialog', { name: 'Choose an example' });
  fireEvent.click(within(popover).getByRole('button', { name }));
  await waitFor(() => expect(popover).not.toBeInTheDocument());
}

beforeEach(() => {
  userEvent.setup();
  jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
});

afterEach(() => jest.restoreAllMocks());

test.each([
  [RedBlackTree, /Recolor after insertion/, 'Insert', '10'],
  [RedBlackTree, /Rotate after insertion/, 'Insert', '20'],
  [SplayTree, /Zig-zig after a search/, 'Search', '10'],
  [SplayTree, /Zig-zag after a search/, 'Search', '30'],
])(
  'runs the %p example %s from the separate picker',
  async (Page, name, operation, value) => {
    mount(Page, `/data-structures/${Page.name}`);
    const picker = screen.getByRole('button', { name: 'Examples' });
    const input = screen.getByLabelText(/Enter a number/i);
    expect(input.closest('.inputRow')).not.toContainElement(picker);
    await waitFor(() => expect(picker).toBeEnabled());
    await chooseExample(name);
    fireEvent.change(input, { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: operation }));
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: operation })).toBeEnabled(),
    );
  },
);
