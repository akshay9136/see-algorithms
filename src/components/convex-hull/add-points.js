import { Box, Button, IconButton, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import { addPoints, randomize } from '@/helpers/convexHull';
import { newIterator } from '@/common/iterator';
import $ from 'jquery';
import AppContext from '@/common/context';
import Graph from '@/common/graph';
import styles from '@/styles/draw-graph.module.css';
import { Colors } from '@/common/constants';

var it;

function AddPoints(props) {
  const { setContext, playStatus } = useContext(AppContext);

  const clear = () => {
    it?.exit();
    Graph.clear();
    $('#plane').off();
    $('#plane').children().remove();
  };

  const refresh = () => {
    clear();
    setContext({ playStatus: 0 });
    addPoints();
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
        $('#plane').off();
        it = newIterator(props.onStart);
        resume();
        break;
      case 1:
        it.stop();
        setContext({ playStatus: -1 });
        break;
      case 2:
        $('#plane path').remove();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.stroke);
        it = newIterator(props.onStart);
        resume();
        break;
      default:
        resume();
    }
  };

  useEffect(() => {
    refresh();
    return () => it?.exit();
  }, []);

  return (
    <Box className="drawGraph" aria-label="Convex hull visualization">
      <Box className={styles.toolbar} mb={1.5}>
        <Typography variant="h6" ml={1} mr="auto">
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
      <Box className="resizable">
        <svg id="plane" className={styles.plane} role="graphics-document"></svg>
      </Box>
    </Box>
  );
}

export default AddPoints;
