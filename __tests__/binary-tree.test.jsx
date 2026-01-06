import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
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
import RBT from '@/pages/data-structures/RedBlackTree';

describe('Binary search tree visualization', () => {
  var container;

  beforeEach(async () => {
    useRouter.mockReturnValue({
      query: { nodes: 'WzUwLDI4LDQxLDMzLDc4LDU3XQ==' }, // 6 nodes,
      isReady: true,
    });
    container = await renderTree(BST);
  });

  testShareLink();

  test('renders tree with initial nodes', () => {
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(6);
    expect(mapDataset(nodes)).toMatchSnapshot();
  });

  test('renders tree with random nodes', async () => {
    fireEvent.click(screen.getByText('Clear'));
    await waitFor(() => {
      expect(container.querySelector('.node')).toBe(null);
    });
    fireEvent.click(screen.getByTestId('RefreshIcon'));
    await waitFor(() => {
      const nodes = container.querySelectorAll('.node');
      expect(nodes).toHaveLength(6);
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
});

describe('AVL tree visualization', () => {
  var container;

  beforeEach(async () => {
    const query = { nodes: 'WzMyLDIyLDc1LDY1XQ==' }; // 4 nodes
    useRouter.mockReturnValue({ query, isReady: true });
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
  var container;

  beforeEach(async () => {
    const nodes =
      'W1s2NSwiQiJdLFszMCwiUiJdLFsxNCwiQiJdLFs1MywiQiJdLFs0MiwiUiJdLFs2MCwiUiJdLFs4NCwiQiJdXQ==';

    useRouter.mockReturnValue({ query: { nodes }, isReady: true });
    container = await renderTree(RBT);
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
