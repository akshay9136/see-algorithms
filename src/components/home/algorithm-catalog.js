import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  GridLegacy as Grid,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  CompareArrows,
  FilterList,
  Search,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { catalogItems } from '@/data/catalog-items';
import { trackEvent } from '@/common/analytics';
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

const categoryMap = {
  sorting: 'Sorting',
  graph: 'Graph',
  'data-structures': 'Data Structures',
  'advanced-trees': 'Advanced Trees',
  other: 'Other',
};

export default function AlgorithmCatalog() {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { asPath } = useRouter();

  useEffect(() => {
    const cat = asPath.split('/')[1].split('#')[0];
    if (categoryMap[cat]) setCategory(categoryMap[cat]);
  }, [asPath]);

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

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(
      () => trackEvent('catalog_search', { search_query: searchQuery }),
      1200,
    );
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCategory = (value) => {
    if (value !== category) {
      trackEvent('catalog_filter', { filter_category: value });
    }
    setCategory(value);
  };

  return (
    <>
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
        setCategory={handleCategory}
      />

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card
          elevation={0}
          sx={{
            padding: 5,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'divider',
            mb: 2,
          }}
        >
          <Search sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.primary" my={0.5}>
            No algorithms match your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2.5}>
            Try clearing the search query or selecting a different category.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              handleCategory('All');
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
          padding: 3,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'divider',
          mt: 5,
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <CompareArrows color="primary" />
          <Typography variant="h6" color="primary.main">
            Side-by-Side Comparison
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
                elevation={1}
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
                    color="text.primary"
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
    </>
  );
}

const styles = {
  comparisonCard: {
    display: 'block',
    padding: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: 'primary.main',
      boxShadow: '0 4px 12px rgba(25,118,210,0.15)',
      transform: 'translateY(-2px)',
    },
  },
};
