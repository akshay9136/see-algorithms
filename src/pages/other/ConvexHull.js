import { Stack, Typography } from '@mui/material';
import AddPoints from '@/components/convex-hull/add-points';
import Graph, { Points } from '@/common/graph';
import Timer from '@/common/timer';
import $ from 'jquery';
import { addPoints } from '@/helpers/convexHull';
import { svgElement } from '@/common/utils';
import { Colors } from '@/common/constants';

export default function ConvexHull(props) {
  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        A <strong>Convex Hull</strong> is the smallest convex polygon that
        encloses a given set of points. It is a fundamental concept in
        computational geometry with applications in collision detection, image
        processing, and pattern recognition. The algorithm visualized here is
        the <strong>Jarvis March</strong> or <strong>Gift Wrapping</strong>{' '}
        algorithm, which finds the convex hull by iteratively wrapping a
        &apos;gift&apos; around the set of points.
      </Typography>
      <AddPoints {...props} start={start} />
    </Stack>
  );
}

var cvx, left, p, q;
var delay = 500;

function start() {
    cvx = [];
    left = 0;
    for (let i = 1; i < Graph.totalPoints(); i++) {
        let x1 = Graph.point(i).x;
        let x2 = Graph.point(left).x;
        if (x1 < x2) left = i;
    }
    p = left;
    Timer.sleep(delay).then(convexHull);
}

function convexHull() {
    cvx.push(p);
    $('.vrtx').eq(p).attr('fill', Colors.visited);
    $('.vrtx').eq(p).attr('stroke', Colors.visited);
    q = (p + 1) % Graph.totalPoints();
    Timer.sleep(delay).then(() => next(0));
}

async function next(i) {
    if (i < Graph.totalPoints()) {
        let seg = [p, q].map(Graph.point);
        let ori = Points.orientation(...seg, Graph.point(i));
        if (ori === 1) {
            q = i;
            connect(Colors.stroke);
            await Timer.sleep(delay);
            $('#plane path').last().remove();
        }
        next(i + 1);
    } else {
        connect(Colors.visited);
        p = q;
        p !== left ? convexHull() : addPoints(cvx);
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
