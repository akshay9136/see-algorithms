import { Article, ListItems, Section } from '@/components/common';
import { Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

const styles = {
  card: {
    maxWidth: 600,
    maxHeight: { xs: 200, sm: 400 },
    overflow: 'hidden',
    border: 1,
    borderColor: 'divider',
    mt: 3,
  },
};

export default function AvlTreeRotations() {
  return (
    <Article
      title="AVL Tree Rotations Explained"
      summary="A step-by-step guide to LL, RR, LR, and RL rotations — the foundational pointer maneuvers that keep AVL trees strictly balanced in O(1) time."
    >
      <Section title="The Need for Discipline">
        <Typography paragraph>
          A standard <Link href="/data-structures/BST">Binary Search Tree</Link>{' '}
          offers O(log n) performance for search, insertion, and deletion. But
          this efficiency is fragile. Insert items in sequential order, and the
          tree silently collapses into a linked list, degrading every lookup to
          a sluggish O(n). In 1962, Soviet mathematicians Georgy Adelson-Velsky
          and Evgenii Landis introduced the first self-balancing binary search
          tree named <Link href="/data-structures/AVL">AVL Tree</Link>.
        </Typography>

        <Typography paragraph>
          Rather than allowing height to drift with incoming data, an AVL tree
          enforces a strict structural discipline after every modification. The
          engine behind that discipline is the tree <strong>rotation</strong> —
          an elegant, constant-time geometric transformation that alters subtree
          heights while leaving binary search order completely untouched.
        </Typography>
      </Section>

      <Section title="Measuring Imbalance">
        <Typography paragraph>
          To maintain balance, every node in an AVL tree keeps track of its
          height — the length of the longest downward path to a leaf. From this
          height, we derive each node&apos;s{' '}
          <strong>Balance Factor (BF)</strong>:
        </Typography>

        <Paper className="pseudoCode" sx={{ mb: 3 }}>
          <pre style={{ margin: 0 }}>
            {`BalanceFactor(node) = height(node.left) - height(node.right)`}
          </pre>
        </Paper>

        <Typography paragraph>
          In a healthy AVL tree, the AVL Invariant dictates that for every node:
        </Typography>

        <Paper className="pseudoCode" sx={{ mb: 3 }}>
          <pre style={{ margin: 0 }}>{`BalanceFactor(node) ∈ {-1, 0, +1}`}</pre>
        </Paper>

        <ListItems>
          <li>
            <strong>BF = 0:</strong> Both subtrees have identical height. The
            node is in perfect equilibrium.
          </li>
          <li>
            <strong>BF = +1:</strong> The left subtree is taller by one level.
            Acceptable and valid.
          </li>
          <li>
            <strong>BF = -1:</strong> The right subtree is taller by one level.
            Acceptable and valid.
          </li>
          <li>
            <strong>BF = +2 or -2:</strong> The balance threshold has been
            breached. The node is critically unbalanced, and the tree must
            perform a rotation to restore order.
          </li>
        </ListItems>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="The BST Invariant">
        <Typography paragraph>
          How can we reshape a tree without scrambling the order of its data?
          Recall that for any node X in a BST:
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre
            style={{ margin: 0 }}
          >{`keys(left subtree) < key(X) < keys(right subtree)`}</pre>
        </Paper>

        <Typography paragraph>
          A tree rotation is a local pointer exchange between a parent node and
          one of its children. During the rotation:
        </Typography>

        <ListItems>
          <li>
            The child moves up to assume the parent&apos;s former position.
          </li>
          <li>The parent moves down to become a child of that node.</li>
          <li>
            The &quot;orphan&quot; middle subtree (the child&apos;s inner
            branch) is handed over to the former parent.
          </li>
        </ListItems>

        <Typography paragraph>
          Because every element in that transferred subtree lies between the
          parent and child, the BST invariant is flawlessly preserved.
          Crucially, this operation touches only 3 to 5 pointers and runs in{' '}
          <strong>O(1) constant time</strong>.
        </Typography>
      </Section>

      <Section title="The Four Imbalance Cases">
        <Typography paragraph>
          When an insertion or deletion pushes a node&apos;s balance factor to{' '}
          <code>+2</code> or <code>-2</code>, the imbalance originates from one
          of four directional configurations. We classify each case by the
          direction from the unbalanced node (Z) toward the taller child (Y),
          and from Y toward its taller child:
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
        >
          Case 1: Left-Left (LL) Imbalance
        </Typography>

        <Typography paragraph>
          Node Z has <code>BF = +2</code> and its left child Y has{' '}
          <code>BF ≥ 0</code>. The excess height lies entirely along the
          outer-left path (Left subtree of Left child). Perform a single{' '}
          <strong>Right Rotation</strong> at node Z. Node Y becomes the new
          subtree root, Z becomes Y&apos;s right child, and Y&apos;s right
          subtree (T2) attaches as Z&apos;s new left subtree.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Before Rotation (LL Imbalance at Z):

            Z (+2)
           /      \\
         Y (+1)    T3
        /      \\
      X (0)     T2
     /   \\
   T0     T1

After Right Rotation at Z:

            Y (0)
          /       \\
        X (0)      Z (0)
       /   \\      /    \\
     T0     T1   T2     T3

Key Pointer Shifts:
1. Z.left = Y.right  (T2 adopts Z as its parent)
2. Y.right = Z       (Z becomes Y's right child)
3. Y adopts Z's old parent`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 2: Right-Right (RR) Imbalance
        </Typography>

        <Typography paragraph>
          Node Z has <code>BF = -2</code> and its right child Y has{' '}
          <code>BF ≤ 0</code>. The excess height is entirely along the
          outer-right path (Right subtree of Right child). The mirror image of
          the LL case. Perform a single <strong>Left Rotation</strong> at node
          Z. Node Y lifts up, Z drops to become Y&apos;s left child, and
          Y&apos;s left subtree (T2) attaches as Z&apos;s right subtree.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Before Rotation (RR Imbalance at Z):

            Z (-2)
           /     \\
         T0       Y (-1)
                  /    \\
                T1      X (0)
                       /     \\
                     T2       T3

After Left Rotation at Z:

            Y (0)
          /       \\
        Z (0)      X (0)
       /     \\    /    \\
      T0     T1  T2     T3

Key Pointer Shifts:
1. Z.right = Y.left  (T1 adopts Z as its parent)
2. Y.left = Z        (Z becomes Y's left child)
3. Y adopts Z's old parent`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 3: Left-Right (LR) Imbalance
        </Typography>

        <Typography paragraph>
          Node Z has <code>BF = +2</code>, but its left child Y has{' '}
          <code>BF = -1</code>. The excess weight is bent inward (Right child of
          Left child), forming a &quot;zig-zag&quot; or &quot;elbow&quot; shape.
          If you perform a naive right rotation at Z, the inner subtree simply
          swings over to the right branch, leaving Z with an RR imbalance. The
          tree remains broken.
        </Typography>

        <Typography paragraph>
          This requires a <strong>double rotation</strong> in two distinct steps
          — <strong>Left Rotation at Y:</strong> Rotate child Y to the left.
          Grandchild X moves up to take Y&apos;s place, converting the zig-zag
          into a straight LL line. <strong>Right Rotation at Z:</strong> Perform
          a standard right rotation at Z. Node X now rises to become the subtree
          root.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Initial State (LR Imbalance at Z):

            Z (+2)
           /      \\
         Y (-1)    T3
        /     \\
      T0       X
              / \\
            T1   T2

Step 1: Rotate Left at Child Y (converts LR → LL):

            Z (+2)
           /      \\
         X (+1)    T3
        /     \\
      Y        T2
     / \\
   T0   T1

Step 2: Rotate Right at Grandparent Z (resolves balance):

            X (0)
          /      \\
        Y         Z
       / \\       / \\
     T0   T1   T2   T3`}
          </pre>
        </Paper>

        <Typography paragraph sx={{ pt: 1 }}>
          <strong>What happens to the Balance Factors?</strong> Node X always
          ends with <code>BF = 0</code>. The final balance factors of Y and Z
          depend on where the newly inserted key landed inside X:
        </Typography>

        <ListItems>
          <li>
            <strong>If X had BF = +1 (insertion in T1):</strong> Y becomes 0, Z
            becomes -1.
          </li>
          <li>
            <strong>If X had BF = -1 (insertion in T2):</strong> Y becomes +1, Z
            becomes 0.
          </li>
          <li>
            <strong>If X had BF = 0 (X was the inserted node):</strong> Both Y
            and Z become 0.
          </li>
        </ListItems>

        <Paper sx={styles.card}>
          <img src="/gifs/avl-tree.gif" alt="AVL Tree Rotations" width="100%" />
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 4 }}
        >
          Case 4: Right-Left (RL) Imbalance
        </Typography>

        <Typography paragraph>
          Node Z has <code>BF = -2</code>, and its right child Y has{' '}
          <code>BF = +1</code>. The excess weight is bent inward on the right
          side (Left child of Right child). The mirror counterpart of the LR
          case — <strong>Right Rotation at Y:</strong> Rotate child Y to the
          right. Grandchild X moves up to take Y&apos;s place, transforming the
          structure into an RR case. <strong>Left Rotation at Z:</strong> Rotate
          grandparent Z to the left. Node X ascends to the root of the subtree.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Initial State (RL Imbalance at Z):

            Z (-2)
           /     \\
         T0       Y (+1)
                  /    \\
                X       T3
               / \\
             T1   T2

Step 1: Rotate Right at Child Y (converts RL → RR):

            Z (-2)
           /     \\
         T0       X (-1)
                  /    \\
                T1      Y
                       / \\
                     T2   T3

Step 2: Rotate Left at Grandparent Z (resolves balance):

            X (0)
          /      \\
        Z         Y
       / \\       / \\
     T0   T1   T2   T3`}
          </pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="The Universal Decision Matrix">
        <Typography paragraph>
          When writing or tracing AVL logic, memorizing diagrams is unnecessary.
          The exact rotation required is determined entirely by the signs of two
          numbers: the balance factor of the unbalanced node (Z) and the balance
          factor of its taller child (Y):
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Unbalanced Node (Z)   Child (Y)       Case   Action
───────────────────   ─────────────── ────   ──────────────────────────
BF(Z) > 1             BF(Y) >= 0      LL     RotateRight(Z)
BF(Z) > 1             BF(Y) < 0       LR     RotateLeft(Y) + RotateRight(Z)
BF(Z) < -1            BF(Y) <= 0      RR     RotateLeft(Z)
BF(Z) < -1            BF(Y) > 0       RL     RotateRight(Y) + RotateLeft(Z)`}
          </pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Insertion vs Deletion">
        <Typography paragraph>
          Both insertions and deletions trigger rotations, but their structural
          aftermath differs profoundly.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
        >
          Insertion: At Most One Rotation
        </Typography>

        <Typography paragraph>
          When you insert a new key into an AVL tree, you traverse down to a
          leaf, add the node, and retrace back toward the root updating heights.
          The moment you encounter the <em>lowest</em> unbalanced ancestor (BF =
          ±2) and execute the appropriate rotation (single or double), the
          height of that entire subtree is restored to exactly what it was
          before the insertion occurred.
        </Typography>

        <Typography paragraph>
          Because the subtree height does not grow beyond its pre-insertion
          level, no higher ancestors experience an increase in height.
          Therefore,{' '}
          <strong>
            an insertion never requires more than one rotation operation
          </strong>{' '}
          (at most two pointer-level rotations for LR/RL). Total rotation cost
          is O(1).
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 3 }}
        >
          Deletion: Rotations May Cascade
        </Typography>

        <Typography paragraph>
          Deletion is far more demanding. Removing a node (using the standard{' '}
          <Link href="/articles/deleting-bst-node">BST deletion rules</Link>)
          can shorten a subtree. When you rotate at an unbalanced ancestor to
          fix its balance factor, the height of that reconstructed subtree may
          decrease by 1 compared to its state before deletion.
        </Typography>

        <Typography paragraph>
          This reduction in height can create an imbalance at the grandparent,
          which in turn requires another rotation, and so on. In the worst case,{' '}
          <strong>
            a single deletion can trigger rotations all the way up to the root
          </strong>{' '}
          — up to O(log n) rotations in total. This cascading potential is why
          write-intensive applications often prefer Red-Black Trees, where
          deletion fixup is guaranteed to require at most three rotations
          regardless of tree size.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Bringing It All Together">
        <Typography paragraph>
          At their core, AVL rotations solve a fundamental challenge in computer
          science: maintaining peak search efficiency without the overhead of
          full tree reorganizations. By rearranging just a handful of pointers
          in <strong>O(1) time</strong>, these four maneuvers restore
          equilibrium locally while leaving the binary search order completely
          undisturbed.
        </Typography>
      </Section>
    </Article>
  );
}
