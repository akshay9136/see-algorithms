import { Box, Button, IconButton, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { addPoints, randomize } from '@/helpers/convexHull';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import $ from 'jquery';
import Graph from '@/common/graph';
import AppContext from '@/common/context';
import Iterator from '@/common/iterator';
import styles from '@/styles/draw-graph.module.css';
import { Colors } from '@/common/constants';

function AddPoints(props) {
  const { setContext, playStatus } = useContext(AppContext);

  const clear = () => {
    Iterator.current()?.exit();
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

  const startToEnd = async () => {
    setContext({ playStatus: 1 });
    await Iterator.current().start();
    setContext({ playStatus: 2 });
  };

  const handlePlay = () => {
    switch (playStatus) {
      case 0:
        $('#plane').off();
        Iterator.new(props.onStart);
        startToEnd();
        break;
      case 1:
        Iterator.current().stop();
        setContext({ playStatus: -1 });
        break;
      case 2:
        $('#plane path').remove();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.stroke);
        Iterator.new(props.onStart);
        startToEnd();
        break;
      default:
        startToEnd();
    }
  };

  useEffect(() => {
    refresh();
    return () => Iterator.current()?.exit();
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
