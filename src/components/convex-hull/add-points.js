import { Box, Button, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { PlayArrow, Pause } from '@mui/icons-material';
import { addPoints, randomize } from '@/helpers/convexHull';
import Graph from '@/common/graph';
import Timer from '@/common/timer';
import $ from 'jquery';
import styles from '@/styles/draw-graph.module.css';
import AppContext from '@/common/context';

function AddPoints(props) {
  const { setContext, playStatus } = useContext(AppContext);

  const clear = () => {
    Timer.clear();
    Graph.clear();
    $('#plane').off();
    $('#plane').children().remove();
  };

  const handleReset = () => {
    clear();
    addPoints();
    randomize();
    setContext({ playStatus: 0 });
  };

  const handlePlay = () => {
    switch (playStatus) {
      case 0:
        $('#plane').off();
        props.start();
        setContext({ playStatus: 1 });
        break;
      case 1:
        Timer.pause();
        setContext({ playStatus: -1 });
        break;
      default:
        setContext({ playStatus: 1 });
        Timer.resume();
    }
  };

  useEffect(() => {
    handleReset();
    return () => Timer.clear();
  }, []);

  return (
    <Box className="drawGraph" aria-label="Convex hull visualization">
      <Box className={styles.toolbar} mb={1.5}>
        <Typography variant="h6" ml={1} mr="auto">
          Add Points
        </Typography>
        <Button
          variant="contained"
          startIcon={playStatus === 1 ? <Pause /> : <PlayArrow />}
          onClick={handlePlay}
          sx={{ mr: 1.5, p: '4px 12px' }}
          aria-live="polite"
        >
          PLAY
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ p: '4px 12px' }}
        >
          RESET
        </Button>
      </Box>
      <Box className="resizable">
        <svg id="plane" className={styles.plane} role="graphics-document"></svg>
      </Box>
    </Box>
  );
}

export default AddPoints;
