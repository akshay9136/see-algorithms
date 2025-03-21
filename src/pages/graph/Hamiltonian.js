import React from 'react';
import { appendCell, cloneEdge, fromDistance, spanEdge } from '@/common/utils';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function Hamiltonian(props) {
    return (
        <>
            <p>
                A <strong>Hamiltonian Cycle</strong> is a path in a graph that
                visits every node exactly once and returns to the starting node.
                It is closely related to Travelling Salesman Problem, where the
                goal is to find the shortest possible Hamiltonian cycle.
                Hamiltonian cycles are useful in routing, scheduling, and
                circuit design.
            </p>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#path').html('')}
                allowDirected={false}
            />
            <div id="path" className="d-flex numGrid alphaGrid" />
        </>
    );
}

var src, v;
var delay = 500;

async function start(source) {
    src = source;
    v = Array(Graph.totalPoints()).fill(0);
    v[src] = 1;
    await Timer.sleep(1000);
    $('.vrtx').eq(src).attr('stroke', Colors.visited);
    $('.vrtx').eq(src).attr('fill', Colors.visited);
    appendCell('#path', String.fromCharCode(65 + src));
    await Timer.sleep(delay);
    await findCycle(src);
}

async function findCycle(i) {
    if (v.indexOf(0) === -1) {
        let ei = Graph.edgeIndex(i, src);
        if (ei !== undefined) {
            spanEdge(i, src);
            return true;
        }
    }
    await Timer.sleep(delay);
    for (let j = 0; j < Graph.totalPoints(); j++) {
        let ei = Graph.edgeIndex(i, j);
        if (ei !== undefined && v[j] === 0) {
            await spanEdge(i, j);
            appendCell('#path', String.fromCharCode(65 + j));
            v[j] = 1;
            if (await findCycle(j)) return true;
            v[j] = 0;
            await Timer.sleep(delay);
            await revertSpan(j, i);
            $('#path').children().last().remove();
            await Timer.sleep(delay);
        }
    }
}

function revertSpan(i, j) {
    $('.vrtx').eq(i).attr('stroke', Colors.stroke);
    const ei = Graph.edgeIndex(i, j);
    const edge = `<line stroke-width="2.5" stroke="${Colors.stroke}" />`;
    const { p, q, d } = cloneEdge(i, j, edge);
    function span(d) {
        if (d > 0) {
            const r = fromDistance(p, q, d);
            $('line:last').attr('x2', r.x);
            $('line:last').attr('y2', r.y);
            return Timer.sleep(5).then(() => span(d - 1));
        } else {
            $('line:last').remove();
            $('.edge').eq(ei).attr('stroke', Colors.stroke);
        }
    }
    return span(d - 2);
}
