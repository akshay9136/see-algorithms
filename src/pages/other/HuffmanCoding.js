import React, { useState } from 'react';
import { Edge, InputNumbers, Node } from '@/components/numbers';
import styles from '@/components/numbers/numbers.module.css';
import useAnimator from '@/hooks/useAnimator';
import binaryTree from '@/common/binaryTree';
import { Colors } from '@/common/constants';
import { sleep, sound, traverse } from '@/common/utils';
import { Stack, Typography } from '@mui/material';

var Tree, delay = 500;
var queue, codes;

export default function HuffmanCoding() {
    const [numbers, setNumbers] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [charcodes, setCharcodes] = useState({});
    const [scope, animator] = useAnimator();
    const { bgcolor } = animator;
    const toChar = (i) => String.fromCharCode(97 + i);

    const extractMin = () => {
        queue.sort((a, b) => a.value - b.value);
        const min = queue[0];
        queue = queue.slice(1);
        return min;
    };

    const huffmanTree = () => {
        const left = extractMin();
        const right = extractMin();
        const sum = left.value + right.value;
        const node = { value: sum, left, right };
        if (queue.length) {
            queue.push(node);
            return huffmanTree();
        }
        return node;
    };

    const huffmanCoding = async () => {
        const root = huffmanTree();
        const arr = [];
        traverse(root, (node) => arr.push(node));
        setNumbers(arr);
        await sleep(delay);
        sound('swap');
        renderTree(root);
        setCharcodes(codes);
    };

    const renderTree = (_node, parent, isLeft) => {
        if (_node) {
            const { value, char, left, right } = _node;
            const node = Tree.insert(value, parent, isLeft);
            if (parent) {
                node.data = (parent.data || '') + (isLeft ? '0' : '1');
            }
            if (!left && !right) {
                codes[char] = node.data;
                bgcolor(`#node${node.index}`, Colors.enqueue);
            }
            renderTree(left, node, true);
            renderTree(right, node);
        }
    };

    const handleStart = (values) => {
        queue = values.map((value, i) => {
            return { value, char: characters[i] };
        });
        codes = {};
        Tree = binaryTree(animator);
        sleep(delay)
            .then(huffmanCoding)
            .catch(() => {});
    };

    const handleStop = () => {
        setNumbers([]);
        setCharacters([]);
        setCharcodes({});
        Tree = undefined;
    };

    return (
        <>
            <p>
                <strong>Huffman Coding</strong> is a lossless data compression
                algorithm that reduces the size of data by assigning shorter
                binary codes to more frequent symbols. It builds an optimal
                prefix tree, ensuring efficient encoding and decoding. Commonly
                used in file compression formats like ZIP and JPEG, Huffman
                Coding minimizes storage space without losing information.
            </p>
            {characters.length > 0 && (
                <div className={styles.inputNumbers + ' mb-0 p-0'}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Character:
                    </Typography>
                    {characters.map((char) => (
                        <Typography
                            key={char}
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ margin: '0 1.2rem' }}
                        >
                            {char}
                        </Typography>
                    ))}
                </div>
            )}
            <InputNumbers
                min={5}
                max={8}
                label="Frequency: "
                onStart={handleStart}
                onStop={handleStop}
                onSelect={(n) => {
                    const arr = Array.from(Array(n));
                    setCharacters(arr.map((_, i) => toChar(i)));
                    sound('pop');
                }}
                startBtnText="Encode"
                stopBtnText="Clear"
            />
            <div className="huffmanTree" ref={scope}>
                {numbers.slice(0, -1).map((_, i) => (
                    <Edge key={i} index={i} />
                ))}
                {numbers.map((node, i) => (
                    <Node
                        key={i}
                        index={i}
                        value={
                            node.char ? (
                                <Stack
                                    alignItems="center"
                                    justifyContent="space-around"
                                    position="relative"
                                    top={15}
                                    height={60}
                                >
                                    <span>{node.value}</span>
                                    <span className="fw-bold">{node.char}</span>
                                </Stack>
                            ) : (
                                node.value
                            )
                        }
                        animate={{ x: i * 50 }}
                        style={{ opacity: 0 }}
                    />
                ))}
                {characters.map((char, i) => (
                    <Node
                        key={i}
                        index={i + 100}
                        value={char}
                        animate={{ y: i * 50 }}
                        style={{
                            borderRadius: 8,
                            backgroundColor: Colors.vertex,
                            fontWeight: 'bold',
                        }}
                    />
                ))}
                {characters.map((char, i) => (
                    <Node
                        key={i}
                        index={i + 200}
                        value={charcodes[char]}
                        animate={{ x: 50, y: i * 50 }}
                        style={{
                            border: 0,
                            justifyContent: 'flex-start',
                            background: 'transparent',
                            fontWeight: 'bold',
                        }}
                    />
                ))}
            </div>
        </>
    );
}
