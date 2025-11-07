import DrawGraph from '@/components/draw-graph';
import $ from 'jquery';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { appendCell, charAt, hasValue, sound, spanEdge } from '@/common/utils';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function BFS(props) {
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
            <Stack spacing={2}>
                <DrawGraph
                    {...props}
                    onStart={start}
                    onClear={() => {
                        $('#visited').html('');
                        $('#bfsQueue').html('');
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
                            Queue :
                        </Typography>
                        <Box id="bfsQueue" className="d-flex alphaGrid" />
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}

var queue, k;
var v, i, prev;
var delay = 800;

async function start(source) {
    v = [source];
    queue = [];
    prev = [];
    i = source;
    k = 0;
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
            if (!v.includes(j) && !queue.includes(j)) {
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                queue.push(j);
                prev[j] = i;
                sound('pop');
                appendCell('#bfsQueue', charAt(65 + j));
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
    if (queue.length) {
        i = queue.shift();
        $('#bfsQueue').children().eq(k++).css('visibility', 'hidden');
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
