import { DrawGraph, Node } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import Graph, { Path } from '@/common/graph';
import $ from 'jquery';
import useAnimator from '@/hooks/useAnimator';
import { useState } from 'react';
import { charAt, hasValue, sound } from '@/common/utils';
import { Colors } from '@/common/constants';

var arr, union;
var delay = 800;

export default function Kruskals(props) {
    const [scope, { txy, bgcolor }] = useAnimator();
    const [size, setSize] = useState(0);
    if (size === 0) arr = [];

    async function* start() {
        $('.vrtx').attr('stroke', Colors.rejected);
        $('.edge').attr('stroke', Colors.rejected);
        yield 0;
        const size = Graph.totalPoints();
        setSize(size);
        arr = [];
        $('.cost').each(function () {
            let w = Number($(this).val()) || 1;
            arr.push({ w });
        });
        union = [];
        for (let i = 0; i < size; i++) {
            union[i] = new Set();
            union[i].add(i);
            for (let j = 0; j < size; j++) {
                let ei = Graph.edgeIndex(i, j);
                if (hasValue(ei)) {
                    arr[ei].u = i;
                    arr[ei].v = j;
                    arr[ei].i = ei;
                }
            }
        }
        arr.sort((a, b) => a.w - b.w);
        yield delay;
        sound('pop');
        yield* nextMin(0);
    }

    async function findUnion(u, v) {
        const y1 = union.findIndex((s) => s.has(v));
        const y2 = union.findIndex((s) => s.has(u));
        if (y1 !== y2) {
            const x = union[y1].size * 50;
            const promises = [];
            [...union[y2]].forEach((v, i) => {
                promises.push(txy(`#node${v}`, x + i * 50, y1 * 50));
            });
            await Promise.all(promises);
            union[y1] = new Set([...union[y1], ...union[y2]]);
            union[y2] = new Set();
            return true;
        }
        return false;
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
        const isValid = await findUnion(u, v);
        if (isValid && arr.length) {
            Path('.edge').eq(i).attr('stroke', Colors.visited);
        }
        yield delay / 2;
        $('.vrtx').eq(u).attr('fill', Colors.vertex);
        $('.vrtx').eq(v).attr('fill', Colors.vertex);
        await Promise.all([
            bgcolor(`#node${u}`, Colors.white),
            bgcolor(`#node${v}`, Colors.white),
        ]);
        if (k + 1 < arr.length) {
            yield delay;
            sound('pop');
            yield* nextMin(k + 1);
        }
    }

    return (
        <Stack spacing={2}>
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
                    pt={6}
                    width={400}
                    height={500}
                    ref={scope}
                    position="relative"
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        position="absolute"
                        left="50%"
                        top={0}
                    >
                        Union-Find
                    </Typography>
                    {Array(size).fill(null).map((_, i) => (
                        <Node
                            key={i}
                            index={i}
                            value={charAt(65 + i)}
                            animate={{ y: i * 50 }}
                            style={{ fontWeight: 'bold' }}
                        />
                    ))}
                </Box>
            </Box>
        </Stack>
    );
}
