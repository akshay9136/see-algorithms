import DrawGraph from '@/components/draw-graph';
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
import Timer from '@/common/timer';
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
                {algorithm}
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

async function start(source) {
    v = [source];
    stack = [];
    prev = [];
    i = source;
    await Timer.sleep(delay);
    sound('pop');
    appendCell('#stack', charAt(65 + i));
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
                sound('pop');
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                stack.push(j);
                v.push(j);
                prev[j] = i;
                appendCell('#stack', charAt(65 + j));
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
    if (stack.length) {
        i = stack.pop();
        sound('swap');
        bgcolor(`.cell:eq(${v.indexOf(i)})`, Colors.visited);
        await spanEdge(prev[i], i);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        await Timer.sleep(delay);
        await explore(0);
    }
}
