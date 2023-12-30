import React, { useEffect } from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import { dataArrayVar } from '../../common/cache';
import Home from '../home/home';
import PageNotFound from '../404/404';
import BubbleSort from '../../algorithms/sorting/BubbleSort';
import InsertionSort from '../../algorithms/sorting/InsertionSort';
import SelectionSort from '../../algorithms/sorting/SelectionSort';
import RadixSort from '../../algorithms/sorting/RadixSort';
import HeapSort from '../../algorithms/sorting/HeapSort';
import MergeSort from '../../algorithms/sorting/MergeSort';
import QuickSort from '../../algorithms/sorting/QuickSort';
import DFS from '../../algorithms/graph/DFS';
import BFS from '../../algorithms/graph/BFS';
import Prims from '../../algorithms/graph/Prims';
import Kruskals from '../../algorithms/graph/Kruskals';
import Dijkstras from '../../algorithms/graph/Dijkstras';
import TopSort from '../../algorithms/graph/TopSort';
import ConvexHull from '../convex-hull/convex-hull';
import BST from '../../data-structures/BST';
import BinaryHeap from '../../data-structures/BinaryHeap';
import CircularQueue from '../../data-structures/CircularQueue';

function Content() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const algoName = queryParams.get('algoName');

    useEffect(() => {
        !algoName && dataArrayVar([]);
    }, [algoName]);

    return (
        <div className="content">
            <Breadcrumbs>
                {algoName ? <Link to="/">Home</Link> : <span>Home</span>}
                {algoName && <span>{algoName}</span>}
            </Breadcrumbs>
            <br />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/bubble-sort" exact component={BubbleSort} />
                <Route path="/insertion-sort" exact component={InsertionSort} />
                <Route path="/selection-sort" exact component={SelectionSort} />
                <Route path="/radix-sort" exact component={RadixSort} />
                <Route path="/heap-sort" exact component={HeapSort} />
                <Route path="/merge-sort" exact component={MergeSort} />
                <Route path="/quick-sort" exact component={QuickSort} />
                <Route path="/dfs" exact component={DFS} />
                <Route path="/bfs" exact component={BFS} />
                <Route path="/prims" exact component={Prims} />
                <Route path="/kruskals" exact component={Kruskals} />
                <Route path="/dijkstras" exact component={Dijkstras} />
                <Route path="/top-sort" exact component={TopSort} />
                <Route path="/convex-hull" exact component={ConvexHull} />
                <Route path="/bst" exact component={BST} />
                <Route path="/binary-heap" exact component={BinaryHeap} />
                <Route path="/circular-queue" exact component={CircularQueue} />
                <Route>
                    <PageNotFound />
                </Route>
            </Switch>
        </div>
    );
}

export default Content;
