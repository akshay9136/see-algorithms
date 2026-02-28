import Article, { Section } from '@/components/article';
import { Typography } from '@mui/material';
import Link from 'next/link';

export default function ShortestPathVsMST() {
  return (
    <Article
      title="Shortest Path vs MST"
      summary='In graph theory, confusion often arises not from complexity, but from similarity. Shortest Path and Minimum Spanning Tree (MST) both deal with weighted graphs. Both aim to "minimize" something. Yet their intentions are fundamentally different.'
    >
      <Section title="The Core Question">
        <Typography paragraph>
          Every algorithm exists to answer a precise question.
        </Typography>

        <Typography paragraph>
          <strong>Shortest Path</strong> asks: What is the minimum cost required
          to go from one specific vertex to another?
        </Typography>

        <Typography paragraph>
          <strong>Minimum Spanning Tree</strong> asks: What is the minimum total
          cost required to connect all vertices together?
        </Typography>

        <Typography paragraph>
          One is concerned with a journey between two points. The other is
          concerned with building an entire network.
        </Typography>
      </Section>

      <Section title="Shortest Path">
        <Typography paragraph>
          Shortest Path algorithms focus on efficiency between specific nodes.
          They do not care about connecting every vertex — only about minimizing
          the cost from a source to a destination.
        </Typography>

        <Typography paragraph>
          When you use <Link href="/graph/Dijkstras">Dijkstra’s algorithm</Link>
          , for example, you are computing the shortest routes from one source
          to all other vertices. But even then, the intention remains
          source-centric.
        </Typography>

        <Typography paragraph>
          In real systems, this appears in routing, navigation, and network
          packet delivery. The goal is directional. There is always a starting
          point. Shortest Path solves: How do I get there efficiently?
        </Typography>
      </Section>

      <Section title="Minimum Spanning Tree">
        <Typography paragraph>
          MST algorithms, such as <Link href="/graph/Prims">Prim’s</Link> or{' '}
          <Link href="/graph/Kruskals">Kruskal’s</Link>, are not interested in
          any particular source or destination. They aim to connect all vertices
          with the minimum possible total edge weight, without forming cycles.
        </Typography>

        <Typography paragraph>
          The result is a tree — a structure with exactly (V − 1) edges. No
          direction. Just minimal connectivity.
        </Typography>

        <Typography paragraph>
          This is useful in infrastructure design: laying cables, building
          roads, or connecting systems where total construction cost must be
          minimized. MST solves: How do I connect everything efficiently?
        </Typography>
      </Section>

      <Section title="Critical Difference">
        <Typography paragraph>
          A shortest path tree minimizes distance from one source. An MST
          minimizes the total weight of all selected edges. These objectives do
          not guarantee the same structure. An edge that is optimal globally may
          not be part of the shortest route from a specific source.
        </Typography>

        <Typography paragraph>Shortest Path:</Typography>

        <Typography component="ul" sx={{ pl: 3 }}>
          <li>May produce different trees for different sources</li>
          <li>Focuses on path distance from one vertex</li>
          <li>Does not aim to minimize total graph weight</li>
        </Typography>

        <Typography paragraph sx={{ mt: 2 }}>
          Minimum Spanning Tree:
        </Typography>

        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Single tree covering all vertices</li>
          <li>Minimizes total edge weight</li>
          <li>Independent of any source vertex</li>
        </Typography>
      </Section>

      <Section title="Practical Insight">
        <Typography paragraph>
          If your system needs optimal routing from a central node — think
          Shortest Path. If your system needs cost-efficient infrastructure
          connecting everything — think Minimum Spanning Tree.
        </Typography>
      </Section>
    </Article>
  );
}
