import $ from 'jquery';
import Graph, { Path } from './graph';
import {
  svgElement,
  findCurve,
  fromDistance,
  cursorOffset,
  costInput,
  charAt,
  hasValue,
} from './utils';
import { Colors } from './constants';

const props = {
  vertex: {
    class: 'vrtx',
    rx: 18,
    ry: 16,
    'stroke-width': 2,
    stroke: Colors.stroke,
    fill: Colors.vertex,
    style: 'cursor:pointer',
  },

  vlabel: {
    class: 'vlbl',
    style: 'cursor:pointer',
    fill: '#404040',
    'font-weight': 'bold',
    'text-anchor': 'middle',
  },

  edge: {
    class: 'edge',
    stroke: Colors.stroke,
    fill: 'transparent',
    'stroke-width': 2.5,
  },
};

export function createGraphScope(container) {
  const scope = $(container);
  const plane = scope.find('.plane');

  return {
    find(query) {
      return scope.find(query);
    },

    node(query) {
      return typeof query === 'number'
        ? scope.find('.vrtx').eq(query)
        : scope.find('.vrtx' + query);
    },

    path(query) {
      return typeof query === 'number'
        ? Path(scope.find('.edge').eq(query))
        : Path(scope.find('.edge' + query));
    },

    cursor(event) {
      return cursorOffset(event, plane.offset());
    },

    setColor(el, color) {
      scope.find(el).css('background-color', color);
    },

    addVertex(p, label) {
      const { vertex, vlabel } = props;
      const labelProps = { x: p.x, y: p.y + 5, ...vlabel };
      const group = svgElement('g', { class: 'vgrp' });
      group.append(
        svgElement('ellipse', { cx: p.x, cy: p.y, ...vertex }),
        svgElement('text', labelProps, label),
      );
      plane.append(group);
    },

    moveVertex(i, p) {
      this.node(i).attr('cx', p.x);
      this.node(i).attr('cy', p.y);
      scope.find('.vlbl').eq(i).attr('x', p.x);
      scope.find('.vlbl').eq(i).attr('y', p.y + 5);

      Graph.segments().forEach((seg, ei) => {
        if (seg.includes(i)) {
          const [u, v] = seg.map(Graph.point);
          let cx = (u.x + v.x) / 2;
          let cy = (u.y + v.y) / 2;
          let d = `M ${u.x} ${u.y} Q ${cx} ${cy} ${v.x} ${v.y}`;
          this.path(ei).attr('d', d);

          if (Graph.isDirected()) {
            const ej = Graph.edgeIndex(seg[1], seg[0]);
            if (hasValue(ej)) {
              [cx, cy] = findCurve(u, v);
              this.path(ei).attr('cx', cx);
              this.path(ei).attr('cy', cy);
            }
            const q = fromDistance(u, v, 22);
            this.path(ei).attr('x2', q.x);
            this.path(ei).attr('y2', q.y);
          }
          const costEl = scope.find('.cost').eq(ei).parent();
          costEl.attr('x', cx);
          costEl.attr('y', cy);
        }
      });
    },

    addEdge(p, q) {
      const cx = (p.x + q.x) / 2;
      const cy = (p.y + q.y) / 2;
      const d = `M ${p.x} ${p.y} Q ${cx} ${cy} ${q.x} ${q.y}`;
      const next = scope.find('.vgrp:first');
      next.before(svgElement('path', { d, ...props.edge }));
    },

    cloneEdge(i, j) {
      const ei = Graph.edgeIndex(i, j);
      const props = {
        d: this.path(ei).attr('d'),
        stroke: Colors.visited,
        fill: 'transparent',
        'stroke-width': 4,
      };
      const edge = svgElement('path', props);
      scope.find('.vgrp:first').before(edge);
      return edge;
    },

    *spanEdge(i, j) {
      const cloned = this.cloneEdge(i, j);
      const index = Graph.edgeIndex(i, j);
      const edge = scope.find('.edge').eq(index);
      const d = edge[0].getTotalLength();
      const t = d / 50;
      const seg = Graph.segments()[index];
      const _this = this;

      function* span(dash) {
        if (dash < d) {
          cloned.setAttribute('stroke-dasharray', `${dash} ${d - dash}`);
          if (i !== seg[0]) {
            cloned.setAttribute('stroke-dashoffset', dash);
          }
          yield 20;
          yield* span(dash + t);
        } else {
          _this.node(j).attr('stroke', Colors.visited);
          cloned.remove();
          edge.attr('stroke', Colors.visited);
          edge.attr('stroke-width', 3);
          edge.removeAttr('stroke-dasharray');
        }
      }
      yield* span(2);
    },

    appendCost(p, q, cost) {
      plane.append(costInput(p, q, cost));
    },

    clearGraph() {
      plane.children().not(':first').remove();
    },

    createGraph(data, weighted) {
      this.clearGraph();
      const { points, segments, directed, matrix, weights } = data;

      points.forEach((p, i) => {
        this.addVertex(p, charAt(65 + i));
      });

      segments.forEach(([i, j]) => {
        const p = points[i], q = points[j];
        this.addEdge(p, q);

        if (directed) {
          const { x, y } = fromDistance(p, q, 22);
          this.path(':last').attr('x2', x);
          this.path(':last').attr('y2', y);
          this.path(':last').attr('marker-end', 'url(#arrow)');

          if (hasValue(matrix[j][i])) {
            const [cx, cy] = findCurve(p, { x, y });
            this.path(':last').attr('cx', cx);
            this.path(':last').attr('cy', cy);
          }
        }

        if (weighted) {
          this.appendCost(p, q, weights?.[i][j]);
        }
      });
    },

    costMatrix() {
      const mat = [];
      Graph.segments().forEach(([i, j], k) => {
        mat[i] = mat[i] || {};
        const value = scope.find('.cost').eq(k).val();
        mat[i][j] = Number(value) || 1;
        if (!Graph.isDirected()) {
          mat[j] = mat[j] || {};
          mat[j][i] = mat[i][j];
        }
      });
      return mat;
    },

    collect() {
      return Graph.skeleton(this.costMatrix());
    },
  };
}
