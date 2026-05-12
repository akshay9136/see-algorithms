import { useContext, useEffect } from 'react';
import { drawGraph, switchType } from '@/helpers/drawGraph';
import { randomGraph } from '@/helpers/randomGraph';
import { newIterator } from '@/common/iterator';
import AppContext from '@/common/context';
import Graph from '@/common/graph';
import $ from 'jquery';
import useUndoRedo from './useUndoRedo';
import { useRouter } from 'next/router';
import { showError, sleep } from '@/common/utils';
import { Colors } from '@/common/constants';

var iterators = [], prevSrc;

function useGraphControls(config, props) {
  const { isDirGraph, playStatus, setContext } = useContext(AppContext);
  const { source, weighted, directed, scope } = config;
  const history = useUndoRedo();
  const router = useRouter();
  const {
    scopes = [scope],
    startHandlers = [props.onStart],
    resetHandlers = props.onClear ? [props.onClear] : [],
  } = props;

  config.history = {
    commit: () => {
      history.push(scope.collect());
    },
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
      message = 'Please draw connected Graph.';
    }
    if (message) {
      showError(message);
      return false;
    }
    return true;
  };

  const resume = async () => {
    setContext({ playStatus: 1 });
    if (scopes.length > 1 && playStatus === 0) {
      scopes.slice(1).forEach((sc) => {
        sc.createGraph(scope.collect(), weighted);
      });
      await sleep(800);
    }
    await Promise.all(iterators.map((it) => it.start()));
    setContext({ playStatus: 2 });
  };

  const restart = () => {
    const src = source.charCodeAt(0) - 65;
    if (src !== prevSrc) {
      props.explain?.(src);
      prevSrc = src;
    }
    $('.plane').off();
    iterators = startHandlers.map((fn) => newIterator(fn, src));
    resume();
  };

  const handlePlay = () => {
    switch (playStatus) {
      case 0:
        if (validate()) restart();
        break;
      case 1:
        iterators.forEach((it) => it.stop());
        setContext({ playStatus: -1 });
        break;
      case 2:
        resetHandlers.forEach((fn) => fn());
        $('.vrtx').attr('fill', Colors.vertex);
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.edge').attr('stroke', Colors.stroke);
        $('.edge').attr('stroke-width', 2.5);
        if (validate()) restart();
        break;
      default:
        resume();
    }
  };

  const cleanup = () => {
    $('.plane').off();
    iterators.forEach((it) => it.exit());
    resetHandlers.forEach((reset) => reset());
    Graph.clear();
    scopes.forEach((sc) => sc?.clearGraph());
    setContext({ playStatus: 0 });
    history.clear();
  };

  const handleClear = () => {
    cleanup();
    drawGraph(config);
    setContext({ playStatus: 0 });
  };

  const handleUndo = () => {
    if (history.canUndo) {
      const prevGraph = history.undo(scope.collect());
      Graph.initialize(prevGraph);
      scope.createGraph(prevGraph, weighted);
    }
  };

  const handleRedo = () => {
    if (history.canRedo) {
      const nextGraph = history.redo(scope.collect());
      Graph.initialize(nextGraph);
      scope.createGraph(nextGraph, weighted);
    }
  };

  const refresh = () => {
    cleanup();
    Graph.initialize(randomGraph(8));
    while (Graph.hasCycle()) {
      Graph.initialize(randomGraph(8));
    }
    drawGraph(config);
    scope.createGraph(Graph.skeleton(), weighted);
    scopes.slice(1).forEach((sc) => {
      sc.createGraph(scope.collect(), weighted);
    });
    if (directed) {
      Graph.switchType();
      scopes.forEach(switchType);
    }
    setContext({ playStatus: 0 });
  };

  const loadSavedGraph = (data) => {
    cleanup();
    Graph.initialize(data);
    drawGraph(config);
    scope.createGraph(data, weighted);
    setContext({
      isDirGraph: data.directed,
      playStatus: 0,
    });
  };

  const setDirected = () => {
    refresh();
    Graph.switchType();
    scopes.forEach(switchType);
    setContext({ isDirGraph: !isDirGraph });
  };

  useEffect(() => {
    if (scope && router.isReady) {
      const { skeleton } = router.query;
      if (skeleton) {
        handleClear();
        try {
          const data = JSON.parse(atob(skeleton));
          Graph.initialize(data);
          scopes.forEach((scope) => {
            scope.createGraph(data, weighted);
          });
        } catch {
          handleClear();
        }
      } else refresh();
    }
    return cleanup;
  }, [router, scope]);

  return {
    handlePlay,
    handleClear,
    handleUndo,
    handleRedo,
    canUndo: history.canUndo && playStatus === 0,
    canRedo: history.canRedo && playStatus === 0,
    refresh,
    loadSavedGraph,
    setDirected,
  };
}

export default useGraphControls;
