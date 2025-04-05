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
import Graph, { Point } from '../common/graph';
import { showToast } from '../components/toast';
import { Colors } from '../common/constants';

export function drawGraph({ weighted, acyclic }) {
    var px, ipx, flag, hold, drag;

    $('#plane').on('mousedown touchstart', (e) => {
        e.preventDefault();
        if (flag) return;
        let p = cursorOffset(e);
        let k;
        for (k = 0; k < Graph.totalPoints(); k++) {
            let q = Graph.point(k);
            let d = Point.distance(p, q);
            if (d < 20) {
                hold = true;
                break;
            }
        }
        ipx = k;
        px = p;
    });

    function overlaps(ip) {
        return Graph.segments().some(
            (seg) => seg.includes(ip) && seg.includes(ipx)
        );
    }

    $('#plane').on('click touchend', function (e) {
        e.preventDefault();
        if (hold && drag) {
            hold = false;
            drag = false;
            return;
        }
        let p = cursorOffset(e);
        let np = Graph.totalPoints();
        let k;
        for (k = 0; k < np; k++) {
            let q = Graph.point(k);
            let d = Point.distance(p, q);
            if (d < 20) {
                p = q;
                break;
            }
        }
        if (flag) {
            $('.vrtx').eq(ipx).attr('stroke', Colors.stroke);
            flag = false;
            hold = false;
            if (Point.equal(p, px) || overlaps(k)) {
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
                px = p;
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
                if (drag) {
                    Graph.setPoint(ipx, p);
                    moveVertex(ipx, p);
                } else {
                    let d = Point.distance(p, px);
                    if (d > 5) drag = true;
                }
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
            const [, q] = seg.map(Graph.point);
            const el = $('.edge').eq(i);
            el.attr('x2', q.x);
            el.attr('y2', q.y);
            el.removeAttr('marker-end');
        });
    }
}
