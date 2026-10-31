import {
  Box,
  Breadcrumbs,
  Container as MuiContainer,
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
import { articles } from '@/data/articles';
import { SITE_AUTHOR, SITE_URL } from '@/utils/constants';
import { memo, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import AdUnit from '../ad-unit';
import Head from 'next/head';
import NextLink from 'next/link';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const adStyle = {
  width: 160,
  flexShrink: 0,
  alignSelf: 'flex-start',
  position: 'sticky',
  top: '50%',
  transform: 'translateY(-50%)',
};

function Container({ children }) {
  const { pathname } = useRouter();
  const showAds = useMediaQuery('(min-width:1200px)');

  return (
    <Box display="flex">
      {showAds && (
        <AdUnit
          key={`left-${pathname}`}
          format="vertical"
          fullWidth={false}
          sx={adStyle}
        />
      )}
      <MuiContainer maxWidth="md" sx={{ p: 0 }} className="article">
        {children}
      </MuiContainer>
      {showAds && (
        <AdUnit
          key={`right-${pathname}`}
          format="vertical"
          fullWidth={false}
          sx={adStyle}
        />
      )}
    </Box>
  );
}

function Article({ title, summary, children }) {
  const router = useRouter();
  const articleId = router.pathname.split('/').pop();
  const { category, date } = articles.find((a) => a.id === articleId) || {};

  const pageUrl = `${SITE_URL}/articles/${articleId}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: summary,
    url: pageUrl,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-title', '.article-summary'],
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

  const { pathname } = router;

  useEffect(() => {
    const query = { category };
    router.replace({ pathname, query }, undefined, { shallow: true });
  }, [category, pathname]);

  return (
    <Container>
      <NextSeo
        title={`${title} - See Algorithms`}
        description={summary}
        canonical={pageUrl}
        openGraph={{
          url: pageUrl,
          title: `${title} - See Algorithms`,
          description: summary,
          type: 'article',
          article: {
            publishedTime: date,
            modifiedTime: date,
            section: category,
            authors: [SITE_AUTHOR.name],
          },
        }}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 2.5 }}
        separator={<NavigateNext fontSize="small" />}
      >
        <MuiLink
          component={NextLink}
          href="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Home sx={{ fontSize: 20 }} />
          Home
        </MuiLink>
        <MuiLink
          component={NextLink}
          href="/articles"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ArticleIcon sx={{ fontSize: 18 }} />
          Articles
        </MuiLink>
      </Breadcrumbs>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="warning.main"
        className="article-title"
        fontSize="1.65rem !important"
      >
        {title}
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        paragraph
        className="article-summary"
      >
        {summary}
      </Typography>

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
  const { component, sx } = props;
  return (
    <Typography
      paragraph
      component={component || 'ul'}
      sx={{ '& li': { mb: 1 }, ...sx }}
    >
      {props.children}
    </Typography>
  );
});
