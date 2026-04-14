import { useContext, useEffect } from 'react';
import { clearGraph, showError } from '@/common/utils';
import { drawGraph, switchType } from '@/helpers/drawGraph';
import { randomGraph } from '@/helpers/randomGraph';
import { Colors } from '@/common/constants';
import AppContext from '@/common/context';
import Graph from '@/common/graph';
import $ from 'jquery';
import { useRouter } from 'next/router';
import { newIterator } from '@/common/iterator';
import useUndoRedo from './useUndoRedo';

var iterators = [], prevSrc;

function useGraphControls(config, props) {
  const { isDirGraph, playStatus, setContext } = useContext(AppContext);
  const { source, weighted, directed, scope } = config;
  const router = useRouter();
  const history = useUndoRedo();
  const {
    scopes = [scope],
    startHandlers = [props.onStart],
    resetHandlers = [props.onClear],
  } = props;

  config.history = {
    commit: () => {
      const data = Graph.skeleton(scope.costMatrix());
      history.push(data);
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
    await Promise.all(iterators.map((it) => it.start()));
    setContext({ playStatus: 2 });
  };

  const handlePlay = () => {
    const src = source.charCodeAt(0) - 65;
    switch (playStatus) {
      case 0:
        if (validate()) {
          $('.plane').off();
          props.explain?.(src);
          prevSrc = src;
          iterators = startHandlers.map((handler) =>
            newIterator(handler, src),
          );
          resume();
        }
        break;
      case 1:
        iterators.forEach((it) => it.stop());
        setContext({ playStatus: -1 });
        break;
      case 2:
        props.onClear?.();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.vertex);
        $('.edge').attr('stroke', Colors.stroke);
        $('.edge').attr('stroke-width', 2.5);
        if (validate()) {
          if (src !== prevSrc) {
            props.explain?.(src);
            prevSrc = src;
          }
          iterators = startHandlers.map((handler) =>
            newIterator(handler, src),
          );
          resume();
        }
        break;
      default:
        resume();
    }
  };

  const commonReset = () => {
    history.clear();
    resetHandlers.forEach((reset, i) => {
      iterators[i]?.exit();
      reset?.();
    });
    clearGraph();
  };

  const handleClear = () => {
    commonReset();
    drawGraph(config);
    setContext({ playStatus: 0 });
  };

  const handleUndo = () => {
    if (history.canUndo) {
      const data = Graph.skeleton(scope.costMatrix());
      const prevGraph = history.undo(data);
      clearGraph();
      Graph.initialize(prevGraph);
      scopes.forEach((scope) => {
        scope.createGraph(prevGraph, weighted)
      });
      drawGraph(config);
    }
  };

  const handleRedo = () => {
    if (history.canRedo) {
      const data = Graph.skeleton(scope.costMatrix());
      const nextGraph = history.redo(data);
      clearGraph();
      Graph.initialize(nextGraph);
      scopes.forEach((scope) => {
        scope.createGraph(nextGraph, weighted)
      });
      drawGraph(config);
    }
  };

  const refresh = () => {
    if (!scope) return;
    commonReset();
    Graph.initialize(randomGraph(8));
    while (Graph.hasCycle()) {
      Graph.initialize(randomGraph(8));
    }
    scopes.forEach((scope) => {
      scope.createGraph(Graph.skeleton(), weighted)
    });
    drawGraph(config);
    if (directed) switchType(scope);
    setContext({ playStatus: 0 });
  };

  const setDirected = () => {
    refresh();
    switchType(scope);
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
            scope.createGraph(data, weighted)
          });
        } catch {
          handleClear();
        }
      } else refresh();
    }
    return () => commonReset();
  }, [router, scope]);

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
