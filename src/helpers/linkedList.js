import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';
import { showToast } from '@/components/toast';

const STEP_SIZE = 60 + 30;
const NODE_TOP = 80;
const EDGE_TOP = 98;
const EDGE_WIDTH = 40;

const delay = 500;
const dur = { duration: 0.5 };

const arrowStyle = {
  borderTopColor: '#555',
  transform: 'rotate(-90deg)',
  left: 'unset',
  right: -2, // arrow offset
};

function linkedList({ tx, ty, txy, bgcolor, animate }) {
  const head = { index: 0 };
  const arr = [head];

  const length = (node) => (node ? 1 + length(node.next) : -1);

  const insertAtHead = (value) => {
    if (!head.next) return insertAtTail(value);
    return insertAtIndex(value, 0);
  };

  const insertAtTail = async (value) => {
    const node = await findNode((x) => !x.next);
    sound('pop');
    const index = arr.length;
    node.next = { value, index, prev: node };
    arr.push(node.next);
    const nodeX = length(head) * STEP_SIZE;
    txy(`#box${index}`, nodeX, NODE_TOP);
    await txy(`#edge${index - 1}`, nodeX - EDGE_WIDTH, EDGE_TOP);
    bgcolor(`#edge${index - 1}`, Colors.stroke);
    $(`#arrow${index - 1}`).css(arrowStyle);
  };

  const findNode = async (predicate) => {
    if (predicate(head, 0)) return head;
    let node = head.next, vi = 1;
    while (node) {
      await bgcolor(`#next${node.index}`, Colors.visited);
      await sleep(delay);
      await bgcolor(`#next${node.index}`, Colors.white);
      if (predicate(node, vi)) break;
      node = node.next;
      vi++;
    }
    return node;
  };

  const insertAtIndex = async (value, k) => {
    if (k >= length(head)) {
      return insertAtTail(value);
    }
    const prev = await findNode((_, i) => i === k);
    if (k > 0) sound('swap');
    const index = arr.length;
    await tx(`#box${index}`, k * STEP_SIZE);
    await txy(`#edge${index - 1}`, k * STEP_SIZE + 30, 80);
    animate(`#edge${index - 1}`, { rotate: -90 }, dur);
    bgcolor(`#edge${index - 1}`, Colors.stroke);
    $(`#arrow${index - 1}`).css(arrowStyle);
    const next = prev.next;
    animate(`#edge${next.index - 1}`, { rotate: 45, width: 55 }, dur);
    ty(`#edge${next.index - 1}`, 40);
    await sleep(delay * 2);
    sound('swap');
    shiftNodes(prev, k + 2);
    const nodeX = (k + 1) * STEP_SIZE;
    txy(`#box${index}`, nodeX, NODE_TOP);
    txy(`#edge${index - 1}`, nodeX - EDGE_WIDTH, EDGE_TOP);
    animate(`#edge${index - 1}`, { rotate: 0 }, dur);
    animate(`#edge${next.index - 1}`, { rotate: 0, width: EDGE_WIDTH }, dur);
    ty(`#edge${next.index - 1}`, EDGE_TOP);
    const newNode = { value, index, prev };
    newNode.next = prev.next;
    prev.next = newNode;
    arr.push(newNode);
  };

  const shiftNodes = (node, vi) => {
    let cur = node.next;
    while (cur) {
      const shiftX = vi * STEP_SIZE;
      tx(`#box${cur.index}`, shiftX);
      tx(`#edge${cur.index - 1}`, shiftX - EDGE_WIDTH);
      cur = cur.next;
      vi++;
    }
  };

  const deleteAtIndex = async (k) => {
    const node = await findNode((_, i) => i - 1 === k);
    if (!node) {
      showToast({
        message: 'Index is out of bound.',
        variant: 'error',
      });
      return;
    }
    animate(`#box${node.index}`, { opacity: 0 });
    animate(`#edge${node.index - 1}`, { opacity: 0 });
    await sleep(delay);
    sound('swap');
    shiftNodes(node, k + 1);
    node.prev.next = node.next;
    if (node.next) {
      node.next.prev = node.prev;
    }
  };

  return {
    insertAtHead,
    insertAtTail,
    insertAtIndex,
    deleteAtIndex,
  };
}

export default linkedList;
