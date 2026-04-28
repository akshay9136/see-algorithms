import { Article, Section } from '@/components/common';
import { Typography, Paper } from '@mui/material';

export default function EmbedDataStruct() {
  return (
    <Article
      title="Embed DS Visualizers"
      summary="A simple guide on how to embed live, interactive data structure animations directly into your content."
    >
      <Section title="Why Embed Visualizers?">
        <Typography paragraph>
          Understanding data structures through text alone can be challenging. A
          static diagram captures a single snapshot, but it cannot convey the
          step-by-step transformations that make structures like AVL trees,
          Red-Black trees, and B-trees so fascinating to study.
        </Typography>

        <Typography paragraph>
          That’s why we’ve made our data structure visualizers embeddable.
          Whether you’re writing a computer science course on Notion, publishing
          a tutorial on Medium, or building a personal study guide, you can
          instantly add high-quality, interactive data structure animations
          directly to your content.
        </Typography>

        <Typography paragraph>
          Your readers can insert values, delete nodes, and watch rotations,
          recoloring, and rebalancing happen live, directly within your page.
          This turns a passive reading experience into active, hands-on
          exploration without ever leaving your website.
        </Typography>
      </Section>

      <Section title="How to Embed">
        <Typography paragraph>
          Each data structure visualizer is available through a dedicated embed
          page. This page is stripped of all site navigation and focused
          entirely on the interactive visualization. To embed it, simply place
          the URL inside an iframe element in your HTML.
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
          Basic Example:
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: '4px 0' }}>
            {`<iframe
    src="https://see-algorithms.com/data-structures/embed/AVL"
    width="100%"
    height="700px"
    frameborder="0">
</iframe>`}
          </pre>
        </Paper>

        <Typography paragraph>
          The iframe acts like a window that loads the external visualizer.
          Modern editors like Notion or Medium allow you to paste the URL
          directly and they will automatically convert it into an interactive
          embed.
        </Typography>
      </Section>

      <Section title="Choosing the Right Size">
        <Typography paragraph>
          The width is typically set to 100% so the visualization adapts to the
          width of your container. The height depends on the data structure you
          are embedding.
        </Typography>

        <Typography paragraph>
          Tree-based structures such as AVL, BST, Red-Black, Splay, and B-trees
          benefit from more vertical space, since the tree can grow deep as
          nodes are inserted. A height between 600 and 700 pixels is recommended
          for these. Simpler structures like the Linked List work well at around
          300 to 400 pixels.
        </Typography>
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          Data structure visualizers are especially powerful in educational
          content where the behavior of an algorithm is difficult to convey
          purely in words. Watching an AVL tree self-balance after an insertion,
          or seeing how a Red-Black tree recolors and rotates to maintain its
          invariants, creates an intuition that prose alone rarely achieves.
        </Typography>
      </Section>
    </Article>
  );
}
