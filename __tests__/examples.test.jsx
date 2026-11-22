import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import {
  graphExamples,
  treeExamples,
  createExampleGraph,
} from '@/data/examples';
import { useRouter } from 'next/router';
import App from '../mocks/context';
import userEvent from '@testing-library/user-event';
import BST from '@/pages/data-structures/BST';
import AVL from '@/pages/data-structures/AVL';
import RedBlackTree from '@/pages/data-structures/RedBlackTree';
import SplayTree from '@/pages/data-structures/SplayTree';

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
  [BST, /Delete the root with two children/, 'Delete', '50'],
  [BST, /Insert a new leaf/, 'Insert', '35'],
  [AVL, /Left-right \(LR\) rotation/, 'Insert', '25'],
  [AVL, /Right rotation \(LL imbalance\)/, 'Insert', '5'],
  [AVL, /Cascading rebalance after deletion/, 'Delete', '10'],
  [RedBlackTree, /Recolor after insertion/, 'Insert', '10'],
  [RedBlackTree, /LR rotation after insertion/, 'Insert', '20'],
  [RedBlackTree, /Delete a black leaf/, 'Delete', '10'],
  [RedBlackTree, /Promote a red child on deletion/, 'Delete', '20'],
  [RedBlackTree, /Fix via sibling rotation/, 'Delete', '10'],
  [SplayTree, /Zig-zig splays a deep left node/, 'Search', '10'],
  [SplayTree, /Zig-zag splays an inner node/, 'Search', '25'],
  [SplayTree, /Single zig to the root/, 'Search', '30'],
  [SplayTree, /Failed search splays the last node/, 'Search', '42'],
  [SplayTree, /Delete the root and join subtrees/, 'Delete', '40'],
])(
  'runs the %p example %s from the separate picker',
  async (Page, name, operation, value) => {
    mount(Page, `/data-structures/${Page.name}`);
    const picker = screen.getByRole('button', { name: 'Examples' });
    const input = screen.getByLabelText(/Enter a number/i);
    expect(input.closest('.inputRow')).not.toContainElement(picker);
    await waitFor(() => expect(picker).toBeEnabled());
    await chooseExample(name);
    expect(input).toHaveValue(value);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: operation })).toBeEnabled(),
    );
  },
);

describe('treeExamples and graphExamples data integrity', () => {
  test('all tree example keys are valid numbers below 100', () => {
    Object.entries(treeExamples).forEach(([_type, examples]) => {
      examples.forEach((example) => {
        expect(example.name).toBeTruthy();
        expect(example.prompt).toBeTruthy();
        expect(['Insert', 'Delete', 'Search']).toContain(example.operation);
        expect(typeof example.value).toBe('number');
        expect(example.value).toBeLessThan(100);
        example.keys.forEach((key) => {
          const val = Array.isArray(key) ? key[0] : key;
          expect(typeof val).toBe('number');
          expect(val).toBeLessThan(100);
          if (Array.isArray(key)) {
            expect(['R', 'B']).toContain(key[1]);
          }
        });
      });
    });
  });

  test('createExampleGraph correctly constructs graph matrix and segments', () => {
    Object.entries(graphExamples).forEach(([_algo, examples]) => {
      examples.forEach((example) => {
        expect(example.name).toBeTruthy();
        expect(example.prompt).toBeTruthy();
        const graph = createExampleGraph(example);
        expect(graph.points.length).toBe(example.positions.length);
        expect(graph.matrix.length).toBe(example.positions.length);
        expect(graph.segments.length).toBe(example.edges.length);
      });
    });
  });
});
