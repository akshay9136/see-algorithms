import { useContext } from 'react';
import { clearGraph, createGraph, showError } from '@/common/utils';
import { drawGraph, switchGraph } from '@/helpers/drawGraph';
import { randomGraph } from '@/helpers/randomGraph';
import { Colors } from '@/common/constants';
import AppContext from '@/common/context';
import Graph, { Path } from '@/common/graph';
import Iterator from '@/common/iterator';
import $ from 'jquery';

function useGraphControls(config, props) {
  const { isDirGraph, playStatus, setContext } = useContext(AppContext);
  const { source, weighted, directed } = config;

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

  const startToEnd = async () => {
    setContext({ playStatus: 1 });
    await Iterator.current().start();
    setContext({ playStatus: 2 });
  }

  const handlePlay = async () => {
    const src = source.charCodeAt(0) - 65;
    switch (playStatus) {
      case 0:
        if (validate()) {
          $('#plane').off();
          Iterator.new(props.onStart, src);
          await startToEnd();
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
            await startToEnd();
        }
        break;
      default:
        await startToEnd();
    }
  };

  const handleClear = () => {
    props.onClear?.();
    Iterator.current()?.exit();
    clearGraph();
    drawGraph(config);
    setContext({ playStatus: 0 });
  };

  const setDirected = () => {
    refresh();
    switchGraph();
    setContext({ isDirGraph: !isDirGraph });
  };

  const refresh = () => {
    Iterator.current()?.exit();
    props.onClear?.();
    clearGraph();
    Graph.initialize(randomGraph(8));
    while (Graph.hasCycle()) {
      Graph.initialize(randomGraph(8));
    }
    createGraph(Graph.skeleton(), weighted);
    drawGraph(config);
    if (directed) switchGraph();
    setContext({ playStatus: 0 });
  };

  return { handlePlay, handleClear, refresh, setDirected };
}

export default useGraphControls;
