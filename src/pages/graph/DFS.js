import React from 'react';
import { appendCell, spanEdge } from '@/common/utils';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function DFS(props) {
    return (
        <>
            <section>
                <p>
                    <strong>Depth First Search</strong> (DFS) explores a graph
                    by starting at a node and going as deep as possible along
                    each path before <strong>backtracking</strong>. It uses a
                    stack to keep track of the path. DFS is useful for tasks
                    like finding connected components and solving puzzles where
                    exploring all paths is necessary.
                </p>
            </section>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#path').html('')}
            />
            <div id="path" className="d-flex numGrid alphaGrid" />
        </>
    );
}

var stack;
var v, i, prev;
var delay = 500;

function start(source) {
    v = [source];
    stack = [];
    prev = [];
    i = source;
    Timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        appendCell('#path', String.fromCharCode(65 + i));
        Timer.timeout(explore, delay, 0);
    }, delay * 2);
}

function explore(j) {
    if (j < Graph.totalPoints()) {
        let ei = Graph.edgeIndex(i, j);
        if (ei !== undefined) {
            if (v.indexOf(j) === -1) {
                $('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.edge').eq(ei).attr('stroke-dasharray', '8,4');
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                stack.push(j);
                prev[j] = i;
                Timer.timeout(explore, delay, ++j);
            } else explore(++j);
        } else explore(++j);
    } else visit();
}

function visit() {
    if (stack.length) {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
        i = stack.pop();
        if (v.indexOf(i) === -1) {
            v.push(i);
            Timer.timeout(() => {
                spanEdge(prev[i], i, 5, dequeue);
            }, delay * 2);
        } else visit();
    } else {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
    }
}

function dequeue() {
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    v.forEach((j) => {
        if (j !== prev[i]) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined) {
                $('.edge').eq(ei).attr('stroke', Colors.rejected);
            }
        }
    });
    appendCell('#path', String.fromCharCode(65 + i));
    Timer.timeout(explore, delay, 0);
}
