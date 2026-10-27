import { useEffect, useState, useRef } from 'react';
import useTreeUrl from '../useTreeUrl';
import useUndoRedo from '../useUndoRedo';
import prefixTree from '@/helpers/prefixTree';
import TrieCanvas from '@/components/trie-canvas';
import { showError } from '@/common/utils';

// Drive the async generator to completion
async function complete(gen) {
  let result;
  do result = await gen.next();
  while (!result.done);
  return result.value;
}

export default function usePrefixTree() {
  const treeRef = useRef(null);
  const Trie = () => {
    if (!treeRef.current) treeRef.current = prefixTree();
    return treeRef.current;
  };

  const [word, setWord] = useState('');
  const [trieState, setTrieState] = useState(() => Trie().snapshot());
  const [running, setRunning] = useState(false);
  const [words, setWords] = useState([]);
  const [nodes, isReady] = useTreeUrl();
  const history = useUndoRedo();

  const setSnapshot = (snap) => setTrieState({ ...snap });

  const validate = () => {
    if (!word) showError('Please enter a word.');
    return !!word;
  };

  const restore = (nextWords) => {
    treeRef.current = prefixTree();
    nextWords.forEach((word) => treeRef.current.insert(word));
    setSnapshot(treeRef.current.snapshot());
    setWords(nextWords);
  };

  const refresh = (data) => {
    clearState();
    const nextWords = data.map((word) => word.toLowerCase());
    restore([...new Set(nextWords)]);
  };

  useEffect(() => {
    // URL data initializes the Trie once it is ready.
    if (isReady && nodes) refresh(nodes);
  }, [nodes, isReady]);

  async function insert() {
    if (!validate(word)) return;
    setRunning(true);
    await complete(Trie().insertAnimated(word, setSnapshot));
    setRunning(false);
    setWord('');
    history.push(words.slice());
    setWords([...words, word]);
  }

  async function search() {
    if (!validate()) return;
    setRunning(true);
    const gen = Trie().searchAnimated(word, setSnapshot);
    const result = await complete(gen);
    setRunning(false);
    setWord('');
    return result;
  }

  async function deleteWord() {
    if (!validate()) return;
    const path = await search(word);
    if (!path) return;
    const snap = Trie().deleteWord(path);
    if (snap) {
      history.push(words.slice());
      setSnapshot(snap);
      setWords(words.filter((val) => val !== word.toLowerCase()));
    } else {
      showError('Not a complete word.');
    }
  }

  function clearState() {
    setWord('');
    history.clear();
    restore([]);
  }

  function undo() {
    if (history.canUndo) {
      restore(history.undo(words.slice()));
    }
  }

  function redo() {
    if (history.canRedo) {
      restore(history.redo(words.slice()));
    }
  }

  const handlers = {
    insert,
    search,
    deleteWord,
    clearState,
    undo,
    redo,
    refresh,
  };

  const animation = (
    <TrieCanvas nodes={trieState.nodes} edges={trieState.edges} />
  );

  return {
    animation,
    handlers,
    word,
    setWord,
    running,
    words,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}
