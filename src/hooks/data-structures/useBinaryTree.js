import { Draggable, Edge, ExamplePicker, Node } from '@/components/common';
import { useAnimator, useSummary, useTreeControls, useTreeUrl } from '@/hooks';
import { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { randomKeys, showError, sleep } from '@/common/utils';
import { assignColors } from '@/helpers/redBlackTree';
import { treeExamples } from '@/data/examples';
import Paper from '@mui/material/Paper';

export default function useBinaryTree({
  createTree,
  hideButtons = [],
  treeType = 'search',
  randomNodes = randomKeys(),
  saveData,
}) {
  const [numbers, setNumbers] = useState([]);
  const [summary, explain, abort] = useSummary();
  const [scope, animator] = useAnimator();
  const [nodes, isReady] = useTreeUrl();
  const treeRef = useRef(null);
  const inputRef = useRef(null);
  const deletedRef = useRef({});
  const Tree = () => treeRef.current;
  const isRedBlack = treeType === 'red-black';

  const collect = isRedBlack
    ? () => Tree().collect((a) => [a.value, a.color])
    : () => Tree().collect();

  async function* insert(num) {
    if (numbers.includes(num) && !deletedRef.current[num]) {
      showError(`Node (${num}) already exists.`);
      return false;
    }
    if (!numbers.length) {
      treeRef.current = createTree(animator);
      deletedRef.current = {};
    }
    const keys = collect();
    explain({ keys, operation: 'Insert', input: num });
    history.push(keys);
    deletedRef.current[num] = false;
    setNumbers((prev) => [...prev, num]);
    yield 500;
    yield* Tree().insert(num);
    return true;
  }

  async function* remove(num) {
    if (numbers.includes(num)) {
      deletedRef.current[num] = true;
    }
    const keys = collect();
    explain({ keys, operation: 'Delete', input: num });
    yield 500;
    const affected = yield* Tree().deleteNode(num);
    if (affected !== undefined) {
      history.push(keys);
      if (!Tree().root()) setNumbers([]);
    }
    return true;
  }

  async function* splaySearch(num) {
    const keys = collect();
    if (treeType === 'splay') history.push(keys);
    explain({ keys, operation: 'Search', input: num });
    yield 500;
    yield* Tree().search(num);
    return true;
  }

  const newTree = async (keys) => {
    keys = keys || (isRedBlack ? assignColors(randomNodes) : randomNodes);
    const values = isRedBlack ? keys.map(([value]) => value) : keys;
    treeRef.current = createTree(animator);
    deletedRef.current = {};
    await sleep(100);
    // Insertion updates the rendered nodes and balance labels directly.
    flushSync(() => setNumbers(values));
    keys.forEach((a) => Tree()._insert(a));
  };

  const { history, controls } = useTreeControls({
    numbers,
    setNumbers,
    newTree,
    collect,
    onClear: abort,
  });

  const saveButton = {
    ...controls.SAVE,
    onClick: () => saveData(collect()),
  };

  const allButtons = [
    { text: 'Insert', onClick: insert, validate: true },
    {
      text: 'Search',
      onClick: splaySearch,
      validate: true,
      disabled: !numbers.length,
    },
    {
      text: 'Delete',
      onClick: remove,
      validate: true,
      disabled: !numbers.length,
    },
    controls.CLEAR,
    controls.UNDO,
    controls.REDO,
    controls.REFRESH,
    ...(saveData ? [saveButton] : []),
    controls.SHARE,
  ];

  useEffect(() => {
    if (isReady) newTree(nodes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, isReady]);

  const animation = (
    <Paper ref={scope} className="resizable">
      <Draggable>
        {numbers.slice(1).map((_, i) => (
          <Edge key={i} index={i} />
        ))}
        {numbers.map((num, i) => (
          <Node
            key={i}
            index={i}
            value={num}
            initial={{ opacity: 0 }}
            showBf={['avl', 'red-black'].includes(treeType)}
          />
        ))}
      </Draggable>
    </Paper>
  );

  const examples = treeExamples[treeType];
  const examplePicker = examples?.length > 0 ? (
    <ExamplePicker
      examples={examples}
      onSelect={({ keys, operation, value }) => {
        inputRef.current.loadExample(operation, value);
        controls.REFRESH.onClick(keys);
      }}
    />
  ) : null;

  return {
    animation,
    summary,
    examplePicker,
    inputRef,
    // eslint-disable-next-line react-hooks/refs
    buttons: allButtons.filter((btn) => !hideButtons.includes(btn.text)),
    refresh: controls.REFRESH.onClick,
  };
}
