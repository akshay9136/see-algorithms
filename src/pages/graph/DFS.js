import DrawGraph from '@/components/draw-graph';
import $ from 'jquery';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { appendCell, charAt, hasValue, sound, spanEdge } from '@/common/utils';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function DFS(props) {
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
            <Stack spacing={2}>
                <DrawGraph
                    {...props}
                    onStart={start}
                    onClear={() => {
                        $('#visited').html('');
                        $('#dfsStack').html('');
                    }}
                />
                <Box display="flex" gap={3} height={90}>
                    <Stack spacing={2} minWidth={300}>
                        <Typography variant="body1" fontWeight="bold">
                            &nbsp;Visited :
                        </Typography>
                        <Box id="visited" className="d-flex alphaGrid" />
                    </Stack>
                    <Divider
                        flexItem
                        orientation="vertical"
                        sx={{ borderRight: '1px solid' }}
                    />
                    <Stack spacing={2}>
                        <Typography variant="body1" fontWeight="bold">
                            Stack :
                        </Typography>
                        <Box id="dfsStack" className="d-flex alphaGrid" />
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}

var stack;
var v, i, prev;
var delay = 800;

async function start(source) {
    v = [source];
    stack = [];
    prev = [];
    i = source;
    await Timer.sleep(delay);
    sound('pop');
    $('.vrtx').eq(i).attr('stroke', Colors.visited);
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    appendCell('#visited', charAt(65 + i));
    await Timer.sleep(delay);
    await explore(0);
}

async function explore(j) {
    if (j < Graph.totalPoints()) {
        const ei = Graph.edgeIndex(i, j);
        if (hasValue(ei)) {
            if (!v.includes(j) && !stack.includes(j)) {
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                stack.push(j);
                prev[j] = i;
                sound('pop');
                appendCell('#dfsStack', charAt(65 + j));
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
    if (stack.length) {
        i = stack.pop();
        $('#dfsStack').children().last().remove();
        sound('pop');
        if (v.indexOf(i) === -1) {
            v.push(i);
            await Timer.sleep(delay / 2);
            appendCell('#visited', charAt(65 + i));
            await spanEdge(prev[i], i);
            $('.vrtx').eq(i).attr('fill', Colors.visited);
            await Timer.sleep(delay);
            await explore(0);
        } else {
            await Timer.sleep(delay);
            await visit();
        }
    }
}
