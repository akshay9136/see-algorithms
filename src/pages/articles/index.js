import { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { articles } from '@/common/appData';
import Link from 'next/link';

const tabs = ['All', 'Sorting', 'Graph', 'Data Structures'];

const ArticleList = () => {
  const [activeTab, setActiveTab] = useState(0);

  const filtered =
    activeTab > 0
      ? articles.filter((a) => a.category === tabs[activeTab])
      : articles;

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        textAlign="center"
      >
        Articles
      </Typography>
      <br />
      <Grid container spacing={3}>
        {filtered.map((article) => (
          <Grid item xs={12} sm={4} key={article.id}>
            <ActionCard href={`/articles/${article.id}`} {...article}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  my: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                }}
              >
                {article.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                }}
              >
                {article.summary}
              </Typography>
            </ActionCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const styles = {
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
};

const ActionCard = ({ children, href, category, date }) => {
  const tagColor =
    category === 'Sorting'
      ? 'info'
      : category === 'Graph'
      ? 'error'
      : 'success';

  return (
    <Card elevation={2} sx={styles.card}>
      <CardActionArea component={Link} href={href} sx={{ height: '100%' }}>
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

export default ArticleList;
