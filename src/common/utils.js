import $ from 'jquery';
import Graph, { Point } from './graph';
import { Colors } from './constants';
import Timer from './timer';

const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'];
const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function withOffset(e) {
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
    return out;
}

function addVertex(p, vlbl) {
    document.getElementById('plane').innerHTML +=
    `<g class="vgrp"><ellipse class="vrtx" cx="${p.x}" cy="${
        p.y
    }" rx="${18}" ry="15" stroke="${Colors.stroke}" stroke-width="2" fill="${
        Colors.vertex
    }" style="cursor:pointer" /><text class="vlbl" x="${p.x}" y="${
        p.y + 5
    }" text-anchor="middle" style="cursor:pointer">${vlbl}</text></g>`;
}

function addEdge(p, q) {
    let edge = `<line class="edge" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke-width="2.5" stroke="${Colors.stroke}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vgrp:first'));
}

function moveVertex(i, p) {
    $('.vrtx').eq(i).attr('cx', p.x);
    $('.vrtx').eq(i).attr('cy', p.y);
    $('.vlbl').eq(i).attr('x', p.x);
    $('.vlbl').eq(i).attr('y', p.y + 5);
    Graph.segments().forEach((seg, ei) => {
        if (seg.includes(i)) {
            const [u, v] = seg.map(Graph.point);
            const edge = $('.edge').eq(ei);
            edge.attr('x1', u.x);
            edge.attr('y1', u.y);
            edge.attr('x2', v.x);
            edge.attr('y2', v.y);
            if (Graph.isDirected()) {
                let q = fromDistance(u, v, 23);
                edge.attr('x2', q.x);
                edge.attr('y2', q.y);
                edge.attr('marker-end', 'url(#arrow)');
            }
            const costEl = $('.cost').eq(ei).parent();
            costEl.attr('x', (u.x + v.x) / 2);
            costEl.attr('y', (u.y + v.y) / 2);
            const newCost = (Point.distance(u, v) / 20).toFixed(1);
            console.log(costEl, newCost)
            costEl.children().text(newCost);
        }
    });
}

function cloneEdge(i, j, edge) {
    edge = edge || `<line stroke-width="4" stroke="${Colors.visited}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vgrp:first'));
    let p, q;
    let [r, s] = [i, j].map(Graph.point);
    if (Point.equal(r, Graph.point(i))) {
        [p, q] = [r, s];
    } else {
        [p, q] = [s, r];
    }
    $('line:last').attr('x1', p.x);
    $('line:last').attr('y1', p.y);
    $('line:last').attr('x2', p.x);
    $('line:last').attr('y2', p.y);
    let d = Point.distance(p, q);
    return { p, q, d };
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
    $(rowId).append(`<div class="cell" style="border:2px solid;">${val}</div>`);
}

function getCostMatrix() {
    let mat = [];
    Graph.segments().forEach(([i, j], k) => {
        mat[i] = mat[i] || [];
        let value = $('.cost').eq(k).text();
        mat[i][j] = Number(value) || 1;
        if (!Graph.isDirected()) {
            mat[j] = mat[j] || [];
            mat[j][i] = Number(value) || 1;
        }
    });
    return mat;
}

function spanEdge(i, j, delay) {
    const ei = Graph.edgeIndex(i, j);
    const { p, q, d } = cloneEdge(i, j);
    function span(d) {
        if (d > 0) {
            const r = fromDistance(p, q, d);
            $('line:last').attr('x2', r.x);
            $('line:last').attr('y2', r.y);
            return Timer.sleep(delay).then(() => span(d - 1));
        } else {
            $('line:last').remove();
            $('.edge').eq(ei).removeAttr('stroke-dasharray');
            $('.edge').eq(ei).attr('stroke', Colors.visited);
            $('.vrtx').eq(j).attr('stroke', Colors.visited);
        }
    }
    return span(d - 2);
}

export {
    withOffset,
    addVertex,
    addEdge,
    moveVertex,
    cloneEdge,
    fromDistance,
    createGrid,
    appendCell,
    getCostMatrix,
    spanEdge,
};

export const randomInt = () => Math.floor(Math.random() * 99) + 1;

export const sleep = (t) => {
    return new Promise((resolve) => setTimeout(resolve, t));
};

export const bgcolor = (id, color) => $(id).css('background-color', color);
