import { useContext } from 'react';
import { clearGraph, createGraph, showError } from '@/common/utils';
import { drawGraph, switchGraph } from '@/helpers/drawGraph';
import { randomGraph } from '@/helpers/randomGraph';
import { Colors } from '@/common/constants';
import AppContext from '@/common/context';
import useUndoRedo from './useUndoRedo';
import Graph, { Path } from '@/common/graph';
import Iterator from '@/common/iterator';
import $ from 'jquery';

var prevSrc;

function useGraphControls(config, props) {
  const { isDirGraph, playStatus, setContext } = useContext(AppContext);
  const { source, weighted, directed } = config;
  const history = useUndoRedo();

  config.history = {
    commit: () => history.push(Graph.skeleton(weighted)),
  };

  const validate = () => {
    let np = Graph.totalPoints();
    let char = String.fromCharCode(64 + np);
    let message = '';
    if (np <= 1) {
      message = 'Graph cannot be empty.';
    } else if (source < 'A' || source > char) {
      message = 'Please enter a valid source.';
    } else if (!Graph.isConnected()) {
      message = 'Please draw connected graph.';
    }
    if (message) {
      showError(message);
      return false;
    }
    return true;
  };

  const resume = async () => {
    setContext({ playStatus: 1 });
    await Iterator.current().start();
    setContext({ playStatus: 2 });
  };

  const handlePlay = () => {
    const src = source.charCodeAt(0) - 65;
    switch (playStatus) {
      case 0:
        if (validate()) {
          $('#plane').off();
          Iterator.new(props.onStart, src);
          props.explain?.(src);
          prevSrc = src;
          resume();
        }
        break;
      case 1:
        Iterator.current().stop();
        setContext({ playStatus: -1 });
        break;
      case 2:
        props.onClear?.();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.vertex);
        Path('.edge').attr('stroke', Colors.stroke);
        Path('.edge').attr('stroke-width', 2.5);
        if (validate()) {
          Iterator.new(props.onStart, src);
          if (src !== prevSrc) {
            props.explain?.(src);
            prevSrc = src;
          }
          resume();
        }
        break;
      default:
        resume();
    }
  };

  const handleClear = () => {
    props.onClear?.();
    Iterator.current()?.exit();
    history.clear();
    clearGraph();
    drawGraph(config);
    setContext({ playStatus: 0 });
  };

  const handleUndo = () => {
    if (history.canUndo) {
      const prevGraph = history.undo(Graph.skeleton(weighted));
      clearGraph();
      Graph.initialize(prevGraph);
      createGraph(prevGraph, weighted);
      drawGraph(config);
    }
  };

  const handleRedo = () => {
    if (history.canRedo) {
      const nextGraph = history.redo(Graph.skeleton(weighted));
      clearGraph();
      Graph.initialize(nextGraph);
      createGraph(nextGraph, weighted);
      drawGraph(config);
    }
  };

  const refresh = () => {
    Iterator.current()?.exit();
    props.onClear?.();
    clearGraph();
    history.clear();
    Graph.initialize(randomGraph(8));
    while (Graph.hasCycle()) {
      Graph.initialize(randomGraph(8));
    }
    createGraph(Graph.skeleton(), weighted);
    drawGraph(config);
    if (directed) switchGraph();
    setContext({ playStatus: 0 });
  };

  const setDirected = () => {
    refresh();
    switchGraph();
    setContext({ isDirGraph: !isDirGraph });
  };

  return {
    handlePlay,
    handleClear,
    handleUndo,
    handleRedo,
    canUndo: history.canUndo && playStatus === 0,
    canRedo: history.canRedo && playStatus === 0,
    refresh,
    setDirected,
  };
}

export default useGraphControls;
