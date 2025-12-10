import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path, Points } from '@/common/graph';
import useAlgorithm from '@/hooks/useAlgorithm';
import {
    appendCell,
    charAt,
    clearGraph,
    createGraph,
    fromDistance,
    hasValue,
    sound,
} from '@/common/utils';
import { Colors } from '@/common/constants';
import Link from 'next/link';

export default function TopSort(props) {
    const [algorithm] = useAlgorithm(`
indeg = indegree()
stack = new Stack()
for each vertex v:
    if indeg[v] == 0: stack.push(v)
while stack is not empty:
    u = stack.pop()
    add u to sorted list
    for each neighbor v of u:
        indeg[v] = indeg[v] - 1
        if indeg[v] == 0: stack.push(v)
`);
    const [indegreeAlgo] = useAlgorithm(`
function indegree():
    indeg = map vertex -> 0
    for each vertex u:
        for each neighbor v of u:
            indeg[v] = indeg[v] + 1
    return indeg
`);

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
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {algorithm}
                {indegreeAlgo}
            </Box>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#sorted').html('')}
                allowDirected={false}
                customSource={false}
            />
            <Box id="sorted" className="d-flex alphaGrid" />
        </Stack>
    );
}

var indeg, stack;
var delay = 800;

async function* start() {
    indeg = Graph.indegree();
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    stack = [];
    for (let i = 0; i < indeg.length; i++) {
        if (indeg[i] === 0) {
            $('.vrtx').eq(i).attr('stroke', Colors.visited);
            stack.push(i);
        }
    }
    yield delay;
    yield* topsort();
}

async function* topsort() {
    if (stack.length > 0) {
        const i = stack.pop();
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        sound('pop');
        yield delay;
        for (let j = 0; j < indeg.length; j++) {
            const ei = Graph.edgeIndex(i, j);
            if (hasValue(ei) && indeg[j] > 0) {
                --indeg[j];
                Path('.edge').eq(ei).attr('stroke', Colors.visited);
                yield delay / 2;
                if (indeg[j] === 0) {
                    $('.vrtx').eq(j).attr('stroke', Colors.visited);
                    stack.push(j);
                }
                sound('swap');
                const [p, q] = [i, j].map(Graph.point);
                const d = Points.distance(p, q);
                const r = fromDistance(q, p, d - 25);
                yield* extract(p, r, ei);
                yield delay / 2;
            }
        }
        $('.vrtx').eq(i).css('opacity', 0);
        $('.vlbl').eq(i).css('opacity', 0);
        yield delay / 2;
        appendCell('#sorted', charAt(65 + i));
        yield delay;
        yield* topsort();
    } else {
        const graph = Graph.skeleton();
        clearGraph();
        Graph.initialize(graph);
        createGraph(graph);
    }
}

function* extract(p, q, ei) {
    const edge = Path('.edge').eq(ei);
    const d = Points.distance(p, q);
    if (d - 25 > 0) {
        const r = fromDistance(q, p, d - 5);
        edge.attr('x2', r.x);
        edge.attr('y2', r.y);
        edge.attr('cx', (p.x + r.x) / 2);
        edge.attr('cy', (p.y + r.y) / 2);
        yield 20;
        yield* extract(p, r, ei);
    }
    edge.removeAttr('stroke');
    edge.removeAttr('marker-end');
}
