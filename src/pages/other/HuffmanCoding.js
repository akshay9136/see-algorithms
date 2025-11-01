import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Edge, InputNumbers, Node } from '@/components/numbers';
import styles from '@/components/numbers/numbers.module.css';
import useAnimator from '@/hooks/useAnimator';
import binaryTree from '@/common/binaryTree';
import { sleep, sound, traverse } from '@/common/utils';
import { Colors } from '@/common/constants';
import $ from 'jquery';

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
        Tree = binaryTree(animator);
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
                $(`#nodeBf${node.index}`).text(char);
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
        sleep(delay)
            .then(huffmanCoding)
            .catch(() => {});
    };

    const handleStop = () => {
        setNumbers([]);
        setCharacters([]);
        setCharcodes({});
        Tree = null;
    };

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Huffman Coding</strong> is a lossless data compression
                algorithm that reduces the size of data by assigning shorter
                binary codes to more frequent symbols. It builds an optimal
                prefix tree, ensuring efficient encoding and decoding. Commonly
                used in file compression formats like ZIP and JPEG, Huffman
                Coding minimizes storage space without losing information.
            </Typography>
            <Stack spacing={1}>
                {characters.length > 0 && (
                    <Box className={styles.inputNumbers}>
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
                    </Box>
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
            </Stack>
            <Box
                className="huffmanTree"
                id="binaryTree"
                sx={{ width: 800, pt: 1 }}
                ref={scope}
            >
                {numbers.slice(0, -1).map((_, i) => (
                    <Edge key={i} index={i} />
                ))}
                {numbers.map((node, i) => (
                    <Node
                        key={i}
                        index={i}
                        value={node.value}
                        showBf={!!node.char}
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
            </Box>
        </Stack>
    );
}
