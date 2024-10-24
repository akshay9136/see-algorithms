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
        directed = data.directed;
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
        if (points.length > 1) {
            if (directed) {
                segments.forEach(([i, j]) => {
                    matrix[j][i] = undefined;
                });
            } else {
                segments.forEach(([i, j]) => {
                    matrix[j][i] = matrix[i][j];
                });
            }
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
        segments.forEach(([i, j]) => ind[j]++);
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

export const Point = {
    create: (x, y) => ({ x, y }),

    equal: (p, q) => p.x === q.x && p.y === q.y,

    distance(p, q) {
        let sum = (q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y);
        return Math.sqrt(sum);
    },
};

export const Segment = {
    slope: (p, q) => (q.y - p.y) / (q.x - p.x),

    orientation([p, q], r) {
        let d = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (d === 0) return 0;
        return d > 0 ? 1 : 2;
    },

    overlap([p, q], [r, s]) {
        const { equal } = Point;
        if (equal(p, r) && equal(q, s)) return true;
        if (equal(q, r) && equal(p, s)) return true;
        return false;
    },
};

export default Graph;
