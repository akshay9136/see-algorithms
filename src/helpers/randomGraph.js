import { hasValue } from '@/common/utils';
import $ from 'jquery';

const EDGE_PROBABILITY = 0.2;

export function randomGraph(np) {
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
        let angle = offset + (2 * Math.PI * i) / np; // Evenly distribute angles
        let x = centerX + radiusX * Math.cos(angle);
        let y = centerY + radiusY * Math.sin(angle);
        x = Math.round(x);
        y = Math.round(y);
        points.push({ x, y });
        matrix[i] = [];
    }
    const segments = [];
    const connected = [0];
    for (let i = 1; i < np; i++) {
        const connectTo =
            connected[Math.floor(Math.random() * connected.length)];
        matrix[i][connectTo] = segments.length;
        matrix[connectTo][i] = segments.length;
        connected.push(i);
        segments.push([connectTo, i]);
    }
    for (let i = 0; i < np; i++) {
        for (let j = i + 1; j < np; j++) {
            if (
                Math.random() < EDGE_PROBABILITY &&
                !hasValue(matrix[i][j])
            ) {
                matrix[i][j] = segments.length;
                matrix[j][i] = segments.length;
                segments.push([i, j]);
            }
        }
    }
    return { points, matrix, segments };
}
