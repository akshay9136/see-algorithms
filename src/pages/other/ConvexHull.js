import React from 'react';
import Graph, { Segment } from '@/common/graph';
import AddPoints from '@/components/add-points/add-points';
import $ from 'jquery';
import { addPoints } from '@/helpers/convexHull';
import { Colors } from '@/common/constants';
import Timer from '@/common/timer';

export default function ConvexHull(props) {
    return <AddPoints {...props} start={start} />;
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
    Timer.timeout(convexHull, delay);
}

function convexHull() {
    cvx.push(p);
    $('.vrtx').eq(p).attr('fill', Colors.visited);
    $('.vrtx').eq(p).attr('stroke', Colors.visited);
    q = (p + 1) % Graph.totalPoints();
    Timer.timeout(next, delay, 0);
}

function next(i) {
    if (i < Graph.totalPoints()) {
        let seg = Segment.create(Graph.point(p), Graph.point(q));
        let ori = Segment.orientation(seg, Graph.point(i));
        if (ori === 1) {
            q = i;
            connect(Colors.stroke);
            Timer.timeout(() => {
                $('line:last').remove();
                next(i + 1);
            }, delay);
            return;
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
    let edge = `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke-width="2" stroke="${color}" />`;
    document.getElementById('plane').innerHTML += edge;
    $('line:last').insertBefore($('.vrtx:first'));
}
