import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import {
  deleteNode,
  insertNode,
  renderTree,
  testShareLink,
} from './test-utils/binary-tree';
import BST from '@/pages/data-structures/BST';
import AVL from '@/pages/data-structures/AVL';

describe('Binary search tree visualization', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      query: { nodes: 'WzUwLDI4LDQxLDMzLDc4LDU3XQ==' }, // 6 nodes,
      isReady: true,
    });
  });

  testShareLink(BST);

  test('renders tree with initial nodes', async () => {
    const container = await renderTree(BST);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(6);
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });

  test('renders tree with random nodes', async () => {
    const container = await renderTree(BST);
    const clear = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clear);
    await waitFor(() => {
      expect(container.querySelector('.node')).toBe(null);
    });
    const refresh = screen.getByTestId('RefreshIcon');
    fireEvent.click(refresh);
    await waitFor(() => {
      const nodes = container.querySelectorAll('.node');
      expect(nodes).toHaveLength(6);
    });
  });

  test('inserts node at correct position', async () => {
    const container = await renderTree(BST);
    await insertNode(47);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(7);
    expect(Object.values(nodes[6].dataset)).toEqual(['320', '230']);
  });

  test('deletes node at correct position', async () => {
    const container = await renderTree(BST);
    await deleteNode(28);
    const nodes = container.querySelectorAll('.node');
    expect(Object.values(nodes[2].dataset)).toEqual(['240', '110']);
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });

  test('deletes node having children', async () => {
    const container = await renderTree(BST);
    await insertNode(23);
    await deleteNode(28);
    const nodes = container.querySelectorAll('.node');
    expect(Object.values(nodes[3].dataset)).toEqual(['240', '110']);
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});

describe('AVL tree visualization', () => {
  beforeEach(() => {
    const query = { nodes: 'WzMyLDIyLDc1LDY1XQ==' }; // 4 nodes
    useRouter.mockReturnValue({ query, isReady: true });
  });

  testShareLink(AVL);

  test('renders tree with initial nodes', async () => {
    const container = await renderTree(AVL);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(4);
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });

  test('inserts node and rebalances tree', async () => {
    const container = await renderTree(AVL);
    await insertNode(69);
    const nodes = container.querySelectorAll('.node');
    expect(nodes).toHaveLength(5);
    expect(Object.values(nodes[2].dataset)).toEqual(['360', '170']);
    await insertNode(36);
    const nodes2 = container.querySelectorAll('.node');
    expect(Object.values(nodes2[3].dataset)).toEqual(['280', '50']);
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });

  test('deletes node and rebalances tree', async () => {
    const container = await renderTree(AVL);
    await deleteNode(22);
    const nodes = container.querySelectorAll('.node');
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });
});
