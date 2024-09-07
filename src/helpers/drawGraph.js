import $ from 'jquery';
import { addVertex, addEdge, withOffset, fromDistance } from '../common/utils';
import Graph, { Point, Segment } from '../common/graph';
import { showToast } from '../components/toast/toast';
import { Colors } from '../common/constants';
import Timer from '../common/timer';

export function createGraph(data) {
    clearGraph();
    let { points, segments, matrix, steps, directed, costMatrix } = data;
    points.forEach((p, i) => {
        addVertex(p, String.fromCharCode(65 + i));
    });
    steps.forEach(([i, j]) => {
        let { p, q } = segments[matrix[i][j]];
        addEdge(p, q);
        if (directed) {
            let { x, y } = fromDistance(p, q, 23);
            $('.edge:last').attr('x2', x);
            $('.edge:last').attr('y2', y);
            $('.edge:last').attr('marker-end', 'url(#arrow)');
        }
        if (costMatrix) {
            addCost(p, q, costMatrix[i][j]);
        }
    });
    Graph.initialize(data);
}

export function clearGraph() {
    Timer.clear();
    $('#plane').off();
    $('#plane').children().not(':first').remove();
    Graph.clear();
}

export function drawGraph({ weighted, acyclic }) {
    let px, ix, flag;

    function isValidSeg(seg) {
        for (let i = 0; i < Graph.totalSegments(); i++) {
            let si = Graph.segment(i);
            if (Segment.overlap(seg, si)) return false;
        }
        return true;
    }

    $('#plane').on('click', function (e) {
        e.preventDefault();
        let p = withOffset(e);
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
                p = { ...q };
                break;
            }
        }
        if (flag) {
            flag = false;
            $('.vrtx').eq(ix).attr('stroke', Colors.stroke);
            let seg = Segment.create(px, p);
            if (Point.equal(p, px) || !isValidSeg(seg)) {
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
            Graph.addSegment(seg);
            if (weighted) addCost(p, px);
            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showToast({
                        message: 'Please draw acyclic graph.',
                        variant: 'error',
                    });
                    $('.edge:last').remove();
                    Graph.removeSegment(seg);
                    return;
                }
                let q = fromDistance(px, p, 23);
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
                px = p;
                ix = k;
                flag = true;
            }
        }
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = withOffset(e);
            $('.edge:last').attr('x2', p.x);
            $('.edge:last').attr('y2', p.y);
        }
    });

    $('#plane').on('mouseleave', function (e) {
        e.preventDefault();
        if (flag) {
            $('.edge:last').remove();
            $('.vrtx').eq(ix).attr('stroke', Colors.stroke);
            flag = false;
        }
    });
}

function addCost(p, q, cost) {
    cost = cost || Math.round(Point.distance(p, q) / 20);
    let element = `
        <foreignObject width="30" height="30" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2}">
            <p class="cost" onclick="this.focus();event.stopPropagation();" contenteditable="true">
                ${cost}
            </p>
        </foreignObject>`;
    document.getElementById('plane').innerHTML += element;
}

export function switchType() {
    Graph.switchType();
    if (Graph.isDirected()) {
        $('.edge').each(function (i) {
            let seg = Graph.segment(i);
            let r = fromDistance(seg.p, seg.q, 23);
            $(this).attr('x2', r.x);
            $(this).attr('y2', r.y);
            $(this).attr('marker-end', 'url(#arrow)');
        });
    } else {
        $('.edge').each(function (i) {
            let { q } = Graph.segment(i);
            $(this).attr('x2', q.x);
            $(this).attr('y2', q.y);
            $(this).removeAttr('marker-end');
        });
    }
}
