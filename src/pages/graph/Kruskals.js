import { DrawGraph, Node } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import useAnimator from '@/hooks/useAnimator';
import { charAt, sound } from '@/common/utils';
import { Colors } from '@/common/constants';

var arr, union, parent;
var delay = 800;

export default function Kruskals(props) {
    const [scope, { txy, bgcolor }] = useAnimator();
    const [size, setSize] = useState(0);
    if (size === 0) arr = [];

    useEffect(() => {
        for (let i = 0; i < size; i++) {
            $(`#nodeBf${i}`).text(charAt(65 + i));
        }
    }, [size]);

    async function* start() {
        sound('pop');
        $('.vrtx').attr('stroke', Colors.rejected);
        $('.edge').attr('stroke', Colors.rejected);
        yield 0;
        const size = Graph.totalPoints();
        setSize(size);
        arr = [];
        $('.cost').each(function (i) {
            const [u, v] = Graph.segments()[i];
            const w = Number($(this).val()) || 1;
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
        yield delay;
        yield* nextMin(0);
    }

    function findRoot(u) {
        if (parent[u] !== u) {
            return findRoot(parent[u]);
        }
        return parent[u];
    }

    async function merge(x1, x2) {
        const y = union[x1].size * 50;
        const promises = [];
        [...union[x2]].forEach((v, i) => {
            promises.push(txy(`#node${v}`, x1 * 70, y + i * 50));
        });
        await Promise.all(promises);
        union[x1] = new Set([...union[x1], ...union[x2]]);
        union[x2] = new Set();
        parent[x2] = x1;
        $(`#nodeBf${x2}`).text(charAt(65 + x1));
        sound('pop');
    }

    async function* nextMin(k) {
        const { u, v, i } = arr[k];
        $('.vrtx').eq(u).attr('stroke', Colors.visited);
        $('.vrtx').eq(v).attr('stroke', Colors.visited);
        $('.vrtx').eq(u).attr('fill', Colors.visited);
        $('.vrtx').eq(v).attr('fill', Colors.visited);
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
            Path('.edge').eq(i).attr('stroke', Colors.visited);
            Path('.edge').eq(i).attr('stroke-width', 3);
        }
        yield delay / 2;
        $('.vrtx').eq(u).attr('fill', Colors.vertex);
        $('.vrtx').eq(v).attr('fill', Colors.vertex);
        await Promise.all([
            bgcolor(`#node${u}`, Colors.white),
            bgcolor(`#node${v}`, Colors.white),
        ]);
        const rest = union.filter((set) => set.size > 0);
        if (rest.length > 1) {
            yield delay;
            yield* nextMin(k + 1);
        }
    }

    return (
        <Stack spacing={2} width="fit-content">
            <Typography variant="body1">
                <strong>Kruskal&apos;s Algorithm</strong> is another way to find
                a Minimum Spanning Tree (MST) in a graph. It works by
                iteratively adding the cheapest available edge that connects two
                previously disconnected components, without forming a cycle. It
                is efficient for sparse graphs and uses a{' '}
                <strong>union-find</strong> data structure to detect cycles.
            </Typography>
            <Typography variant="h6" component="h2" fontSize="1.2rem">
                Things to Observe
            </Typography>
            <Typography
                component="div"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <ul>
                    <li>
                        <strong>Component Merging:</strong> Observe how adding
                        an edge merges two previously separate components into
                        one. The visualization shows nodes moving together as
                        components are unified, demonstrating how the algorithm
                        gradually connects all vertices.
                    </li>
                    <li>
                        <strong>Cycle Detection:</strong> Watch how union-find
                        data structure efficiently checks if two vertices are
                        not in the same connected component before adding an
                        edge.
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
                <DrawGraph
                    {...props}
                    onStart={start}
                    onClear={() => setSize(0)}
                    weighted={true}
                    allowDirected={false}
                    customSource={false}
                />
                <Box
                    pt={4}
                    width={size * 70}
                    height={size * 60}
                    minHeight={300}
                    ref={scope}
                    position="relative"
                    overflow="hidden"
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        fontSize={18}
                        textAlign="center"
                        position="relative"
                        top={-40}
                    >
                        Union-Find
                    </Typography>
                    {Array(size).fill(null).map((_, i) => (
                        <Node
                            key={i}
                            index={i}
                            value={charAt(65 + i)}
                            animate={{ x: i * 70 }}
                            style={{ fontWeight: 'bold' }}
                            showBf={true}
                        />
                    ))}
                </Box>
            </Box>
        </Stack>
    );
}
