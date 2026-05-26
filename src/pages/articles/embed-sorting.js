import { Article, Section } from '@/components/common';
import { Paper, Typography } from '@mui/material';

export default function EmbedSorting() {
  return (
    <Article
      title="Embed Sorting Visualizers"
      summary="A comprehensive guide on embedding live, interactive sorting algorithm animations into your website, blog, or course materials. Transform passive reading into active exploration with a single iframe."
    >
      <Section title="Why Embed Visualizers?">
        <Typography paragraph>
          Reading about algorithms is often a passive experience. A diagram may
          help, but it still represents only a frozen moment of the process.
          However, building an interactive data structure or sorting animation
          from scratch just to include it in a blog post or tutorial can be
          incredibly time-consuming.
        </Typography>

        <Typography paragraph>
          That&apos;s why we have made our visualizers embeddable. Whether
          you&apos;re a teacher building course materials on Notion, a student
          taking notes, or a developer writing a technical blog on Medium, you
          can instantly add high-quality, interactive sorting animations
          directly to your content.
        </Typography>

        <Typography paragraph>
          By embedding these visualizers, your readers can manually input
          arrays, play, pause, and step through the algorithms directly within
          your page. This significantly enhances the learning experience and
          keeps them engaged without ever having to leave your website.
        </Typography>
      </Section>

      <Section title="How to Embed">
        <Typography paragraph>
          Each sorting visualizer is available through a dedicated embed page
          that removes unnecessary navigation and focuses entirely on the
          visualization interface. To embed the visualizer, place the URL inside
          an iframe element.
        </Typography>

        <Typography paragraph>
          The structure of the URL follows a simple pattern:
        </Typography>

        <Paper className="pseudoCode" sx={{ mb: 3 }}>
          <pre style={{ margin: 0 }}>
            {`https://see-algorithms.com/sorting/embed/{Algorithm}`}
          </pre>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Example
        </Typography>

        <Paper className="pseudoCode" sx={{ mb: 3 }}>
          <pre style={{ margin: '4px 0' }}>
            {`<iframe
    src="https://see-algorithms.com/sorting/embed/MergeSort"
    width="100%"
    height="400px"
    frameborder="0">
</iframe>`}
          </pre>
        </Paper>

        <Typography paragraph>
          The iframe acts like a window that loads the external site. Modern
          editors like Notion or Medium allow you to simply paste the URL and it
          will automatically convert it into an interactive embed.
        </Typography>
      </Section>

      <Section title="Live Preview" sx={{ minWidth: 600 }}>
        <Typography color="text.secondary" paragraph>
          This is exactly how the embedded visualizer appears on your page:
        </Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <iframe
            src="/sorting/embed/MergeSort"
            width="100%"
            height="500px"
            style={{ border: 'none', display: 'block' }}
            title="Embedded Merge Sort Visualizer"
          />
        </Paper>
      </Section>

      <Section title="Choosing the Right Size">
        <Typography paragraph>
          The width is typically set to 100% so the visualization adapts to the
          width of your container. The height can be adjusted depending on the
          sorting algorithm and your layout.
        </Typography>

        <Typography paragraph>
          A height between 300 and 400 pixels works well for most of the
          algorithms. This provides enough room for the algorithm controls and
          the animated elements without making the page feel cramped.
        </Typography>
        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre style={{ margin: 0 }}>
            {`Recommended Heights:

Algorithm          Suggested Height
──────────────     ────────────────
Most algorithms    300 - 400 px
Merge Sort         400 - 500 px  (extra space for split arrays)
Radix Sort         400 - 500 px  (extra space for bucket display)`}
          </pre>
        </Paper>
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          Embedded visualizers are particularly useful in programming tutorials,
          technical blogs, and educational articles. Instead of describing each
          step in words, you can place the visualization directly after the
          explanation. The explanation provides conceptual clarity, while the
          visualization confirms the behavior visually.
        </Typography>

        <Typography paragraph>
          When used thoughtfully, a simple iframe can transform an article from
          something that merely describes algorithms into something that lets
          readers truly observe and interact with them.
        </Typography>
      </Section>
    </Article>
  );
}
