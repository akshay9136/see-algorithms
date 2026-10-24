import { useEffect, useState, useRef } from 'react';
import useUndoRedo from '@/hooks/useUndoRedo';
import useTreeUrl from '@/hooks/useTreeUrl';
import prefixTree from '@/helpers/prefixTree';
import TrieCanvas from '@/components/trie-canvas';
import { showError } from '@/common/utils';

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
    history.clear();
    const nextWords = data.map((word) => word.toLowerCase());
    restore([...new Set(nextWords)]);
  };

  useEffect(() => {
    // URL data initializes the Trie once it is ready.
    if (isReady && nodes) refresh(nodes);
  }, [nodes, isReady]);

  async function insert() {
    if (!validate(word)) return;
    const gen = Trie().insertAnimated(word, setSnapshot);
    setRunning(true);
    // Drive the async generator to completion
    let result = await gen.next();
    while (!result.done) result = await gen.next();
    setRunning(false);
    setWord('');
    history.push(words.slice());
    setWords([...words, word]);
  }

  async function search() {
    if (!validate()) return;
    const gen = Trie().searchAnimated(word, setSnapshot);
    setRunning(true);
    let result = await gen.next();
    while (!result.done) result = await gen.next();
    setRunning(false);
    setWord('');
    return result.value;
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

  const animation = (
    <TrieCanvas nodes={trieState.nodes} edges={trieState.edges} />
  );

  const handlers = {
    insert,
    search,
    deleteWord,
    clearState,
    undo,
    redo,
    refresh,
  };

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
