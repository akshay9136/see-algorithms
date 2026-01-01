import { DrawGraph } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph from '@/common/graph';
import {
    appendCell,
    charAt,
    cloneEdge,
    hasValue,
    showError,
    sound,
    spanEdge,
} from '@/common/utils';
import { Colors } from '@/common/constants';

export default function Hamiltonian(props) {
    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                A <strong>Hamiltonian Cycle</strong> is a path in a graph that
                visits every node exactly once and returns to the starting node.
                It is closely related to Travelling Salesman Problem, where the
                goal is to find the shortest possible Hamiltonian cycle.
                Hamiltonian cycles are useful in routing, scheduling, and
                circuit design.
            </Typography>
            <DrawGraph
                {...props}
                onStart={start}
                onClear={() => $('#path').html('')}
                allowDirected={false}
            />
            <Box id="path" className="d-flex alphaGrid" />
        </Stack>
    );
}

var src, v;
var delay = 1000;

async function* start(source) {
    v = Array(Graph.totalPoints()).fill(0);
    src = source;
    v[src] = 1;
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    $('.vrtx').eq(src).attr('stroke', Colors.visited);
    $('.vrtx').eq(src).attr('fill', Colors.visited);
    appendCell('#path', charAt(65 + src));
    yield* findCycle(src);

    if (v.indexOf(0) > -1) showError('Cycle not found.');
}

async function* findCycle(i) {
    if (v.indexOf(0) === -1) {
        let ei = Graph.edgeIndex(i, src);
        if (hasValue(ei)) {
            yield* spanEdge(i, src);
            return true;
        }
    }
    yield delay;
    for (let j = 0; j < Graph.totalPoints(); j++) {
        let ei = Graph.edgeIndex(i, j);
        if (hasValue(ei) && v[j] === 0) {
            sound('pop');
            appendCell('#path', charAt(65 + j));
            yield* spanEdge(i, j);
            v[j] = 1;
            if (yield* findCycle(j)) return true;
            v[j] = 0;
            sound('pop');
            $('#path').children().last().remove();
            yield* backtrack(i, j);
            yield delay;
        }
    }
}

function* backtrack(i, j) {
    const ei = Graph.edgeIndex(i, j);
    $('.edge').eq(ei).attr('stroke', Colors.enqueue);
    $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
    const edge = cloneEdge(i, j);
    const d = edge.getTotalLength();
    const t = d / 50;
    const seg = Graph.segments()[ei];

    function* span(dash) {
        if (dash < d) {
            $(edge).attr('stroke-dasharray', `${d - dash} ${dash}`);
            if (i !== seg[0]) {
                $(edge).attr('stroke-dashoffset', d - dash);
            }
            yield 20;
            yield* span(dash + t);
        } else edge.remove();
    }
    yield* span(2);
}
