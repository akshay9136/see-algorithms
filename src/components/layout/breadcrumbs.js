import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink } from '@mui/material';
import { Category, Home, NavigateNext } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { SITE_URL } from '@/utils/constants';
import Head from 'next/head';
import Link from 'next/link';

function Breadcrumbs({ category }) {
  const { pathname } = useRouter();
  const _category = pathname.split('/')[1];
  const catalogPath = `/${category == 'Advanced Trees' ? 'advanced-trees' : _category}#algorithm-catalog`;
  const categoryName = category === 'Finding MST' ? 'Graph' : category;

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
        name: categoryName,
        item: `${SITE_URL}${catalogPath}`,
      },
    ],
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <MuiBreadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
        separator={<NavigateNext fontSize="small" />}
      >
        <MuiLink
          component={Link}
          href="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Home sx={{ fontSize: 20 }} />
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          href={catalogPath}
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Category sx={{ fontSize: 20 }} />
          {categoryName}
        </MuiLink>
      </MuiBreadcrumbs>
    </>
  );
}

export default Breadcrumbs;
