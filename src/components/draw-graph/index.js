import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import { PlayArrow, Pause, Refresh, Share } from '@mui/icons-material';
import Spinner from '../spinner';
import styles from './draw-graph.module.css';
import AppContext from '@/common/context';
import useGraphControls from '@/hooks/useGraphControls';
import { useRouter } from 'next/router';
import Timer from '@/common/timer';
import Graph from '@/common/graph';
import { createGraph, getCostMatrix } from '@/common/utils';
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
    directed:
      algoId === 'TopSort' || (isDirGraph && props.allowDirected !== false),
  };
  const { handlePlay, handleClear, refresh, setDirected } = useGraphControls(
    config,
    props
  );

  useEffect(() => {
    refresh();
    return () => Timer.clear();
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
    const data = JSON.stringify({
      ...Graph.skeleton(),
      costMatrix: getCostMatrix(),
    });
    const origin = window.location.origin;
    const url = `${origin}${router.pathname}?skeleton=${btoa(data)}`;
    navigator.clipboard.writeText(url);
    showToast({
      message: 'Graph url is copied to clipboard.',
      variant: 'success',
    });
  };

  return (
    <Spinner className="drawGraph" spinning={false}>
      <Box mb={1.5} className={styles.toolbar}>
        <Typography variant="h6" className={styles.title} ml={1}>
          Draw Graph
        </Typography>

        <div className={styles.buttonGroup}>
          <Tooltip title="Refresh Graph">
            <IconButton onClick={refresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>

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
              sx={{ maxWidth: '80px' }}
              InputProps={{
                style: { fontSize: '0.9rem' },
              }}
            />
          )}

          <Button
            variant="contained"
            startIcon={playStatus > 0 ? <Pause /> : <PlayArrow />}
            onClick={handlePlay}
            disabled={Boolean(props.isDAG && playStatus)}
            color="primary"
            sx={{
              minWidth: '80px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            {playStatus > 0 ? 'PAUSE' : 'PLAY'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleClear}
            color="primary"
            sx={{
              minWidth: '70px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            CLEAR
          </Button>

          <Tooltip title="Share Graph">
            <IconButton
              color="primary"
              onClick={handleSave}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </div>
      </Box>
      <Box mb={1} className="resizable">
        <svg id="plane" className={styles.plane}>
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
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
        </svg>
      </Box>
    </Spinner>
  );
}

export default DrawGraph;
