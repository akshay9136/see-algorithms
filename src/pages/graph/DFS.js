import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import useAlgorithm from '@/hooks/useAlgorithm';
import {
    appendCell,
    bgcolor,
    charAt,
    hasValue,
    sound,
    spanEdge,
} from '@/common/utils';
import { Colors } from '@/common/constants';

export default function DFS(props) {
    const [algorithm] = useAlgorithm(`
stack = new Stack()
stack.push(src)
mark src as visited
while stack is not empty:
    u = stack.pop()
    for each neighbor v of u:
        if v is not visited:
            stack.push(v)
            mark v as visited
`);

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Depth-First Search (DFS)</strong> explores a graph by
                going as deep as possible along each branch before{' '}
                <strong>backtracking</strong>. Think of it as navigating a maze
                by following one path to its end before trying another. It uses
                a <strong>stack</strong> (often via recursion) to keep track of
                its path, making it highly effective for cycle detection,
                pathfinding, and solving puzzles.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2" pt={1}>
                        Visualization
                    </Typography>
                    {algorithm}
                </Stack>
                <Stack spacing={2}>
                    <DrawGraph
                        {...props}
                        onStart={start}
                        onClear={() => $('#stack').html('')}
                    />
                    <Box id="stack" className="d-flex alphaGrid" />
                </Stack>
            </Box>
        </Stack>
    );
}

var v, stack;
var i, prev;
var delay = 800;

async function* start(source) {
    v = [source];
    stack = [];
    prev = [];
    i = source;
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    $('.vrtx').eq(i).attr('stroke', Colors.visited);
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    appendCell('#stack', charAt(65 + i));
    bgcolor('.cell:eq(0)', Colors.visited);
    yield delay;
    yield* explore(0);
}

async function* explore(j) {
    if (j < Graph.totalPoints()) {
        const ei = Graph.edgeIndex(i, j);
        if (hasValue(ei)) {
            if (!v.includes(j)) {
                sound('pop');
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                stack.push(j);
                v.push(j);
                prev[j] = i;
                appendCell('#stack', charAt(65 + j));
                yield delay;
            }
        }
        yield* explore(j + 1);
    } else {
        yield delay / 2;
        yield* visit();
    }
}

async function* visit() {
    $('.vrtx').eq(i).attr('fill', Colors.vertex);
    yield delay / 2;
    if (stack.length) {
        i = stack.pop();
        sound('pop');
        bgcolor(`.cell:eq(${v.indexOf(i)})`, Colors.visited);
        yield* spanEdge(prev[i], i);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        yield delay;
        yield* explore(0);
    }
}
