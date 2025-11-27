import $ from 'jquery';
import Graph, { Path, Point } from './graph';
import { Colors } from './constants';
import { showToast } from '../components/toast';
import Timer from './timer';

const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'];
const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function cursorOffset(e) {
    let out = { x: 0, y: 0 };
    let { left, top } = $('#plane').offset();
    if (touchEvents.includes(e.type)) {
        let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX - left;
        out.y = touch.pageY - top;
    } else if (mouseEvents.includes(e.type)) {
        out.x = e.pageX - left;
        out.y = e.pageY - top;
    }
    out.x = Math.round(out.x);
    out.y = Math.round(out.y);
    return out;
}

function addVertex(p, vlbl) {
    document.getElementById('plane').innerHTML +=
    `<g class="vgrp"><ellipse class="vrtx" cx="${p.x}" cy="${
        p.y
    }" rx="18" ry="16" stroke="${Colors.stroke}" stroke-width="2" fill="${
        Colors.vertex
    }" style="cursor:pointer" /><text class="vlbl" x="${p.x}" y="${
        p.y + 5
    }" text-anchor="middle" style="cursor:pointer">${vlbl}</text></g>`;
}

function moveVertex(i, p) {
    $('.vrtx').eq(i).attr('cx', p.x);
    $('.vrtx').eq(i).attr('cy', p.y);
    $('.vlbl').eq(i).attr('x', p.x);
    $('.vlbl').eq(i).attr('y', p.y + 5);
    Graph.segments().forEach((seg, ei) => {
        if (seg.includes(i)) {
            let [u, v] = seg.map(Graph.point);
            let edge = Path('.edge').eq(ei);
            let cx = (u.x + v.x) / 2;
            let cy = (u.y + v.y) / 2;
            let d = `M ${u.x} ${u.y} Q ${cx} ${cy} ${v.x} ${v.y}`;
            edge.attr('d', d);
            if (Graph.isDirected()) {
                let ej = Graph.edgeIndex(seg[1], seg[0]);
                if (hasValue(ej)) {
                    [cx, cy] = findCurve(u, v);
                    edge.attr('cx', cx);
                    edge.attr('cy', cy);
                }
                let q = fromDistance(u, v, 22);
                edge.attr('x2', q.x);
                edge.attr('y2', q.y);
            }
            let costEl = $('.cost').eq(ei).parent();
            costEl.attr('x', cx);
            costEl.attr('y', cy);
        }
    });
}

function findCurve(p, q) {
    let mx = (p.x + q.x) / 2;
    let my = (p.y + q.y) / 2;
    let dx = p.x - q.x;
    let dy = p.y - q.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    let offset = length * 0.1; // Adjust curve strength
    // Perpendicular vector
    let nx = -dy / length;
    let ny = dx / length;
    // Control point
    let cx = mx + nx * offset;
    let cy = my + ny * offset;
    return [cx, cy];
}

function addEdge(p, q) {
    let cx = (p.x + q.x) / 2;
    let cy = (p.y + q.y) / 2;
    let d = `M ${p.x} ${p.y} Q ${cx} ${cy} ${q.x} ${q.y}`;
    let edge = `<path class="edge" d="${d}" stroke-width="2.5" stroke="${Colors.stroke}" fill="transparent" />`;
    document.getElementById('plane').innerHTML += edge;
    $('.edge:last').insertBefore($('.vgrp:first'));
}

function addCost(p, q, cost) {
    cost = cost || (Point.distance(p, q) / 10).toFixed();
    const handler = `
        event.stopPropagation();
        this.focus();
        var value = this.value;
        this.value = '';
        this.value = value;`;
    const element = `
        <foreignObject width="32" height="24" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2}">
            <input class="cost" value="${cost}" maxlength="${3}" onclick="${handler}" ontouchend="${handler}">
        </foreignObject>`;
    document.getElementById('plane').innerHTML += element;
}

function cloneEdge(i, j) {
    let ei = Graph.edgeIndex(i, j);
    let d = Path('.edge').eq(ei).attr('d');
    let edge = `<path stroke-width="4" stroke="${Colors.visited}" fill="transparent" d="${d}"  />`;
    document.getElementById('plane').innerHTML += edge;
    $('path:last').insertBefore($('.vgrp:first'));
    return $('path:last');
}

function fromDistance(start, end, distance) {
    let x = end.x - start.x;
    let y = end.y - start.y;
    let z = Math.sqrt(x * x + y * y);
    let ratio = distance / z;
    let deltaX = x * ratio;
    let deltaY = y * ratio;
    return { x: end.x - deltaX, y: end.y - deltaY };
}

function createGrid(n, id) {
    let row = document.createElement('div');
    row.setAttribute('class', 'd-flex');
    for (let j = 0; j < n; j++) {
        let cell = document.createElement('div');
        cell.setAttribute('class', 'cell');
        row.appendChild(cell);
    }
    $(id).append(row);
}

function appendCell(rowId, val) {
    $(rowId).append(`<div class="cell">${val}</div>`);
}

function getCostMatrix() {
    const mat = [];
    Graph.segments().forEach(([i, j], k) => {
        mat[i] = mat[i] || [];
        const value = $('.cost').eq(k).val();
        mat[i][j] = Number(value) || 1;
        if (!Graph.isDirected()) {
            mat[j] = mat[j] || [];
            mat[j][i] = mat[i][j];
        }
    });
    return mat;
}

function spanEdge(i, j) {
    const ei = Graph.edgeIndex(i, j);
    const edge = cloneEdge(i, j);
    const d = edge[0].getTotalLength();
    const t = d / 40;
    const seg = Graph.segments()[ei];

    function span(dash) {
        if (dash < d) {
            edge.attr('stroke-dasharray', `${dash} ${d - dash}`);
            if (i !== seg[0]) {
                edge.attr('stroke-dashoffset', dash);
            }
            return Timer.sleep(20).then(() => span(dash + t));
        } else {
            edge.remove();
            $('.edge').eq(ei).attr('stroke', Colors.visited);
            $('.vrtx').eq(j).attr('stroke', Colors.visited);
        }
    }
    return span(2);
}

function clearGraph() {
    Timer.clear();
    $('#plane').off();
    $('#plane').children().not(':first').remove();
    Graph.clear();
}

function createGraph(data, weighted) {
    const { points, segments, directed, matrix, costMatrix } = data;
    points.forEach((p, i) => {
        addVertex(p, charAt(65 + i));
    });
    segments.forEach(([i, j]) => {
        const p = points[i], q = points[j];
        addEdge(p, q);
        if (directed) {
            const { x, y } = fromDistance(p, q, 22);
            Path('.edge:last').attr('x2', x);
            Path('.edge:last').attr('y2', y);
            Path('.edge:last').attr('marker-end', 'url(#arrow)');
            if (hasValue(matrix[j][i])) {
                const [cx, cy] = findCurve(p, { x, y });
                Path('.edge:last').attr('cx', cx);
                Path('.edge:last').attr('cy', cy);
            }
        }
        if (weighted) {
            addCost(p, q, costMatrix?.[i][j]);
        }
    });
}

function traverse(node, fn) {
    if (node) {
        fn(node);
        traverse(node.left, fn);
        traverse(node.right, fn);
    }
}

function copyBinaryTree(root) {
    const data = [];
    traverse(root, (node) => data.push(node.value));
    const nodes = JSON.stringify(data);
    const origin = window.location.origin;
    const url = `${origin}${location.pathname}?nodes=${btoa(nodes)}`;
    navigator.clipboard.writeText(url);
    showToast({
        message: 'Tree url is copied to clipboard.',
        variant: 'success',
    });
};

export {
    cursorOffset,
    addVertex,
    addEdge,
    addCost,
    moveVertex,
    findCurve,
    cloneEdge,
    fromDistance,
    createGrid,
    appendCell,
    getCostMatrix,
    spanEdge,
    clearGraph,
    createGraph,
    traverse,
    copyBinaryTree,
};

export const sound = (name) => {
    const sound = document.getElementById(`${name}Sound`);
    sound?.play();
};

export const groupBy = (arr, key) => {
    return arr.reduce((acc, x) => {
      (acc[x[key]] ??= []).push(x);
      return acc;
    }, {});
};

export const throttle = (fn, delay) => {
    let prev = 0;
    return (...args) => {
        let now = Date.now();
        if (now - prev > delay) {
            prev = now;
            fn(...args);
        }
    }
};

export const sleep = (t) => {
    return new Promise((resolve) => setTimeout(resolve, t));
};

export const charAt = (code) => String.fromCharCode(code);

export const randomInt = () => Math.floor(Math.random() * 99) + 1;

export const hasValue = (val) => {
    return val !== null && val !== undefined;
};

export const bgcolor = (id, color) => $(id).css('background-color', color);

export const withBoxId = (val, i) => ({ val, id: `#box${i}` });

export const showError = (msg) => {
    showToast({ message: msg, variant: 'error' });
};
