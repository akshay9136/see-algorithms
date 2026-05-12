import { Article, Section } from '@/components/common';
import { Paper, Typography } from '@mui/material';

export default function EmbedDataStruct() {
  return (
    <Article
      title="Embed DS Visualizers"
      summary="A practical guide on embedding live, interactive data structure animations into your content. Let readers insert values, delete nodes, and watch rotations and rebalancing happen in real time."
    >
      <Section title="Why Embed Visualizers?">
        <Typography paragraph>
          Understanding data structures through text alone can be challenging. A
          static diagram captures a single snapshot, but it cannot convey the
          step-by-step transformations that make structures like AVL trees,
          Red-Black trees, and B-trees so fascinating to study.
        </Typography>

        <Typography paragraph>
          That&apos;s why we have made our data structure visualizers
          embeddable. Whether you&apos;re writing a computer science course on
          Notion, publishing a tutorial on Medium, or building a personal study
          guide, you can instantly add high-quality, interactive animations
          directly to your content.
        </Typography>

        <Typography paragraph>
          This turns a passive reading experience into active, hands-on
          exploration without ever leaving your website.
        </Typography>
      </Section>

      <Section title="How to Embed">
        <Typography paragraph>
          Each data structure visualizer is available through a dedicated embed
          page, stripped of site navigation and focused entirely on the
          interactive visualization. To embed it, place the URL inside an iframe
          element.
        </Typography>

        <Typography paragraph>
          The structure of the URL follows a simple pattern:
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: 0 }}>
            {`https://see-algorithms.com/data-structures/embed/{DataStructure}`}
          </pre>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Data Structures
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: 0 }}>
            {`CircularQueue    - Circular Queue
LinkedList       - Linked List
BinaryHeap       - Binary (Max) Heap
BST              - Binary Search Tree
AVL              - AVL Tree
RedBlackTree     - Red-Black Tree
SplayTree        - Splay Tree
BTree            - B-Tree`}
          </pre>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Example
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: '4px 0' }}>
            {`<iframe
    src="https://see-algorithms.com/data-structures/embed/BST"
    width="100%"
    height="600px"
    frameborder="0">
</iframe>`}
          </pre>
        </Paper>

        <Typography paragraph>
          The iframe loads the external visualizer in a contained window.
          Platforms like Notion or Medium allow you to paste the URL directly
          and they will automatically convert it into an interactive embed.
        </Typography>
      </Section>

      <Section title="Live Preview" sx={{ minWidth: 600 }}>
        <Typography color="text.secondary" paragraph>
          This is exactly how the embedded visualizer appears on your page:
        </Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <iframe
            src="/data-structures/embed/BST"
            width="100%"
            height="600px"
            style={{ border: 'none', display: 'block' }}
            title="Embedded BST Visualizer"
          />
        </Paper>
      </Section>

      <Section title="Choosing the Right Size">
        <Typography paragraph>
          The width is typically set to 100% so the visualization adapts to the
          width of your container. The height depends on the data structure you
          are embedding.
        </Typography>

        <Typography paragraph>
          Tree-based structures such as AVL, BST, and Splay Tree benefit from
          more vertical space, since the tree can grow deep as nodes are
          inserted. A height between 600 and 700 pixels is recommended for
          these. Simpler structures like Circular Queue work well at around 300
          to 400 pixels.
        </Typography>
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          Data structure visualizers are especially powerful in educational
          content where the behavior of an operation is difficult to convey
          purely in words. Watching an AVL tree self-balance after an insertion,
          or seeing how a Red-Black tree recolors and rotates to maintain its
          invariants, creates an intuition that prose alone rarely achieves.
        </Typography>

        <Typography paragraph>
          A single iframe is all it takes to turn abstract data structure theory
          into a tangible, interactive learning experience.
        </Typography>
      </Section>
    </Article>
  );
}
