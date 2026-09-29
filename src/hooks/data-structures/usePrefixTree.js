import { useState, useRef } from 'react';
import prefixTree from '@/helpers/prefixTree';
import TrieCanvas from '@/components/common/trie-canvas';
import { showError } from '@/common/utils';

export default function usePrefixTree() {
  const treeRef = useRef(null);
  const Trie = () => {
    if (!treeRef.current) treeRef.current = prefixTree();
    return treeRef.current;
  };

  const [trieState, setTrieState] = useState(() => Trie().snapshot());
  const [wordCount, setWordCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const setSnapshot = (snap) => setTrieState({ ...snap });

  const validate = (word) => {
    if (!word) showError('Please enter a word.');
    return !!word;
  };

  async function insert(word) {
    if (!validate(word)) return;
    setBusy(true);
    const gen = Trie().insertAnimated(word, setSnapshot);
    // Drive the async generator to completion
    let result = await gen.next();
    while (!result.done) result = await gen.next();
    setWordCount((c) => c + 1);
    setBusy(false);
  }

  async function search(word) {
    if (!validate(word)) return;
    setBusy(true);
    const gen = Trie().searchAnimated(word, setSnapshot);
    let result = await gen.next();
    while (!result.done) result = await gen.next();
    setBusy(false);
    return result.value;
  }

  async function deleteWord(word) {
    const path = await search(word);
    if (!path) return;
    const snap = Trie().deleteWord(path);
    if (snap) {
      setTrieState({ ...snap });
      setWordCount((c) => Math.max(0, c - 1));
    } else {
      showError('Not a complete word.');
    }
  }

  function clearState() {
    treeRef.current = prefixTree();
    setTrieState(treeRef.current.snapshot());
    setWordCount(0);
  }

  const animation = (
    <TrieCanvas nodes={trieState.nodes} edges={trieState.edges} />
  );

  return { animation, insert, search, deleteWord, clearState, wordCount, busy };
}
