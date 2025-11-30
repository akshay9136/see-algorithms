import { hasValue } from '@/common/utils';
import $ from 'jquery';

function randomPoints(n) {
    const width = $('#plane').width() - 200;
    const height = $('#plane').height() - 200;
    const rectX = 100;
    const rectY = 100;
    const stepX = width / 3;
    const stepY = height / 3;

    const corners = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            corners.push({
                x: rectX + c * stepX,
                y: rectY + r * stepY,
            });
        }
    }

    // Fisher–Yates shuffle
    for (let i = corners.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [corners[i], corners[j]] = [corners[j], corners[i]];
    }

    return corners.slice(0, n);
}

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function onSegment(p, q, r) {
    const cross = (r.x - p.x) * (q.y - p.y) - (r.y - p.y) * (q.x - p.x);
    if (Math.abs(cross) > 1e-6) return false;
    const dot = (r.x - p.x) * (r.x - q.x) + (r.y - p.y) * (r.y - q.y);
    return dot <= 0;
}

function orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (Math.abs(val) < 1e-6) return 0; // collinear
    return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

function doesIntersect(p1, q1, p2, q2) {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;

    if (o1 === 0 && onSegment(p1, q1, p2)) return true;
    if (o2 === 0 && onSegment(p1, q1, q2)) return true;
    if (o3 === 0 && onSegment(p2, q2, p1)) return true;
    if (o4 === 0 && onSegment(p2, q2, q1)) return true;

    return false;
}

export function randomGraph(np) {
    const points = randomPoints(np);
    const matrix = Array.from({ length: np }, () => []);
    const segments = [];

    const wouldIntersect = (u, v) => {
        const p1 = points[u];
        const q1 = points[v];
        for (const [i, j] of segments) {
            if (u === i || u === j || v === i || v === j) continue;
            const p2 = points[i];
            const q2 = points[j];
            if (doesIntersect(p1, q1, p2, q2)) return true;
        }
        return false;
    };

    const wouldOverlap = (u, v) => {
        const p1 = points[u];
        const q1 = points[v];
        for (let i = 0; i < np; i++) {
            if (i === u || i === v) continue;
            if (onSegment(p1, q1, points[i])) return true;
        }
        return false;
    };

    const isValidEdge = (u, v) => {
        const d = getDistance(points[u], points[v]);
        return d < 200 && !wouldIntersect(u, v) && !wouldOverlap(u, v);
    };

    const reached = [0];
    const unreached = new Set();

    for (let i = 1; i < np; i++) unreached.add(i);

    while (unreached.size > 0) {
        let bestEdge = null;

        for (let u of reached) {
            for (let v of unreached) {
                if (isValidEdge(u, v)) {
                    bestEdge = [u, v];
                    break;
                }
            }
            if (bestEdge) break;
        }

        if (!bestEdge) {
            const u = Math.floor(Math.random() * reached.length);
            const v = unreached.values().next().value;
            bestEdge = [u, v];
        }

        const [u, v] = bestEdge;
        matrix[u][v] = segments.length;
        matrix[v][u] = segments.length;
        segments.push([u, v]);
        reached.push(v);
        unreached.delete(v);
    }

    for (let i = 0; i < np; i++) {
        for (let j = 0; j < np; j++) {
            if (i !== j && !hasValue(matrix[i][j])) {
                if (isValidEdge(i, j) && Math.random() > 0.6) {
                    matrix[i][j] = segments.length;
                    matrix[j][i] = segments.length;
                    segments.push([i, j]);
                }
            }
        }
    }

    return { points, matrix, segments };
}
