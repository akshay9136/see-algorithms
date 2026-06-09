import Graph, { Points } from '../common/graph';
import { cursorOffset, throttle, svgElement } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

function addPoint(p) {
  const props = { class: 'vrtx', cx: p.x, cy: p.y, r: 4, fill: Colors.stroke };
  const dot = svgElement('circle', props);
  $('.plane').append(dot);
  Graph.addPoint(p);
}

export function randomize() {
  for (let i = 0; i < 30; i++) {
    const rect = $('.plane')[0].getBoundingClientRect();
    const np = Graph.totalPoints();
    const x = Math.random() * (rect.width - 100) + 50;
    const y = Math.random() * (rect.height - 100) + 50;
    const p = Points.create(x, y);
    let j = 0;
    for (; j < np; j++) {
      const d = Points.distance(p, Graph.point(j));
      if (d < 15) break;
    }
    if (j < np) continue;
    addPoint(p);
  }
}

export function addPoints(cvx, scope) {
  let flag, k, left, p, q;
  let plane = scope.find('.plane');

  plane.on('mousedown', (e) => {
    e.preventDefault();
    const p = cursorOffset(e, plane.offset());
    for (let i = 0; i < Graph.totalPoints(); i++) {
      const q = Graph.point(i);
      if (Points.distance(p, q) < 8) {
        flag = true;
        k = i;
        return;
      }
    }
    addPoint(p);
    if (cvx) {
      for (let i = 0; i < cvx.length; i++) {
        const u = Graph.point(cvx[i]);
        const v = Graph.point(cvx[(i + 1) % cvx.length]);
        if (Points.orientation(u, v, p) === 1) {
          newConvex();
          break;
        }
      }
    }
  });

  plane.on(
    'mousemove',
    throttle((e) => {
      e.preventDefault();
      if (flag) {
        const p = cursorOffset(e, plane.offset());
        scope.node(k).attr('cx', p.x);
        scope.node(k).attr('cy', p.y);
        Graph.setPoint(k, p);
        if (cvx) newConvex();
      }
    }, 20),
  );

  plane.on('mouseup', (e) => {
    e.preventDefault();
    flag = false;
  });

  function newConvex() {
    $('.edge').remove();
    left = 0;
    cvx = [];
    for (let i = 1; i < Graph.totalPoints(); i++) {
      const x1 = Graph.point(i).x;
      const x2 = Graph.point(left).x;
      if (x1 < x2) left = i;
    }
    p = left;
    $('.vrtx').attr('fill', Colors.stroke);
    $('.vrtx').removeAttr('stroke');
    convexHull();
  }

  function convexHull() {
    do {
      cvx.push(p);
      scope.node(p).attr('fill', Colors.visited);
      scope.node(p).attr('stroke', Colors.visited);
      const np = Graph.totalPoints();
      q = (p + 1) % np;
      for (let i = 0; i < np; i++) {
        const seg = [p, q].map(Graph.point);
        const ori = Points.orientation(...seg, Graph.point(i));
        if (ori === 1) q = i;
      }
      const u = Graph.point(p);
      const v = Graph.point(q);
      const props = {
        class: 'edge',
        d: `M${u.x} ${u.y} L${v.x} ${v.y}`,
        stroke: Colors.visited,
        'stroke-width': 2,
      };
      const edge = svgElement('path', props);
      plane.append(edge);
      p = q;
    } while (p !== left);
  }
}
