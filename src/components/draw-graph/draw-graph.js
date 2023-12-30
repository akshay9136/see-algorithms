import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Button, Checkbox, TextField, FormControlLabel } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { showToast } from '../toast/toast';
import './draw-graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import { clearGraph, drawGraph, switchType } from '../../helpers/drawGraph';
import { getCostMatrix } from '../../common/utils';
import Timer from '../../common/timer';
import Spinner from '../spinner/spinner';
import { AppContext } from '../../common/context';
import useAlgoData from '../../hooks/useAlgoData';
import { useReactiveVar } from '@apollo/client';
import { userAuthVar } from '../../common/cache';

function DrawGraph(props) {
    const { setContext, isDirGraph, playStatus } = useContext(AppContext);
    const userAuth = useReactiveVar(userAuthVar);
    const [source, setSource] = useState('A');
    const { state: { algoId } = {} } = props.location;
    const payload = { algoId, skipQuery: !userAuth || !algoId };
    const { saveAlgoData, loading } = useAlgoData(payload);

    const validate = () => {
        let np = Graph.totalPoints();
        if (np < 2) {
            showToast({
                message: 'Graph cannot be empty.',
                variant: 'error',
            });
            return false;
        }
        let lastChar = String.fromCharCode(64 + np);
        if (source < 'A' || source > lastChar) {
            showToast({
                message: 'Please enter a valid source.',
                variant: 'error',
            });
            return false;
        }
        if (!Graph.isConnected()) {
            showToast({
                message: 'Please draw connected graph.',
                variant: 'error',
            });
            return false;
        }
        return true;
    };

    const config = () => ({
        weighted: props.isMST || props.weighted || false,
        acyclic: props.isDAG || false,
    });

    const handleClear = () => {
        clearGraph();
        drawGraph(config());
        setContext({ playStatus: 0 });
    };

    const handlePlay = () => {
        switch (playStatus) {
            case 0:
                if (validate()) {
                    $('#plane').off();
                    props.start(source.charCodeAt(0) - 65);
                    setContext({ playStatus: 1 });
                }
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
        handleClear();
        const isDirGraph = props.isDAG || false;
        setContext({ isDirGraph });
        if (Graph.isDirected() !== isDirGraph) {
            Graph.switchType();
        }
        return () => clearGraph();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algoId]);

    const setDirected = () => {
        switchType();
        $('#plane').off();
        drawGraph(config());
        setContext({ isDirGraph: !isDirGraph });
    };

    const saveGraph = () => {
        const costMatrix = getCostMatrix();
        const data = Graph.stringify({ costMatrix, ...config() });
        saveAlgoData({ variables: { algoId, data } });
    };

    return (
        <Spinner className="drawGraph" spinning={loading}>
            <div className="d-flex flex-wrap toolbar">
                <span className="title">Draw Graph</span>
                {!props.isDAG && (
                    <Fragment>
                        {!props.isMST && (
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
                                className="source"
                                label="Source"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    </Fragment>
                )}
                <Button
                    variant="contained"
                    startIcon={playStatus > 0 ? <Pause /> : <PlayArrow />}
                    onClick={handlePlay}
                    disabled={Boolean(props.isDAG && playStatus)}
                >
                    {playStatus > 0 ? 'Pause' : 'Play'}
                </Button>
                <Button variant="contained" onClick={handleClear} id="clear">
                    Clear
                </Button>
                {userAuth && (
                    <Button
                        variant="contained"
                        onClick={() => validate() && saveGraph()}
                        disabled={playStatus !== 0}
                    >
                        Save
                    </Button>
                )}
            </div>
            <div className="resizable">
                <svg id="plane">
                    <defs>
                        <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="4"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                    </defs>
                </svg>
            </div>
            <div className="spaceAround ">
                <table id="tbl" />
            </div>
        </Spinner>
    );
}

export default DrawGraph;
