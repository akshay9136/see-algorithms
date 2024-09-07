import React from 'react';
import {
    fromDistance,
    isNumber,
    createGrid,
} from '@/common/utils';
import Graph, { Point } from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';
import { createGraph } from '@/helpers/drawGraph';

export default function TopSort(props) {
    return (
        <>
            <section>
                <p>
                    <strong>Topological Sort</strong> is an ordering of nodes in
                    a directed acyclic graph (DAG) where each node appears
                    before all the nodes it points to. It is like creating a
                    list of tasks, ensuring that each task comes after any tasks
                    it depends on.
                </p>
            </section>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#visited').html('')}
                isDAG={true}
            />
            <div id="visited" className="numGrid alphaGrid" />
        </>
    );
}

var cells, n;
var ind, stack, k;
var delay = 500;

function start() {
    n = Graph.totalPoints();
    createGrid(n, '#visited');
    cells = document.querySelectorAll('.cell');
    for (let i = 0; i < n; i++) {
        cells[i].setAttribute('style', 'border:2px solid; width:3rem;');
    }
    stack = [];
    ind = Graph.indegree();
    for (let i = 0; i < n; i++) {
        if (ind[i] === 0) {
            stack.push(i);
            $(`.vrtx:eq(${i})`).attr('stroke', Colors.visited);
        }
    }
    k = 0;
    Timer.timeout(topsort, delay * 2);
}

function topsort() {
    if (stack.length > 0) {
        let i = stack.pop();
        $(`.vrtx:eq(${i})`).attr('fill', Colors.visited);
        for (let j = 0; j < Graph.totalPoints(); j++) {
            let ei = Graph.edgeIndex(i, j);
            if (isNumber(ei) && ind[j] !== 0) {
                --ind[j];
                k++;
                let p = Graph.point(i);
                let x2 = $(`line:eq(${ei})`).attr('x2');
                let y2 = $(`line:eq(${ei})`).attr('y2');
                let q = Point.create(x2, y2);
                $(`line:eq(${ei})`).attr('stroke', Colors.visited);
                let d = Point.distance(p, q);
                // eslint-disable-next-line no-loop-func
                Timer.timeout(() => {
                    if (ind[j] === 0) {
                        stack.push(j);
                        $(`.vrtx:eq(${j})`).attr('stroke', Colors.visited);
                    }
                    extract(p, q, i, j, d - 2);
                }, delay);
            }
        }
        if (k === 0) {
            Timer.timeout(fall, delay, i);
        }
    } else {
        createGraph(Graph.skeleton());
    }
}

function extract(p, q, i, j, d) {
    let ei = Graph.edgeIndex(i, j);
    if (d > 0) {
        let r = fromDistance(q, p, d);
        $(`line:eq(${ei})`).attr('x2', r.x);
        $(`line:eq(${ei})`).attr('y2', r.y);
        Timer.timeout(extract, 5, p, q, i, j, d - 2);
    } else {
        $(`line:eq(${ei})`).removeAttr('stroke');
        $(`line:eq(${ei})`).removeAttr('marker-end');
        if (--k === 0) {
            Timer.timeout(fall, delay, i);
        }
    }
}

function fall(i) {
    let cy = parseInt($(`.vrtx:eq(${i})`).attr('cy'));
    if (cy < $('#plane').height() + 20) {
        $(`.vrtx:eq(${i})`).attr('cy', cy + 2);
        $(`.vlbl:eq(${i})`).attr('y', cy + 7);
        Timer.timeout(fall, 5, i);
    } else {
        let np = Graph.totalPoints();
        cells[np - n].textContent = String.fromCharCode(65 + i);
        cells[np - n].style.backgroundColor = Colors.visited;
        $(`.vgrp:eq(${i})`).css('visibility', 'hidden');
        n--;
        Timer.timeout(topsort, delay);
    }
}
