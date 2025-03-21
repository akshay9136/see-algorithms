import React, { useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import styles from '../draw-graph/draw-graph.module.css';
import Graph from '@/common/graph';
import $ from 'jquery';
import { addPoints, randomize } from '@/helpers/convexHull';
import Timer from '@/common/timer';
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
      case -1:
        setContext({ playStatus: 1 });
        Timer.resume();
        break;
      default:
        setContext({ playStatus: -1 });
        Timer.pause();
    }
  };

  useEffect(() => {
    handleReset();
    () => Timer.clear();
  }, []);

  return (
    <div className="drawGraph">
      <div className={'d-flex flex-wrap ' + styles.toolbar}>
        <h5 className={styles.title}>Add Points</h5>
        <Button
          variant="contained"
          startIcon={playStatus > 0 ? <Pause /> : <PlayArrow />}
          onClick={handlePlay}
        >
          {playStatus > 0 ? 'Pause' : 'Play'}
        </Button>
        <Button variant="contained" onClick={handleReset} id="clear">
          Reset
        </Button>
      </div>
      <div className="resizable">
        <svg id="plane" className={styles.plane}></svg>
      </div>
    </div>
  );
}

export default AddPoints;
