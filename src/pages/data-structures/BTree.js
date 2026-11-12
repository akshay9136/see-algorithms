import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  AdUnit,
  ComplexityTable,
  ListItems,
  SavedDataList,
  Section,
  TreeInput,
} from '@/components/common';
import { useAlgorithm, useBreakpoints, useSavedData } from '@/hooks';
import { useBTree } from '@/hooks/data-structures';
import Link from 'next/link';

export default function BTree(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { animation, summary, buttons, refresh } = useBTree({ saveData });
  const { lgup, xldown } = useBreakpoints();

  const [searchAlgo] = useAlgorithm(`
function search(node, key):
    i = 0
    while i < node.n and key > node.keys[i]:
        i = i + 1
    if i < node.n and key == node.keys[i]:
        return (node, i)
    if node.isLeaf:
        return null
    return search(node.children[i], key)
`);

  return (
    <>
      <Typography paragraph>
        A <strong>B-Tree</strong> is a self-balancing search tree designed to
        maintain sorted data and allow efficient insertion, deletion, and search
        operations. Unlike <Link href="/data-structures/BST">binary trees</Link>
        , each node can hold multiple keys and have more than two children.
        B-Trees are widely used in databases and file systems where large blocks
        of data must be read and written efficiently.
      </Typography>
      <Typography paragraph>
        When inserting a new key, it is placed into the appropriate leaf node.
        If the node overflows by exceeding the maximum number of keys,{' '}
        <strong>it splits</strong> — the median key is pushed up to the parent,
        while the remaining keys form two child nodes. This process can
        propagate upward and may even create a new root. This splitting
        mechanism is essential for keeping the tree balanced, ensuring that all
        leaves always remain at the same depth as keys are redistributed.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={{ xs: 0, md: 4 }}
      >
        <Section variant="h6" title="Key Properties">
          <ListItems sx={{ pl: 2, mb: 0 }}>
            <li>
              <strong>Multi-Way Branching:</strong> Every node can contain
              multiple sorted keys and have more than two children, defined by
              order M.
            </li>
            <li>
              <strong>Node Fill Capacity:</strong> Every internal node (except
              the root) contains at least <strong>(M / 2) &minus; 1</strong>{' '}
              keys and at most <strong>M&minus;1</strong> keys, guaranteeing at
              least 50% storage utilization.
            </li>
            <li>
              <strong>Uniform Leaf Depth:</strong> All leaf nodes reside at the
              exact same depth, ensuring perfectly balanced tree height.
            </li>
            <li>
              <strong>Ordered Routing:</strong> Keys inside each node partition
              the ranges of its child subtrees, enabling efficient binary or
              linear search within nodes.
            </li>
          </ListItems>
        </Section>
        <Section variant="h6" title="Key Operations">
          <ListItems sx={{ pl: 2, mb: 0 }}>
            <li>
              <strong>Search:</strong> Compares target against keys in the
              current node; if not found, follows the child pointer between the
              bracketing keys down to a leaf.
            </li>
            <li>
              <strong>Insertion:</strong> Places the key in a leaf. If full, the
              node splits and elevates its median key up to the parent.
            </li>
            <li>
              <strong>Deletion:</strong> Removes the key directly from a leaf or
              replaces it with an in-order predecessor/successor, borrowing or
              merging nodes on underflow.
            </li>
          </ListItems>
        </Section>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            Visualizer
          </Typography>
          <TreeInput {...props} buttons={buttons} />
          {animation}
          <Typography variant="body2" color="text.secondary" mt={1}>
            For simplicity, the order of this B-Tree visualizer is fixed to 3.
          </Typography>
        </Stack>
        {lgup && xldown && <AdUnit sx={{ maxWidth: 300 }} />}
        {summary}
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="How It Works">
            <Typography paragraph>
              A B-Tree generalizes binary search trees by allowing nodes to
              store multiple keys and branch into many subtrees. During a{' '}
              <strong>search</strong>, the algorithm scans the sorted keys
              within the current node. If the target matches a key, the search
              terminates immediately. Otherwise, it identifies the child pointer
              situated between the two keys that bound the search value and
              recurses downward until reaching a leaf.
            </Typography>
            <Typography paragraph>
              During <strong>deletion</strong>, removing a key from an internal
              node requires substituting it with its in-order predecessor or
              successor. If any node falls below the minimum required keys
              (underflow), the tree rebalances by borrowing a key from an
              immediate sibling through the parent or by merging with a sibling
              and the separating parent key.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              B-Trees are the architectural cornerstone of relational databases
              (such as SQLite, PostgreSQL, and MySQL) and storage filesystems
              (such as ext4 and NTFS). Because disk and SSD storage controllers
              read and write data in fixed-size blocks (typically 4 KB or 8 KB),
              B-Trees configure node sizes to align precisely with block
              boundaries. This maximizes the branching factor (often 100+ keys
              per node), compressing tree height to only 3–4 levels for millions
              of rows and minimizing slow disk seek operations.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>

      <SavedDataList onSelect={refresh} {...saveDataProps} />
    </>
  );
}

const complexityData = [
  {
    type: 'Search',
    complexity: 'O(log n)',
    description: (
      <>
        Multi-way branching reduces tree height; searching within a node takes
        O(log M), giving <strong>O(log M · log n)</strong> = O(log n) total
        time.
      </>
    ),
  },
  {
    type: 'Insertion',
    complexity: 'O(log n)',
    description:
      'Traverses from root to leaf in O(log n) time. If a node is full, splitting and pushing the median key up takes O(M) time per level.',
  },
  {
    type: 'Deletion',
    complexity: 'O(log n)',
    description:
      'Locates the key in O(log n) time, followed by key borrowing from siblings or merging nodes if underflow occurs on the path.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description: (
      <>
        Stores all n keys and child pointers. Every non-root node guarantees at
        least 50% storage utilization.
      </>
    ),
  },
];
