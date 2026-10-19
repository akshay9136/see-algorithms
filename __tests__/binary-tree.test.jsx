import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  deleteNode,
  insertNode,
  mapDataset,
  mapInnerText,
  renderTree,
  testShareLink,
} from './test-utils/binary-tree';
import BST from '@/pages/data-structures/BST';
import AVL from '@/pages/data-structures/AVL';
import RedBlackTree from '@/pages/data-structures/RedBlackTree';
import SplayTree from '@/pages/data-structures/SplayTree';

describe('Binary search tree visualization', () => {
  let container;

  beforeEach(async () => {
    useRouter.mockReturnValue({
      query: { skeleton: 'WzUwLDI4LDQxLDMzLDc4LDU3XQ==' }, // 6 nodes,
      isReady: true,
      pathname: '/tree/BST',
      asPath: '/tree/BST',
    });

    container = await renderTree(BST);
  });

  testShareLink();

  test('renders tree with initial nodes', () => {
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(6);
    expect(mapDataset(nodes)).toMatchSnapshot();
  });

  test('removes all nodes on clear', async () => {
    fireEvent.click(screen.getByText('Clear'));
    await waitFor(() => {
      expect(container.querySelector('.node')).toBe(null);
    });
  });

  test('inserts node at correct position', async () => {
    await insertNode(47);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(7);
    expect(Object.values(nodes[6].dataset)).toEqual(['320', '230']);
  });

  test('deletes node at correct position', async () => {
    await deleteNode(28);
    const nodes = container.querySelectorAll('.node');
    expect(Object.values(nodes[2].dataset)).toEqual(['240', '110']);
    expect(mapDataset(nodes)).toMatchSnapshot();
  });

  test('deletes node having children', async () => {
    await insertNode(23);
    await deleteNode(28);
    const nodes = container.querySelectorAll('.node');
    expect(Object.values(nodes[3].dataset)).toEqual(['240', '110']);
    expect(mapDataset(nodes)).toMatchSnapshot();
  });

  test('undo and redo operations', async () => {
    await insertNode(47);
    expect(container.querySelectorAll('.node')).toHaveLength(7);

    fireEvent.click(screen.getByTitle('Undo'));
    await waitFor(() => {
      expect(container.querySelectorAll('.node')).toHaveLength(6);
    });
    fireEvent.click(screen.getByTitle('Redo'));
    await waitFor(() => {
      expect(container.querySelectorAll('.node')).toHaveLength(7);
    });
  });

  test('renders saved data correctly', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
    });

    const savedData = {
      id: '123',
      createdAt: new Date().toISOString(),
      data: JSON.stringify([50, 28, 41, 62, 75]),
    };

    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
        json: () => Promise.resolve([savedData]),
      }),
    );

    container = await renderTree(BST);
    const openBtn = await screen.findByText('Saved Data');
    fireEvent.click(openBtn);
    const savedItem = await screen.findByText(/202/);
    fireEvent.click(savedItem);

    await waitFor(() => {
      expect(container.querySelectorAll('.node')).toHaveLength(5);
    });
  });

  test('shows error when inserting duplicate node', async () => {
    await insertNode(50);
    // error toast should appear (no extra node added)
    expect(container.querySelectorAll('.node')).toHaveLength(6);
    await screen.findByRole('presentation');
  });

  test('shows no change when deleting non-existent node', async () => {
    await deleteNode(99);
    // Tree unchanged — still 6 nodes
    expect(container.querySelectorAll('.node')).toHaveLength(6);
  });
});

describe('Splay tree deletion', () => {
  let container;

  beforeEach(async () => {
    useRouter.mockReturnValue({
      query: { skeleton: btoa(JSON.stringify([50, 30, 70, 20, 40, 60, 80])) },
      isReady: true,
      pathname: '/data-structures/SplayTree',
      asPath: '/data-structures/SplayTree',
    });
    container = await renderTree(SplayTree);
  });

  test('restores the tree with undo and redo', async () => {
    expect(screen.getByRole('button', { name: /delete/i })).toBeEnabled();
    await deleteNode(50);
    const nodes = container.querySelectorAll('.node');
    expect(nodes[4].dataset.ty).toBe('50');

    fireEvent.click(screen.getByTitle('Undo'));
    await waitFor(() => {
      const nodes = container.querySelectorAll('.node');
      const expected = ['50', '30', '20', '40', '70', '60', '80'];
      expect(mapInnerText(nodes)).toEqual(expected);
    });
    fireEvent.click(screen.getByTitle('Redo'));
    await waitFor(() => {
      const nodes = container.querySelectorAll('.node');
      const expected = ['40', '30', '20', '70', '60', '80'];
      expect(mapInnerText(nodes)).toEqual(expected);
    });
    await insertNode(50);
    expect(container.querySelectorAll('.node')).toHaveLength(7);
  });
});

describe('AVL tree visualization', () => {
  let container;

  beforeEach(async () => {
    const query = { skeleton: 'WzMyLDIyLDc1LDY1XQ==' }; // 4 nodes
    useRouter.mockReturnValue({
      query,
      isReady: true,
      pathname: '/tree/AVL',
      asPath: '/tree/AVL',
    });
    container = await renderTree(AVL);
  });

  test('renders tree with initial nodes', async () => {
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(4);
    expect(mapDataset(nodes)).toMatchSnapshot();
    const spans = container.querySelectorAll('.node span');
    expect(mapInnerText(spans)).toEqual(['-1', '0', '1', '0']);
  });

  test('inserts node and rebalances tree', async () => {
    await insertNode(69);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(5);
    expect(Object.values(nodes[2].dataset)).toEqual(['360', '170']);
    await insertNode(36);
    const nodes2 = container.querySelectorAll('.node');
    expect(Object.values(nodes2[3].dataset)).toEqual(['280', '50']);
    expect(mapDataset(nodes2)).toMatchSnapshot();
  });

  test('deletes node and rebalances tree', async () => {
    await deleteNode(22);
    const nodes = container.querySelectorAll('.node');
    expect(mapDataset(nodes)).toMatchSnapshot();
  });
});

describe('Red-Black tree visualization', () => {
  let container;

  beforeEach(async () => {
    const skeleton =
      'W1s2NSwiQiJdLFszMCwiUiJdLFsxNCwiQiJdLFs1MywiQiJdLFs0MiwiUiJdLFs2MCwiUiJdLFs4NCwiQiJdXQ==';

    useRouter.mockReturnValue({
      query: { skeleton },
      isReady: true,
      pathname: '/tree/RedBlackTree',
      asPath: '/tree/RedBlackTree',
    });

    container = await renderTree(RedBlackTree);
  });

  test('renders tree with initial nodes', () => {
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(7);
    expect(mapDataset(nodes)).toMatchSnapshot();
    const spans = container.querySelectorAll('.node span');
    expect(mapInnerText(spans)).toEqual(['B', 'R', 'B', 'B', 'R', 'R', 'B']);
  });

  test('inserts node and rebalances tree', async () => {
    await insertNode(35);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(8);
    expect(Object.values(nodes[3].dataset)).toEqual(['250', '50']);
    expect(Object.values(nodes[5].dataset)).toEqual(['280', '170']);
    expect(mapDataset(nodes)).toMatchSnapshot();
  });
});
