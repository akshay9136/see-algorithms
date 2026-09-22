import { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { articles } from '@/common/appData';
import Link from 'next/link';

const tabs = [
  'All Articles',
  'Sorting',
  'Graph',
  'Data Structures',
  'Advanced Trees',
];

const styles = {
  container: {
    padding: 0,
    width: '100%',
    maxWidth: { xs: 'calc(100vw - 4rem)' },
  },
  tabsContainer: {
    mt: 3,
    borderBottom: 1,
    borderColor: 'divider',
  },
  tabs: {
    '& .MuiTabs-flexContainer': {
      justifyContent: { xs: 'flex-start', md: 'center' },
    },
    '& .MuiTabs-indicator': { height: 3 },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  card: {
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
      borderColor: 'primary.main',
      boxShadow: 6,
    },
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
  },
  cardTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    my: 1,
  },
  cardDesc: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
  },
};

const Articles = () => {
  const [activeTab, setActiveTab] = useState(0);

  const filtered =
    activeTab > 0
      ? articles.filter((a) => a.category === tabs[activeTab])
      : articles;

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Typography variant="h4" component="h1" textAlign="center">
        Articles on DSA
      </Typography>

      <Box sx={styles.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          aria-label="Filter articles by category"
          sx={styles.tabs}
        >
          {tabs.map((category) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      </Box>

      {filtered.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="body1" color="text.secondary">
            No articles found for this category.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} my={4}>
          {filtered.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <ActionCard href={`/articles/${article.id}`} {...article}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={styles.cardTitle}
                >
                  {article.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={styles.cardDesc}
                >
                  {article.summary}
                </Typography>
              </ActionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

const ActionCard = ({ children, href, category, date }) => {
  const tagColor =
    category === 'Sorting'
      ? 'info'
      : category === 'Graph'
        ? 'warning'
        : category === 'Advanced Trees'
          ? 'secondary'
          : 'success';

  return (
    <Card elevation={2} sx={styles.card}>
      <CardActionArea
        component={Link}
        href={href + `?category=${category}`}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={category}
              size="small"
              color={tagColor}
              variant="outlined"
              sx={{ fontWeight: 'bold', lineHeight: 1.4 }}
            />
            <Typography variant="caption" ml="auto">
              {date}
            </Typography>
          </Box>
          {children}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Articles;
