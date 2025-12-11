import { useState, useContext, useEffect, memo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { PlayArrow, Pause, Refresh, Share } from '@mui/icons-material';
import { createGraph, getCostMatrix } from '@/common/utils';
import useGraphControls from '@/hooks/useGraphControls';
import styles from '@/styles/draw-graph.module.css';
import AppContext from '@/common/context';
import Iterator from '@/common/iterator';
import Graph from '@/common/graph';
import { useRouter } from 'next/router';
import { showToast } from '../toast';

function DrawGraph(props) {
  const { isDirGraph, playStatus } = useContext(AppContext);
  const [source, setSource] = useState('A');
  const router = useRouter();
  const algoId = router.pathname.split('/')[2];
  const config = {
    source,
    weighted: props.weighted || false,
    acyclic: algoId === 'TopSort',
    directed: algoId === 'TopSort' ||
      (isDirGraph && props.allowDirected !== false),
  };
  const { handlePlay, handleClear, refresh, setDirected } =
    useGraphControls(config, props);

  useEffect(() => {
    refresh();
    return () => Iterator.current()?.exit();
  }, [algoId, router]);

  useEffect(() => {
    const { skeleton } = router.query;
    if (skeleton) {
      handleClear();
      try {
        const data = JSON.parse(atob(skeleton));
        Graph.initialize(data);
        createGraph(data, config.weighted);
      } catch {
        handleClear();
      }
    }
  }, [router]);

  const handleSave = () => {
    const weights = getCostMatrix();
    const data = JSON.stringify({ ...Graph.skeleton(), weights });
    const origin = window.location.origin;
    const url = `${origin}${router.pathname}?skeleton=${btoa(data)}`;
    navigator.clipboard.writeText(url);
    showToast({
      message: 'Graph url is copied to clipboard.',
      variant: 'success',
    });
  };

  return (
    <Box className="drawGraph" aria-label="Graph controls and visualization">
      <Box mb={1} className={styles.toolbar}>
        <Typography variant="h6" ml={1} mr="auto">
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
              sx={{ mr: 1 }}
            />
          )}

          {props.customSource !== false && (
            <TextField
              value={source}
              onChange={(e) => {
                let value = e.target.value;
                setSource(value.charAt(0).toUpperCase());
              }}
              className={styles.source}
              label="Source"
              variant="outlined"
              size="small"
              InputProps={{
                sx: { fontSize: '0.9rem' },
              }}
              sx={{ maxWidth: '75px' }}
            />
          )}

          <Button
            variant="contained"
            startIcon={playStatus === 1 ? <Pause /> : <PlayArrow />}
            onClick={handlePlay}
            disabled={Boolean(props.isDAG && playStatus)}
            aria-live="polite"
            sx={{
              minWidth: '80px',
              padding: '4px 12px',
            }}
          >
            PLAY
          </Button>

          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{
              minWidth: '70px',
              padding: '4px 12px',
            }}
          >
            CLEAR
          </Button>

          <IconButton
            onClick={handleSave}
            color="primary"
            title="Share Graph"
            aria-label="Share Graph"
          >
            <Share />
          </IconButton>
        </Box>
      </Box>
      <Box mb={1} className="resizable">
        <Plane />
      </Box>
    </Box>
  );
}

const Plane = memo(function () {
  return (
    <svg id="plane" className={styles.plane} role="graphics-document">
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
