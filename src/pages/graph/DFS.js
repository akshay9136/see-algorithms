import React from 'react';
import DrawGraph from '@/components/draw-graph';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { appendCell, hasValue, sound, spanEdge } from '@/common/utils';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';

export default function DFS(props) {
    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Depth First Search</strong> (DFS) explores a graph by
                starting at a node and going as deep as possible along each path
                before <strong>backtracking</strong>. It uses a stack to keep
                track of the path. DFS is useful for tasks like finding
                connected components and solving puzzles where exploring all
                paths is necessary.
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
                <Stack direction="row" spacing={3} height={90}>
                    <Stack spacing={2} minWidth={300}>
                        <Typography variant="body1" fontWeight="bold">
                            &nbsp;Visited :
                        </Typography>
                        <Box
                            id="visited"
                            className="d-flex alphaGrid"
                        />
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
                        <Box
                            id="dfsStack"
                            className="d-flex alphaGrid"
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

var stack;
var v, i, prev;
var r, delay = 800;

function start(source) {
    v = [source];
    stack = [];
    prev = [];
    i = source;
    Timer.timeout(() => {
        sound('pop');
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        appendCell('#visited', String.fromCharCode(65 + i));
        Timer.timeout(explore, delay, 0);
    }, delay);
    return new Promise((res) => (r = res));
}

function explore(j) {
    if (j < Graph.totalPoints()) {
        let ei = Graph.edgeIndex(i, j);
        if (hasValue(ei)) {
            if (!v.includes(j) && !stack.includes(j)) {
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                stack.push(j);
                prev[j] = i;
                sound('pop');
                appendCell('#dfsStack', String.fromCharCode(65 + j));
                Timer.timeout(explore, delay, ++j);
            } else explore(++j);
        } else explore(++j);
    } else {
        Timer.timeout(visit, delay / 2);
    }
}

function visit() {
    $('.vrtx').eq(i).attr('fill', Colors.vertex);
    if (stack.length) {
        i = stack.pop();
        sound('pop');
        $('#dfsStack').children().last().remove();
        if (v.indexOf(i) === -1) {
            v.push(i);
            Timer.timeout(() => {
                spanEdge(prev[i], i).then(dequeue);
                appendCell('#visited', String.fromCharCode(65 + i));
            }, delay / 2);
        } else {
            Timer.timeout(visit, delay);
        }
    } else r();
}

function dequeue() {
    $('.vrtx').eq(i).attr('fill', Colors.visited);
    Timer.timeout(explore, delay, 0);
}
