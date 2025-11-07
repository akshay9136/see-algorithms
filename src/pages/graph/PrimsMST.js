import React from 'react';
import DrawGraph from '@/components/draw-graph';
import { Stack, Typography } from '@mui/material';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { getCostMatrix, hasValue, spanEdge } from '@/common/utils';
import { Colors } from '@/common/constants';

export default function PrimsMST(props) {
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

var n, w;
var mst, i, j;
var queue;
var r, delay = 1000;

function start(source) {
    $('.cost').each(function () {
        this.setAttribute('value', this.value);
        this.setAttribute('readonly', true);
    });
    n = Graph.totalPoints();
    w = getCostMatrix();
    queue = [];
    mst = [];
    i = source;
    Timer.timeout(() => {
        $('.vrtx').eq(i).attr('stroke', Colors.visited);
        $('.vrtx').eq(i).attr('fill', Colors.visited);
        Timer.timeout(enqueue, delay);
    }, delay);
    return new Promise((res) => (r = res));
}

function enqueue() {
    mst.push(i);
    queue = queue.concat(Array(n).fill(Infinity));
    w[i] = w[i] || [];
    w[i].forEach((val, j) => {
        queue[n * i + j] = val;
    });
    for (let k = 0; k < n; k++) {
        if (mst.indexOf(k) === -1 && hasValue(w[i][k])) {
            let ei = Graph.edgeIndex(i, k);
            Path('.edge').eq(ei).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(k).attr('stroke', Colors.enqueue);
            $('.vrtx').eq(k).attr('fill', Colors.enqueue);
        }
    }
    Timer.timeout(extractMin, delay);
}

function extractMin() {
    let min = queue.reduce((a, b) => (b < a ? b : a), Infinity);
    if (min === Infinity) return r();
    let k = queue.indexOf(min);
    queue[k] = Infinity;
    i = Math.floor(k / n);
    j = k % n;
    if (mst.indexOf(j) > -1) {
        extractMin();
    } else {
        spanEdge(i, j).then(() => {
            $('.vrtx').eq(j).attr('fill', Colors.visited);
            i = j;
            if (mst.length < n) {
                Timer.timeout(enqueue, delay);
            }
        });
    }
}
