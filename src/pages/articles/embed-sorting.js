import { Article, Section } from '@/components/common';
import { Typography, Paper } from '@mui/material';

export default function EmbedSorting() {
  return (
    <Article
      title="Embed Sorting Visualizers"
      summary="A quick guide for embedding our high-quality sorting animations into your blog, Notion, or website."
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
          That’s why we’ve made our visualizers embeddable. Whether you’re a
          teacher building course materials on Notion, a student taking notes,
          or a developer writing a technical blog on Medium, you can instantly
          add high-quality, interactive sorting animations directly to your
          content.
        </Typography>

        <Typography>
          By embedding these visualizers, your readers can manually input
          arrays, play, pause, and step through the algorithms directly within
          your page. This significantly enhances the learning experience and
          keeps them engaged without ever having to leave your website.
        </Typography>
      </Section>

      <Section title="How to Embed">
        <Typography paragraph>
          To embed a visualizer, add an <code>{'<iframe>'}</code> tag to your
          HTML and set the <code>src</code> attribute to the appropriate embed
          URL. Each sorting visualizer has a dedicated embed path. The embedded
          visualizer handles its own state, layout, and interactivity without
          taking up unnecessary space.
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Example:
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ padding: '0 24px' }}>
            {`<iframe
    src="https://see-algorithms.com/sorting/embed/MergeSort"
    width="900px"
    height="400px"
    frameborder="0">
</iframe>`}
          </pre>
        </Paper>

        <Typography paragraph>
          Modern editors like Notion or Medium allow you to simply paste the URL
          and it will automatically convert it into an interactive embed.
        </Typography>
      </Section>
    </Article>
  );
}
