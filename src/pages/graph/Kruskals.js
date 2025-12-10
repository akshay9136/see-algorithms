import { DrawGraph } from '@/components/common';
import { Stack, Typography } from '@mui/material';
import Graph, { Path } from '@/common/graph';
import $ from 'jquery';
import { Colors } from '@/common/constants';
import { hasValue, sound } from '@/common/utils';

export default function Kruskals(props) {
    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Kruskal&apos;s Algorithm</strong> is another way to find
                a Minimum Spanning Tree (MST) in a graph. It works by
                iteratively adding the cheapest available edge that connects two
                previously disconnected components, without forming a cycle. It
                is efficient for sparse graphs and uses a{' '}
                <strong>union-find</strong> data structure to detect cycles.
            </Typography>
            <DrawGraph
                {...props}
                onStart={start}
                weighted={true}
                allowDirected={false}
                customSource={false}
            />
        </Stack>
    );
}

var arr, mst, parent;
var delay = 1000;

async function* start() {
    arr = [];
    $('.cost').each(function () {
        let w = Number($(this).val()) || 1;
        arr.push({ w });
    });
    let n = Graph.totalPoints();
    parent = [];
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        for (let j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (hasValue(ei)) {
                arr[ei].u = i;
                arr[ei].v = j;
                arr[ei].i = ei;
            }
        }
    }
    arr.sort((a, b) => a.w - b.w);
    mst = [];
    yield delay;
    yield* nextMin(0);
}

async function* nextMin(k) {
    if (k < arr.length) {
        const { u, v, i } = arr[k];
        const edge = Path('.edge').eq(i);
        const p = findParent(u);
        const q = findParent(v);
        if (p !== q) {
            parent[q] = p;
            sound('pop');
            $('.vrtx').eq(u).attr('stroke', Colors.visited);
            $('.vrtx').eq(v).attr('stroke', Colors.visited);
            $('.vrtx').eq(u).attr('fill', Colors.visited);
            $('.vrtx').eq(v).attr('fill', Colors.visited);
            edge.attr('stroke', Colors.visited);
            yield delay / 2;
            $('.vrtx').eq(u).attr('fill', Colors.vertex);
            $('.vrtx').eq(v).attr('fill', Colors.vertex);
            mst.push(arr[k]);
        } else {
            sound('pop');
            $('.vrtx').eq(u).attr('stroke', 'orangered');
            $('.vrtx').eq(v).attr('stroke', 'orangered');
            edge.attr('stroke', 'orangered');
            yield delay / 2;
            $('.vrtx').eq(u).attr('stroke', Colors.visited);
            $('.vrtx').eq(v).attr('stroke', Colors.visited);
            edge.attr('stroke', Colors.rejected);
        }
        yield delay;
        yield* nextMin(k + 1);
    }
}

function findParent(q) {
    return parent[q] === q ? q : findParent(parent[q]);
}
