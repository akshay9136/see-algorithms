import { useState, useContext, memo } from 'react';
import { useGraphControls, useSavedData } from '@/hooks';
import { graphExamples } from '@/data/examples';
import { useRouter } from 'next/router';
import { showError } from '@/common/utils';
import { trackEvent } from '@/common/analytics';
import { showToast } from '../toast';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Edit,
  PlayArrow,
  Pause,
  Refresh,
  Share,
  Undo,
  Redo,
  Save,
} from '@mui/icons-material';
import styles from '@/styles/drawing.module.css';
import ExamplePicker from './example-picker';
import SavedDataList from './saved-data';
import AppContext from '@/common/context';
import Graph from '@/common/graph';

function DrawGraph({
  weighted = false,
  allowDirected = true,
  allowRefresh = true,
  customSource = true,
  scope,
  scopes = [scope],
  ...props
}) {
  const { isDirGraph, playStatus } = useContext(AppContext);
  const { saveData, ...rest } = useSavedData();
  const { pathname, query } = useRouter();
  const [source, setSource] = useState('A');

  const isEmbed = pathname.includes('/embed/');
  const algoId = isEmbed
    ? query.algorithm || query.dataStructure
    : pathname.split('/')[2];

  const config = {
    source,
    weighted,
    acyclic: algoId === 'TopSort',
    directed: algoId === 'TopSort' || (isDirGraph && allowDirected),
    scope: scopes[0],
  };

  const {
    handlePlay,
    handleEdit,
    handleClear,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    refresh,
    loadSavedGraph,
    setDirected,
  } = useGraphControls(config, { scopes, allowRefresh, ...props });

  const handleCopy = async () => {
    const weights = weighted ? scopes[0].costMatrix() : undefined;
    const json = JSON.stringify(Graph.skeleton(weights));
    const pageId = location.pathname.split('/').pop();
    const url = `${location.origin}/graph/embed/${pageId}?skeleton=${btoa(json)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      showError('Could not copy graph url.');
      return;
    }
    trackEvent('share_url');
    showToast({
      message: 'Graph url is copied to clipboard.',
      variant: 'success',
    });
  };

  const handleSave = () => {
    if (Graph.totalPoints() <= 1) {
      showToast({ message: 'Nothing to save.', variant: 'warning' });
      return;
    }
    const weights = weighted ? scopes[0].costMatrix() : undefined;
    saveData(Graph.skeleton(weights));
  };

  // const examples = graphExamples[algoId] || [];

  return (
    <Box className="drawGraph" aria-label="Graph controls and visualization">
      <Box className={styles.toolbar} mb={1.5} px={0.5}>
        <Typography variant="h6">Draw Graph</Typography>

        <Box className={styles.buttonGroup}>
          {/* {examples.length > 0 && (
            <ExamplePicker
              examples={examples}
              onSelect={(example) => {
                const directed = example.directed || config.directed;
                loadSavedGraph(createExampleGraph({ ...example, directed }));
                setSource(example.source || 'A');
              }}
            />
          )} */}

          {allowRefresh && (
            <IconButton
              onClick={refresh}
              color="primary"
              title="New Graph"
              aria-label="New Graph"
              sx={{ p: 0.5 }}
            >
              <Refresh sx={{ fontSize: 28 }} />
            </IconButton>
          )}

          {allowDirected && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDirGraph}
                  onChange={setDirected}
                  name="directed"
                  disabled={playStatus !== 0}
                  color="primary"
                  sx={{ p: 0, mx: 1 }}
                />
              }
              label="Directed"
              sx={{ mr: 0.5 }}
            />
          )}

          {customSource && (
            <TextField
              value={source}
              onChange={(e) => {
                const value = e.target.value;
                setSource(value.charAt(0).toUpperCase());
              }}
              className={styles.source}
              label="Src"
              variant="outlined"
              size="small"
              InputProps={{ sx: { height: 35 } }}
              sx={{ maxWidth: '60px' }}
            />
          )}

          <Button
            size="small"
            variant="contained"
            onClick={handlePlay}
            title={playStatus === 1 ? 'Pause' : 'Play'}
            aria-live="polite"
            sx={{ minWidth: '40px' }}
          >
            {playStatus === 1 ? <Pause /> : <PlayArrow />}
          </Button>

          <Button variant="outlined" onClick={handleClear} sx={{ px: 1.5 }}>
            CLEAR
          </Button>

          <Button
            onClick={handleUndo}
            variant="outlined"
            disabled={!canUndo}
            title="Undo"
            aria-label="Undo"
            sx={{ p: '4px 8px', minWidth: 40 }}
          >
            <Undo />
          </Button>

          <Button
            onClick={handleRedo}
            variant="outlined"
            disabled={!canRedo}
            title="Redo"
            aria-label="Redo"
            sx={{ p: '4px 8px', minWidth: 40 }}
          >
            <Redo />
          </Button>

          {!isEmbed && (
            <IconButton
              onClick={handleSave}
              color="primary"
              title="Save Graph"
              aria-label="Save Graph"
              sx={{ p: 0 }}
            >
              <Save sx={{ fontSize: 32 }} />
            </IconButton>
          )}

          <IconButton
            onClick={handleCopy}
            color="primary"
            title="Share Graph"
            aria-label="Share Graph"
            sx={{ p: 0 }}
          >
            <Share sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Box>

      <Paper className="resizable" sx={{ mb: 1 }}>
        <Plane />
        <IconButton
          aria-label="Edit graph"
          title="Edit graph"
          onClick={handleEdit}
          disabled={playStatus < 2}
          sx={{
            position: 'absolute',
            top: -1,
            left: -1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Paper>

      {!isEmbed && <SavedDataList onSelect={loadSavedGraph} {...rest} />}
    </Box>
  );
}

export const Plane = memo(function Plane() {
  return (
    <svg
      className="plane"
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
      role="graphics-document"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          {/* currentColor inherits from the parent stroke, adapting to dark mode */}
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
});

export default DrawGraph;
