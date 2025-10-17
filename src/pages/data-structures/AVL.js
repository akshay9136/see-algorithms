import React, { useEffect, useState } from 'react';
import DSInput from '@/components/ds-input';
import { Edge, Node } from '@/components/numbers';
import avlTree from '@/helpers/avlTree';
import useAnimator from '@/hooks/useAnimator';
import { randomInt, sleep, traverse } from '@/common/utils';
import { useRouter } from 'next/router';
import { showToast } from '@/components/toast';
import { Refresh, Share } from '@mui/icons-material';

var arr = [], Tree;

export default function AVL(props) {
    const router = useRouter();
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    if (!numbers.length) arr = [];

    const insert = async (num) => {
        arr.push(num);
        setNumbers(arr.slice());
        await sleep(500);
        if (!numbers.length) {
            Tree = avlTree(animator);
        }
        await Tree.insert(num);
    };

    const reset = () => setNumbers([]);

    const copyAVL = () => {
        const data = [];
        traverse(Tree.root(), (node) => data.push(node.value));
        const nodes = JSON.stringify(data);
        const origin = window.location.origin;
        const url = `${origin}${router.pathname}?nodes=${btoa(nodes)}`;
        navigator.clipboard.writeText(url);
        showToast({
            message: 'Tree url is copied to clipboard.',
            variant: 'success',
        });
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        // { text: <Refresh />, onClick: randomTree },
        {
            text: <Share fontSize="small" />,
            onClick: copyAVL,
            disabled: !arr.length,
        },
    ];

    // useEffect(() => {
    //     if (router.isReady && !arr.length) {
    //         arr = randomNodes();
    //         const { nodes } = router.query;
    //         try {
    //             if (nodes) {
    //                 arr = JSON.parse(atob(nodes));
    //             }
    //             insertAll();
    //         } catch {}
    //     }
    // }, [router]);

    const insertAll = async () => {
        setNumbers(arr.slice());
        Tree = avlTree(animator);
        await sleep(100);
        arr.forEach((num) => Tree._insert(num));
    };

    return (
        <>
            <p>
                An <strong>AVL Tree</strong> is a self-balancing binary search
                tree. It maintains a balanced height by performing rotations
                (single or double) after insertions and deletions that cause an
                imbalance. This ensures that operations like search, insert, and
                delete have a worst-case time complexity of O(log n).
            </p>
            <DSInput {...props} buttons={buttons} />
            <div ref={scope} className="resizable">
                {numbers.slice(0, -1).map((_, i) => (
                    <Edge key={i} index={i} />
                ))}
                {numbers.map((num, i) => (
                    <Node
                        key={i}
                        index={i}
                        value={num}
                        style={{ opacity: 0 }}
                        showBf
                    />
                ))}
            </div>
        </>
    );
}
