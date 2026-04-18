import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import { addPoints, randomize } from '@/helpers/convexHull';
import { useContext, useEffect } from 'react';
import $ from 'jquery';
import styles from '@/styles/draw-graph.module.css';
import Graph from '@/common/graph';
import AppContext from '@/common/context';
import { Colors } from '@/common/constants';
import { newIterator } from '@/common/iterator';

var it;

function AddPoints({ scope, graphRef, onStart }) {
  const { setContext, playStatus } = useContext(AppContext);

  const clear = () => {
    it?.exit();
    Graph.clear();
    $('.plane').off();
    $('.plane').children().remove();
  };

  const refresh = () => {
    clear();
    setContext({ playStatus: 0 });
    addPoints(null, scope);
    randomize();
  };

  const resume = async () => {
    setContext({ playStatus: 1 });
    await it.start();
    setContext({ playStatus: 2 });
  };

  const handlePlay = () => {
    switch (playStatus) {
      case 0:
        $('.plane').off();
        it = newIterator(onStart);
        resume();
        break;
      case 1:
        it.stop();
        setContext({ playStatus: -1 });
        break;
      case 2:
        $('.edge').remove();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.stroke);
        it = newIterator(onStart);
        resume();
        break;
      default:
        resume();
    }
  };

  useEffect(() => {
    if (scope) refresh();
    return () => it?.exit();
  }, [scope]);

  return (
    <Box className="drawGraph" aria-label="Convex hull visualization" ref={graphRef}>
      <Box className={styles.toolbar} mb={1}>
        <Typography variant="h6" ml={0.5} mr="auto">
          Add Points
        </Typography>
        <IconButton
          onClick={refresh}
          color="primary"
          title="New Graph"
          aria-label="New Graph"
        >
          <Refresh />
        </IconButton>
        <Button
          variant="contained"
          startIcon={playStatus === 1 ? <Pause /> : <PlayArrow />}
          onClick={handlePlay}
          sx={{ ml: 1.5, p: '4px 12px' }}
          aria-live="polite"
        >
          PLAY
        </Button>
      </Box>
      <Paper className="resizable" ref={graphRef}>
        <svg
          className="plane"
          style={{ width: '100%', height: '100%' }}
          role="graphics-document"
        ></svg>
      </Paper>
    </Box>
  );
}

export default AddPoints;
