import React from 'react';
import DrawGraph from '@/components/draw-graph';
import $ from 'jquery';
import Graph, { Path } from '@/common/graph';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';
import { hasValue, sound } from '@/common/utils';

export default function KruskalsMST(props) {
    return (
        <>
            <p>
                <strong>Kruskal&apos;s Algorithm</strong> builds a Minimum
                Spanning Tree (MST) by sorting all edges and adding them in
                order of increasing weight, ensuring no cycles are formed. It is
                efficient for sparse graphs and uses a union-find data structure
                to manage connected components.
            </p>
            <DrawGraph
                {...props}
                onStart={start}
                weighted={true}
                allowDirected={false}
                customSource={false}
            />
        </>
    );
}

var parent;
var arr, mst, k;
var r, delay = 1000;

function start() {
    arr = [];
    $('.cost').each(function () {
        let edge = {};
        edge.w = Number($(this).val()) || 1;
        arr.push(edge);
    });
    let n = Graph.totalPoints();
    parent = [];
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        for (let j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (hasValue(ei)) {
                arr[ei].u = i;
                arr[ei].v = j;
                arr[ei].i = ei;
            }
        }
    }
    arr.sort((a, b) => a.w - b.w);
    mst = [];
    k = 0;
    Timer.timeout(nextMin, delay);
    return new Promise((res) => (r = res));
}

function nextMin() {
    if (k < arr.length) {
        let p = findParent(arr[k].u);
        let q = findParent(arr[k].v);
        if (p !== q) {
            parent[q] = p;
            sound('pop');
            $('.vrtx').eq(arr[k].u).attr('stroke', Colors.visited);
            $('.vrtx').eq(arr[k].u).attr('fill', Colors.visited);
            $('.vrtx').eq(arr[k].v).attr('stroke', Colors.visited);
            $('.vrtx').eq(arr[k].v).attr('fill', Colors.visited);
            Path('.edge').eq(arr[k].i).attr('stroke', Colors.visited);
            Timer.timeout(() => {
                $('.vrtx').eq(arr[k].u).attr('fill', Colors.vertex);
                $('.vrtx').eq(arr[k].v).attr('fill', Colors.vertex);
                mst.push(arr[k++]);
                Timer.timeout(nextMin, delay);
            }, delay / 2);
        } else {
            sound('pop');
            $('.vrtx').eq(arr[k].u).attr('stroke', 'orangered');
            $('.vrtx').eq(arr[k].v).attr('stroke', 'orangered');
            Path('.edge').eq(arr[k].i).attr('stroke', 'orangered');
            Timer.timeout(reject, delay / 2);
        }
    } else r();
}

function reject() {
    $('.vrtx').eq(arr[k].u).attr('stroke', Colors.visited);
    $('.vrtx').eq(arr[k].v).attr('stroke', Colors.visited);
    Path('.edge').eq(arr[k].i).attr('stroke', Colors.rejected);
    k++;
    Timer.timeout(nextMin, delay);
}

function findParent(q) {
    return parent[q] === q ? q : findParent(parent[q]);
}
