import { useMemo, useState } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import {
  ArrowForward,
  CompareArrows,
  FilterList,
  Search,
} from '@mui/icons-material';
import { catalogItems } from '@/data/algo-catalog';
import AlgorithmCard from './algorithm-card';
import SearchBar from './search-bar';
import Link from 'next/link';

const COMPARISONS = [
  {
    name: 'BFS vs DFS',
    path: '/graph/bfs-vs-dfs',
    desc: 'Breadth vs Depth traversal',
  },
  {
    name: 'AVL Tree vs Red-Black Tree',
    path: '/data-structures/avl-tree-vs-rbt',
    desc: 'Strict vs relaxed balancing',
  },
  {
    name: 'B-Tree vs B+ Tree',
    path: '/data-structures/b-tree-vs-b+tree',
    desc: 'Internal vs leaf range scans',
  },
];

export default function AlgoCatalog() {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter algorithms by category and search query
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return catalogItems.filter((algo) => {
      const matches = category === 'All' || algo.category === category;
      if (!matches) return false;
      if (!query) return true;
      const searchable =
        `${algo.name} ${algo.category} ${algo.timeComplexity} ${algo.difficulty} ${algo.description}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [searchQuery, category]);

  return (
    <Box id="algorithm-catalog">
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <FilterList color="warning" sx={{ fontSize: 32 }} />
          <Typography variant="h5" component="h2">
            Algorithm Catalog
          </Typography>
        </Box>
        <Typography color="text.secondary">
          Browse all 30+ interactive visualizations. Search by name, category,
          or complexity to find the exact algorithm you need.
        </Typography>
      </Box>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        setCategory={setCategory}
      />

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 2,
            padding: 5,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'grey.300',
            bgcolor: 'grey.50',
          }}
        >
          <Search sx={{ fontSize: 40, color: 'text.secondary' }} />

          <Typography variant="h6" color="grey.800" my={0.5}>
            No algorithms match your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2.5}>
            Try clearing the search query or selecting a different category.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setCategory('All');
              setSearchQuery('');
            }}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Clear Search & Filters
          </Button>
        </Card>
      )}

      <Grid container spacing={2.5}>
        {filtered.map((algo) => (
          <Grid item xs={12} sm={6} lg={4} key={algo.id}>
            <AlgorithmCard algo={algo} />
          </Grid>
        ))}
      </Grid>

      {/* Comparisons */}
      <Box
        sx={{
          mt: 5,
          padding: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.300',
          bgcolor: 'grey.50',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <CompareArrows color="primary" />
          <Typography variant="h6" color="primary.main">
            Compare Algorithms Side-by-Side
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          See two algorithms run simultaneously on identical inputs to compare
          trade-offs:
        </Typography>

        <Grid container spacing={2}>
          {COMPARISONS.map((comp) => (
            <Grid item xs={12} md={4} key={comp.path}>
              <Card
                component={Link}
                href={comp.path}
                elevation={0}
                sx={styles.comparisonCard}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="grey.900"
                    mb={0.5}
                  >
                    {comp.name}
                  </Typography>
                  <ArrowForward fontSize="small" color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {comp.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

const styles = {
  comparisonCard: {
    display: 'block',
    padding: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'grey.300',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: 'primary.main',
      boxShadow: '0 4px 12px rgba(25,118,210,0.15)',
      transform: 'translateY(-2px)',
    },
  },
};
