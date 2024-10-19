import $ from 'jquery';
import { withOffset } from '../common/utils';
import Graph, { Point, Segment } from '../common/graph';
import { Colors } from '../common/constants';

function print(p) {
    let dot = `<circle class="vrtx" cx="${p.x}" cy="${p.y}" r="4" fill="${Colors.stroke}" />`;
    document.getElementById('plane').innerHTML += dot;
    Graph.addPoint(p);
}

export function randomize() {
    for (let i = 0; i < 30; i++) {
        let x = Math.random() * ($('#plane').width() - 100) + 50;
        let y = Math.random() * ($('#plane').height() - 100) + 50;
        let p = Point.create(x, y);
        let np = Graph.totalPoints();
        let j;
        for (j = 0; j < np; j++) {
            let d = Point.distance(p, Graph.point(j));
            if (d < 15) break;
        }
        if (j < np) continue;
        print(p);
    }
}

export function addPoints(cvx) {
    let flag, k;
    let left, p, q;

    $('#plane').on('mousedown', function (e) {
        e.preventDefault();
        let p = withOffset(e);
        let np = Graph.totalPoints();
        for (let i = 0; i < np; i++) {
            let d = Point.distance(p, Graph.point(i));
            if (d < 8) {
                flag = true;
                k = i;
                return;
            }
        }
        print(p);
        if (cvx) {
            let size = cvx.length;
            for (let i = 0; i < size; i++) {
                let u = Graph.point(cvx[i]);
                let v = Graph.point(cvx[(i + 1) % size]);
                if (Segment.orientation([u, v], p) === 1) {
                    newConvex();
                    break;
                }
            }
        }
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = withOffset(e);
            $('.vrtx').eq(k).attr('cx', p.x);
            $('.vrtx').eq(k).attr('cy', p.y);
            Graph.setPoint(k, p);
            if (cvx) newConvex();
        }
    });

    $('#plane').on('mouseup', function (e) {
        e.preventDefault();
        flag = false;
    });

    function newConvex() {
        $('line').remove();
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
            $('.vrtx').eq(p).attr('fill', Colors.visited);
            $('.vrtx').eq(p).attr('stroke', Colors.visited);
            let np = Graph.totalPoints();
            q = (p + 1) % np;
            for (let i = 0; i < np; i++) {
                let seg = [p, q].map(Graph.point);
                let ori = Segment.orientation(seg, Graph.point(i));
                if (ori === 1) q = i;
            }
            let u = Graph.point(p);
            let v = Graph.point(q);
            let edge = `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke-width="2" stroke="${Colors.visited}" />`;
            document.getElementById('plane').innerHTML += edge;
            p = q;
        } while (p !== left);
    }
}
