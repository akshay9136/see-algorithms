import { useState, useContext, memo } from 'react';
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
  PlayArrow,
  Pause,
  Refresh,
  Share,
  Undo,
  Redo,
  Save,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import useGraphControls from '@/hooks/useGraphControls';
import useSavedData from '@/hooks/useSavedData';
import styles from '@/styles/draw-graph.module.css';
import Graph from '@/common/graph';
import AppContext from '@/common/context';
import SavedItems from '@/components/common/saved-items';
import { showToast } from '../toast';

function DrawGraph(props) {
  const { isDirGraph, playStatus } = useContext(AppContext);
  const { saveData, ...rest } = useSavedData();
  const { pathname } = useRouter();
  const [source, setSource] = useState('A');

  const algoId = pathname.split('/')[2];
  const isEmbed = pathname.includes('/embed/');

  const config = {
    source,
    weighted: props.weighted || false,
    acyclic: algoId === 'TopSort',
    directed:
      algoId === 'TopSort' || (isDirGraph && props.allowDirected !== false),
    scope: props.scopes ? props.scopes[0] : props.scope,
  };

  const {
    handlePlay,
    handleClear,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    refresh,
    loadSavedGraph,
    setDirected,
  } = useGraphControls(config, props);

  const handleCopy = () => {
    const weights = config.scope.costMatrix();
    const json = JSON.stringify(Graph.skeleton(weights));
    const origin = window.location.origin;
    const url = `${origin}${pathname}?skeleton=${btoa(json)}`;
    navigator.clipboard.writeText(url);
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
    const weights = config.scope.costMatrix();
    saveData(Graph.skeleton(weights));
  };

  return (
    <Box className="drawGraph" aria-label="Graph controls and visualization">
      <Box mb={1} px={0.5} className={styles.toolbar}>
        <Typography variant="h6" mr="auto">
          Draw Graph
        </Typography>

        <Box className={styles.buttonGroup}>
          <IconButton
            onClick={refresh}
            color="primary"
            title="New Graph"
            aria-label="New Graph"
          >
            <Refresh />
          </IconButton>

          {props.allowDirected !== false && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDirGraph}
                  onChange={setDirected}
                  name="directed"
                  disabled={playStatus !== 0}
                  color="primary"
                />
              }
              label="Directed"
              sx={{ mr: 0.5 }}
            />
          )}

          {props.customSource !== false && (
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
              sx={{ maxWidth: '60px', mr: 0.5 }}
            />
          )}

          <Button
            size="small"
            variant="contained"
            onClick={handlePlay}
            disabled={Boolean(props.isDAG && playStatus)}
            title={playStatus === 1 ? 'Pause' : 'Play'}
            aria-live="polite"
            sx={{ minWidth: '40px', px: 1 }}
          >
            {playStatus === 1 ? <Pause /> : <PlayArrow />}
          </Button>

          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{ minWidth: '70px', py: 0.5 }}
          >
            CLEAR
          </Button>

          <Button
            onClick={handleUndo}
            variant="outlined"
            disabled={!canUndo}
            title="Undo"
            aria-label="Undo"
            sx={{ p: 0.5, minWidth: 40 }}
          >
            <Undo />
          </Button>

          <Button
            onClick={handleRedo}
            variant="outlined"
            disabled={!canRedo}
            title="Redo"
            aria-label="Redo"
            sx={{ p: 0.5, minWidth: 40 }}
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
              <Save sx={{ fontSize: 30 }} />
            </IconButton>
          )}

          <IconButton
            onClick={handleCopy}
            color="primary"
            title="Share Graph"
            aria-label="Share Graph"
            sx={{ p: 0 }}
          >
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Paper className="resizable" sx={{ mb: 1 }}>
        <Plane />
      </Paper>

      {!isEmbed && <SavedItems onSelect={loadSavedGraph} {...rest} />}
    </Box>
  );
}

export const Plane = memo(function () {
  return (
    <svg
      className="plane"
      style={{ width: '100%', height: '100%' }}
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
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
        </marker>
      </defs>
    </svg>
  );
});

export default DrawGraph;
