import { DrawGraph } from '@/components/common';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { graphAlgoPrompt } from '@/common/prompts';
import { useSummary } from '@/hooks';
import Graph, { Path } from '@/common/graph';
import $ from 'jquery';
import { hasValue, spanEdge, getCostMatrix, sound } from '@/common/utils';
import { Colors } from '@/common/constants';

const getPrompt = graphAlgoPrompt('Prims Minimum Spanning Tree');

export default function Prims(props) {
    const [summary, explain, abortSummary] = useSummary();

    return (
        <Stack spacing={2}>
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
            <Typography variant="h6" component="h2">
                Step by Step
            </Typography>
            <Typography
                component="ul"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <li>Initialize an empty set of edges for the MST.</li>
                <li>Start with an arbitrary vertex and mark it as visited (part of MST).</li>
                <li>Find the cheapest edge connecting a vertex in the MST to a vertex outside the MST.</li>
                <li>Add this edge to the MST and mark the new vertex as visited.</li>
                <li>Repeat until all vertices are part of the MST.</li>
            </Typography>
            <br />
            <Box display="flex" flexWrap="wrap" gap={3}>
                <DrawGraph
                    {...props}
                    onStart={start}
                    onClear={abortSummary}
                    weighted={true}
                    allowDirected={false}
                    explain={(source) => {
                        const matrix = getCostMatrix();
                        explain(getPrompt({ matrix, source }));
                    }}
                />
                <Divider orientation="vertical" flexItem />
                {summary}
            </Box>
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
