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
import { useBPlusTree } from '@/hooks/data-structures';
import Link from 'next/link';

export default function BPlusTree(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { animation, summary, buttons, refresh } = useBPlusTree({ saveData });
  const { lgup, xldown } = useBreakpoints();

  return (
    <>
      <Typography paragraph>
        A <strong>B+ Tree</strong> is a self-balancing search tree and a variant
        of the <Link href="/data-structures/BTree">B-Tree</Link>. Like a B-Tree,
        each internal node can hold multiple keys and have more than two
        children. The key difference is that in a B+ Tree{' '}
        <strong>all data records are stored only in the leaf nodes</strong>,
        while internal nodes act purely as routing guides. Leaf nodes are also
        connected in a{' '}
        <Link href="/data-structures/LinkedList">Linked List</Link>, enabling
        efficient range queries without traversing the tree.
      </Typography>
      <Typography paragraph>
        When inserting a new key, it is placed into the appropriate leaf node.
        If the leaf overflows, <strong>it splits</strong> — the smallest key of
        the right half is <strong>copied</strong> (not moved) up to the parent
        as a separator, so the key remains in the leaf. This copying behaviour
        is what distinguishes a B+ Tree from a B-Tree. Internal nodes split
        using the traditional median-push approach. The splitting process can
        propagate upward and may create a new root, always keeping all leaves at
        the same depth.
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
              <strong>Data Exclusively in Leaves:</strong> Internal nodes store
              only routing keys and child pointers; all data records reside
              strictly in the leaf level.
            </li>
            <li>
              <strong>Sequential Leaf Chain:</strong> Leaf nodes are linked as a
              continuous singly or doubly linked list, supporting O(k)
              sequential scans.
            </li>
            <li>
              <strong>Key Replication:</strong> Keys appear in internal nodes as
              routing separators and are duplicated in the leaf nodes where the
              actual records exist.
            </li>
            <li>
              <strong>Shallow Height:</strong> Omitting data payloads from
              internal nodes allows more keys per block, yielding lower tree
              depth than standard B-Trees.
            </li>
          </ListItems>
        </Section>
        <Section variant="h6" title="Key Operations">
          <ListItems sx={{ pl: 2, mb: 0 }}>
            <li>
              <strong>Point Search:</strong> Navigates internal routing keys
              down to the target leaf, ensuring identical search path lengths
              for all keys.
            </li>
            <li>
              <strong>Range Query:</strong> Finds the start key in O(log n),
              then follows the leaf chain pointers to collect records in range.
            </li>
            <li>
              <strong>Leaf Split (Copy Up):</strong> When a leaf overflows, the
              smallest key of the right half is copied up to the parent so the
              key remains in the leaf.
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
            For simplicity, the order of this B+ Tree visualizer is fixed to 3.
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
              A <strong>search</strong> operation in a B+ Tree always traverses
              from the root down to a leaf node. At each internal node, the
              algorithm compares the search key against the routing keys to
              determine which child subtree to visit. Even if an exact match is
              found inside an internal node, traversal continues downward into
              the child branch because the actual data record pointer is stored
              only in the leaf.
            </Typography>
            <Typography paragraph>
              To execute a <strong>range query</strong> (e.g. finding all values
              between 20 and 50), the B+ Tree first performs a standard search
              to locate the leaf containing the lower bound. From there, it
              simply follows the sequential <code>next</code> pointer of the
              leaf nodes to scan records directly in sorted order until
              exceeding the upper bound, completely avoiding tree traversal
              overhead.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              B+ Trees are the universal default storage engine index for
              production relational databases, including MySQL (InnoDB),
              PostgreSQL, SQLite, and Microsoft SQL Server, as well as modern
              file systems like NTFS and XFS. Because real-world database
              queries frequently involve range filters (<code>between</code>,
              &gt;=, &lt;=) and sorting (order by), the linked leaf structure
              provides dramatically higher query throughput than standard
              B-Trees or hash indexes.
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
    type: 'Point Search',
    complexity: 'O(log n)',
    description:
      'Uniform height ensures all searches reach the leaf level in exactly the same logarithmic number of steps.',
  },
  {
    type: 'Range Query',
    complexity: 'O(log n + k)',
    description:
      'Locates the starting leaf in O(log n) time, then traverses k matching elements sequentially via the leaf linked list.',
  },
  {
    type: 'Insertion',
    complexity: 'O(log n)',
    description:
      'Inserts into a leaf node; splitting copies the separator key up to internal routing nodes in O(log n) time.',
  },
  {
    type: 'Deletion',
    complexity: 'O(log n)',
    description:
      'Removes the key from the leaf; rebalancing borrows from adjacent leaves or merges leaves and updates parent routing keys.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description: (
      <>
        Stores all n records in leaves plus routing keys in internal nodes. High
        fanout keeps overhead low.
      </>
    ),
  },
];
