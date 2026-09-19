import { useEffect, useState, useRef } from 'react';
import { showError, sleep } from '@/common/utils';
import useAnimator from '@/hooks/useAnimator';

export default function useLinkedListBase({ createList, delay = 500 }) {
  const [nodes, setNodes] = useState(['H']);
  const [scope, animator] = useAnimator();
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const listRef = useRef(null);

  const getList = () => listRef.current;

  async function* insertAtHead(value) {
    const { setStatus } = inputRef2.current;
    setStatus(1);
    setNodes((prev) => [...prev, value]);
    await sleep(delay);
    await getList().insertAtHead(value);
    setStatus(0);
  }

  async function* insertAtTail(value) {
    const { setStatus } = inputRef2.current;
    setStatus(1);
    setNodes((prev) => [...prev, value]);
    await sleep(delay);
    await getList().insertAtTail(value);
    setStatus(0);
  }

  async function* insertAt(index) {
    const { value, setStatus } = inputRef1.current;
    if (typeof value !== 'number') {
      showError('Please enter a number.');
      return;
    }
    setStatus(1);
    setNodes((prev) => [...prev, value]);
    await sleep(delay);
    const flag = await getList().insertAt(value, index);
    await sleep(delay);
    if (flag) setNodes((prev) => [...prev]); // if index is out of bounds trigger re-render if needed, but prev is better
    setStatus(0);
  }

  async function* deleteAt(index) {
    const { setStatus } = inputRef1.current;
    setStatus(1);
    await getList().deleteAt(index);
    setStatus(0);
  }

  const reset = () => {
    setNodes(['H']);
    listRef.current = createList(animator);
  };

  const buttons = [
    { text: 'Insert at head', onClick: insertAtHead, validate: true },
    { text: 'Insert at tail', onClick: insertAtTail, validate: true },
    { text: 'Insert', onClick: insertAt, validate: true },
    { text: 'Delete', onClick: deleteAt, validate: true, keepEmpty: true },
    { text: 'Clear', onClick: reset, disabled: nodes.length <= 1 },
  ];

  useEffect(() => {
    reset();
    animator.txy(`#box${0}`, 0, 80, 0);
    return reset;
  }, []);

  return { 
    buttons,
    inputRefs: [inputRef1, inputRef2],
    scope,
    nodes
  };
}
