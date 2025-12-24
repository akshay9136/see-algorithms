import { render, waitFor } from '@testing-library/react';
import { deleteNode, insertNode } from './test-utils/data-structures';
import { useRouter } from 'next/router';
import BST from '@/pages/data-structures/BST';

describe('BST Visualization', () => {
  var _container;

  beforeEach(async () => {
    useRouter.mockReturnValue({
      query: { nodes: 'WzUwLDI4LDQxLDMzLDc4LDU3XQ==' }, // 6 nodes
      isReady: true,
    });
    _container = render(<BST />).container;
    await waitFor(() => {
      // wait till the tree is rendered
      const node = _container.querySelector('#node0');
      expect(node?.dataset).toBeDefined();
    });
  });

  test('renders with initial nodes', () => {
    const nodes = _container.querySelectorAll('.node');
    expect(nodes).toHaveLength(6);
    expect(
      Array.from(nodes).map((el) => JSON.stringify(el.dataset))
    ).toMatchSnapshot();
  });

  test('inserts node at correct position', async () => {
    await insertNode(47);
    const nodes = _container.querySelectorAll('.node');
    expect(nodes).toHaveLength(7);
    expect(Object.values(nodes[6].dataset)).toEqual(['320', '230']);
  });

  test('deletes node at correct position', async () => {
    await deleteNode(28);
    await waitFor(() => {
      const node = _container.querySelector('#node2');
      expect(Object.values(node.dataset)).toEqual(['240', '110']);
    });
  });
});
