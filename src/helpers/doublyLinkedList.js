import { showError, sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

const STEP_SIZE = 75 + 30;
const NODE_TOP = 80;
const NEXT_EDGE_TOP = 92;
const PREV_EDGE_TOP = 106;
const EDGE_WIDTH = 40;

const delay = 500;
const dur = { duration: 0.5 };

const arrowStyle = {
  borderTopColor: '#555',
  transform: 'rotate(-90deg)',
  left: 'unset',
  right: -2,
};

function doublyLinkedList({ tx, txy, bgcolor, animate }) {
  const head = { key: 0 };
  const arr = [head];

  const length = (node) => (node ? 1 + length(node.next) : -1);

  const insertAtHead = (value) => {
    if (!head.next) return insertAtTail(value);
    return insertAt(value, 0);
  };

  const insertAtTail = async (value) => {
    const node = await findNode((a) => !a.next);
    const key = arr.length;
    const nextEid = `.edge${key - 1}Next`;
    const prevEid = `.edge${key - 1}Prev`;
    node.next = { value, key, nextEid, prevEid, prev: node };
    arr.push(node.next);
    sound('pop');
    const nodeX = length(head) * STEP_SIZE;
    txy(`#box${key}`, nodeX, NODE_TOP);

    // arrow points right
    await txy(nextEid, nodeX - EDGE_WIDTH, NEXT_EDGE_TOP);
    $(`.arrow${key - 1}Next`).css(arrowStyle);
    animate(nextEid, { opacity: 1, width: EDGE_WIDTH });

    // arrow points left
    await txy(prevEid, nodeX + 10, PREV_EDGE_TOP);
    $(`.arrow${key - 1}Prev`).css(arrowStyle);
    animate(prevEid, { opacity: 1, width: EDGE_WIDTH, rotate: 180 });
  };

  const findNode = async (predicate) => {
    let node = head, vi = 0;
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

  const insertAt = async (value, k) => {
    if (k === length(head)) return insertAtTail(value);

    if (k > length(head) || k < 0) {
      showError('Index is out of bounds.');
      return true;
    }
    const prev = await findNode((_, i) => i === k);
    const key = arr.length;
    const nextEid = `.edge${key - 1}Next`;
    const prevEid = `.edge${key - 1}Prev`;
    const nodeX = (k + 1) * STEP_SIZE;
    const centerX = k * STEP_SIZE + STEP_SIZE / 2;

    await tx(`#box${key}`, centerX);
    await sleep(delay);
    shiftNodes(prev, k + 2);
    txy(`#box${key}`, nodeX, NODE_TOP);
    sound('pop');

    txy(nextEid, nodeX - EDGE_WIDTH, NEXT_EDGE_TOP);
    $(`.arrow${key - 1}Next`).css(arrowStyle);
    animate(nextEid, { rotate: 0, width: EDGE_WIDTH, opacity: 1 }, dur);

    txy(prevEid, nodeX + 10, PREV_EDGE_TOP);
    $(`.arrow${key - 1}Prev`).css(arrowStyle);
    animate(prevEid, { rotate: 180, width: EDGE_WIDTH, opacity: 1 }, dur);

    await sleep(delay);
    const newNode = { value, key, nextEid, prevEid, prev };
    newNode.next = prev.next;
    prev.next = newNode;
    if (newNode.next) {
      newNode.next.prev = newNode;
    }
    arr.push(newNode);
  };

  const shiftNodes = (node, vi) => {
    let cur = node.next;
    while (cur) {
      const shiftX = vi * STEP_SIZE;
      tx(`#box${cur.key}`, shiftX);
      tx(cur.nextEid, shiftX - EDGE_WIDTH);
      tx(cur.prevEid, shiftX + 10);
      cur = cur.next;
      vi++;
    }
  };

  const deleteAt = async (k) => {
    if (k >= length(head) || k < 0) {
      showError('Index is out of bounds.');
      return;
    }
    const node = await findNode((_, i) => i - 1 === k);
    animate(`#box${node.key}`, { opacity: 0 });
    animate(node.nextEid, { opacity: 0 });
    animate(node.prevEid, { opacity: 0 });
    await sleep(delay);
    if (node.next) sound('swap');
    shiftNodes(node, k + 1);
    node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
  };

  return { insertAtHead, insertAtTail, insertAt, deleteAt };
}

export default doublyLinkedList;
