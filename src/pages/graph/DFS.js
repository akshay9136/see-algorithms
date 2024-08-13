import React from 'react';
import { isNumber, spanEdge } from '@/common/utils';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function DFS(props) {
    return <DrawGraph {...props} start={start} />;
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
                stack.push(j);
                v.push(j);
                prev[j] = i;
                Timer.timeout(visit, delay, ++j);
            } else visit(++j);
        } else visit(++j);
    } else dfs();
}

function dfs() {
    if (stack.length) {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
        i = stack.pop();
        Timer.timeout(() => {
            spanEdge(prev[i], i, 5, dequeue);
        }, delay * 2);
    } else {
        $('.vrtx').eq(i).attr('fill', Colors.vertex);
    }
}

function dequeue() {
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    let j;
    let n = Graph.totalPoints();
    for (j = 0; j < n; j++) {
        let ei = Graph.edgeIndex(i, j);
        if (isNumber(ei)) {
            if (v.indexOf(j) === -1 || stack.indexOf(j) > -1) {
                Timer.timeout(visit, delay, 0);
                break;
            }
        }
    }
    if (j === n) {
        Timer.timeout(dfs, delay);
    }
}
