import $ from 'jquery';
import {
    addVertex,
    addEdge,
    cursorOffset,
    fromDistance,
    moveVertex,
    throttle,
    addCost,
    findCurve,
} from '../common/utils';
import Graph, { Path, Point } from '../common/graph';
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

    function isValidEdge(ip) {
        return Graph.edgeIndex(ipx, ip) === undefined;
    }

    $('#plane').on('click touchend', function (e) {
        e.preventDefault();
        let active = document.activeElement;
        if (active?.tagName === 'INPUT') {
            active.blur();
            active.setAttribute('value', active.value);
            return;
        }
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
            if (Point.equal(p, px) || !isValidEdge(k)) {
                Path('.edge:last').remove();
                return;
            }
            Path('.edge:last').attr('x2', p.x);
            Path('.edge:last').attr('y2', p.y);
            if (k === np) {
                if (np === 26) {
                    Path('.edge:last').remove();
                    return;
                }
                addVertex(p, String.fromCharCode(65 + np));
                Graph.addPoint(p);
            }
            Graph.addSegment(ipx, k);
            if (weighted) addCost(px, p);
            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showToast({
                        message: 'Please draw acyclic graph.',
                        variant: 'error',
                    });
                    Path('.edge:last').remove();
                    Graph.removeEdge(ipx, k);
                    return;
                }
                let q = fromDistance(px, p, 22);
                if (overlaps(k)) {
                    q = fromDistance(px, p, 22);
                    let [cx, cy] = findCurve(px, q);
                    Path('.edge:last').attr('cx', cx);
                    Path('.edge:last').attr('cy', cy);
                    $('.cost:last').parent().attr('x', cx);
                    $('.cost:last').parent().attr('y', cy);
                    let [u, v] = [k, ipx].map(Graph.point);
                    let [cu, cv] = findCurve(u, fromDistance(u, v, 22));
                    let ei = Graph.edgeIndex(k, ipx);
                    Path('.edge').eq(ei).attr('cx', cu);
                    Path('.edge').eq(ei).attr('cy', cv);
                    $('.cost').eq(ei).parent().attr('x', cu);
                    $('.cost').eq(ei).parent().attr('y', cv);
                }
                Path('.edge:last').attr('x2', q.x);
                Path('.edge:last').attr('y2', q.y);
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
                    Path('.edge:last').attr('marker-end', 'url(#arrow)');
                }
                flag = true;
                hold = false;
                px = p;
            }
        }
    });

    function overlaps(ip) {
        return (
            Graph.edgeIndex(ipx, ip) !== undefined &&
            Graph.edgeIndex(ip, ipx) !== undefined
        );
    }

    $('#plane').on(
        'mousemove touchmove',
        throttle((e) => {
            e.preventDefault();
            if (flag) {
                let p = cursorOffset(e);
                Path('.edge:last').attr('x2', p.x);
                Path('.edge:last').attr('y2', p.y);
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
            Path('.edge:last').remove();
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
            let [p, q] = seg.map(Graph.point);
            let r = fromDistance(p, q, 22);
            let el = Path('.edge').eq(i);
            el.attr('x2', r.x);
            el.attr('y2', r.y);
            el.attr('marker-end', 'url(#arrow)');
        });
    } else {
        Graph.segments().forEach((seg, i) => {
            let [, q] = seg.map(Graph.point);
            let el = Path('.edge').eq(i);
            el.attr('x2', q.x);
            el.attr('y2', q.y);
            el.removeAttr('marker-end');
        });
    }
}
