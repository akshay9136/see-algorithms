import { metaConfigs } from '@/data/configs';
import { SITE_URL } from '@/utils/constants';

export const defaultSeoConfig = {
  title: 'See Algorithms - Interactive Algorithm Visualizations',
  description:
    'Learn algorithms through interactive visualizations. Step-by-step animations for sorting, searching, graph algorithms, and data structures. Perfect for students and educators.',
  canonical: SITE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'See Algorithms',
    title: 'See Algorithms - Interactive Algorithm Visualizations',
    description:
      'Learn algorithms through interactive visualizations. Step-by-step animations for sorting, searching, graph algorithms, and data structures.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1400,
        height: 720,
        alt: 'See Algorithms Visualization',
      },
    ],
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content:
        'algorithms, visualization, sorting, data structures, computer science, programming, education, interactive learning, binary search tree, graph algorithms',
    },
    {
      name: 'author',
      content: 'Akshay Karande',
    },
    {
      property: 'article:author',
      content: `${SITE_URL}/author`,
    },
  ],
  additionalLinkTags: [
    { rel: 'icon', href: '/favicon.png' },
    { rel: 'manifest', href: '/manifest.json' },
  ],
};

export const getSeoConfig = (pageId, pathname) => {
  const config = metaConfigs[pageId];

  if (!config) {
    if (pathname === '/articles') {
      return {
        title: 'Articles (See Algorithms) | Deep-dive into DSA',
        description:
          'Learn about sorting efficiency, self-balancing trees, graph theory, and more through interactive articles and visual guides.',
      };
    }
    return defaultSeoConfig;
  }

  return config;
};
