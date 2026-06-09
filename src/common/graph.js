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
    points = data.points;
    segments = data.segments;
    matrix = data.matrix;
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

  removeEdge(i, j) {
    segments.splice(matrix[i][j], 1);
    matrix[i][j] = undefined;
    if (!directed) {
      matrix[j][i] = undefined;
    }
  },

  indegree() {
    const indeg = new Array(points.length).fill(0);
    segments.forEach(([, j]) => indeg[j]++);
    return indeg;
  },

  hasCycle() {
    const np = points.length;
    const ind = this.indegree();
    const stack = [];
    for (let i = 0; i < np; i++) {
      if (ind[i] === 0) stack.push(i);
    }
    let k = 0;
    for (; stack.length > 0; k++) {
      const u = stack.pop();
      segments.forEach(([i, j]) => {
        if (u === i && ind[j] > 0) {
          ind[j]--;
          if (ind[j] === 0) stack.push(j);
        }
      });
    }
    return k < np;
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
