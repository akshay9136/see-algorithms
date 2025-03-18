import React from 'react';
import { fromDistance, createGraph, appendCell } from '@/common/utils';
import Graph, { Point } from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

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
                allowDirected={false}
                customSource={false}
            />
            <div id="visited" className="d-flex numGrid alphaGrid" />
        </>
    );
}

var n, ind, stack;
var delay = 800;

function start() {
    n = Graph.totalPoints();
    ind = Graph.indegree();
    stack = [];
    for (let i = 0; i < n; i++) {
        if (ind[i] === 0) {
            $(`.vrtx:eq(${i})`).attr('stroke', Colors.visited);
            stack.push(i);
        }
    }
    return Timer.sleep(delay).then(topSort);
}

async function topSort() {
    if (stack.length > 0) {
        let i = stack.pop();
        $(`.vrtx:eq(${i})`).attr('fill', Colors.visited);
        let promises = [];
        for (let j = 0; j < Graph.totalPoints(); j++) {
            let ei = Graph.edgeIndex(i, j);
            if (ei !== undefined && ind[j] !== 0) {
                --ind[j];
                $(`line:eq(${ei})`).attr('stroke', Colors.visited);
                if (ind[j] === 0) {
                    $(`.vrtx:eq(${j})`).attr('stroke', Colors.visited);
                    stack.push(j);
                }
                let [p, q] = [i, j].map(Graph.point);
                let d = Point.distance(p, q);
                promises.push(() => extract(i, j, d - 25));
            }
        }
        if (promises.length) {
            await Timer.sleep(delay);
            await Promise.all(promises.map(p => p()));
        }
        await Timer.sleep(delay).then(() => fall(i));
        await Timer.sleep(delay).then(topSort);
    } else {
        createGraph(Graph.skeleton());
    }
}

function extract(i, j, d) {
    let [p, q] = [i, j].map(Graph.point);
    let ei = Graph.edgeIndex(i, j);
    if (d > 0) {
        let r = fromDistance(q, p, d);
        $(`line:eq(${ei})`).attr('x2', r.x);
        $(`line:eq(${ei})`).attr('y2', r.y);
        return Timer.sleep(5).then(() => extract(i, j, d - 2));
    } else {
        $(`line:eq(${ei})`).removeAttr('stroke');
        $(`line:eq(${ei})`).removeAttr('marker-end');
    }
}

function fall(i) {
    let cy = Number($(`.vrtx:eq(${i})`).attr('cy'));
    if (cy < $('#plane').height() + 20) {
        $(`.vrtx:eq(${i})`).attr('cy', cy + 2);
        $(`.vlbl:eq(${i})`).attr('y', cy + 7);
        return Timer.sleep(5).then(() => fall(i));
    } else {
        appendCell('#visited', String.fromCharCode(65 + i));
        n--;
    }
}
