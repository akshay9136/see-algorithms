var points = [];
var segments = [];
var matrix = [];
var directed = false;

function dfs(u, visited) {
  for (let v = 0; v < points.length; v++) {
    if (visited.indexOf(v) === -1) {
      const cost = matrix[u][v];
      const alt = matrix[v][u];
      if (cost !== undefined || alt !== undefined) {
        visited.push(v);
        dfs(v, visited);
      }
    }
  }
  return visited;
}

const Graph = {
  addPoint(p) {
    points.push(p);
    matrix.push({});
  },

  setPoint: (i, p) => void (points[i] = p),

  addSegment(i, j) {
    matrix[i][j] = segments.length;
    if (!directed) {
      matrix[j][i] = segments.length;
    }
    segments.push([i, j]);
  },

  totalPoints: () => points.length,

  segments: () => segments.slice(),

  point: (i) => ({ ...points[i] }),

  edgeIndex: (i, j) => matrix[i]?.[j],

  clear() {
    points = [];
    segments = [];
    matrix = [];
  },

  skeleton(weights) {
    return {
      points: points.slice(),
      segments: segments.slice(),
      matrix: matrix.map((row) => ({ ...row })),
      directed,
      weights,
    };
  },

  initialize(data) {
    points = data.points || [];
    segments = data.segments || [];
    matrix = data.matrix || [];
    directed = data.directed || false;
  },

  isDirected: () => directed,

  isConnected() {
    const visited = dfs(0, [0]);
    return visited.length === points.length;
  },

  switchType() {
    directed = !directed;
    if (directed) {
      segments.forEach(([i, j]) => {
        matrix[j][i] = undefined;
      });
    } else {
      segments.forEach(([i, j]) => {
        matrix[j][i] = matrix[i][j];
      });
    }
  },

  indegree() {
    const indeg = new Array(points.length).fill(0);
    segments.forEach(([, j]) => indeg[j]++);
    return indeg;
  },

  /**
   * Detects cycles using Kahn's algorithm (topological sort).
   * @param {Array<number>} [newEdge] - Optional [u, v] candidate edge to simulate before adding.
   * @returns {boolean} True if a cycle exists (or would exist with newEdge).
   */
  hasCycle(newEdge) {
    const allSeg = newEdge ? [...segments, newEdge] : segments;
    // Account for potential new vertex
    const np = newEdge?.includes(points.length)
      ? points.length + 1
      : points.length;

    // 1. Calculate in-degrees for all vertices
    const indeg = new Array(np).fill(0);
    allSeg.forEach(([, j]) => indeg[j]++);

    // 2. Collect all vertices with in-degree 0
    const stack = [];
    for (let i = 0; i < np; i++) {
      if (indeg[i] === 0) stack.push(i);
    }

    // 3. Process zero in-degree vertices and reduce neighbor in-degrees
    let count = 0;
    for (; stack.length > 0; count++) {
      const u = stack.pop();
      allSeg.forEach(([i, j]) => {
        if (u === i && indeg[j] > 0) {
          indeg[j]--;
          if (indeg[j] === 0) stack.push(j);
        }
      });
    }
    // If count is less than total vertices, a cycle exists
    return count < np;
  },
};

export default Graph;

export const Points = {
  create: (x, y) => ({ x, y }),

  equal: (p, q) => p.x === q.x && p.y === q.y,

  slope: (p, q) => (q.y - p.y) / (q.x - p.x),

  distance(p, q) {
    return Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2);
  },

  onSegment(p, q, r) {
    const cross = (r.x - p.x) * (q.y - p.y) - (r.y - p.y) * (q.x - p.x);
    if (Math.abs(cross) > 1e-6) return false;
    const dot = (r.x - p.x) * (r.x - q.x) + (r.y - p.y) * (r.y - q.y);
    return dot <= 0;
  },

  orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (Math.abs(val) < 1e-6) return 0; // collinear
    return val > 0 ? 1 : 2; // clockwise or counterclockwise
  },
};

export function Path(pathEl) {
  return {
    attr: (prop, val) => {
      const hasVal = val !== undefined;
      if (['x1', 'y1', 'x2', 'y2', 'cx', 'cy'].includes(prop)) {
        const d = pathEl.attr('d') || '';
        const [x1, y1, cx, cy, x2, y2] = d
          .replace(/[MQ]/g, '')
          .trim()
          .split(/\s+/);
        const coords = { x1, y1, cx, cy, x2, y2 };
        if (!hasVal) return coords[prop];
        coords[prop] = val;
        const newD = `M ${coords.x1} ${coords.y1} Q ${coords.cx} ${coords.cy} ${coords.x2} ${coords.y2}`;
        pathEl.attr('d', newD);
      } else {
        if (!hasVal) return pathEl.attr(prop);
        pathEl.attr(prop, val);
      }
    },
    remove: () => pathEl.remove(),
    removeAttr: (prop) => pathEl.removeAttr(prop),
  };
}
