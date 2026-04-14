import { DrawGraph, Node } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import { charAt, sound } from '@/common/utils';
import { useAlgorithm, useAnimator, useGraphScope } from '@/hooks';
import { useEffect, useState } from 'react';
import { Colors } from '@/common/constants';
import Graph from '@/common/graph';

var arr, union, parent;
var delay = 800;

export default function Kruskals(props) {
    const [animScope, { txy, bgcolor }] = useAnimator();
    const [scope, graphRef] = useGraphScope();
    const [size, setSize] = useState(0);
    if (size === 0) arr = [];

    const [algorithm] = useAlgorithm(`
sort edges by weight (ascending)
MST = empty set
for each vertex v:
    create a disjoint set {v}
for each edge (u, v):
    if find(u) ≠ find(v):
        add (u, v) to MST
        union(u, v)
`);

    useEffect(() => {
        for (let i = 0; i < size; i++) {
            scope.find(`#nodeTag${i}`).text(charAt(65 + i));
        }
    }, [size]);

    function findRoot(u) {
        if (parent[u] !== u) {
            return findRoot(parent[u]);
        }
        return parent[u];
    }

    async function* start() {
        scope.find('.vrtx').attr('stroke', Colors.rejected);
        scope.find('.edge').attr('stroke', Colors.rejected);
        scope.find('.edge').attr('stroke-dasharray', '8,4');
        yield delay / 2;
        const size = Graph.totalPoints();
        setSize(size);
        arr = [];
        scope.find('.cost').each(function (i) {
            const [u, v] = Graph.segments()[i];
            const w = Number(this.value) || 1;
            arr.push({ u, v, w, i });
        });
        arr.sort((a, b) => a.w - b.w);
        union = [];
        parent = [];
        for (let i = 0; i < size; i++) {
            union[i] = new Set();
            union[i].add(i);
            parent[i] = i;
        }
        yield* nextMin(0);
    }

    async function* nextMin(k) {
        yield delay;
        const { u, v, i } = arr[k];
        scope.node(u).attr('stroke', Colors.visited);
        scope.node(v).attr('stroke', Colors.visited);
        scope.node(u).attr('fill', Colors.visited);
        scope.node(v).attr('fill', Colors.visited);
        await Promise.all([
            bgcolor(`#node${u}`, Colors.visited),
            bgcolor(`#node${v}`, Colors.visited),
        ]);
        yield delay / 2;
        const x1 = findRoot(v);
        const x2 = findRoot(u);
        if (x1 !== x2) {
            await merge(x1, x2);
            if (!arr.length) return;
            scope.path(i).attr('stroke', Colors.visited);
            scope.path(i).attr('stroke-width', 3);
            scope.path(i).removeAttr('stroke-dasharray');
        }
        yield delay;
        scope.node(u).attr('fill', Colors.vertex);
        scope.node(v).attr('fill', Colors.vertex);
        await Promise.all([
            bgcolor(`#node${u}`, Colors.white),
            bgcolor(`#node${v}`, Colors.white),
        ]);
        const rest = union.filter((set) => set.size > 0);
        if (rest.length > 1) yield* nextMin(k + 1);
    }

    async function merge(x1, x2) {
        const y = union[x1].size * 50;
        const promises = [];
        [...union[x2]].forEach((v, i) => {
            promises.push(txy(`#node${v}`, x1 * 60, y + i * 50));
        });
        await Promise.all(promises);
        union[x1] = new Set([...union[x1], ...union[x2]]);
        union[x2] = new Set();
        parent[x2] = x1;
        scope.find(`#nodeTag${x2}`).text(charAt(65 + x1));
        sound('pop');
    }

    return (
        <Stack spacing={3} width="fit-content">
            <Typography variant="body1">
                <strong>Kruskal&apos;s Algorithm</strong> is another way to find
                a Minimum Spanning Tree (MST) in a graph. It works by
                iteratively adding the cheapest available edge that connects two
                previously disconnected components, without forming a cycle. It
                is efficient for sparse graphs and uses a{' '}
                <strong>Union-Find</strong> data structure to detect cycles.
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Pseudocode
                    </Typography>
                    {algorithm}
                </Stack>
                <Stack spacing={2} flex={1}>
                    <Typography variant="h6" component="h2">
                        Step by Step
                    </Typography>
                    <Typography
                        component="ul"
                        variant="body1"
                        sx={{ '& li': { mb: 1 }, pl: 2 }}
                    >
                        <li>
                            Sort all edges in non-decreasing order of their
                            weights.
                        </li>
                        <li>Initialize an empty set of edges for the MST.</li>
                        <li>
                            Initialize a <strong>Disjoint set</strong> structure
                            with each vertex in its own set.
                        </li>
                        <li>
                            For each edge (u, v) in the sorted list:
                            <ul style={{ marginTop: 8 }}>
                                <li>
                                    Use <strong>Find</strong> operation to
                                    determine the sets of u and v.
                                </li>
                                <li>
                                    If the sets are different, the edge does not
                                    form a cycle. Add it to the MST.
                                </li>
                                <li>
                                    Merge the two sets using{' '}
                                    <strong>Union</strong> operation.
                                </li>
                            </ul>
                        </li>
                    </Typography>
                </Stack>
            </Box>
            <br />
            <Box display="flex" flexWrap="wrap" gap={4} ref={graphRef}>
                <DrawGraph
                    {...props}
                    scope={scope}
                    onStart={start}
                    onClear={() => setSize(0)}
                    weighted={true}
                    allowDirected={false}
                    customSource={false}
                />
                <Box
                    pt={3}
                    width={size * 60}
                    height={size * 60}
                    minHeight={300}
                    ref={animScope}
                    position="relative"
                >
                    {Array(size).fill(null).map((_, i) => (
                        <Node
                            key={i}
                            index={i}
                            value={charAt(65 + i)}
                            animate={{ x: i * 60 }}
                            showBf={true}
                            style={{ scale: 0.9 }}
                        />
                    ))}
                </Box>
            </Box>
        </Stack>
    );
}
