import $ from 'jquery';
import {
    addVertex,
    addEdge,
    cursorOffset,
    fromDistance,
    moveVertex,
    throttle,
    addCost,
} from '../common/utils';
import Graph, { Point, Segment } from '../common/graph';
import { showToast } from '../components/toast';
import { Colors } from '../common/constants';

export function drawGraph({ weighted, acyclic }) {
    var ipx, flag, hold, drag;

    function isValidEdge(p, q) {
        if (!p || !q) return true;
        return Graph.segments().every((seg) => {
            let [r, s] = seg.map(Graph.point);
            return !Segment.overlap([p, q], [r, s]);
        });
    }

    $('#plane').on('mousedown touchstart', (e) => {
        e.preventDefault();
        if (flag) return;
        let p = cursorOffset(e);
        let k;
        for (k = 0; k < Graph.totalPoints(); k++) {
            let q = Graph.point(k);
            let d = Point.distance(p, q);
            if (d < 25) {
                hold = true;
                break;
            }
        }
        ipx = k;
    });

    $('#plane').on('click touchend', function (e) {
        e.preventDefault();
        if (hold && drag) {
            hold = false;
            drag = false;
            return;
        }
        let p = cursorOffset(e);
        let np = Graph.totalPoints();
        if (np === 0) {
            addVertex(p, 'A');
            Graph.addPoint(p);
            return;
        }
        let k;
        for (k = 0; k < np; k++) {
            let q = Graph.point(k);
            let d = Point.distance(p, q);
            if (d < 25) {
                p = q;
                break;
            }
        }
        if (flag) {
            $('.vrtx').eq(ipx).attr('stroke', Colors.stroke);
            flag = false;
            hold = false;
            const px = Graph.point(ipx);
            if (Point.equal(p, px) || !isValidEdge(px, p)) {
                $('.edge:last').remove();
                return;
            }
            $('.edge:last').attr('x2', p.x);
            $('.edge:last').attr('y2', p.y);
            if (k === np) {
                if (np === 26) {
                    $('.edge:last').remove();
                    return;
                }
                addVertex(p, String.fromCharCode(65 + np));
                Graph.addPoint(p);
            }
            Graph.addSegment(ipx, k);
            if (weighted) addCost([px, p]);
            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showToast({
                        message: 'Please draw acyclic graph.',
                        variant: 'error',
                    });
                    $('.edge:last').remove();
                    Graph.removeEdge(ipx, k);
                    return;
                }
                const q = fromDistance(px, p, 23);
                $('.edge:last').attr('x2', q.x);
                $('.edge:last').attr('y2', q.y);
            }
        } else {
            if (k === np) {
                if (np < 26) {
                    addVertex(p, String.fromCharCode(65 + np));
                    Graph.addPoint(p);
                }
            } else {
                addEdge(p, p);
                $('.vrtx').eq(k).attr('stroke', Colors.visited);
                if (Graph.isDirected()) {
                    $('.edge:last').attr('marker-end', 'url(#arrow)');
                }
                flag = true;
                hold = false;
            }
        }
    });

    $('#plane').on(
        'mousemove touchmove',
        throttle((e) => {
            e.preventDefault();
            if (flag) {
                let p = cursorOffset(e);
                $('.edge:last').attr('x2', p.x);
                $('.edge:last').attr('y2', p.y);
            } else if (hold) {
                let p = cursorOffset(e);
                Graph.setPoint(ipx, p);
                moveVertex(ipx, p);
                drag = true;
            }
        }, 20)
    );

    $('#plane').on('mouseleave', (e) => {
        e.preventDefault();
        if (flag) {
            $('.edge:last').remove();
            $('.vrtx').eq(ipx).attr('stroke', Colors.stroke);
        }
        flag = false;
        hold = false;
        drag = false;
    });
}

export function switchGraph() {
    Graph.switchType();
    if (Graph.isDirected()) {
        Graph.segments().forEach((seg, i) => {
            const [p, q] = seg.map(Graph.point);
            const r = fromDistance(p, q, 23);
            const el = $('.edge').eq(i);
            el.attr('x2', r.x);
            el.attr('y2', r.y);
            el.attr('marker-end', 'url(#arrow)');
        });
    } else {
        Graph.segments().forEach((seg, i) => {
            const [_, q] = seg.map(Graph.point);
            const el = $('.edge').eq(i);
            el.attr('x2', q.x);
            el.attr('y2', q.y);
            el.removeAttr('marker-end');
        });
    }
}
