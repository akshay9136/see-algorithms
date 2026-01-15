import Graph, { Path, Points } from './graph';
import $ from 'jquery';
import { Colors } from './constants';
import { showToast } from '../components/toast';

const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'];
const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function cursorOffset(e) {
    const out = { x: 0, y: 0 };
    const { left, top } = $('#plane').offset();
    if (touchEvents.includes(e.type)) {
        const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
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

function svgElement(tag, attrs, text) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    if (text) el.textContent = text;
    return el;
}

function addVertex(p, vlbl) {
    const props = {
        class: 'vrtx',
        cx: p.x,
        cy: p.y,
        rx: 18,
        ry: 16,
        'stroke-width': 2,
        stroke: Colors.stroke,
        fill: Colors.vertex,
        style: 'cursor:pointer',
    };
    const labelProps = {
        class: 'vlbl',
        x: p.x,
        y: p.y + 5,
        style: 'cursor:pointer',
        fill: '#505050',
        'font-weight': 'bold',
        'text-anchor': 'middle',
    };
    const group = svgElement('g', { class: 'vgrp' });
    group.append(
        svgElement('ellipse', props),
        svgElement('text', labelProps, vlbl)
    );
    $('#plane').append(group);
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
    const cx = (p.x + q.x) / 2;
    const cy = (p.y + q.y) / 2;
    const d = `M ${p.x} ${p.y} Q ${cx} ${cy} ${q.x} ${q.y}`;
    const props = {
        class: 'edge',
        stroke: Colors.stroke,
        fill: 'transparent',
        'stroke-width': 2.5,
    };
    const edge = svgElement('path', { d, ...props });
    $('.vgrp:first').before(edge);
}

function addCost(p, q, cost) {
    if (!cost) {
        const distance = Points.distance(p, q);
        const baseCost = distance / 20;
        // Generate random cost between 50% and 200% of base cost
        const random = 0.5 + Math.random() * 1.5;
        cost = Math.floor(baseCost * random).toString();
    }
    const parent = svgElement('foreignObject', {
        width: 32,
        height: 24,
        x: (p.x + q.x) / 2,
        y: (p.y + q.y) / 2,
    });
    const input = document.createElement('input');
    input.value = cost;
    input.maxLength = 3;
    input.className = 'cost';

    const handler = (e) => {
        e.stopPropagation();
        input.focus();
    };
    input.addEventListener('click', handler);
    input.addEventListener('touchend', handler);
    parent.append(input);
    $('#plane').append(parent);
}

function cloneEdge(i, j) {
    const ei = Graph.edgeIndex(i, j);
    const props = {
        d: Path('.edge').eq(ei).attr('d'),
        stroke: Colors.visited,
        fill: 'transparent',
        'stroke-width': 4,
    };
    const edge = svgElement('path', props);
    $('.vgrp:first').before(edge);
    return edge;
}

function fromDistance(start, end, distance) {
    let x = end.x - start.x;
    let y = end.y - start.y;
    let z = Math.sqrt(x * x + y * y);
    let ratio = distance / z;
    let deltaX = Math.round(x * ratio);
    let deltaY = Math.round(y * ratio);
    return { x: end.x - deltaX, y: end.y - deltaY };
}

function createGrid(n, id) {
    const row = document.createElement('div');
    row.className = 'd-flex';
    for (let j = 0; j < n; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        row.appendChild(cell);
    }
    $(id).append(row);
}

function appendCell(rowId, val) {
    const cell = document.createElement('div');
    cell.textContent = val;
    cell.className = 'cell';
    $(rowId).append(cell);
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

function* spanEdge(i, j) {
    const ei = Graph.edgeIndex(i, j);
    const edge = cloneEdge(i, j);
    const d = edge.getTotalLength();
    const t = d / 50;
    const seg = Graph.segments()[ei];

    function* span(dash) {
        if (dash < d) {
            $(edge).attr('stroke-dasharray', `${dash} ${d - dash}`);
            if (i !== seg[0]) {
                $(edge).attr('stroke-dashoffset', dash);
            }
            yield 20;
            yield* span(dash + t);
        } else {
            edge.remove();
            $('.edge').eq(ei).attr('stroke', Colors.visited);
            $('.edge').eq(ei).attr('stroke-width', 3);
            $('.vrtx').eq(j).attr('stroke', Colors.visited);
        }
    }
    yield* span(2);
}

function clearGraph() {
    $('#plane').off();
    $('#plane').children().not(':first').remove();
    Graph.clear();
}

function createGraph(data, weighted) {
    const { points, segments, directed, matrix, weights } = data;

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
            addCost(p, q, weights?.[i][j]);
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

function copyBinaryTree(root, fn = (a) => a.value) {
    const data = [];
    traverse(root, (node) => data.push(fn(node)));
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
    svgElement,
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

export const logError = (error) => {
    fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
    });
};
