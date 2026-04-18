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

export function drawGraph({ weighted, acyclic, history, scope }) {
    var px, ipx, flag;
    var hold, drag;
    var plane = scope.find('.plane');

    function isInputActive() {
        const active = document.activeElement;
        if (active?.className === 'cost') {
            active.blur();
            scope.find('.cost').each(function () {
                $(this).attr('value', $(this).val());
            });
            return true;
        }
        return false;
    }

    plane.on('mousedown touchstart', (e) => {
        e.preventDefault();
        if (flag || isInputActive()) return;
        let p = scope.cursor(e);
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

    plane.on('click touchend', (e) => {
        e.preventDefault();
        if (isInputActive()) return;

        if (hold && drag) {
            hold = false;
            drag = false;
            return;
        }
        let p = scope.cursor(e);
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
            scope.node(ipx).attr('stroke', Colors.stroke);
            const lastEdge = scope.path(':last');
            flag = false;
            hold = false;
            if (Points.equal(p, px) || !isValidEdge(k)) {
                lastEdge.remove();
                return;
            }
            history.commit();
            lastEdge.attr('x2', p.x);
            lastEdge.attr('y2', p.y);
            if (k === np) {
                if (np === 26) {
                    lastEdge.remove();
                    return;
                }
                scope.addVertex(p, charAt(65 + np));
                Graph.addPoint(p);
            }
            Graph.addSegment(ipx, k);
            if (weighted) scope.appendCost(px, p);

            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showError('Please draw acyclic Graph.');
                    lastEdge.remove();
                    Graph.removeEdge(ipx, k);
                    return;
                }
                let q = fromDistance(px, p, 22);
                if (overlaps(k)) {
                    q = fromDistance(px, p, 22);
                    const [cx, cy] = findCurve(px, q);
                    lastEdge.attr('cx', cx);
                    lastEdge.attr('cy', cy);
                    scope.find('.cost:last').parent().attr('x', cx);
                    scope.find('.cost:last').parent().attr('y', cy);
                    const [u, v] = [k, ipx].map(Graph.point);
                    const [cu, cv] = findCurve(u, fromDistance(u, v, 22));
                    const ei = Graph.edgeIndex(k, ipx);
                    scope.path(ei).attr('cx', cu);
                    scope.path(ei).attr('cy', cv);
                    const costEl = scope.find('.cost').eq(ei);
                    costEl.parent().attr('x', cu);
                    costEl.parent().attr('y', cv);
                }
                lastEdge.attr('x2', q.x);
                lastEdge.attr('y2', q.y);
            }
        } else {
            if (k === np) {
                if (np < 26) {
                    history.commit();
                    scope.addVertex(p, charAt(65 + np));
                    Graph.addPoint(p);
                }
            } else if (ipx < np) {
                scope.addEdge(p, p);
                scope.node(k).attr('stroke', Colors.visited);
                if (Graph.isDirected()) {
                    scope.path(':last').attr('marker-end', 'url(#arrow)');
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

    plane.on(
        'mousemove touchmove',
        throttle((e) => {
            e.preventDefault();
            if (flag) {
                const p = scope.cursor(e);
                scope.path(':last').attr('x2', p.x);
                scope.path(':last').attr('y2', p.y);
            } else if (hold) {
                const p = scope.cursor(e);
                if (drag) {
                    Graph.setPoint(ipx, p);
                    scope.moveVertex(ipx, p, scope);
                } else {
                    const d = Points.distance(p, px);
                    if (d > 5) {
                        drag = true;
                        history.commit();
                    }
                }
            }
        }, 20)
    );

    plane.on('mouseleave', (e) => {
        e.preventDefault();
        if (flag) {
            scope.path(':last').remove();
            scope.node(ipx).attr('stroke', Colors.stroke);
        }
        flag = false;
        hold = false;
        drag = false;
    });
}

export function switchType(scope) {
    const segments = Graph.segments();

    if (Graph.isDirected()) {
        segments.forEach((seg, i) => {
            const [p, q] = seg.map(Graph.point);
            const r = fromDistance(p, q, 22);
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
