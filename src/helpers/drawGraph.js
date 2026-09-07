import $ from 'jquery';
import {
  fromDistance,
  throttle,
  findCurve,
  hasValue,
  charAt,
  showError,
} from '../common/utils';
import Graph, { Points } from '../common/graph';
import { Colors } from '../common/constants';

const HIT_RADIUS = 20; // Hit-test / snap radius for vertices
const ARROW_OFFSET = 22; // Distance offset for directed arrow marker
const DRAG_THRESHOLD = 5; // Minimum px displacement to initiate drag
const MAX_NODES = 26; // Maximum vertex count (A-Z)
const CHAR_CODE_A = 65; // ASCII 'A'

const States = Object.freeze({
  IDLE: 'IDLE',
  DRAG_READY: 'DRAG_READY',
  DRAGGING: 'DRAGGING',
  DRAWING_EDGE: 'DRAWING_EDGE',
});

export function drawGraph({ weighted, acyclic, history, scope }) {
  const plane = scope.find('.plane');

  var state = {
    mode: States.IDLE,
    startIndex: null,
    startPoint: null,
    cursorStart: null,
  };

  function transition(mode, patch = {}) {
    state = { ...state, mode, ...patch };
  }

  function reset() {
    state = {
      mode: States.IDLE,
      startIndex: null,
      startPoint: null,
      cursorStart: null,
    };
  }

  function nearestNode(p) {
    const total = Graph.totalPoints();
    for (let k = 0; k < total; k++) {
      const q = Graph.point(k);
      if (Points.distance(p, q) < HIT_RADIUS) {
        return [k, q];
      }
    }
    return [total, p];
  }

  function isInputActive() {
    return document.activeElement?.className === 'cost';
  }

  function exitCostInput() {
    const active = document.activeElement;
    if (active?.className === 'cost') {
      active.blur();
      scope.find('.cost').each(function () {
        $(this).attr('value', $(this).val());
      });
    }
  }

  function isOverlapping(fromIndex, toIndex) {
    const outgoing = Graph.edgeIndex(fromIndex, toIndex);
    const incoming = Graph.edgeIndex(toIndex, fromIndex);
    return hasValue(outgoing) && hasValue(incoming);
  }

  function showDirection(targetIndex, targetPoint) {
    const { startIndex, startPoint } = state;
    var arrowEnd = fromDistance(startPoint, targetPoint, ARROW_OFFSET);

    if (isOverlapping(startIndex, targetIndex)) {
      arrowEnd = fromDistance(startPoint, targetPoint, ARROW_OFFSET);
      const [cx, cy] = findCurve(startPoint, arrowEnd);
      scope.path(':last').attr('cx', cx);
      scope.path(':last').attr('cy', cy);

      if (weighted) {
        const costParent = scope.find('.cost:last').parent();
        costParent.attr('x', cx);
        costParent.attr('y', cy);
      }

      const [u, v] = [targetIndex, startIndex].map(Graph.point);
      const [cu, cv] = findCurve(u, fromDistance(u, v, ARROW_OFFSET));
      const edgeIndex = Graph.edgeIndex(targetIndex, startIndex);
      scope.path(edgeIndex).attr('cx', cu);
      scope.path(edgeIndex).attr('cy', cv);

      if (weighted) {
        const costParent = scope.find('.cost').eq(edgeIndex).parent();
        costParent.attr('x', cu);
        costParent.attr('y', cv);
      }
    }

    scope.path(':last').attr('x2', arrowEnd.x);
    scope.path(':last').attr('y2', arrowEnd.y);
  }

  function commitEdge(targetIndex, targetPoint) {
    const { startIndex, startPoint } = state;
    const total = Graph.totalPoints();

    if (
      // Reject self-loops and duplicate edges
      targetIndex === startIndex ||
      Points.equal(startPoint, targetPoint) ||
      hasValue(Graph.edgeIndex(startIndex, targetIndex))
    ) {
      return false;
    }

    if (Graph.isDirected() && acyclic) {
      if (Graph.hasCycle([startIndex, targetIndex])) {
        showError('Please draw acyclic Graph.');
        return false;
      }
    }

    history.commit();

    // Create a new vertex if clicking on empty space
    if (targetIndex === total) {
      if (total >= MAX_NODES) return false;
      scope.addVertex(targetPoint, charAt(CHAR_CODE_A + total));
      Graph.addPoint(targetPoint);
    }

    Graph.addSegment(startIndex, targetIndex);

    if (Graph.isDirected()) {
      showDirection(targetIndex, targetPoint);
    } else {
      scope.path(':last').attr('x2', targetPoint.x);
      scope.path(':last').attr('y2', targetPoint.y);
    }

    if (weighted) {
      scope.appendCost(startPoint, targetPoint);
    }

    return true;
  }

  function handleStart(e) {
    e.preventDefault();
    if (isInputActive()) return;
    if (state.mode === States.DRAWING_EDGE) return;

    const p = scope.cursor(e);
    const [index, point] = nearestNode(p);

    transition(States.DRAG_READY, {
      startIndex: index,
      startPoint: point,
      cursorStart: p,
    });

    window.gtag?.('event', 'draw_graph', {
      directed: Graph.isDirected(),
    });
  }

  function handleMove(e) {
    e.preventDefault();
    const { startIndex, cursorStart } = state;

    switch (state.mode) {
      case States.DRAWING_EDGE: {
        const p = scope.cursor(e);
        scope.path(':last').attr('x2', p.x);
        scope.path(':last').attr('y2', p.y);
        break;
      }

      case States.DRAGGING: {
        const p = scope.cursor(e);
        Graph.setPoint(startIndex, p);
        scope.moveVertex(startIndex, p);
        break;
      }

      case States.DRAG_READY: {
        if (startIndex < Graph.totalPoints()) {
          const p = scope.cursor(e);
          const d = Points.distance(p, cursorStart);
          if (d > DRAG_THRESHOLD) {
            history.commit();
            transition(States.DRAGGING);
            Graph.setPoint(startIndex, p);
            scope.moveVertex(startIndex, p);
          }
        }
        break;
      }
    }
  }

  function handleClick(e) {
    e.preventDefault();
    if (state.mode === States.DRAGGING) {
      reset(); // exit dragging state
      return;
    }
    if (isInputActive()) {
      exitCostInput();
      return;
    }

    const p = scope.cursor(e);
    const [index, point] = nearestNode(p);
    const total = Graph.totalPoints();

    if (state.mode === States.DRAWING_EDGE) {
      scope.node(state.startIndex).attr('stroke', Colors.stroke);
      const success = commitEdge(index, point);
      if (!success) {
        scope.path(':last').remove();
      }
      reset();
    } else {
      if (index < total) {
        scope.addEdge(point, point);
        scope.node(index).attr('stroke', Colors.visited);
        if (Graph.isDirected()) {
          scope.path(':last').attr('marker-end', 'url(#arrow)');
        }
        transition(States.DRAWING_EDGE, {
          startIndex: index,
          startPoint: point,
        });
      } else if (total < MAX_NODES) {
        history.commit();
        scope.addVertex(p, charAt(CHAR_CODE_A + total));
        Graph.addPoint(p);
        reset();
      }
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    if (state.mode === States.DRAWING_EDGE) {
      scope.path(':last').remove();
      scope.node(state.startIndex).attr('stroke', Colors.stroke);
    }
    reset();
  }

  plane.off();
  plane.on('mousedown touchstart', handleStart);
  plane.on('click touchend', handleClick);
  plane.on('mousemove touchmove', throttle(handleMove, 20));
  plane.on('mouseleave touchcancel', handleCancel);
}

export function switchType(scope) {
  const segments = Graph.segments();

  if (Graph.isDirected()) {
    segments.forEach((seg, i) => {
      const [p, q] = seg.map(Graph.point);
      const r = fromDistance(p, q, ARROW_OFFSET);
      scope.path(i).attr('x2', r.x);
      scope.path(i).attr('y2', r.y);
      scope.path(i).attr('marker-end', 'url(#arrow)');
    });
  } else {
    segments.forEach((seg, i) => {
      const [, q] = seg.map(Graph.point);
      scope.path(i).attr('x2', q.x);
      scope.path(i).attr('y2', q.y);
      scope.path(i).removeAttr('marker-end');
    });
  }
}
