import React from 'react';
import { appendCell, isNumber, spanEdge } from '@/common/utils';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function BFS(props) {
    return (
        <>
            <section>
                <p>
                    <strong>Breadth First Search</strong> (BFS) explores a graph
                    level by level, starting at a node and visiting all its
                    neighbors before moving on to the next level. It uses a
                    queue to manage nodes. BFS is ideal for finding the shortest
                    path in an unweighted graph and for checking connectivity.
                </p>
            </section>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#visited').html('')}
            />
            <div id="visited" className="d-flex numGrid alphaGrid" />
        </>
    );
}

var queue;
var v, i, prev;
var delay = 500;

function start(source) {
    v = [source];
    queue = [];
    prev = [];
    i = source;
    Timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        appendCell('#visited', String.fromCharCode(65 + i));
        Timer.timeout(visit, delay, 0);
    }, delay * 2);
}

function visit(j) {
    if (j < Graph.totalPoints()) {
        let ei = Graph.edgeIndex(i, j);
        if (isNumber(ei)) {
            if (v.indexOf(j) === -1) {
                $('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                queue.push(j);
                v.push(j);
                prev[j] = i;
                Timer.timeout(visit, delay, ++j);
            } else visit(++j);
        } else visit(++j);
    } else bfs();
}

function bfs() {
    if (queue.length) {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
        i = queue.shift();
        Timer.timeout(() => {
            spanEdge(prev[i], i, 5, dequeue);
        }, delay * 2);
    } else {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
    }
}

function dequeue() {
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    appendCell('#visited', String.fromCharCode(65 + i));
    Timer.timeout(visit, delay, 0);
}
