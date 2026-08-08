import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { getSeoConfig } from './config';
import { algorithms } from '@/common/appData';
import { SITE_URL } from '@/utils/constants';
import Head from 'next/head';

const AlgorithmSEO = () => {
  const router = useRouter();
  const { pathname, query, asPath } = router;
  const cleanPath = asPath.split('?')[0].split('#')[0];
  const url = SITE_URL + (cleanPath === '/' ? '' : cleanPath);

  const isEmbed = pathname.includes('/embed/');
  const pageId = isEmbed
    ? query.algorithm || query.dataStructure
    : pathname.split('/')[2];
  const { title, description } = getSeoConfig(pageId, pathname);
  const { name, category } = algorithms.findObj('id', pageId) || {};

  const seoConfig = {
    title,
    description,
    canonical: url,
    openGraph: { title, description, url, type: 'article' },
    additionalMetaTags: [
      { name: 'article:section', content: category },
      { name: 'article:tag', content: name },
    ],
  };

  // Structured Data for Algorithm
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'LearningResource'],
    name: title,
    description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    educationalLevel: 'Beginner to Advanced',
    learningResourceType: 'Interactive Visualization',
    educationalUse: ['learning', 'demonstration'],
    teaches: name || title,
    featureList: 'Interactive algorithm visualization, step-by-step execution, customizable input data',
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: 'Akshay Karande',
      url: `${SITE_URL}/about`,
      sameAs: [
        'https://github.com/akshay9136',
        'https://www.linkedin.com/in/akshay-karande-365604130/',
      ],
    },
    creator: {
      '@type': 'Person',
      name: 'Akshay Karande',
      url: 'https://github.com/akshay9136',
    },
    publisher: {
      '@type': 'Organization',
      name: 'See Algorithms',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    provider: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'See Algorithms',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: ['https://github.com/akshay9136/see-algorithms'],
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: ['student', 'teacher'],
    },
    interactivityType: 'active',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'See Algorithms',
      url: SITE_URL,
    },
  };

  return (
    <>
      <NextSeo {...seoConfig} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  );
};

export default AlgorithmSEO;
