import React, { useEffect, useState } from 'react';
import DSInput from '@/components/ds-input';
import { Edge, Node } from '@/components/numbers';
import avlTree from '@/helpers/avlTree';
import useAnimator from '@/hooks/useAnimator';
import { copyBST, sleep } from '@/common/utils';
import { useRouter } from 'next/router';
import { Share } from '@mui/icons-material';

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

    const remove = async (num) => {
        await sleep(500);
        await Tree.deleteNode(num);
        if (!Tree.root()) reset();
    };

    const reset = () => setNumbers([]);

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !arr.length,
        },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBST(Tree.root()),
            disabled: !arr.length,
        },
    ];

    useEffect(() => {
        if (router.isReady && !arr.length) {
            const { nodes } = router.query;
            try {
                if (nodes) {
                    arr = JSON.parse(atob(nodes));
                    insertAll();
                }
            } catch {}
        }
    }, [router]);

    const insertAll = async () => {
        setNumbers(arr.slice());
        Tree = avlTree(animator);
        await sleep(100);
        arr.forEach((num) => Tree._insert(num));
    };

    return (
        <>
            <p>
                Named after its inventors Adelson-Velsky and Landis, an{' '}
                <strong>AVL Tree</strong> rigorously maintains balance by
                ensuring that for every node, the difference between the heights
                of its left and right subtrees (known as the &quot;balance
                factor&quot;) is never more than 1. If an operation violates
                this condition, the tree automatically rebalances itself through
                a series of rotations. This ensures that operations like search,
                insert, and delete have a worst-case time complexity of O(log
                n).
            </p>
            <DSInput {...props} buttons={buttons} />
            <div ref={scope} className="resizable" id="binaryTree">
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
