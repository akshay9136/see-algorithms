import React from 'react';
import DrawGraph from '@/components/draw-graph';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { appendCell, hasValue, sound, spanEdge } from '@/common/utils';
import { Colors } from '@/common/constants';

export default function BFS(props) {
    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Breadth First Search</strong> (BFS) explores a graph
                level by level, starting at a node and visiting all its
                neighbors before moving on to the next level. It uses a queue to
                manage nodes. BFS is ideal for finding the shortest path in an
                unweighted graph and for checking connectivity.
            </Typography>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => {
                    $('#visited').html('');
                    $('#bfsQueue').html('');
                }}
            />
            <Box id="visited" className="d-flex numGrid alphaGrid" />
            <Box id="bfsQueue" className="d-flex numGrid alphaGrid" />
        </Stack>
    );
}

var queue, k;
var v, i, prev;
var r, delay = 800;

function start(source) {
    v = [source];
    queue = [];
    prev = [];
    i = source;
    k = 0;
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
            if (!v.includes(j) && !queue.includes(j)) {
                Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
                $('.vrtx').eq(j).attr('fill', Colors.enqueue);
                queue.push(j);
                prev[j] = i;
                sound('pop');
                appendCell('#bfsQueue', String.fromCharCode(65 + j));
                Timer.timeout(explore, delay, ++j);
            } else explore(++j);
        } else explore(++j);
    } else {
        Timer.timeout(visit, delay / 2);
    }
}

function visit() {
    $('.vrtx').eq(i).attr('fill', Colors.vertex);
    if (queue.length) {
        i = queue.shift();
        sound('pop');
        $('#bfsQueue').children().eq(k++).css('visibility', 'hidden');
        if (v.indexOf(i) === -1) {
            v.push(i);
            Timer.timeout(() => {
                appendCell('#visited', String.fromCharCode(65 + i));
                spanEdge(prev[i], i).then(dequeue);
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
