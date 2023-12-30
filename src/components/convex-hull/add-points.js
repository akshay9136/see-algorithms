import React, { useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
// import './draw-graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import { addPoints, randomize } from '../../helpers/convexHull';
import Timer from '../../common/timer';
import { AppContext } from '../../common/context';
import { dataArrayVar } from '../../common/cache';

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
        dataArrayVar([]);
        return () => clear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="drawGraph">
            <div className="d-flex flex-wrap toolbar">
                <span className="title">Add Points</span>
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
                <svg id="plane" className="w-100 h-100"></svg>
            </div>
        </div>
    );
}

export default AddPoints;
