import Graph, { Points } from '../common/graph';
import { cursorOffset, throttle, svgElement } from '../common/utils';
import { Colors } from '../common/constants';
import $ from 'jquery';

function addPoint(p) {
    let props = { class: 'vrtx', cx: p.x, cy: p.y, r: 4, fill: Colors.stroke };
    let dot = svgElement('circle', props);
    $('.plane').append(dot);
    Graph.addPoint(p);
}

export function randomize() {
    for (let i = 0; i < 30; i++) {
        let rect = $('.plane')[0].getBoundingClientRect();
        let np = Graph.totalPoints();
        let x = Math.random() * (rect.width - 100) + 50;
        let y = Math.random() * (rect.height - 100) + 50;
        let p = Points.create(x, y);
        let j;
        for (j = 0; j < np; j++) {
            let d = Points.distance(p, Graph.point(j));
            if (d < 15) break;
        }
        if (j < np) continue;
        addPoint(p);
    }
}

export function addPoints(cvx, scope) {
    let flag, k, left, p, q;
    let plane = scope.find('.plane');

    plane.on('mousedown', (e) =>{
        e.preventDefault();
        let p = cursorOffset(e, plane.offset());
        let np = Graph.totalPoints();
        for (let i = 0; i < np; i++) {
            let d = Points.distance(p, Graph.point(i));
            if (d < 8) {
                flag = true;
                k = i;
                return;
            }
        }
        addPoint(p);
        if (cvx) {
            let size = cvx.length;
            for (let i = 0; i < size; i++) {
                let u = Graph.point(cvx[i]);
                let v = Graph.point(cvx[(i + 1) % size]);
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
                let p = cursorOffset(e, plane.offset());
                scope.node(k).attr('cx', p.x);
                scope.node(k).attr('cy', p.y);
                Graph.setPoint(k, p);
                if (cvx) newConvex();
            }
        }, 20)
    );

    plane.on('mouseup', (e) => {
        e.preventDefault();
        flag = false;
    });

    function newConvex() {
        $('.edge').remove();
        cvx = [];
        left = 0;
        for (let i = 1; i < Graph.totalPoints(); i++) {
            let x1 = Graph.point(i).x;
            let x2 = Graph.point(left).x;
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
            let np = Graph.totalPoints();
            q = (p + 1) % np;
            for (let i = 0; i < np; i++) {
                let seg = [p, q].map(Graph.point);
                let ori = Points.orientation(...seg, Graph.point(i));
                if (ori === 1) q = i;
            }
            let u = Graph.point(p);
            let v = Graph.point(q);
            let props = {
                class: 'edge',
                d: `M${u.x} ${u.y} L${v.x} ${v.y}`,
                stroke: Colors.visited,
                'stroke-width': 2,
            };
            let edge = svgElement('path', props);
            plane.append(edge);
            p = q;
        } while (p !== left);
    }
}
