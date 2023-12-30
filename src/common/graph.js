import { isNumber } from './utils';

var points = [];
var segments = [];
var matrix = [];
var steps = [];
var directed = false;

const Graph = {
    addPoint(p) {
        points.push(p);
        matrix.push([]);
    },

    setPoint: (i, p) => void (points[i] = p),

    position(seg) {
        let i = points.findIndex((r) => Point.equal(r, seg.p));
        let j = points.findIndex((r) => Point.equal(r, seg.q));
        return [i, j];
    },

    addSegment(seg) {
        let [i, j] = this.position(seg);
        matrix[i][j] = segments.length;
        if (!directed) {
            matrix[j][i] = segments.length;
        }
        segments.push(seg);
        steps.push([i, j]);
    },

    totalPoints: () => points.length,

    totalSegments: () => segments.length,

    point: (index) => points[index],

    segment: (index) => segments[index],

    edgeIndex: (i, j) => matrix[i]?.[j],

    clear() {
        points = [];
        segments = [];
        matrix = [];
        steps = [];
    },

    stringify(props) {
        const data = { points, segments, matrix, steps, directed, ...props };
        return JSON.stringify(data);
    },

    initialize(data) {
        points = data.points;
        segments = data.segments;
        matrix = data.matrix;
        steps = data.steps;
        directed = data.directed;
    },

    forEach(callback) {
        let np = points.length;
        for (let i = 0; i < np; i++) {
            for (let j = 0; j < np; j++) {
                callback(i, j);
            }
        }
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
                steps.forEach(([i, j]) => {
                    matrix[j][i] = undefined;
                });
            } else {
                steps.forEach(([i, j]) => {
                    matrix[j][i] = matrix[i][j];
                });
            }
        }
    },

    removeSegment(seg) {
        let [i, j] = this.position(seg);
        segments.splice(matrix[i][j], 1);
        matrix[i][j] = undefined;
        if (!directed) {
            matrix[j][i] = undefined;
        }
        let k = steps.findIndex(([u, v]) => u === i && v === j);
        steps.splice(k, 1);
    },

    indegree() {
        let np = points.length;
        let ind = new Array(np).fill(0);
        steps.forEach(([i, j]) => ind[j]++);
        return ind;
    },

    hasCycle() {
        let np = points.length;
        let ind = this.indegree();
        let stack = [];
        for (let i = 0; i < np; i++) {
            if (ind[i] === 0) stack.push(i);
        }
        if (stack.length === 0) {
            return true;
        }
        let k = 0;
        while (stack.length > 0) {
            let i = stack.pop();
            for (let j = 0; j < np; j++) {
                let ei = this.edgeIndex(i, j);
                if (isNumber(ei) && ind[j] !== 0) {
                    ind[j]--;
                    if (ind[j] === 0) stack.push(j);
                }
            }
            k++;
        }
        return k !== np;
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
    create: (p, q) => ({ p, q }),

    slope: ({ p, q }) => (q.y - p.y) / (q.x - p.x),

    orientation({ p, q }, r) {
        let d = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (d === 0) return 0;
        return d > 0 ? 1 : 2;
    },

    overlap(s1, s2) {
        const { equal } = Point;
        if (equal(s1.p, s2.p) || equal(s1.p, s2.q)) {
            if (equal(s1.q, s2.p) || equal(s1.q, s2.q)) {
                return true;
            }
        }
        return false;
    },
};

export default Graph;
