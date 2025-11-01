import React from 'react';
import DrawGraph from '@/components/draw-graph';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path, Point } from '@/common/graph';
import Timer from '@/common/timer';
import {
    appendCell,
    clearGraph,
    createGraph,
    fromDistance,
    hasValue,
    sound,
} from '@/common/utils';
import { Colors } from '@/common/constants';
import Link from 'next/link';

export default function TopSort(props) {
    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Topological Sorting</strong> is an ordering of nodes in
                a directed acyclic graph (DAG) where each node appears before
                all the nodes it points to. It is like creating a list of tasks,
                ensuring that each task comes after any tasks it depends on. The
                sorting can be achieved using Kahn&apos;s algorithm or{' '}
                <Link href="/graph/DFS">DFS</Link> with a stack.{' '}
                <strong>Kahn&apos;s algorithm</strong> works by repeatedly
                removing nodes with no incoming edges (zero in-degree) and
                adding them to the order.
            </Typography>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#visited').html('')}
                allowDirected={false}
                customSource={false}
            />
            <Box id="visited" className="d-flex numGrid alphaGrid" />
        </Stack>
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
        sound('pop');
        $(`.vrtx:eq(${i})`).attr('fill', Colors.visited);
        let promises = [];
        for (let j = 0; j < Graph.totalPoints(); j++) {
            let ei = Graph.edgeIndex(i, j);
            if (hasValue(ei) && ind[j] !== 0) {
                --ind[j];
                Path('.edge').eq(ei).attr('stroke', Colors.visited);
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
            sound('swap');
            await Promise.all(promises.map((p) => p()));
        }
        await Timer.sleep(delay).then(() => fall(i));
        await Timer.sleep(delay).then(topSort);
    } else {
        const graph = Graph.skeleton();
        clearGraph();
        Graph.initialize(graph);
        createGraph(graph);
    }
}

function extract(i, j, d) {
    let [p, q] = [i, j].map(Graph.point);
    let edge = Path('.edge').eq(Graph.edgeIndex(i, j));
    if (d > 0) {
        let r = fromDistance(q, p, d);
        edge.attr('x2', r.x);
        edge.attr('y2', r.y);
        edge.attr('cx', (p.x + r.x) / 2);
        edge.attr('cy', (p.y + r.y) / 2);
        return Timer.sleep(5).then(() => extract(i, j, d - 2));
    } else {
        edge.removeAttr('stroke');
        edge.removeAttr('marker-end');
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
