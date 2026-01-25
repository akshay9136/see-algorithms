import binarySearchTree from './binarySearchTree';
import { showError } from '@/common/utils';
import { Colors } from '../common/constants';

const delay = 500;

function splayTree(animator) {
    const Tree = binarySearchTree(animator);
    const { bgcolor } = animator;

    function* rotateRight(node) {
        Tree.rotateRight(node);
        yield delay * 2;
    }

    function* rotateLeft(node) {
        Tree.rotateLeft(node);
        yield delay * 2;
    }

    async function* splay(node) {
        if (!node) return;
        
        while (node.parent) {
            const parent = node.parent;
            const pop = parent.parent;
            if (!pop) {
                // Zig or Zag
                if (node.isLeft) {
                    yield* rotateRight(parent);
                } else {
                    yield* rotateLeft(parent);
                }
            } else {
                if (node.isLeft && parent.isLeft) {
                    // Zig-Zig
                    yield* rotateRight(pop);
                    yield* rotateRight(parent);
                } else if (!node.isLeft && !parent.isLeft) {
                    // Zag-Zag
                    yield* rotateLeft(pop);
                    yield* rotateLeft(parent);
                } else if (node.isLeft && !parent.isLeft) {
                    // Zig-Zag
                    yield* rotateRight(parent);
                    yield* rotateLeft(pop);
                } else {
                    // Zag-Zig
                    yield* rotateLeft(parent);
                    yield* rotateRight(pop);
                }
            }
        }
    }

    return Object.freeze({
        ...Tree,
        async *insert(num) {
            const node = yield* Tree.insert(num);
            yield delay;
            bgcolor(node.id, Colors.compare);
            yield delay;
            yield* splay(node);
            bgcolor(node.id, Colors.white);
        },
        async *search(num) {
            const node = yield* Tree.findNode(num, Tree.root());
            if (node.value !== num) {
                showError(`Node (${num}) not found.`);
            }
            yield delay;
            yield* splay(node);
            bgcolor(node.id, Colors.white);
        },
    });
}

export default splayTree;
