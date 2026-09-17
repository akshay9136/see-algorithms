import { Article, Section } from '@/components/common';
import { Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function RbtDeletion() {
  return (
    <Article
      title="Deletion in a Red-Black Tree"
      summary="Red-Black Tree deletion is the most intricate operation on any self-balancing tree. Unlike insertion, it can create a structural deficit that requires up to four distinct fixup cases to resolve."
    >
      <Section title="Why Deletion Is Different">
        <Typography paragraph>
          Inserting a node into a{' '}
          <Link href="/data-structures/RedBlackTree">Red-Black Tree</Link> is
          already non-trivial — it may require recoloring and rotations to
          restore the four key invariants. But deletion is harder. When you
          remove a node, you may reduce the black-node count along one path,
          violating the rule that every path from root to a null leaf must
          contain the same number of black nodes.
        </Typography>

        <Typography paragraph>
          The concept used to reason about this imbalance is called a{' '}
          <strong>double-black</strong> node. Think of it as an invisible, extra
          black credit sitting at the position where a black node was physically
          removed. The goal of the fixup is to absorb or distribute that extra
          credit until balance is restored.
        </Typography>
      </Section>

      <Section title="Step 1 — BST Deletion First">
        <Typography paragraph>
          Every Red-Black deletion begins as a standard{' '}
          <Link href="/articles/deleting-bst-node">BST deletion</Link>. There
          are three structural situations:
        </Typography>

        <Typography component="ul" sx={{ mb: 2, '& li': { mb: 1 } }}>
          <li>
            <strong>No children:</strong> Simply remove the (leaf) node.
          </li>
          <li>
            <strong>One child:</strong> Replace the node with its only child.
          </li>
          <li>
            <strong>Two children:</strong> Find the inorder successor (minimum
            of the right subtree), copy its value into the target node, then
            physically delete the successor — which has at most one child.
          </li>
        </Typography>

        <Typography paragraph>
          The node that is physically removed is always a node with at most one
          child. We call it the <strong>spliced-out</strong> node. Its color
          determines what happens next.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Delete 20 from this tree (has two children):

         20 [B]
        /     \\
     10 [B]   30 [B]
              /
           25 [R]

Step 1: Find inorder successor of 20 → 25
Step 2: Copy 25 into node 20's position
Step 3: Physically delete the old node 25 (it's a red leaf)

         25 [B]
        /     \\
     10 [B]   30 [B]

→ Spliced-out node was RED. No fixup needed.`}
          </pre>
        </Paper>

        <Typography paragraph>
          If the spliced-out node is <strong>red</strong>, the black-height is
          unchanged. The tree is already valid — no fixup required.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Step 2 — The Child Takes Over">
        <Typography paragraph>
          If the spliced-out node is <strong>black</strong>, its only child (or
          a null sentinel if it was a leaf) inherits an extra unit of blackness.
          If that child was red, we simply recolor it black and the balance is
          immediately restored.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Delete 10 [B] which has one red child 5 [R]:

      20 [B]               20 [B]
      /                    /
   10 [B]      →        5 [B]
   /
 5 [R]

→ Child was RED. Recolor it BLACK. Done.`}
          </pre>
        </Paper>

        <Typography paragraph>
          If the child is also black (or null), we cannot absorb the extra
          blackness locally. The child becomes a <strong>double-black</strong>{' '}
          node, and we enter the fixup loop. The loop runs while the
          double-black node is not the root, resolving one of four cases on each
          iteration.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="The Four Fixup Cases">
        <Typography paragraph>
          All four cases are defined relative to the double-black node (DB) and
          its <strong>sibling</strong> — the other child of DB&apos;s parent.
          Each case either resolves the double-black immediately or transforms
          it into a simpler case.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
        >
          Case 1: Sibling is Red
        </Typography>

        <Typography paragraph>
          When the sibling is red, the parent must be black (by the red-black
          coloring rule). We rotate the parent toward DB and swap the colors of
          the parent and the sibling. This does not resolve the double-black,
          but it transforms the situation so that the new sibling is black —
          setting up one of the remaining cases.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`DB is left child, sibling S is RED:

      P [B]                        S [B]
     /     \\                     /     \\
   DB       S [R]    →         P [R]   SR [B]
           /    \\             /    \\
        SL [B]  SR [B]       DB    SL [B]

→ Rotate P left. Recolor: P → Red, S → Black.
→ DB's new sibling is SL (which is black). Continue.`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 2: Sibling is Black, Both of Sibling&apos;s Children Are Black
        </Typography>

        <Typography paragraph>
          This case absorbs one unit of blackness from both DB and its sibling
          by recoloring the sibling red. The extra black credit moves up to the
          parent. If the parent was red, it becomes black and the problem is
          solved. If the parent was already black, it becomes the new
          double-black node and the loop continues upward.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`DB is left child. Sibling S [B] has two black children:

      P [?]                    P [?+1]
     /     \\                  /      \\
   DB       S [B]    →      DB        S [R]
           /    \\
        SL [B]  SR [B]

→ Recolor S → Red. DB drops to single-black.
→ Parent absorbs the extra black (+1).
  · If P was Red → P becomes Black. Done.
  · If P was Black → P becomes Double-Black. Loop up.`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 3: Sibling is Black, Near Child Red, Far Child Black
        </Typography>

        <Typography paragraph>
          The &quot;near child&quot; is the sibling&apos;s child on the same
          side as DB. When the near child is red and the far child is black, we
          rotate the sibling away from DB and recolor. This transforms the tree
          into Case 4 without changing DB&apos;s position.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`DB is left child. Sibling S [B], near child SL [R], far child SR [B]:

      P [?]                      P [?]
     /     \\                   /     \\
   DB       S [B]    →       DB      SL [B]
           /    \\                       \\
        SL [R]  SR [B]                 S [R]
                                          \\
                                         SR [B]

→ Rotate S right. Recolor: SL → Black, S → Red.
→ DB's new sibling is SL (black, with a red far child).
→ Now in Case 4.`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 4: Sibling is Black, Far Child is Red
        </Typography>

        <Typography paragraph>
          This is the terminal case — it always resolves the double-black in a
          single rotation. We rotate the parent toward DB, give the sibling the
          parent&apos;s color, then recolor both the parent and the far child to
          black. The extra black credit is absorbed by the far child&apos;s
          recoloring, restoring the black-height on all paths simultaneously.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`DB is left child. Sibling S [B], far child SR [R]:

      P [c]                      S [c]
     /     \\                   /      \\
   DB       S [B]    →       P [B]    SR [B]
           /    \\           /    \\
        SL [?]  SR [R]    DB     SL [?]

→ Rotate P left.
→ Recolor: S → P's old color (c), P → Black, SR → Black.
→ DB is now single-black. Done.`}
          </pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="The Fixup at a Glance">
        <Typography paragraph>
          The four cases follow a clear decision tree. Symmetric cases exist
          when DB is the right child instead of the left — simply mirror all
          directions.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`while DB ≠ root AND DB is double-black:

  sibling S = DB's sibling

  if S is Red:
    → Case 1: Rotate parent toward DB, swap parent/sibling colors
              (transforms to Case 2, 3, or 4)

  else: (S is Black)

    if both S's children are Black:
      → Case 2: Recolor S Red, push extra black up to parent
                (may resolve or loop upward)

    else if far child of S is Black:
      → Case 3: Rotate S away from DB, swap S/near-child colors
                (transforms to Case 4)

    else: (far child of S is Red)
      → Case 4: Rotate parent toward DB
                Recolor S ← parent's color, parent ← Black, far child ← Black
                (always resolves — exit loop)

if root is double-black:
  → Simply recolor root to single-black`}
          </pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="A Complete Example">
        <Typography paragraph>
          Starting from a tree where deleting a black leaf node triggers a full
          fixup chain:
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Initial Tree:
           15 [B]
          /      \\
        10 [B]   20 [B]
        /    \\       \\
      5 [R]  12 [R]  25 [R]

Delete 20 [B]:
  → 20 has one child (25 [R]), splice out 20.
  → Child 25 was Red → recolor to Black. Done.

           15 [B]
          /      \\
        10 [B]   25 [B]
        /    \\
      5 [R]  12 [R]

─────────────────────────────────────────────

Now delete 25 [B] (a leaf):
  → Spliced-out node is Black, no child → DB at null position.
  → DB is right child of 15. Sibling = 10 [B].
  → 10's near child (for right-DB) = 12 [R], far child = 5 [R].

  Far child (5 [R]) is Red → Case 4:
    Rotate 15 right. 10 gets 15's color [B], 15 → Black, 5 → Black.

           10 [B]
          /      \\
        5 [B]   15 [B]
                /
             12 [R]

→ Double-black resolved. Tree is balanced.`}
          </pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Time Complexity">
        <Typography paragraph>
          Deletion in a Red-Black Tree is guaranteed to run in O(log n) time.
          The BST traversal to find the node takes O(log n) because the
          tree&apos;s height is bounded. The fixup loop can propagate upward at
          most O(log n) levels, and each case performs at most a constant number
          of rotations and recolorings. Case 4 always terminates the loop, so
          rotations happen at most twice per deletion.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Operation                      Complexity
──────────────────────────     ──────────
Find target node               O(log n)
BST splice-out                 O(log n)   (finding successor)
Fixup loop iterations          O(log n)
Rotations (total per delete)   O(1)       (at most 3)

Overall deletion time          O(log n)`}
          </pre>
        </Paper>

        <Typography paragraph>
          This is a key advantage over an unbalanced{' '}
          <Link href="/data-structures/BST">BST</Link>, where deletion can
          degrade to O(n) on a skewed tree. The coloring invariants of the
          Red-Black Tree ensure the height never exceeds 2 · log n, making every
          operation reliably fast.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Comparison with AVL Tree">
        <Typography paragraph>
          Both Red-Black Trees and{' '}
          <Link href="/data-structures/AVL">AVL Trees</Link> guarantee O(log n)
          deletion. The key difference is in how much restructuring each
          requires. An AVL deletion may trigger rotations all the way up to the
          root because height differences must be corrected at every ancestor. A
          Red-Black Tree deletion requires at most three rotations total — Case
          4 always terminates the loop and uses a single rotation.
        </Typography>

        <Typography paragraph>
          This makes Red-Black Trees the preferred structure in systems with
          frequent writes, such as the Linux kernel&apos;s task scheduler, and
          Java&apos;s TreeMap. Read{' '}
          <Link href="/articles/avl-tree-vs-red-black">
            AVL Tree vs Red-Black Tree
          </Link>{' '}
          for a deeper comparison.
        </Typography>
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          Red-Black Tree deletion follows a precise recipe. Start with a BST
          deletion, identify the spliced-out node&apos;s color, and check
          whether the surviving child can absorb the black-height deficit
          locally. If not, enter the four-case fixup loop, which systematically
          resolves the imbalance. Once internalized, the procedure feels less
          like memorization and more like a structured conversation between a
          node and its tree.
        </Typography>
      </Section>
    </Article>
  );
}
