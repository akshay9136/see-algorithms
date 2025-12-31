import { Points } from '@/common/graph';
import { hasValue } from '@/common/utils';
import $ from 'jquery';

const { orientation, onSegment } = Points;

function randomPoints(n) {
  const rect = $('#plane')[0].getBoundingClientRect();
  const width = rect.width / 1.5;
  const height = rect.height / 1.5;
  const rectX = width / 5, rectY = height / 5;
  const stepX = width / 3, stepY = height / 3;

  const corners = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      corners.push({
        x: Math.round(rectX + c * stepX),
        y: Math.round(rectY + r * stepY),
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

function doesIntersect(p1, q1, p2, q2) {
  // Check if the segments (p1, q1) and (p2, q2) intersect
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
      if (u === i || u === j) continue;
      if (v === i || v === j) continue;
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
    const d = Points.distance(points[u], points[v]);
    const rect = $('#plane')[0].getBoundingClientRect();
    const gap = rect.width / 3;
    return d < gap && !wouldIntersect(u, v) && !wouldOverlap(u, v);
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

    const [u, v] = bestEdge || [
      Math.floor(Math.random() * reached.length),
      unreached.values().next().value,
    ];

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
