var points = [];
var segments = [];
var matrix = [];
var directed = false;

const Graph = {
    addPoint(p) {
        points.push(p);
        matrix.push([]);
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

    skeleton() {
        return { points, segments, matrix, directed };
    },

    initialize(data) {
        points = data.points;
        segments = data.segments;
        matrix = data.matrix;
        directed = data.directed || false;
    },

    isDirected: () => directed,

    isConnected() {
        let visited = this.dfs(0, [0]);
        return visited.length === this.totalPoints();
    },

    dfs(u, visited) {
        let np = points.length;
        for (let v = 0; v < np; v++) {
            if (visited.indexOf(v) === -1) {
                let cost = matrix[u][v];
                let alt = matrix[v][u];
                if (cost !== undefined || alt !== undefined) {
                    visited.push(v);
                    this.dfs(v, visited);
                }
            }
        }
        return visited;
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
        let np = points.length;
        let ind = new Array(np).fill(0);
        segments.forEach(([, j]) => ind[j]++);
        return ind;
    },

    hasCycle() {
        let np = points.length;
        let ind = this.indegree();
        let stack = [];
        for (let i = 0; i < np; i++) {
            if (ind[i] === 0) stack.push(i);
        }
        let k = 0;
        while (stack.length) {
            let u = stack.pop();
            segments.forEach(([i, j]) => {
                if (u === i && ind[j] > 0) {
                    ind[j]--
                    if (ind[j] === 0) stack.push(j);
                }
            });
            k++;
        }
        return k < np;
    },
};

export default Graph;

export const Point = {
    create: (x, y) => ({ x, y }),

    equal: (p, q) => p.x === q.x && p.y === q.y,

    distance(p, q) {
        return Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2);
    },
};

export const Segment = {
    slope: (p, q) => (q.y - p.y) / (q.x - p.x),

    orientation([p, q], r) {
        let d = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (d === 0) return 0;
        return d > 0 ? 1 : 2;
    },
};

import $ from 'jquery';

export function Path(el = '#plane path') {
    const _path = typeof el === 'string' ? $(el) : el;
    return {
        eq: (i) => Path(_path.eq(i)),
        attr: (prop, val) => {
            if (val === undefined) return _path.attr(prop);
            if (['x1', 'y1', 'x2', 'y2', 'cx', 'cy'].includes(prop)) {
                const d = _path.attr('d') || '';
                const [x1, y1, cx, cy, x2, y2] = d.replace(/[MQ]/g, '').trim().split(/\s+/);
                const coords = { x1, y1, cx, cy, x2, y2 };
                coords[prop] = val;
                const newD = `M ${coords.x1} ${coords.y1} Q ${coords.cx} ${coords.cy} ${coords.x2} ${coords.y2}`;
                return _path.attr('d', newD);
            }
            _path.attr(prop, val);
        },
        remove: () => _path.remove(),
        removeAttr: (prop) => _path.removeAttr(prop),
        last: () => Path(_path.last()),
    };
}
