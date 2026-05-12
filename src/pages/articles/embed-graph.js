import { Article, Section } from '@/components/common';
import { Paper, Typography } from '@mui/material';

export default function EmbedGraph() {
  return (
    <Article
      title="Embed Graph Visualizers"
      summary="A practical guide on embedding interactive graph algorithm visualizations into your website, blog, or course materials. Let readers draw graphs, assign weights, and watch traversals and shortest paths unfold step by step."
    >
      <Section title="Why Embed Visualizers?">
        <Typography paragraph>
          Graph algorithms traverse nodes and edges in patterns that are
          difficult to convey through text or static images alone. A written
          description of Dijkstra&apos;s algorithm can explain the logic, but
          watching the shortest path tree grow outward from a source node makes
          the concept immediately intuitive.
        </Typography>

        <Typography paragraph>
          Our graph visualizers are now embeddable. Whether you&apos;re writing
          a blog post, building a lecture deck, or creating an interactive
          tutorial, readers can draw their own graphs, assign weights, pick a
          source node, and watch the algorithm run step by step — without ever
          leaving your page.
        </Typography>
      </Section>

      <Section title="How to Embed">
        <Typography paragraph>
          Each graph algorithm has a dedicated embed page that strips away site
          navigation and content, leaving only the interactive canvas and
          controls. Place the embed URL inside a standard HTML iframe.
        </Typography>

        <Typography paragraph>The URL follows this pattern:</Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: 0 }}>
            {`https://see-algorithms.com/graph/embed/{Algorithm}`}
          </pre>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Algorithms
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: '4px 0' }}>
            {`BFS          - Breadth-First Search
DFS          - Depth-First Search
Dijkstras    - Dijkstra's Shortest Path
Prims        - Prim's Minimum Spanning Tree
Kruskals     - Kruskal's Minimum Spanning Tree
Boruvkas     - Borůvka's Minimum Spanning Tree
TopSort      - Topological Sorting
Hamiltonian  - Hamiltonian Cycle`}
          </pre>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Example
        </Typography>

        <Paper className="algorithm" sx={{ mb: 3 }}>
          <pre style={{ margin: '4px 0' }}>
            {`<iframe
    src="https://see-algorithms.com/graph/embed/BFS"
    width="100%"
    height="600px"
    frameborder="0">
</iframe>`}
          </pre>
        </Paper>

        <Typography paragraph>
          If you&apos;re using a platform like Notion or Medium, pasting the
          embed URL directly will often auto-convert it into an inline embed
          without needing to write any HTML.
        </Typography>
      </Section>

      <Section title="Live Preview" sx={{ minWidth: 600 }}>
        <Typography color="text.secondary" paragraph>
          This is exactly how the embedded visualizer appears on your page:
        </Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <iframe
            src="/graph/embed/BFS"
            width="100%"
            height="600px"
            style={{ border: 'none', display: 'block' }}
            title="Embedded BFS Visualizer"
          />
        </Paper>
      </Section>

      <Section title="Choosing the Right Size">
        <Typography paragraph>
          Graph visualizers need more vertical space than sorting visualizers as
          they include a drawing canvas, node labels, and edge connections.
          Setting the width to 100% ensures the visualization adapts to the
          container, while the height should generally be 600 pixels. Algorithms
          that display auxiliary elements, such as the traversal order in BFS
          and DFS, may benefit from additional height.
        </Typography>
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          A static diagram freezes a single moment of a graph algorithm. An
          embedded visualizer, on the other hand, lets the reader construct a
          graph, choose a starting point, and watch the algorithm unfold across
          every edge and node. This turns a passive reading experience into an
          active exploration.
        </Typography>

        <Typography paragraph>
          Whether you&apos;re illustrating BFS traversal, comparing MST
          strategies, or demonstrating shortest path computation, a simple
          iframe is all it takes to turn abstract graph theory into a tangible,
          interactive experience.
        </Typography>
      </Section>
    </Article>
  );
}
