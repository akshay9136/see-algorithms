import { Box, Button, Input, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useAlgorithm } from '@/hooks';
import { usePrefixTree } from '@/hooks/data-structures';

export default function PrefixTree() {
  const { animation, insert, search, deleteWord, clearState, wordCount, busy } =
    usePrefixTree();
  const [word, setWord] = useState('');

  const handleChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Z]/g, '');
    setWord(clean.slice(0, 15));
  };

  const handleInsert = async () => {
    await insert(word.trim());
    setWord('');
  };

  const handleSearch = async () => {
    await search(word.trim());
    setWord('');
  };

  const handleDelete = async () => {
    await deleteWord(word.trim());
    setWord('');
  };

  const handleClear = () => {
    clearState();
    setWord('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !busy) handleInsert();
  };

  const [insertAlgo] = useAlgorithm(`
function insert(root, word):
    node = root
    for each char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
    node.isEnd = true
`);

  const [searchAlgo] = useAlgorithm(`
function search(root, word):
    node = root
    for each char in word:
        if char not in node.children:
            return false
        node = node.children[char]
    return node.isEnd
`);

  return (
    <Stack spacing={2}>
      <Typography>
        A <strong>Trie</strong> (also called a <strong>prefix tree</strong>) is
        a tree-shaped data structure used to store strings. Each node represents
        a single character, and paths from the root spell out words. It excels
        at prefix-based lookups — autocomplete, spell-checking, and IP routing
        all rely on tries. Insertion and search both run in{' '}
        <strong>O(L)</strong> time, where L is the word length, independent of
        how many words are stored.
      </Typography>

      <Typography variant="h6" component="h2">
        Visualizer
      </Typography>

      <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5}>
        <Typography
          component="label"
          htmlFor="trieWordInput"
          variant="subtitle1"
          fontSize="1.1rem"
        >
          Enter a word:&nbsp;
        </Typography>
        <Input
          id="trieWordInput"
          value={word}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="e.g. apple"
          disabled={busy}
          inputProps={{ maxLength: 15 }}
          sx={{ width: 150 }}
        />

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            id="trieInsertBtn"
            size="small"
            variant="outlined"
            onClick={handleInsert}
            disabled={busy}
            aria-label="Insert word"
          >
            Insert
          </Button>
          <Button
            id="trieSearchBtn"
            size="small"
            variant="outlined"
            onClick={handleSearch}
            disabled={busy || wordCount === 0}
            aria-label="Search word"
          >
            Search
          </Button>
          <Button
            id="trieDeleteBtn"
            size="small"
            variant="outlined"
            onClick={handleDelete}
            disabled={busy || wordCount === 0}
            aria-label="Delete word"
          >
            Delete
          </Button>
          <Button
            id="trieClearBtn"
            size="small"
            variant="outlined"
            color="error"
            onClick={handleClear}
            disabled={busy || wordCount === 0}
            aria-label="Clear the Trie"
          >
            Clear
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {wordCount} word{wordCount > 1 ? 's' : ''}
        </Typography>
      </Box>

      {animation}
      <br />
      <Typography variant="h6" component="h2">
        Pseudocode
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap">
        {insertAlgo}
        {searchAlgo}
      </Box>
    </Stack>
  );
}
