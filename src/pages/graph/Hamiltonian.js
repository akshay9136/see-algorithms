import DrawGraph from '@/components/draw-graph';
import { Box, Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph from '@/common/graph';
import Timer from '@/common/timer';
import {
    appendCell,
    charAt,
    cloneEdge,
    hasValue,
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

async function start(source) {
    v = Array(Graph.totalPoints()).fill(0);
    src = source;
    v[src] = 1;
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    await Timer.sleep(delay);
    sound('pop');
    $('.vrtx').eq(src).attr('stroke', Colors.visited);
    $('.vrtx').eq(src).attr('fill', Colors.visited);
    appendCell('#path', charAt(65 + src));
    await findCycle(src);
}

async function findCycle(i) {
    if (v.indexOf(0) === -1) {
        let ei = Graph.edgeIndex(i, src);
        if (hasValue(ei)) {
            await spanEdge(i, src);
            return true;
        }
    }
    await Timer.sleep(delay);
    for (let j = 0; j < Graph.totalPoints(); j++) {
        let ei = Graph.edgeIndex(i, j);
        if (hasValue(ei) && v[j] === 0) {
            sound('pop');
            await spanEdge(i, j);
            appendCell('#path', charAt(65 + j));
            v[j] = 1;
            if (await findCycle(j)) return true;
            v[j] = 0;
            sound('pop');
            await backtrack(i, j);
            $('#path').children().last().remove();
            await Timer.sleep(delay);
        }
    }
}

function backtrack(i, j) {
    const ei = Graph.edgeIndex(i, j);
    $('.edge').eq(ei).attr('stroke', Colors.rejected);
    $('.vrtx').eq(j).attr('stroke', Colors.rejected);
    const edge = cloneEdge(i, j);
    const d = edge[0].getTotalLength();
    const t = d / 40;
    const seg = Graph.segments()[ei];

    function span(dash) {
        if (dash < d) {
            edge.attr('stroke-dasharray', `${d - dash} ${dash}`);
            if (i !== seg[0]) {
                edge.attr('stroke-dashoffset', d - dash);
            }
            return Timer.sleep(20)
              .then(() => span(dash + t));
        } else edge.remove();
    }
    return span(2);
}
