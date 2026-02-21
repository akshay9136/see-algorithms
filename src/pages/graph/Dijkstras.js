import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import useAlgorithm from '@/hooks/useAlgorithm';
import {
    charAt,
    getCostMatrix,
    hasValue,
    spanEdge,
    svgElement,
} from '@/common/utils';
import { Colors } from '@/common/constants';
import Link from 'next/link';

export default function Dijkstras(props) {
    const [algorithm] = useAlgorithm(`
dist = map vertex -> Infinity
dist[src] = 0
heap = new MinHeap()
heap.insert(src, 0)
while heap is not empty:
    (u, d) = heap.extract()
    if u is not visited:
        relax(u, d)
`);
const [relaxAlgo] = useAlgorithm(`
function relax(u, d):
    mark u as visited
    for each neighbor v of u:
        alt = d + weight(u, v)
        if alt < dist[v]:
            dist[v] = alt
            heap.insert(v, alt)
`);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Dijkstra&apos;s Algorithm</strong> finds the shortest
                path from a source node to all other nodes in a graph with
                non-negative weights. It uses a{' '}
                <Link href="/data-structures/BinaryHeap">priority queue</Link>{' '}
                to explore nodes in order of increasing distance. This algorithm
                works by maintaining a set of visited nodes and, at each step,
                selecting the unvisited node with the smallest known distance to
                visit next. This process continues until all nodes have been
                visited, making it essential for network routing problems.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2" pt={1}>
                        Visualization
                    </Typography>
                    <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                        {algorithm}
                        {relaxAlgo}
                    </Box>
                </Stack>
                <DrawGraph {...props} onStart={start} weighted={true} />
            </Box>
        </Stack>
    );
}

var n, v, w;
var d, prev;
var delay = 1000;

const svgLabel = (i, text) => {
    const p = Graph.point(i);
    const props = {
        class: 'vtag',
        x: p.x + 20,
        y: p.y - 12,
        fill: '#606060',
        'font-size': 14,
        'font-weight': 'bold',
    };
    return svgElement('text', props, text);
};

async function* start(src) {
    $('.cost').each(function () {
        this.setAttribute('value', this.value);
        this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    w = getCostMatrix();
    v = [src];
    d = [];
    d[src] = 0;
    prev = [];
    for (let i = 0; i < n; i++) {
        const label = svgLabel(i, charAt(65 + i));
        $('.vgrp').eq(i).append(label);
        if (i !== src) {
            $('.vlbl').eq(i).html('<tspan dy="0.1em">&infin;</tspan>');
            $('.vlbl').eq(i).css('font-size', 20);
            d[i] = Infinity;
        } else {
            $('.vlbl').eq(i).text('0');
            $('.vlbl').eq(i).css('font-size', 14);
        }
    }
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    yield delay;
    $('.vrtx').eq(src).attr('stroke', Colors.visited);
    $('.vrtx').eq(src).attr('fill', Colors.visited);
    yield delay;
    yield* dijkstra(src);
}

async function* dijkstra(i) {
    let flag = 1;
    w[i] = w[i] || [];
    for (let j = 0; j < n; j++) {
        if (v.includes(j)) continue;
        const ei = Graph.edgeIndex(i, j);

        if (hasValue(ei) && d[i] + w[i][j] < d[j]) {
            d[j] = d[i] + w[i][j];
            const ej = Graph.edgeIndex(prev[j], j);
            Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
            Path('.edge').eq(ej).attr('stroke', Colors.rejected);
            $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(j).attr('fill', Colors.enqueue);
            $('.vlbl').eq(j).text(d[j]);
            $('.vlbl').eq(j).css('font-size', 14);
            prev[j] = i;
            flag = 2;
        }
    }
    d[i] = Infinity;
    yield delay * flag;
    yield* dequeue();
}

async function* dequeue() {
    const min = d.reduce((a, b) => (b < a ? b : a), Infinity);
    const j = d.indexOf(min);
    const i = prev[j];
    v.push(j);
    yield* spanEdge(i, j);
    $('.vrtx').eq(j).attr('fill', Colors.visited);
    if (v.length < n) {
        yield delay;
        yield* dijkstra(j);
    }
}
