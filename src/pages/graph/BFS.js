import React from 'react';
import { appendCell, spanEdge } from '@/common/utils';
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
                onClear={() => {
                    $('#visited').html('');
                    $('#queue').html('');
                }}
            />
            <div className="d-flex queue mb-2">
                <h6 className="pt-2 pe-3">Visited:</h6>
                <div id="visited" className="d-flex numGrid alphaGrid" />
            </div>
            <div className="d-flex queue mb-3">
                <h6 className="pt-2 pe-3">Queue:</h6>
                <div id="queue" className="d-flex numGrid alphaGrid" />
            </div>
        </>
    );
}

var queue, k;
var v, i, prev;
var delay = 800;

function start(source) {
    v = [source];
    queue = [];
    prev = [];
    i = source;
    k = 0;
    Timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        appendCell('#visited', String.fromCharCode(65 + i));
        Timer.timeout(explore, delay, 0);
    }, delay);
}

function explore(j) {
    if (j < Graph.totalPoints()) {
        let ei = Graph.edgeIndex(i, j);
        if (ei !== undefined) {
            if (v.indexOf(j) === -1) {
                $('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                queue.push(j);
                prev[j] = i;
                appendCell('#queue', String.fromCharCode(65 + j));
                Timer.timeout(explore, delay, ++j);
            } else explore(++j);
        } else explore(++j);
    } else {
        Timer.timeout(visit, delay);
    }
}

function visit() {
    $('.vrtx').eq(i).attr('fill', Colors.vertex);
    if (queue.length) {
        i = queue.shift();
        $('#queue').children().eq(k++).css('visibility', 'hidden');
        if (v.indexOf(i) === -1) {
            v.push(i);
            Timer.timeout(() => {
                appendCell('#visited', String.fromCharCode(65 + i));
                spanEdge(prev[i], i, 3).then(dequeue);
            }, delay / 2);
        } else {
            Timer.timeout(visit, delay);
        }
    }
}

function dequeue() {
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    Timer.timeout(explore, delay, 0);
}
