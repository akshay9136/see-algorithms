import { sleep, sound } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

const NODE_WIDTH = 60;
const SPACING = 30;
const NODE_TOP = 80;
const EDGE_TOP = 98;
const EDGE_WIDTH = 40;

const delay = 500;

const arrowStyle = {
  borderTopColor: '#555',
  transform: 'rotate(-90deg)',
  left: 'unset',
  right: -2, // arrow offset
};

function linkedList({ tx, ty, txy, bgcolor, animate }) {
  const head = { index: 0 };
  const arr = [head];

  const insertAtHead = async (value) => {
    if (!head.next) return insertAtTail(value);
    const index = arr.length;
    const dur = { duration: 0.5 };
    await txy(`#edge${index - 1}`, 30, 80);
    animate(`#edge${index - 1}`, { rotate: -90 }, dur);
    bgcolor(`#edge${index - 1}`, Colors.stroke);
    $(`#arrow${index - 1}`).css(arrowStyle);
    const j = head.next.index;
    animate(`#edge${j - 1}`, { rotate: 45, width: 55 }, dur);
    ty(`#edge${j - 1}`, 40);
    await sleep(delay * 2);
    let node = head;
    let vi = 1; // visible node index
    while (node.next) {
        node = node.next;
        const shiftX = (vi + 1) * (NODE_WIDTH + SPACING);
        tx(`#box${node.index}`, shiftX);
        tx(`#edge${node.index - 1}`, shiftX - EDGE_WIDTH);
        vi++;
    }
    sound('swap');
    const x = NODE_WIDTH + SPACING;
    txy(`#box${index}`, x, NODE_TOP);
    txy(`#edge${index - 1}`, x - EDGE_WIDTH, EDGE_TOP);
    animate(`#edge${index - 1}`, { rotate: 0 }, dur);
    animate(`#edge${j - 1}`, { rotate: 0, width: EDGE_WIDTH }, dur);
    ty(`#edge${j - 1}`, EDGE_TOP);
    node = { value, index, prev: head };
    node.next = head.next;
    head.next = node;
    arr.push(node);
  };

  const insertAtTail = async (value) => {
    await bgcolor(`#next${0}`, Colors.visited);
    await sleep(delay);
    var node = head;
    while (node.next) {
      await bgcolor(`#next${node.index}`, 'unset');
      node = node.next;
      await bgcolor(`#next${node.index}`, Colors.visited);
      await sleep(delay);
    }
    await bgcolor(`#next${node.index}`, 'unset');
    const index = arr.length;
    node.next = { value, index, prev: node };
    arr.push(node.next);
    sound('pop');
    const x = index * (NODE_WIDTH + SPACING);
    txy(`#box${index}`, x, NODE_TOP);
    await txy(`#edge${index - 1}`, x - EDGE_WIDTH, EDGE_TOP);
    bgcolor(`#edge${index - 1}`, Colors.stroke);
    $(`#arrow${index - 1}`).css(arrowStyle);
  };

  return {
    insertAtHead,
    insertAtTail,
  };
}

export default linkedList;
