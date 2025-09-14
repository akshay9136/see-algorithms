import React, { useEffect, useState } from 'react';
import DSInput from '@/components/ds-input';
import { Edge, Node } from '@/components/numbers';
import binarySearchTree from '@/helpers/binarySearchTree';
import useAnimator from '@/hooks/useAnimator';
import { sleep, traverse } from '@/common/utils';
import { useRouter } from 'next/router';
import { showToast } from '@/components/toast';

var arr = [], Tree;

export default function BST(props) {
    const router = useRouter();
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    if (!numbers.length) arr = [];

    const insert = async (num) => {
        arr.push(num);
        setNumbers(arr.slice());
        await sleep(500);
        if (!numbers.length) {
            Tree = binarySearchTree(animator);
        }
        await Tree.insert(num);
    };

    const remove = async (num) => {
        if (numbers.length) {
            await Tree.findAndRemove(num);
            if (!Tree.root()) reset();
        }
    };

    const reset = () => setNumbers([]);

    const copyBST = () => {
        let data = [];
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
        { text: 'Delete', onClick: remove, validate: true },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        { text: 'Share', onClick: copyBST, disabled: !arr.length },
    ];

    useEffect(() => {
        const { nodes } = router.query;
        if (nodes) {
            setNumbers([]);
            try {
                arr = JSON.parse(atob(nodes));
                if (Array.isArray(arr)) {
                    setNumbers(arr.slice());
                    Tree = binarySearchTree(animator);
                    sleep(100).then(() => {
                        arr.forEach((num) => Tree._insert(num));
                    });
                }
            } catch {}
        }
    }, [router]);

    return (
        <>
            <p>
                A <strong>Binary Search Tree</strong> (BST) is like a
                well-organized library where each book (node) has a clear place
                based on its value. In a BST, each node has up to two children:
                the left child holds smaller values, and the right child holds
                larger values. This structure allows for efficient searching,
                adding, and removing of books, as you can quickly navigate left
                or right to find or insert a book in its proper place.
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
                    />
                ))}
            </div>
        </>
    );
}
