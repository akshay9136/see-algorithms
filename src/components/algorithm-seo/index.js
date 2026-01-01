import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { getSeoConfig } from './config';
import { algorithms } from '@/common/appData';
import Head from 'next/head';

const AlgorithmSEO = () => {
  const { pathname } = useRouter();
  const algoId = pathname.split('/')[2];
  const { title, description, keywords } = getSeoConfig(algoId);
  const { name: algoName, category } = algorithms.findObj('id', algoId) || {};
  const url = `https://see-algorithms.com${pathname}`;

  const seoConfig = {
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: keywords,
      },
      {
        name: 'article:section',
        content: category,
      },
      {
        name: 'article:tag',
        content: algoName,
      },
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
    teaches: algoName,
    url,
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
