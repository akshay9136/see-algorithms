import { useContext } from 'react';
import { showToast } from '@/components/toast';
import Graph from '@/common/graph';
import $ from 'jquery';
import { drawGraph, switchGraph } from '@/helpers/drawGraph';
import { randomGraph } from '@/helpers/randomGraph';
import { clearGraph, createGraph } from '@/common/utils';
import { Colors } from '@/common/constants';
import AppContext from '@/common/context';
import Timer from '@/common/timer';

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
      showToast({ message, variant: 'error' });
      return false;
    }
    return true;
  };

  const handlePlay = async () => {
    switch (playStatus) {
      case 0:
        if (validate()) {
          $('#plane').off();
          setContext({ playStatus: 1 });
          await props.onStart(source.charCodeAt(0) - 65);
          setContext({ playStatus: -2 });
        }
        break;
      case -1:
        setContext({ playStatus: 1 });
        Timer.resume();
        break;
      case -2:
        props.onClear?.();
        $('.vrtx').attr('stroke', Colors.stroke);
        $('.edge').attr('stroke', Colors.stroke);
        $('.vrtx').attr('fill', Colors.vertex);
        setContext({ playStatus: 1 });
        await Timer.sleep(1000);
        await props.onStart(source.charCodeAt(0) - 65);
        setContext({ playStatus: -2 });
        break;
      default:
        setContext({ playStatus: -1 });
        Timer.pause();
    }
  };

  const handleClear = () => {
    props.onClear?.();
    clearGraph();
    drawGraph(config);
    setContext({ playStatus: 0 });
  };

  const setDirected = () => {
    switchGraph();
    $('#plane').off();
    drawGraph(config);
    setContext({ isDirGraph: !isDirGraph });
  };

  const refresh = () => {
    props.onClear?.();
    clearGraph();
    do Graph.initialize(randomGraph(5));
    while (Graph.hasCycle());
    createGraph(Graph.skeleton(), weighted);
    drawGraph(config);
    if (directed) switchGraph();
    setContext({ playStatus: 0 });
  };

  return { handlePlay, handleClear, refresh, setDirected };
}

export default useGraphControls;
