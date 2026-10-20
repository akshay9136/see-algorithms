import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import { addPoints, randomize } from '@/helpers/convexHull';
import { trackVisualization } from '@/common/analytics';
import AppContext from '@/common/context';
import Graph from '@/common/graph';
import $ from 'jquery';
import { useContext, useEffect, useRef } from 'react';
import { newIterator } from '@/common/iterator';
import { Colors } from '@/common/constants';
import styles from '@/styles/drawing.module.css';

var it;

function AddPoints({ scope, graphRef, onStart }) {
  const { setContext, playStatus } = useContext(AppContext);
  const runRef = useRef(null);

  const clear = () => {
    runRef.current?.cancel();
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
        runRef.current?.cancel();
        runRef.current = trackVisualization(1);
        it = newIterator(runRef.current.wrap(onStart));
        resume();
        break;
      case 1:
        runRef.current?.control('pause');
        setContext({ playStatus: -1 });
        it.stop();
        break;
      case 2:
        $('.edge').remove();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.stroke);
        runRef.current?.cancel();
        runRef.current = trackVisualization(1);
        it = newIterator(runRef.current.wrap(onStart));
        resume();
        break;
      default:
        runRef.current?.control('resume');
        resume();
    }
  };

  useEffect(() => {
    if (scope) refresh();
    return () => {
      runRef.current?.cancel();
      it?.exit();
    };
  }, [scope]);

  return (
    <Box
      className="drawGraph"
      aria-label="Convex hull visualization"
      ref={graphRef}
    >
      <Box className={styles.toolbar} mb={1} px={0.5}>
        <Typography variant="h6" mr="auto">
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
