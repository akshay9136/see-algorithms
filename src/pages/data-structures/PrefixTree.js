import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { PlayArrow, Redo, Save, Share, Undo } from '@mui/icons-material';
import { AdUnit, SavedDataList } from '@/components/common';
import { usePrefixTree } from '@/hooks/data-structures';
import { useAlgorithm, useBreakpoints, useSavedData } from '@/hooks';
import { copyTreeUrl } from '@/common/utils';

export default function PrefixTree() {
  const { saveData, ...saveDataProps } = useSavedData();
  const { xlup } = useBreakpoints();

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
      <Typography>
        A <strong>Trie</strong> (also called a <strong>prefix tree</strong>) is
        a tree-shaped data structure used to store strings. Each node represents
        a single character, and paths from the root spell out words. It excels
        at prefix-based lookups — autocomplete, spell-checking, and IP routing
        all rely on tries. Insertion and search both run in{' '}
        <strong>O(L)</strong> time, where L is the word length, independent of
        how many words are stored.
      </Typography>
      <br />

      <Typography variant="h6" component="h2" mb={2}>
        Trie Visualizer
      </Typography>
      <Box display="flex" gap={3}>
        <Visualizer saveData={saveData} saveDataProps={saveDataProps} />
        {xlup && <AdUnit fullWidth="true" />}
      </Box>
      <br />

      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Pseudocode
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap">
          {insertAlgo}
          {searchAlgo}
          {xlup && <AdUnit sx={{ maxWidth: 300 }} />}
        </Box>
      </Stack>
    </>
  );
}

export function Visualizer({ saveData, saveDataProps }) {
  const [operation, setOperation] = useState('Insert');
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

  const empty = wordCount === 0;
  const toggles = [
    { text: 'Insert', onClick: handlers.insert },
    { text: 'Search', onClick: handlers.search, disabled: empty },
    { text: 'Delete', onClick: handlers.deleteWord, disabled: empty },
  ];
  const selected = toggles.find((button) => button.text === operation);
  const playDisabled = running || selected.disabled;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !playDisabled) {
      e.preventDefault();
      selected.onClick();
    }
  };

  const buttons = [
    {
      text: 'Clear',
      onClick: () => {
        handlers.clearState();
        setOperation('Insert');
      },
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

          <ToggleButtonGroup
            exclusive
            size="small"
            value={operation}
            onChange={(_, value) => {
              if (value !== null) setOperation(value);
            }}
            disabled={running}
            aria-label="Tree operation"
          >
            {toggles.map((button) => (
              <ToggleButton
                key={button.text}
                value={button.text}
                disabled={running || button.disabled}
                sx={{ px: 1.5, py: 0.5, fontWeight: 600 }}
              >
                {button.text}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Button
            size="small"
            variant="outlined"
            onClick={selected.onClick}
            disabled={playDisabled}
            aria-label="Play"
            title="Play"
            sx={{ minWidth: 40, px: 0 }}
          >
            <PlayArrow />
          </Button>

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
