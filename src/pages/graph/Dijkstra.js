import React from 'react';
import { createGrid, getCostMatrix, spanEdge } from '@/common/utils';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';
import Link from 'next/link';

export default function Dijkstra(props) {
    return (
        <>
            <section>
                <p>
                    <strong>Dijkstra&apos;s Algorithm</strong> finds the
                    shortest path from a source node to all other nodes in a
                    graph with non-negative weights. It uses a{' '}
                    <Link href="/data-structures/BinaryHeap">
                        priority queue
                    </Link>{' '}
                    to explore nodes in order of increasing distance. This
                    algorithm is widely used in routing and navigation systems.
                </p>
            </section>
            <DrawGraph
                {...props}
                onStart={start}
                weighted={true}
                onClear={() => {
                    $('#vert').html('');
                    $('#dist').html('');
                }}
            />
            <div id="vert" className="d-flex numGrid alphaGrid" />
            <div id="dist" className="d-flex numGrid alphaGrid" />
        </>
    );
}

var n, w, cells;
var d, queue;
var v, prev;
var delay = 1000;

function start(src) {
    $('.cost').each(function () {
        this.setAttribute('value', this.value);
        this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    w = getCostMatrix();
    v = [src];
    d = [];
    createGrid(n, '#vert');
    createGrid(n, '#dist');
    cells = document.querySelectorAll('.cell');
    cells[src + n].textContent = 0;
    d[src] = 0;
    for (let i = 0; i < n; i++) {
        cells[i].style.border = '2px solid';
        cells[i + n].style.border = '2px solid';
        cells[i].textContent = String.fromCharCode(65 + i);
        cells[i + n].style.transition = 'opacity 0.5s';
        if (i !== src) {
            d[i] = Infinity;
            cells[i + n].innerHTML = '&infin;';
        }
    }
    queue = [src];
    prev = [];
    Timer.timeout(() => {
        $('.vrtx').eq(src).attr('stroke', Colors.visited);
        $('.vrtx').eq(src).attr('fill', Colors.visited);
        cells[src].style.backgroundColor = Colors.visited;
        Timer.timeout(dijkstra, delay, src);
    }, delay);
}

function dijkstra(i) {
    w[i] = w[i] || [];
    let flag = 1;
    for (let j = 0; j < n; j++) {
        if (v.indexOf(j) === -1) {
            let ei = Graph.edgeIndex(i, j);
            if (ei === undefined) continue;
            if (d[i] + w[i][j] < d[j]) {
                d[j] = d[i] + w[i][j];
                $('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                cells[j].style.backgroundColor = Colors.enqueue;
                Timer.sleep(500).then(() => {
                    cells[j + n].style.opacity = 0;
                });
                Timer.sleep(delay).then(() => {
                    cells[j + n].textContent = d[j];
                    cells[j + n].style.opacity = 1;
                });
                prev[j] = i;
                flag = 2;
            }
        }
    }
    for (let j = 0; j < n; j++) {
        queue[j] = v.indexOf(j) === -1 ? d[j] : Infinity;
    }
    Timer.timeout(extractMin, delay * flag);
}

function extractMin() {
    let min = queue.reduce((a, b) => (b < a ? b : a), Infinity);
    if (min === Infinity) return;
    let j = queue.indexOf(min);
    let i = prev[j];
    v.push(j);
    spanEdge(i, j).then(() => {
        $('.vrtx').eq(j).attr('fill', Colors.visited);
        cells[j].style.backgroundColor = Colors.visited;
        if (v.length < n) {
            Timer.timeout(dijkstra, delay, j);
        }
    });
}
