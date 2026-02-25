import { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';

const articles = [
  {
    id: 'why-sorting-matters',
    title: 'Why Sorting is Important',
    summary:
      'Understanding why sorting matters is more important than memorizing how sorting works.',
    category: 'Sorting',
    date: '2026-02-24',
  },
  {
    id: 'inplace-sorting',
    title: 'In-place Sorting',
    summary:
      'Understand how in-place sorting algorithms minimize extra space while reorganizing data.',
    category: 'Sorting',
    date: '2026-02-24',
  },
  {
    id: 'stable-sorting',
    title: 'Stable Sorting',
    summary:
      'Understand the importance of maintaining original order when sorting data with duplicate keys.',
    category: 'Sorting',
    date: '2026-02-25',
  },
];

const tabs = ['All', 'Sorting', 'Graph', 'Data Structures'];

const ArticleList = () => {
  const [activeTab, setActiveTab] = useState(0);

  const filtered =
    activeTab > 0
      ? articles.filter((a) => a.category === tabs[activeTab])
      : articles;

  return (
    <Stack spacing={3}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
      >
        Articles
      </Typography>

      {/* <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
            },
            width: 'max-content',
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
      </Box> */}

      {filtered.map((article) => (
        <Card
          key={article.id}
          elevation={1}
          sx={{
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: 4,
            },
          }}
        >
          <CardActionArea component={Link} href={`/articles/${article.id}`}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Chip
                  label={article.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'bold', lineHeight: 1.4 }}
                />
                <Typography variant="caption" color="text.disabled">
                  {article.date}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 700, my: 1 }}
              >
                {article.title}
              </Typography>
              <Typography
                variant="body2"
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
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
};

export default ArticleList;
