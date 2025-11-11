import DrawGraph from '@/components/draw-graph';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import useAlgorithm from '@/hooks/useAlgorithm';
import Graph, { Path, Point } from '@/common/graph';
import Timer from '@/common/timer';
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

var ind, stack;
var delay = 800;

function start() {
    ind = Graph.indegree();
    stack = [];
    for (let i = 0; i < ind.length; i++) {
        if (ind[i] === 0) {
            $('.vrtx').eq(i).attr('stroke', Colors.visited);
            stack.push(i);
        }
    }
    return Timer.sleep(delay).then(topsort);
}

async function topsort() {
    if (stack.length > 0) {
        const i = stack.pop();
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        sound('pop');
        const promises = [];
        for (let j = 0; j < Graph.totalPoints(); j++) {
            const ei = Graph.edgeIndex(i, j);
            if (hasValue(ei) && ind[j] > 0) {
                --ind[j];
                Path('.edge').eq(ei).attr('stroke', Colors.visited);
                if (ind[j] === 0) {
                    $('.vrtx').eq(j).attr('stroke', Colors.visited);
                    stack.push(j);
                }
                const [p, q] = [i, j].map(Graph.point);
                const d = Point.distance(p, q);
                promises.push(() => extract(i, j, d - 25));
            }
        }
        if (promises.length) {
            await Timer.sleep(delay);
            sound('swap');
            await Promise.all(promises.map((p) => p()));
        }
        await Timer.sleep(delay).then(() => fall(i));
        await Timer.sleep(delay).then(topsort);
    } else {
        const graph = Graph.skeleton();
        clearGraph();
        Graph.initialize(graph);
        createGraph(graph);
    }
}

function extract(i, j, d) {
    const [p, q] = [i, j].map(Graph.point);
    const edge = Path('.edge').eq(Graph.edgeIndex(i, j));
    if (d > 0) {
        const r = fromDistance(q, p, d);
        edge.attr('x2', r.x);
        edge.attr('y2', r.y);
        edge.attr('cx', (p.x + r.x) / 2);
        edge.attr('cy', (p.y + r.y) / 2);
        return Timer.sleep(5).then(() => extract(i, j, d - 2));
    }
    edge.removeAttr('stroke');
    edge.removeAttr('marker-end');
}

function fall(i) {
    const cy = Number($('.vrtx').eq(i).attr('cy'));
    if (cy < $('#plane').height() + 20) {
        $('.vrtx').eq(i).attr('cy', cy + 2);
        $('.vlbl').eq(i).attr('y', cy + 7);
        return Timer.sleep(5).then(() => fall(i));
    }
    appendCell('#sorted', charAt(65 + i));
}
