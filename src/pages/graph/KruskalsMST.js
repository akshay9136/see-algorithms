import React from 'react';
import Graph from '@/common/graph';
import DrawGraph from '@/components/draw-graph/draw-graph';
import $ from 'jquery';
import Timer from '@/common/timer';
import { Colors } from '@/common/constants';
import { isNumber } from '@/common/utils';

export default function KruskalsMST(props) {
    return (
        <>
            <section>
                <p>
                    <strong>Kruskal&apos;s Algorithm</strong> builds a Minimum
                    Spanning Tree (MST) by sorting all edges and adding them in
                    order of increasing weight, ensuring no cycles are formed.
                    It is efficient for sparse graphs and uses a union-find data
                    structure to manage connected components.
                </p>
            </section>
            <DrawGraph
                {...props}
                onStart={start}
                isMST={true}
                customSource={false}
            />
        </>
    );
}

var parent;
var arr, mst, k;
var delay = 1000;

function start() {
    arr = [];
    $('.cost').each(function () {
        let edge = {};
        edge.w = parseInt($(this).text()) || 1;
        arr.push(edge);
    });
    let n = Graph.totalPoints();
    parent = [];
    for (let i = 0; i < n; i++) {
        parent[i] = i;
        for (let j = 0; j < n; j++) {
            let ei = Graph.edgeIndex(i, j);
            if (isNumber(ei)) {
                arr[ei].u = i;
                arr[ei].v = j;
                arr[ei].i = ei;
            }
        }
    }
    arr.sort((a, b) => a.w - b.w);
    mst = [];
    k = 0;
    Timer.timeout(find, delay);
}

function find() {
    if (k < arr.length) {
        let p = findParent(arr[k].u);
        let q = findParent(arr[k].v);
        if (p !== q) {
            parent[q] = p;
            $('.vrtx').eq(arr[k].u).attr('stroke', Colors.visited);
            $('.vrtx').eq(arr[k].u).attr('fill', Colors.visited);
            $('.vrtx').eq(arr[k].v).attr('stroke', Colors.visited);
            $('.vrtx').eq(arr[k].v).attr('fill', Colors.visited);
            $('.edge').eq(arr[k].i).attr('stroke', Colors.visited);
            Timer.timeout(() => {
                $('.vrtx').eq(arr[k].u).attr('fill', Colors.vertex);
                $('.vrtx').eq(arr[k].v).attr('fill', Colors.vertex);
                mst.push(arr[k++]);
                Timer.timeout(find, delay);
            }, delay / 2);
        } else {
            $('.vrtx').eq(arr[k].u).attr('stroke', '#f44336');
            $('.vrtx').eq(arr[k].v).attr('stroke', '#f44336');
            $('.edge').eq(arr[k].i).attr('stroke', '#f44336');
            Timer.timeout(reject, delay / 2);
        }
    }
}

function reject() {
    $('.vrtx').eq(arr[k].u).attr('stroke', Colors.visited);
    $('.vrtx').eq(arr[k].v).attr('stroke', Colors.visited);
    $('.edge').eq(arr[k].i).attr('stroke', Colors.rejected);
    $('.edge').eq(arr[k].i).attr('stroke-dasharray', '8,4');
    k++;
    Timer.timeout(find, delay);
}

function findParent(q) {
    return parent[q] === q ? q : findParent(parent[q]);
}
