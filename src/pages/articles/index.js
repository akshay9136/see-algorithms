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
                sx={{ fontWeight: 700, my: 1 }}
              >
                {article.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
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

const ActionCard = ({ children, href, category, date }) => {
  const tagColor =
    category === 'Sorting'
      ? 'info'
      : category === 'Graph'
      ? 'error'
      : 'success';

  return (
    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
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
