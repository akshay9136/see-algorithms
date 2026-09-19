import searchTree from '../common/searchTree';
import { Colors } from '../common/constants';

const delay = 500;

function redBlackTree(animator) {
    const Tree = searchTree(animator);
    const { bgcolor, scope, txy, animate } = animator;

    function* rotateRight(node) {
        const left = node.left;
        Tree.rotateRight(node);
        yield delay * 2;
        updateColor(node, 'R');
        updateColor(left, 'B');
        yield delay;
    }

    function* rotateLeft(node) {
        const right = node.right;
        Tree.rotateLeft(node);
        yield delay * 2;
        updateColor(node, 'R');
        updateColor(right, 'B');
        yield delay;
    }

    async function* rebalance(node) {
        if (!node) return;
        const parent = node.parent;
        if (node.color === 'R' && parent.color === 'R') {
            yield delay;
            await bgcolor(node.id, Colors.compare);
            const pop = parent.parent;
            const uncle = pop[parent.isLeft ? 'right' : 'left'];
            yield delay;
            if (!uncle || uncle.color === 'B') {
                if (parent.isLeft) {
                    if (node.isLeft) {
                        yield* rotateRight(pop);
                    } else {
                        yield* rotateLeft(parent);
                        yield* rotateRight(pop);
                    }
                } else {
                    if (node.isLeft) {
                        yield* rotateRight(parent);
                        yield* rotateLeft(pop);
                    } else {
                        yield* rotateLeft(pop);
                    }
                }
                await bgcolor(node.id, Colors.white);
            } else {
                updateColor(parent, 'B');
                updateColor(uncle, 'B');
                yield delay;
                if (pop.parent) {
                    updateColor(pop, 'R');
                    yield delay;
                }
                await bgcolor(node.id, Colors.white);
                yield* rebalance(pop);
            }
        }
    }

    const updateColor = (node, color) => {
        const tagId = node.id.replace('.node', '.tag');
        const element = scope.current.querySelector(tagId);
        if (element) {
            element.textContent = color;
            element.style.color = Colors.white;
            element.style.backgroundColor =
              color === 'R' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';
        }
        node.update({ color });
    };

    const findNodeSilent = (num) => {
        let node = Tree.root();
        while (node) {
            if (num === node.value) return node;
            node = num < node.value ? node.left : node.right;
        }
        return null;
    };

    const findSuccessor = (node) => {
        let curr = node.right;
        while (curr && curr.left) curr = curr.left;
        return curr;
    };

    const showDbGhost = (nodeId) => {
        animate(nodeId, { opacity: 0.3 });
        const el = scope.current.querySelector(nodeId);
        el.textContent = '';
        el.style.outline = '2px dashed';
        el.style.outlineOffset = '2px'
    };

    const rotateFixup = (node, toLeft) => {
        toLeft ? Tree.rotateLeft(node) : Tree.rotateRight(node);
    };

    async function* deleteFixup(node, dbIsLeft) {
        let isResolved = false;

        while (node && !isResolved) {
            let sibDir = dbIsLeft ? 'right' : 'left';
            let sibling = node[sibDir];
            if (!sibling) break;

            // Case 1: Sibling is red
            if (sibling.color === 'R') {
                await bgcolor(sibling.id, Colors.compare);
                yield delay;
                updateColor(node, 'R');
                updateColor(sibling, 'B');
                yield delay;
                rotateFixup(node, dbIsLeft);
                yield delay * 2;
                await bgcolor(sibling.id, Colors.white);
                sibling = node[sibDir];
                if (!sibling) break;
            }

            // Sibling is black — highlight it
            await bgcolor(sibling.id, Colors.compare);
            yield delay;

            const nearChild = sibling[dbIsLeft ? 'left' : 'right'];
            const farChild  = sibling[sibDir];
            const nearIsBlack = !nearChild || nearChild.color === 'B';
            const farIsBlack  = !farChild  || farChild.color  === 'B';

            if (nearIsBlack && farIsBlack) {
                // Case 2: Both children of sibling are black
                updateColor(sibling, 'R');
                await bgcolor(sibling.id, Colors.white);
                yield delay;
                if (node.color === 'R') {
                    updateColor(node, 'B');
                    isResolved = true;
                    yield delay;
                } else {
                    dbIsLeft = node.isLeft;
                    node = node.parent;
                }
            } else {
                if (farIsBlack) {
                    // Case 3: Near child is red, far child is black
                    updateColor(nearChild, 'B');
                    updateColor(sibling, 'R');
                    yield delay;
                    rotateFixup(sibling, !dbIsLeft);
                    yield delay * 2;
                    await bgcolor(sibling.id, Colors.white);
                    sibling = node[sibDir];
                    await bgcolor(sibling.id, Colors.compare);
                    yield delay;
                }

                // Case 4: Far child is red — terminal rotation
                const newFarChild = sibling[sibDir];
                updateColor(sibling, node.color);
                updateColor(node, 'B');
                if (newFarChild) updateColor(newFarChild, 'B');
                yield delay;
                rotateFixup(node, dbIsLeft);
                yield delay * 2;
                await bgcolor(sibling.id, Colors.white);
                isResolved = true;
                yield delay;
            }
        }

        // Ensure root is always black
        const root = Tree.root();
        if (root && root.color === 'R') {
            updateColor(root, 'B');
            yield delay;
        }
    }

    return Object.freeze({
        ...Tree,

        _insert([num, color]) {
            const node = Tree._insert(num);
            updateColor(node, color);
        },

        async *insert(num) {
            const node = yield* Tree.insert(num);
            updateColor(node, node.parent ? 'R' : 'B');
            yield delay;
            yield* rebalance(node);
        },

        async *deleteNode(num) {
            const target = findNodeSilent(num);
            if (!target) {
                yield* Tree.deleteNode(num);
                return;
            }

            const hasTwoChild  = Boolean(target.left && target.right);
            const physicalNode = hasTwoChild ? findSuccessor(target) : target;

            // Capture state before BST deletion mutates the tree
            const deletedColor = physicalNode.color;
            const hasChild = Boolean(physicalNode.left || physicalNode.right);
            const wasLeft = physicalNode.isLeft;
            const px = physicalNode.x;
            const py = physicalNode.y;

            // Remember the id of the node about to be physically removed so
            // we can show it as double black (black-leaf case only).
            const ghostId = deletedColor === 'B' && !hasChild
                ? target.id
                : null;

            // BST deletion
            const affected = yield* Tree.deleteNode(num);
            if (!affected) return affected;

            yield delay;

            // After two-children deletion, the successor's DOM element
            // at the target position still shows its old color tag.
            // Sync it with the color inherited from the deleted node.
            if (hasTwoChild) {
                const replacement = target.refresh();
                updateColor(replacement, replacement.color);
                yield delay;
            }

            // Deleting a red node preserves all red-black properties
            if (deletedColor === 'R') return affected;

            // Black node deletion requires rebalancing / recoloring
            if (hasChild) {
                await bgcolor(affected.id, Colors.compare);
                yield delay;
                updateColor(affected, 'B');
                await bgcolor(affected.id, Colors.white);
                return affected;
            }

            if (hasTwoChild) txy(ghostId, px, py, 0);
            showDbGhost(ghostId);
            yield delay * 2;
            yield* deleteFixup(affected, wasLeft);
            animate(ghostId, { opacity: 0 });

            return affected;
        },
    });
}

export default redBlackTree;

export function assignColors(array) {
  if (!array) return [];

  class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }

  // Build BST using the given insertion order
  function insert(root, value) {
    if (!root) return new Node(value);

    if (value < root.value) {
      root.left = insert(root.left, value);
    } else {
      root.right = insert(root.right, value);
    }

    return root;
  }

  let root = null;

  for (const value of array) root = insert(root, value);

  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  function validate(node, bh, color) {
    return canColor(node.left, bh, color) && canColor(node.right, bh, color);
  }

  function canColor(node, bh, parentColor) {
    if (!node) return bh === 0;

    node.color = 'B'; // Try Black first
    if (validate(node, bh - 1, 'B')) return true;

    // Try Red (only valid if parent is Black)
    if (parentColor === 'B') {
      node.color = 'R';
      if (validate(node, bh, 'R')) return true;
    }

    return false;
  }

  // Find the valid black-height for the tree (root is always Black)
  const h = height(root);

  for (let bh = 1; bh <= h; bh++) {
    root.color = 'B';
    if (validate(root, bh - 1, 'B')) break;
  }

  const nodes = [];

  function collect(node) {
    if (!node) return;
    nodes.push(node);
    collect(node.left);
    collect(node.right);
  }

  collect(root);

  return nodes.map(node => [node.value, node.color]);
}
