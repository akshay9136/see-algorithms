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
    hasValue,
    charAt,
    showError,
} from '../common/utils';
import Graph, { Path, Points } from '../common/graph';
import { Colors } from '../common/constants';

export function drawGraph({ weighted, acyclic }) {
    var px, ipx, flag, hold, drag;

    function isInputActive() {
        const active = document.activeElement;
        if (active?.className === 'cost') {
            active.blur();
            $('.cost').each(function () {
                $(this).attr('value', $(this).val());
            });
            return true;
        }
        return false;
    }

    $('#plane').on('mousedown touchstart', (e) => {
        e.preventDefault();
        if (flag || isInputActive()) return;

        let p = cursorOffset(e);
        let k = 0;
        for (; k < Graph.totalPoints(); k++) {
            const q = Graph.point(k);
            const d = Points.distance(p, q);
            if (d < 20) {
                hold = true;
                break;
            }
        }
        ipx = k;
        px = p;
    });

    function isValidEdge(ip) {
        return !hasValue(Graph.edgeIndex(ipx, ip));
    }

    $('#plane').on('click touchend', (e) => {
        e.preventDefault();
        if (isInputActive()) return;

        if (hold && drag) {
            hold = false;
            drag = false;
            return;
        }
        let p = cursorOffset(e);
        let np = Graph.totalPoints();
        let k;
        for (k = 0; k < np; k++) {
            const q = Graph.point(k);
            const d = Points.distance(p, q);
            if (d < 20) {
                p = q;
                break;
            }
        }
        if (flag) {
            $('.vrtx').eq(ipx).attr('stroke', Colors.stroke);
            flag = false;
            hold = false;
            if (Points.equal(p, px) || !isValidEdge(k)) {
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
                addVertex(p, charAt(65 + np));
                Graph.addPoint(p);
            }
            Graph.addSegment(ipx, k);
            if (weighted) addCost(px, p);

            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showError('Please draw acyclic graph.');
                    Path('.edge:last').remove();
                    Graph.removeEdge(ipx, k);
                    return;
                }
                let q = fromDistance(px, p, 22);
                if (overlaps(k)) {
                    q = fromDistance(px, p, 22);
                    const [cx, cy] = findCurve(px, q);
                    Path('.edge:last').attr('cx', cx);
                    Path('.edge:last').attr('cy', cy);
                    $('.cost:last').parent().attr('x', cx);
                    $('.cost:last').parent().attr('y', cy);
                    const [u, v] = [k, ipx].map(Graph.point);
                    const [cu, cv] = findCurve(u, fromDistance(u, v, 22));
                    const ei = Graph.edgeIndex(k, ipx);
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
                    addVertex(p, charAt(65 + np));
                    Graph.addPoint(p);
                }
            } else if (ipx < np) {
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
        const u = Graph.edgeIndex(ipx, ip);
        const v = Graph.edgeIndex(ip, ipx);
        return hasValue(u) && hasValue(v);
    }

    $('#plane').on(
        'mousemove touchmove',
        throttle((e) => {
            e.preventDefault();
            if (flag) {
                const p = cursorOffset(e);
                Path('.edge:last').attr('x2', p.x);
                Path('.edge:last').attr('y2', p.y);
            } else if (hold) {
                const p = cursorOffset(e);
                if (drag) {
                    Graph.setPoint(ipx, p);
                    moveVertex(ipx, p);
                } else {
                    const d = Points.distance(p, px);
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
    const segments = Graph.segments();

    if (Graph.isDirected()) {
        segments.forEach((seg, i) => {
            const [p, q] = seg.map(Graph.point);
            const r = fromDistance(p, q, 22);
            const el = Path('.edge').eq(i);
            el.attr('x2', r.x);
            el.attr('y2', r.y);
            el.attr('marker-end', 'url(#arrow)');
        });
    } else {
        segments.forEach((seg, i) => {
            const [, q] = seg.map(Graph.point);
            const el = Path('.edge').eq(i);
            el.attr('x2', q.x);
            el.attr('y2', q.y);
            el.removeAttr('marker-end');
        });
    }
}
