import { DrawGraph } from '@/components/common';
import { Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import { hasValue, spanEdge, getCostMatrix, sound } from '@/common/utils';
import { Colors } from '@/common/constants';

export default function Prims(props) {
    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Prim&apos;s Algorithm</strong> builds a Minimum Spanning
                Tree (MST) by starting with a single node and
                &quot;growing&quot; the tree outward. At every step, it finds
                the cheapest edge that connects a node inside the growing tree
                to a node outside of it. This greedy approach continues until
                all nodes are part of the tree, ensuring the total weight of all
                edges is as low as possible. It is perfect for problems like
                designing cost-effective road or utility networks.
            </Typography>
            <DrawGraph
                {...props}
                onStart={start}
                weighted={true}
                allowDirected={false}
            />
        </Stack>
    );
}

var n, w, mst;
var queue;
var delay = 1000;

async function* start(src) {
    $('.cost').each(function () {
        this.setAttribute('value', this.value);
        this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    w = getCostMatrix();
    queue = [];
    mst = [];
    $('.vrtx').attr('stroke', Colors.rejected);
    $('.edge').attr('stroke', Colors.rejected);
    yield delay;
    sound('pop');
    $('.vrtx').eq(src).attr('stroke', Colors.visited);
    $('.vrtx').eq(src).attr('fill', Colors.visited);
    yield delay;
    yield* explore(src);
}

async function* explore(i) {
    mst.push(i);
    w[i] = w[i] || [];
    let flag = 0.5;
    for (let j = 0; j < n; j++) {
        if (mst.includes(j)) {
            queue[n * j + i] = Infinity;
            continue;
        }
        if (hasValue(w[i][j])) {
            queue[n * i + j] = w[i][j];
            const ei = Graph.edgeIndex(i, j);
            Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(j).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(j).attr('fill', Colors.enqueue);
            flag = 1;
        }
    }
    yield delay * flag;
    yield* dequeue();
}

async function* dequeue() {
    const min = queue.reduce((a, b) => (b < a ? b : a), Infinity);
    if (min === Infinity) return;
    const k = queue.indexOf(min);
    queue[k] = Infinity;
    const i = Math.floor(k / n);
    const j = k % n;
    if (mst.includes(j)) return dequeue();
    sound('pop');
    yield* spanEdge(i, j);
    $('.vrtx').eq(j).attr('fill', Colors.visited);
    if (mst.length < n) {
        yield delay;
        yield* explore(j);
    }
}
