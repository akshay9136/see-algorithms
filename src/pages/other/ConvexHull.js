import { Stack, Typography } from '@mui/material';
import Graph, { Points } from '@/common/graph';
import AddPoints from '@/components/convex-hull/add-points';
import $ from 'jquery';
import { addPoints } from '@/helpers/convexHull';
import { Colors } from '@/common/constants';
import { svgElement } from '@/common/utils';

export default function ConvexHull(props) {
  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        A <strong>Convex Hull</strong> is the smallest convex polygon that
        encloses a given set of points. It is a fundamental concept in
        computational geometry with applications in collision detection, image
        processing, and pattern recognition. The algorithm visualized here is
        the <strong>Jarvis March</strong> or <strong>Gift Wrapping</strong>{' '}
        algorithm, which finds the convex hull by iteratively wrapping a
        {"'gift'"} around the set of points.
      </Typography>
      <Typography variant="h6" component="h2">
        How it Works
      </Typography>
      <Typography variant="body1">
        The Jarvis March algorithm starts by finding the leftmost point and then
        iteratively wrapping a {"'gift'"} around the set of points. It uses the
        orientation of three points to determine if a point is inside or outside
        the hull. If a point is outside the hull, it is added to the hull and
        the next point is selected. This process continues until the hull is
        complete.
      </Typography>
      <AddPoints {...props} onStart={start} />
    </Stack>
  );
}

var cvx, left, p, q;
var delay = 500;

async function* start() {
    cvx = [];
    left = 0;
    for (let i = 1; i < Graph.totalPoints(); i++) {
        let x1 = Graph.point(i).x;
        let x2 = Graph.point(left).x;
        if (x1 < x2) left = i;
    }
    p = left;
    yield delay;
    yield* convexHull();
}

async function* convexHull() {
    cvx.push(p);
    $('.vrtx').eq(p).attr('fill', Colors.visited);
    $('.vrtx').eq(p).attr('stroke', Colors.visited);
    q = (p + 1) % Graph.totalPoints();
    yield delay;
    yield* next(0);
}

async function* next(i) {
    if (i < Graph.totalPoints()) {
        let seg = [p, q].map(Graph.point);
        let ori = Points.orientation(...seg, Graph.point(i));
        if (ori === 1) {
            q = i;
            connect(Colors.stroke);
            yield delay;
            $('#plane path').last().remove();
        }
        yield* next(i + 1);
    } else {
        connect(Colors.visited);
        p = q;
        p !== left ? yield* convexHull() : addPoints(cvx);
    }
}

function connect(color) {
    let u = Graph.point(p);
    let v = Graph.point(q);
    let d = `M${u.x} ${u.y} L${v.x} ${v.y}`;
    let props = { d, stroke: color, 'stroke-width': 2 };
    let edge = svgElement('path', props);
    $('.vrtx:first').before(edge);
}
