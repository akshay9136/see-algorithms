import { Article, ListItems, Section } from '@/components/common';
import { Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function SplayTreeRotations() {
  return (
    <Article
      title="Splay Tree Rotations Explained"
      summary="A step-by-step guide to Zig, Zig-Zig, and Zig-Zag rotations — how splay trees move accessed nodes to the root without storing balance factors."
    >
      <Section title="Let Access Shape the Tree">
        <Typography paragraph>
          Imagine looking up the same key again and again, only to follow the
          same long path through a tree on every search. In an ordinary{' '}
          <Link href="/data-structures/BST">Binary Search Tree</Link>, a
          frequently used key can remain buried near the leaves while rarely
          used keys sit closer to the root. If you repeatedly access the same
          deep node, BST repeats that work every time.
        </Typography>

        <Typography paragraph>
          A <Link href="/data-structures/SplayTree">Splay Tree</Link> makes
          access an opportunity to reorganize. After finding a node, it moves
          that node to the root through a sequence of rotations called{' '}
          <strong>splaying</strong>. If the next search asks for the same key,
          the answer is already at the root. As accesses change, the tree&apos;s
          shape changes with them.
        </Typography>
      </Section>

      <Section title="The Building Block">
        <Typography paragraph>
          Every splay step uses ordinary BST rotations. A right rotation lifts a
          left child above its parent; a left rotation lifts a right child. The
          child&apos;s inner subtree transfers to the parent so that the inorder
          sequence stays unchanged.
        </Typography>

        <Typography paragraph>
          Each rotation preserves binary search order, so the tree can reshape
          itself without losing its search property. The key decision is which
          rotation to perform next. That depends on just three nodes: the
          accessed node, its parent, and its grandparent. Their positions give
          us the three splay cases: <strong>Zig</strong>,{' '}
          <strong>Zig-Zig</strong>, and <strong>Zig-Zag</strong>.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`Right rotation at P:          Left rotation at X:

        P                            X
       / \\                          / \\
      X   C          <-->          A   P
     / \\                              / \\
    A   B                            B   C

Inorder before and after: A, X, B, P, C`}</pre>
        </Paper>

        <Typography paragraph>
          Here A, B, and C represent entire subtrees, any of which may be empty.
          Every key in B lies between X and P, so B can safely move from
          X&apos;s right branch to P&apos;s left branch. With parent pointers,
          those pointers and the connection to the old parent&apos;s parent must
          also be updated.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Three Splay Cases">
        <Typography paragraph>
          In the diagrams below, <strong>X</strong> is the node being splayed,{' '}
          <strong>P</strong> is its current parent, and <strong>G</strong> is
          its current grandparent. Inspect their positions, perform the matching
          step, then inspect X&apos;s new ancestors. Stop when X becomes the
          root. If X is already the root, no rotation is needed.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
        >
          Case 1: Zig — One Level from the Root
        </Typography>

        <Typography paragraph>
          X has a parent but no grandparent, so P is the root. A single rotation
          finishes the splay. If X is the left child, rotate right at P. If X is
          the right child, rotate left at P — this mirror case is called{' '}
          <strong>Zag</strong>.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`Before:                   rotateRight(P):

        P                         X
       / \\                       / \\
      X   C                     A   P
     / \\                           / \\
    A   B                         B   C

X is now the root. Splaying is complete.`}</pre>
        </Paper>

        <Typography paragraph>
          Zig is the final step when only one edge remains above X. It is not
          the rule to apply repeatedly when X still has a grandparent.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 2: Zig-Zig — Two Edges in the Same Direction
        </Typography>

        <Typography paragraph>
          X is P&apos;s left child, and P is G&apos;s left child. First rotate
          right at <strong>G</strong>, lifting P above G. Then rotate right at{' '}
          <strong>P</strong>, lifting X above P. The order matters: rotate the
          grandparent first, then the parent.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`Before:          rotateRight(G):    rotateRight(P):

        G                P                  X
       / \\              / \\                / \\
      P   D            X   G              A   P
     / \\              / \\ / \\                / \\
    X   C            A  B C  D              B   G
   / \\                                         / \\
  A   B                                       C   D

Inorder throughout: A, X, B, P, C, G, D`}</pre>
        </Paper>

        <Typography paragraph>
          X rises two levels and G moves down. For the right-right mirror,
          called <strong>Zag-Zag</strong>, rotate left at G, then left at P.
          These paired steps restructure the access path differently from simply
          rotating X over its parent twice. That distinction is part of the
          standard splay algorithm&apos;s amortized guarantee.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 3: Zig-Zag — Two Edges in Opposite Directions
        </Typography>

        <Typography paragraph>
          X and P form a bend: one is a left child and the other is a right
          child. For example, let P be G&apos;s left child and X be P&apos;s
          right child. First rotate left at <strong>P</strong>, then rotate
          right at <strong>G</strong>. X rises between its former ancestors and
          becomes the root of this local subtree.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`Before:          rotateLeft(P):     rotateRight(G):

        G                G                  X
       / \\              / \\                / \\
      P   D            X   D              P   G
     / \\              / \\                / \\ / \\
    A   X            P   C              A  B C  D
       / \\          / \\
      B   C        A   B

Inorder throughout: A, P, B, X, C, G, D`}</pre>
        </Paper>

        <Typography paragraph>
          For the mirror configuration, where P is G&apos;s right child and X is
          P&apos;s left child, rotate right at P, then left at G. Some
          descriptions distinguish the two bends as Zig-Zag and Zag-Zig. The
          reliable rule is to inspect the actual child positions: opposite
          directions mean <strong>parent first, grandparent second</strong>.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="The Rotation Table">
        <Typography paragraph>
          The following table covers both orientations of each case. Left and
          right describe child positions, while <code>rotateLeft</code> and{' '}
          <code>rotateRight</code> describe the operation performed at the named
          node.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`P relative to G   X relative to P   Rotations in order
---------------   ----------------  --------------------------------
No G (P is root)  Left              rotateRight(P)
No G (P is root)  Right             rotateLeft(P)
Left              Left              rotateRight(G), rotateRight(P)
Right             Right             rotateLeft(G), rotateLeft(P)
Left              Right             rotateLeft(P), rotateRight(G)
Right             Left              rotateRight(P), rotateLeft(G)`}</pre>
        </Paper>

        <Typography paragraph>
          In pseudocode, the entire bottom-up process is a loop. The rotation
          helpers below reconnect the rotated subtree to its former ancestor,
          update parent pointers, and update the tree root when necessary.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`function splay(X):
  while X.parent is not null:
    P = X.parent
    G = P.parent

    if G is null:
      if X == P.left: rotateRight(P)
      else: rotateLeft(P)
    else if P == G.left and X == P.left:
      rotateRight(G)
      rotateRight(P)
    else if P == G.right and X == P.right:
      rotateLeft(G)
      rotateLeft(P)
    else if P == G.left and X == P.right:
      rotateLeft(P)
      rotateRight(G)
    else:
      rotateRight(P)
      rotateLeft(G)`}</pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Tracing a Complete Splay">
        <Typography paragraph>
          Consider searching for 20 in the tree below. The BST search follows
          100 → 80 → 40 → 20. Finding the key is only the first part; now splay
          that same node to the root.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>{`Initial tree:    After Zig-Zig:     After final Zig:

      100              100                 20
      /                /                     \\
     80               20                     100
    /                   \\                   /
   40                   40                 40
  /                       \\                 \\
 20                       80                 80

1. X = 20, P = 40, G = 80: left-left.
   rotateRight(80), then rotateRight(40).

2. X = 20, P = 100, no grandparent: Zig.
   rotateRight(100).

Final inorder sequence: 20, 40, 80, 100`}</pre>
        </Paper>

        <Typography paragraph>
          The ancestors change after each step, but X remains the same node.
          This splay uses three rotations. The resulting tree need not be
          perfectly balanced; the goal is to bring the accessed key to the root.
        </Typography>

        <Typography paragraph>
          Open the{' '}
          <Link href="/data-structures/SplayTree">Splay Tree Visualizer</Link>,
          insert a few keys, and search for a node below the root. Pause before
          each step and identify X, P, and G. Decide whether the edges point in
          the same direction or opposite directions, then predict which node
          rotates first. The visualizer also suppors deletion.
        </Typography>
      </Section>

      <Section title="When Splaying Happens">
        <ListItems>
          <li>
            <strong>Search:</strong> follow BST comparisons, then splay the
            matching node. Even a lookup can change the tree. If the search is
            unsuccessful, splay the last visited node.
          </li>
          <li>
            <strong>Insertion:</strong> insert a new key as a BST leaf, then
            splay that new node to the root.
          </li>
          <li>
            <strong>Deletion:</strong> splay the target to the root and remove
            it. If its left subtree exists, make that subtree the tree and splay
            its maximum key. This new root has no right child, so attach the
            removed root&apos;s right subtree there. If the left subtree is
            empty, the right subtree becomes the tree directly.
          </li>
        </ListItems>
      </Section>

      <Section title="Amortized Operations">
        <Typography paragraph>
          Each rotation takes O(1), but an entire splay may require one rotation
          per edge on the path to the root. A tree with n nodes can have height
          n − 1, so one search and its splay can take <strong>O(n)</strong>.
        </Typography>

        <Typography paragraph>
          However, across a sequence of operations, splay trees guarantee{' '}
          <strong>O(log n) amortized time</strong> per operation. Splaying can
          be useful when access is concentrated on a small set of keys. It
          reshapes and flattens deep paths so that subsequent operations run
          much faster on average.
        </Typography>
      </Section>
    </Article>
  );
}
