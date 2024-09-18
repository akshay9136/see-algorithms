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
    let vrtx = `<g class="vgrp"><ellipse class="vrtx" cx="${p.x}" cy="${
        p.y
    }" rx="${18}" ry="15" stroke="${Colors.stroke}" stroke-width="2" fill="${
        Colors.vertex
    }" /><text class="vlbl" x="${p.x}" y="${
        p.y + 5
    }" text-anchor="middle" style="cursor:pointer">${vlbl}</text></g>`;
    document.getElementById('plane').innerHTML += vrtx;
}

function moveVertex(i, r) {
    $('.vrtx').eq(i).attr('cx', r.x);
    $('.vrtx').eq(i).attr('cy', r.y);
    $('.vlbl').eq(i).attr('x', r.x);
    $('.vlbl').eq(i).attr('y', r.y + 5);
}

function addEdge(p, q) {
    let edge = `<line class="edge" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke-width="2.5" stroke="${Colors.stroke}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vgrp:first'));
}

function cloneEdge(i, j) {
    let edge = `<line stroke-width="4" stroke="${Colors.visited}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vgrp:first'));
    let p, q;
    let segment = Graph.segment(j);
    if (Point.equal(segment.p, Graph.point(i))) {
        p = segment.p;
        q = segment.q;
    } else {
        p = segment.q;
        q = segment.p;
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
    Graph.forEach((i, j) => {
        mat[i] = mat[i] || [];
        let ei = Graph.edgeIndex(i, j);
        if (isNumber(ei)) {
            let value = $('.cost').eq(ei).text();
            mat[i][j] = parseInt(value) || 1;
        } else {
            mat[i][j] = Infinity;
        }
    });
    return mat;
}

function spanEdge(i, j, delay, callback) {
    let ei = Graph.edgeIndex(i, j);
    let { p, q, d } = cloneEdge(i, ei);
    function span(d) {
        if (d > 0) {
            let r = fromDistance(p, q, d);
            $('line:last').attr('x2', r.x);
            $('line:last').attr('y2', r.y);
            Timer.timeout(span, delay, d - 2);
        } else {
            $('line:last').remove();
            $('.edge').eq(ei).removeAttr('stroke-dasharray');
            $('.edge').eq(ei).attr('stroke', Colors.visited);
            $('.vrtx').eq(j).attr('stroke', Colors.visited);
            callback();
        }
    }
    span(d - 2);
}

export {
    withOffset,
    addVertex,
    moveVertex,
    addEdge,
    cloneEdge,
    fromDistance,
    createGrid,
    appendCell,
    getCostMatrix,
    spanEdge,
};

export const isNumber = (x) => !isNaN(parseInt(x));

export const randomInt = () => Math.floor(Math.random() * 99) + 1;

export const sleep = (t) => {
    return new Promise((resolve) => setTimeout(resolve, t));
};

export const try_ = (fn) => () => fn().catch(() => {});

export const bgcolor = (id, color) => $(id).css('background-color', color);
