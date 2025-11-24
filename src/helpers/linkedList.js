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
  const head = { key: 0, id: '#box0' };
  const arr = [head];

  const length = (node) => (node ? 1 + length(node.next) : -1);

  const insertAtHead = (value) => {
    if (!head.next) return insertAtTail(value);
    return insertAtIndex(value, 0);
  };

  const insertAtTail = async (value) => {
    const node = await findNode((x) => !x.next);
    sound('pop');
    const key = arr.length;
    const eid = `#edge${key - 1}`;
    node.next = { value, key, eid, prev: node };
    arr.push(node.next);
    const nodeX = length(head) * STEP_SIZE;
    txy(`#box${key}`, nodeX, NODE_TOP);
    await txy(eid, nodeX - EDGE_WIDTH, EDGE_TOP);
    $(`#arrow${key - 1}`).css(arrowStyle);
    bgcolor(eid, Colors.stroke);
  };

  const findNode = async (predicate) => {
    if (predicate(head, 0)) return head;
    let node = head.next, vi = 1;
    while (node) {
      await bgcolor(`#next${node.key}`, Colors.visited);
      await sleep(delay);
      await bgcolor(`#next${node.key}`, Colors.white);
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
    const key = arr.length;
    const eid = `#edge${key - 1}`;
    await tx(`#box${key}`, k * STEP_SIZE);
    await txy(eid, k * STEP_SIZE + 30, 80);
    animate(eid, { rotate: -90 }, dur);
    bgcolor(eid, Colors.stroke);
    $(`#arrow${key - 1}`).css(arrowStyle);
    const next = prev.next;
    animate(next.eid, { rotate: 45, width: 55 }, dur);
    ty(next.eid, 40);
    await sleep(delay * 2);
    sound('swap');
    shiftNodes(prev, k + 2);
    const nodeX = (k + 1) * STEP_SIZE;
    txy(`#box${key}`, nodeX, NODE_TOP);
    txy(eid, nodeX - EDGE_WIDTH, EDGE_TOP);
    animate(eid, { rotate: 0 }, dur);
    animate(next.eid, { rotate: 0, width: EDGE_WIDTH }, dur);
    ty(next.eid, EDGE_TOP);
    const newNode = { value, key, eid, prev };
    newNode.next = prev.next;
    prev.next = newNode;
    arr.push(newNode);
  };

  const shiftNodes = (node, vi) => {
    let cur = node.next;
    while (cur) {
      const shiftX = vi * STEP_SIZE;
      tx(`#box${cur.key}`, shiftX);
      tx(cur.eid, shiftX - EDGE_WIDTH);
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
    animate(node.id, { opacity: 0 });
    animate(node.eid, { opacity: 0 });
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
