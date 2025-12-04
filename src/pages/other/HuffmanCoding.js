import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Edge, InputNumbers, Node } from '@/components/common';
import useAnimator from '@/hooks/useAnimator';
import huffmanTree from '@/helpers/huffmanTree';
import { Iterator } from '@/common/timer';
import { Colors } from '@/common/constants';
import { charAt, sound, traverse } from '@/common/utils';
import styles from '@/styles/numbers.module.css';

var it, queue;

export default function HuffmanCoding() {
    const [numbers, setNumbers] = useState([]);
    const [alphabets, setAlphabets] = useState([]);
    const [coding, setCoding] = useState({});
    const [scope, animator] = useAnimator();

    const toChar = (i) => charAt(65 + i);

    const dequeue = () => {
        queue.sort((a, b) => a.value - b.value);
        const min = queue[0];
        queue = queue.slice(1);
        return min;
    };

    const _huffmanTree = () => {
        const left = dequeue();
        const right = dequeue();
        const sum = left.value + right.value;
        const step = queue.length;
        const node = { value: sum, left, right, step };
        if (queue.length) {
            queue.push(node);
            return _huffmanTree();
        }
        return node;
    };

    async function* encode() {
        const root = _huffmanTree();
        const arr = [];
        traverse(root, (node) => arr.push(node));
        setNumbers(arr);
        yield 1000;
        const Tree = huffmanTree(animator);
        yield* Tree.renderSteps(root);
        setCoding(Tree.coding);
    }

    const handleStart = (values) => {
        if (queue) return it.start();

        queue = values.map((value, i) => {
            return ({ value, char: alphabets[i] });
        });
        it = Iterator(encode);
        return it.start();
    };

    const handleStop = (reset) => {
        if (reset) setAlphabets([]);
        setNumbers([]);
        setCoding({});
        it?.exit();
        queue = undefined;
    };

    useEffect(() => handleStop, []);

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
                {alphabets.length > 0 && (
                    <Box className={styles.inputNumbers}>
                        <Typography variant="subtitle1" fontWeight="bold" mr={2}>
                            Character:
                        </Typography>
                        {alphabets.map((char) => (
                            <Typography
                                key={char}
                                variant="subtitle2"
                                fontWeight="bold"
                                mr="2.4rem"
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
                    onSelect={(n) => {
                        const arr = Array(n).fill(null);
                        setAlphabets(arr.map((_, i) => toChar(i)));
                        sound('pop');
                    }}
                    onStart={handleStart}
                    onReset={handleStop}
                    onStop={() => it?.stop()}
                />
            </Stack>
            <Box
                className="huffmanTree"
                id="binaryTree"
                sx={{ width: 700, pt: 1 }}
                ref={scope}
            >
                {numbers.slice(1).map((_, i) => (
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
                {alphabets.map((char, i) => (
                    <Node
                        key={i}
                        index={i + 100}
                        value={char}
                        animate={{ y: i * 50 }}
                        style={{
                            borderRadius: 8,
                            backgroundColor: Colors.vertex,
                            fontWeight: 'bold',
                            fontSize: 14,
                        }}
                    />
                ))}
                {alphabets.map((char, i) => (
                    <Node
                        key={i}
                        index={i + 200}
                        value={coding[char]}
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
