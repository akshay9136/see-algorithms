import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import {
    bgcolor,
    charAt,
    createGrid,
    getCostMatrix,
    hasValue,
    sleep,
    sound,
    spanEdge,
} from '@/common/utils';
import { Colors } from '@/common/constants';
import Link from 'next/link';

export default function Dijkstras(props) {
    return (
        <Stack spacing={3}>
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
            <Stack spacing={2}>
                <DrawGraph
                    {...props}
                    onStart={start}
                    weighted={true}
                    onClear={() => {
                        $('#vert').html('');
                        $('#dist').html('');
                    }}
                />
                <Stack spacing={1}>
                    <Box id="vert" className="d-flex alphaGrid" />
                    <Box id="dist" className="d-flex alphaGrid" />
                </Stack>
            </Stack>
        </Stack>
    );
}

var n, w, cells;
var d, v, prev;
var delay = 1000;

async function* start(src) {
    $('.cost').each(function () {
        this.setAttribute('value', this.value);
        this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    w = getCostMatrix();
    v = [src];
    d = [];
    createGrid(n, '#vert');
    createGrid(n, '#dist');
    cells = document.querySelectorAll('.cell');
    cells[src + n].textContent = 0;
    d[src] = 0;
    for (let i = 0; i < n; i++) {
        cells[i].textContent = charAt(65 + i);
        cells[i + n].style.fontWeight = 500;
        if (i !== src) {
            cells[i + n].textContent = 'Inf';
            d[i] = Infinity;
        }
    }
    prev = [];
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    $('.vrtx').eq(src).attr('stroke', Colors.visited);
    $('.vrtx').eq(src).attr('fill', Colors.visited);
    bgcolor(cells[src], Colors.visited);
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
            Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(j).attr('fill', Colors.enqueue);
            bgcolor(cells[j], Colors.enqueue);

            sleep(delay).then(() => {
                cells[j + n].style.opacity = 0;
            });
            sleep(1500).then(() => {
                cells[j + n].textContent = d[j];
                cells[j + n].style.opacity = 1;
            });
            prev[j] = i;
            flag = 3;
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
    sound('pop');
    bgcolor(cells[j], Colors.visited);
    yield* spanEdge(i, j);
    $('.vrtx').eq(j).attr('fill', Colors.visited);
    if (v.length < n) {
        yield delay;
        yield* dijkstra(j);
    }
}
