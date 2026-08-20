import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import {
  Article as ArticleIcon,
  CalendarToday,
  Home,
  NavigateNext,
  Person,
} from '@mui/icons-material';
import Head from 'next/head';
import NextLink from 'next/link';
import { memo } from 'react';
import { useRouter } from 'next/router';
import { SITE_AUTHOR, SITE_URL } from '@/utils/constants';
import { articles } from '@/common/appData';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function Article({ title, summary, children }) {
  const router = useRouter();
  const articleId = router.pathname.split('/').pop();
  const { date } = articles.find((a) => a.id === articleId) || {};
  const pageUrl = `${SITE_URL}/articles/${articleId}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: summary,
    url: pageUrl,
    datePublished: date,
    SITE_AUTHOR: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${SITE_URL}/articles`,
      },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ p: 0 }} className="article">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 3, lineHeight: 1.3 }}
        separator={<NavigateNext fontSize="small" />}
      >
        <MuiLink
          component={NextLink}
          href="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home sx={{ fontSize: 18 }} />
          Home
        </MuiLink>
        <MuiLink
          component={NextLink}
          href="/articles"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <ArticleIcon sx={{ fontSize: 16 }} />
          Articles
        </MuiLink>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom color="warning.main">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        {summary}
      </Typography>

      {(SITE_AUTHOR || date) && (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 1,
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          <Box display="flex" gap={1}>
            <Person sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight={600}>
              {SITE_AUTHOR.name}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <CalendarToday sx={{ fontSize: 16, mt: 0.15 }} />
            <Typography variant="body2">{formatDate(date)}</Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />
      {children}
    </Container>
  );
}

export default memo(Article);

export const Section = memo(function (props) {
  const { title, children, variant = 'h5', sx } = props;
  return (
    <Box
      component="section"
      textAlign="justify"
      minWidth={300}
      mb={variant === 'h5' ? 4 : 3}
      sx={{ flex: 1, ...sx }}
    >
      <Typography variant={variant} component="h2" mb={1.5}>
        {title}
      </Typography>
      {children}
    </Box>
  );
});

export const ListItems = memo(function (props) {
  return (
    <Typography paragraph component="ul" sx={{ '& li': { mb: 1 } }}>
      {props.children}
    </Typography>
  );
});
