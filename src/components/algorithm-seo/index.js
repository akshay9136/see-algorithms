import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { getSeoConfig } from './config';
import { algorithms } from '@/common/appData';
import Head from 'next/head';

const AlgorithmSEO = () => {
  const { pathname, query } = useRouter();
  const isEmbed = pathname.includes('/embed/');
  const pageId = isEmbed
    ? query.algorithm || query.dataStructure
    : pathname.split('/')[2];
  const { title, description } = getSeoConfig(pageId, pathname);
  const { name, category } = algorithms.findObj('id', pageId) || {};
  const url = 'https://see-algorithms.com' + pathname;

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
    '@type': 'LearningResource',
    name: title,
    description,
    educationalLevel: 'Beginner to Advanced',
    learningResourceType: 'Interactive Visualization',
    educationalUse: ['learning', 'demonstration'],
    teaches: name,
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: 'Akshay Karande',
      url: 'https://see-algorithms.com/about',
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
      url: 'https://see-algorithms.com',
    },
    provider: {
      '@type': 'Organization',
      name: 'See Algorithms',
      sameAs: 'https://see-algorithms.com',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: ['student', 'teacher'],
    },
    interactivityType: 'active',
    isPartOf: {
      '@type': 'WebSite',
      name: 'See Algorithms',
      url: 'https://see-algorithms.com',
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
