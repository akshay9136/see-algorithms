import React from 'react';
import DrawGraph from '@/components/draw-graph';
import $ from 'jquery';
import Graph from '@/common/graph';
import Timer from '@/common/timer';
import { appendCell, cloneEdge, hasValue, spanEdge } from '@/common/utils';
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
        if (hasValue(ei)) {
            await spanEdge(i, src);
            return true;
        }
    }
    await Timer.sleep(delay);
    for (let j = 0; j < Graph.totalPoints(); j++) {
        let ei = Graph.edgeIndex(i, j);
        if (hasValue(ei) && v[j] === 0) {
            await spanEdge(i, j);
            appendCell('#path', String.fromCharCode(65 + j));
            v[j] = 1;
            if (await findCycle(j)) return true;
            v[j] = 0;
            await Timer.sleep(delay);
            await revertSpan(i, j);
            $('#path').children().last().remove();
            await Timer.sleep(delay);
        }
    }
}

function revertSpan(i, j) {
    const ei = Graph.edgeIndex(i, j);
    $('.edge').eq(ei).attr('stroke', Colors.stroke);
    $('.vrtx').eq(j).attr('stroke', Colors.stroke);
    const edge = cloneEdge(i, j);
    const d = edge[0].getTotalLength();
    const t = 1000 / (d / 2);
    const seg = Graph.segments()[ei];
    function span(dash) {
        if (dash < d) {
            edge.attr('stroke-dasharray', `${d - dash} ${dash}`);
            if (i !== seg[0]) {
                edge.attr('stroke-dashoffset', d - dash);
            }
            return Timer.sleep(t).then(() => span(dash + 2));
        } else edge.remove();
    }
    return span(2);
}
