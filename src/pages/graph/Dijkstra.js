import React from 'react';
import { getCostMatrix, isNumber, spanEdge } from '@/common/utils';
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
            <DrawGraph {...props} onStart={start} weighted={true} />
        </>
    );
}

var n, w;
var d, queue;
var v, prev;
var delay = 1000;

function start(source) {
    n = Graph.totalPoints();
    w = getCostMatrix();
    v = [source];
    d = [];
    for (let i = 0; i < n; i++) {
        if (i === source) d.push(0);
        else d.push(Infinity);
    }
    queue = [source];
    prev = [];
    Timer.timeout(() => {
        $('.vrtx').eq(source).attr('stroke', Colors.visited);
        $('.vrtx').eq(source).attr('fill', Colors.visited);
        Timer.timeout(dijkstra, delay, source);
    }, delay);
}

function dijkstra(i) {
    for (let j = 0; j < n; j++) {
        if (v.indexOf(j) === -1) {
            let ei = Graph.edgeIndex(i, j);
            if (!isNumber(ei)) continue;
            $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
            if (d[i] + w[i][j] < d[j]) {
                d[j] = d[i] + w[i][j];
                $('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                if (prev[j] !== undefined) {
                    let ej = Graph.edgeIndex(prev[j], j);
                    $('.edge').eq(ej).attr('stroke', Colors.rejected);
                }
                prev[j] = i;
            } else {
                $('.edge').eq(ei).attr('stroke', Colors.rejected);
            }
        }
    }
    for (let j = 0; j < n; j++) {
        queue[j] = v.indexOf(j) === -1 ? d[j] : Infinity;
    }
    Timer.timeout(extractMin, delay);
}

function extractMin() {
    let j = queue.indexOf(Math.min(...queue));
    v.push(j);
    let i = prev[j];
    spanEdge(i, j, 10, () => {
        $('.vrtx').eq(j).attr('stroke', Colors.visited);
        if (v.length < n) {
            Timer.timeout(dijkstra, delay / 2, j);
        }
    });
}
