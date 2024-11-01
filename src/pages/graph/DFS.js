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
                onClear={() => {
                    $('#visited').html('');
                    $('#stack').html('');
                }}
            />
            <div className="d-flex queue">
                <h6 className="pt-2 pe-3">Visited:</h6>
                <div id="visited" className="d-flex numGrid alphaGrid" />
            </div>
            <div className="d-flex queue mb-3">
                <h6 className="pt-2 pe-3">Stack:</h6>
                <div id="stack" className="d-flex numGrid alphaGrid" />
            </div>
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
        appendCell('#visited', String.fromCharCode(65 + i));
        Timer.timeout(explore, 1000, 0);
    }, delay);
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
                appendCell('#stack', String.fromCharCode(65 + j));
                Timer.timeout(explore, delay, ++j);
            } else explore(++j);
        } else explore(++j);
    } else {
        Timer.timeout(visit, delay);
    }
}

function visit() {
    if (stack.length) {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
        i = stack.pop();
        $('#stack').children().last().remove();
        if (v.indexOf(i) === -1) {
            v.push(i);
            Timer.timeout(() => {
                appendCell('#visited', String.fromCharCode(65 + i));
                spanEdge(prev[i], i, 3).then(dequeue);
            }, delay);
        } else {
            Timer.timeout(visit, delay);
        }
    } else {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
    }
}

function dequeue() {
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    v.forEach((k) => {
        if (k !== prev[i]) {
            let ei = Graph.edgeIndex(k, i);
            if (ei !== undefined) {
                $('.edge').eq(ei).attr('stroke', Colors.rejected);
            }
        }
    });
    Timer.timeout(explore, delay, 0);
}
