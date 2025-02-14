import { addCost, createGraph } from '@/common/utils';
import $ from 'jquery';

const EDGE_PROBABILITY = 0.3;

export function randomGraph(np, weighted) {
    const points = [];
    const matrix = [];
    const width = $('#plane').width();
    const height = $('#plane').height();
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width / 4;
    const radiusY = height / 4;
    const offset = Math.random() * 2 * Math.PI;
    for (let i = 0; i < np; i++) {
        const angle = offset + (2 * Math.PI * i) / np; // Evenly distribute angles
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);
        points.push({ x, y });
        matrix[i] = [];
    }
    const segments = [];
    const connected = [0];
    for (let i = 1; i < np; i++) {
        const connectTo =
            Array.from(connected)[Math.floor(Math.random() * connected.length)];
        matrix[i][connectTo] = segments.length;
        matrix[connectTo][i] = segments.length;
        connected.push(i);
        segments.push([i, connectTo]);
    }
    for (let i = 0; i < np; i++) {
        for (let j = i + 1; j < np; j++) {
            if (
                Math.random() < EDGE_PROBABILITY &&
                matrix[i][j] === undefined
            ) {
                matrix[i][j] = segments.length;
                matrix[j][i] = segments.length;
                segments.push([i, j]);
            }
        }
    }
    createGraph({ points, matrix, segments });
    if (weighted) {
        segments.forEach(([i, j]) => {
            addCost([points[i], points[j]]);
        });
    }
}
