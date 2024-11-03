import React from 'react';
import { getCostMatrix, spanEdge } from '@/common/utils';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function PrimsMST(props) {
    return (
        <>
            <section>
                <p>
                    <strong>Prim&apos;s Algorithm</strong> builds a Minimum
                    Spanning Tree (MST) by starting from any node and adding the
                    smallest edge that connects the tree to a new node,
                    repeating until all nodes are included. It is used for
                    optimizing network designs like computer and road networks.
                </p>
            </section>
            <DrawGraph
                {...props}
                onStart={start}
                weighted={true}
                allowDirected={false}
            />
        </>
    );
}

var n, w;
var mst, i, j;
var queue;
var delay = 1000;

function start(source) {
    n = Graph.totalPoints();
    w = getCostMatrix();
    queue = [];
    mst = [];
    i = source;
    Timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        Timer.timeout(enqueue, delay / 2);
    }, delay);
}

function enqueue() {
    mst.push(i);
    queue = queue.concat(Array(n).fill(Infinity));
    w[i] = w[i] || [];
    w[i].forEach((val, j) => {
        queue[n * i + j] = val;
    });
    for (let k = 0; k < n; k++) {
        if (mst.indexOf(k) === -1 && w[i][k] !== undefined) {
            let ei = Graph.edgeIndex(i, k);
            $('.edge').eq(ei).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(k).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(k).attr('fill', Colors.enqueue);
        }
    }
    Timer.timeout(extractMin, delay);
}

function extractMin() {
    let min = queue.reduce((a, b) => b < a ? b : a, Infinity);
    if (min === Infinity) return;
    let k = queue.indexOf(min);
    queue[k] = Infinity;
    i = Math.floor(k / n);
    j = k % n;
    if (mst.indexOf(j) > -1) {
        extractMin();
    } else {
        spanEdge(i, j, 5).then(() => {
            $('.vrtx').eq(j).attr('fill', Colors.visited);
            i = j;
            if (mst.length < n - 1) {
                Timer.timeout(enqueue, delay / 2);
            }
        });
    }
}
