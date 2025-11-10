import DrawGraph from '@/components/draw-graph';
import $ from 'jquery';
import useAlgorithm from '@/hooks/useAlgorithm';
import { Box, Stack, Typography } from '@mui/material';
import {
    appendCell,
    bgcolor,
    charAt,
    hasValue,
    sound,
    spanEdge,
} from '@/common/utils';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function BFS(props) {
    const [algorithm] = useAlgorithm(`
queue = new Queue()
queue.enq(src)
mark src as visited
while queue is not empty:
    u = queue.deq()
    for each neighbor v of u:
        if v is not visited:
            queue.enq(v)
            mark v as visited
`);

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Breadth-First Search (BFS)</strong> explores a graph
                much like finding connections in a social network. Starting from
                a source node, it first visits all of its direct friends
                (neighbors), then all of their friends, and so on, level by
                level. It uses a <strong>queue</strong> to keep track of who to
                visit next, ensuring it doesn&apos;t go too deep down one path.
                This makes it perfect for finding the shortest path in an
                unweighted graph.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {algorithm}
                <Stack spacing={2}>
                    <DrawGraph
                        {...props}
                        onStart={start}
                        onClear={() => $('#queue').html('')}
                    />
                    <Box id="queue" className="d-flex alphaGrid" />
                </Stack>
            </Box>
        </Stack>
    );
}

var v, queue;
var i, prev;
var delay = 800;

async function start(source) {
    v = [source];
    queue = [];
    prev = [];
    i = source;
    await Timer.sleep(delay);
    sound('pop');
    appendCell('#queue', charAt(65 + i));
    bgcolor('.cell:eq(0)', Colors.visited);
    $('.vrtx').eq(i).attr('stroke', Colors.visited);
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    await Timer.sleep(delay);
    await explore(0);
}

async function explore(j) {
    if (j < Graph.totalPoints()) {
        const ei = Graph.edgeIndex(i, j);
        if (hasValue(ei)) {
            if (!v.includes(j)) {
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                queue.push(j);
                v.push(j);
                prev[j] = i;
                sound('pop');
                appendCell('#queue', charAt(65 + j));
                await Timer.sleep(delay);
            }
        }
        await explore(j + 1);
    } else {
        await Timer.sleep(delay / 2);
        await visit();
    }
}

async function visit() {
    $('.vrtx').eq(i).attr('fill', Colors.vertex);
    await Timer.sleep(delay / 2);
    if (queue.length) {
        i = queue.shift();
        sound('pop');
        bgcolor(`.cell:eq(${v.indexOf(i)})`, Colors.visited);
        await spanEdge(prev[i], i);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        await Timer.sleep(delay);
        await explore(0);
    }
}
