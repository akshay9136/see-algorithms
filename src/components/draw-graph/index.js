import React, { useState, useContext, Fragment, useEffect } from 'react';
import { Button, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import Spinner from '../spinner';
import styles from './draw-graph.module.css';
import AppContext from '@/common/context';
import useGraphControls from '@/hooks/useGraphControls';
import { useRouter } from 'next/router';
import Timer from '@/common/timer';

function DrawGraph(props) {
  const { userAuth, isDirGraph, playStatus } = useContext(AppContext);
  const [source, setSource] = useState('A');
  const router = useRouter();
  const algoId = router.pathname.split('/')[2];
  const config = {
    source,
    weighted: props.weighted || false,
    acyclic: algoId === 'TopSort',
    directed:
      algoId === 'TopSort' ||
      (isDirGraph && props.allowDirected !== false),
  };
  const { handlePlay, handleClear, refresh, setDirected } =
    useGraphControls(config, props);

  useEffect(() => {
    refresh();
    return () => Timer.clear();
  }, [algoId]);

  return (
    <Spinner className="drawGraph" spinning={false}>
      <div className={'d-flex flex-wrap ' + styles.toolbar}>
        <h5 className={styles.title}>Draw Graph</h5>
        <Button onClick={refresh} style={{ minWidth: 50 }}>
          <Refresh />
        </Button>
        <Fragment>
          {props.allowDirected !== false && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDirGraph}
                  onChange={setDirected}
                  name="directed"
                  disabled={playStatus !== 0}
                />
              }
              label="Directed"
              style={{ margin: 0 }}
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
            />
          )}
        </Fragment>
        <Button
          variant="contained"
          startIcon={playStatus > 0 ? <Pause /> : <PlayArrow />}
          onClick={handlePlay}
          disabled={Boolean(props.isDAG && playStatus)}
        >
          {playStatus > 0 ? 'Pause' : 'Play'}
        </Button>
        <Button variant="contained" onClick={handleClear}>
          Clear
        </Button>
        {userAuth && (
          <Button
            variant="contained"
            // onClick={() => validate() && saveGraph()}
            disabled={playStatus !== 0}
          >
            Save
          </Button>
        )}
      </div>
      <div className="resizable">
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
      </div>
    </Spinner>
  );
}

export default DrawGraph;
