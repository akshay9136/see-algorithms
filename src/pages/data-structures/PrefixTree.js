import { Box, Button, Input, Stack, Typography } from '@mui/material';
import { Redo, Save, Share, Undo } from '@mui/icons-material';
import { SavedDataList } from '@/components/common';
import { usePrefixTree } from '@/hooks/data-structures';
import { useAlgorithm, useSavedData } from '@/hooks';
import { copyTreeUrl } from '@/common/utils';

export default function PrefixTree() {
  const { saveData, ...saveDataProps } = useSavedData();
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
    <>
      <Typography paragraph>
        A <strong>Trie</strong> (also called a <strong>prefix tree</strong>) is
        a tree-shaped data structure used to store strings. Each node represents
        a single character, and paths from the root spell out words. It excels
        at prefix-based lookups — autocomplete, spell-checking, and IP routing
        all rely on tries. Insertion and search both run in{' '}
        <strong>O(L)</strong> time, where L is the word length, independent of
        how many words are stored.
      </Typography>

      <Typography variant="h6" component="h2" mb={2}>
        Trie Visualizer
      </Typography>
      <Visualizer saveData={saveData} saveDataProps={saveDataProps} />
      <br />

      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Pseudocode
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap">
          {insertAlgo}
          {searchAlgo}
        </Box>
      </Stack>
    </>
  );
}

export function Visualizer({ saveData, saveDataProps }) {
  const {
    animation,
    handlers,
    word,
    setWord,
    running,
    words,
    wordCount = words.length,
    canUndo,
    canRedo,
  } = usePrefixTree();

  const handleChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Z]/g, '');
    setWord(clean.slice(0, 15));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !running) handlers.insert();
  };

  const empty = wordCount === 0;

  const buttons = [
    { text: 'Insert', onClick: handlers.insert },
    { text: 'Search', onClick: handlers.search, disabled: empty },
    { text: 'Delete', onClick: handlers.deleteWord, disabled: empty },
    {
      text: 'Clear',
      onClick: handlers.clearState,
      disabled: empty,
      color: 'secondary',
    },
    {
      icon: <Undo />,
      label: 'Undo',
      onClick: handlers.undo,
      disabled: !canUndo,
    },
    {
      icon: <Redo />,
      label: 'Redo',
      onClick: handlers.redo,
      disabled: !canRedo,
    },
    ...(saveData
      ? [
          {
            icon: <Save />,
            label: 'Save this Trie',
            onClick: () => saveData(words),
            disabled: empty,
          },
        ]
      : []),
    {
      icon: <Share fontSize="small" sx={{ height: 24 }} />,
      label: 'Share this Trie',
      onClick: () => copyTreeUrl(words),
      disabled: empty,
    },
  ];

  return (
    <>
      <Stack spacing={2} width="fit-content">
        <Box width="max-content" display="flex" alignItems="center" gap={1}>
          <Typography
            component="label"
            htmlFor="trieWordInput"
            variant="subtitle1"
            fontWeight={600}
          >
            Enter a word:
          </Typography>

          <Input
            id="trieWordInput"
            value={word}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. apple"
            disabled={running}
            inputProps={{ maxLength: 15 }}
            sx={{ width: 150 }}
          />

          {buttons.map(({ text, icon, label, disabled, onClick }) => (
            <Button
              key={text || label}
              size="small"
              variant="outlined"
              onClick={onClick}
              disabled={running || disabled}
              aria-label={text || label}
              title={label}
              sx={{ minWidth: 40 }}
            >
              {icon || text}
            </Button>
          ))}
        </Box>
        {animation}
      </Stack>

      {saveDataProps && (
        <SavedDataList onSelect={handlers.refresh} {...saveDataProps} />
      )}
    </>
  );
}
