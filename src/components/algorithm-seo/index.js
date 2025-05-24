import React from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { getAlgorithmSEO } from './config';
import { algorithms } from '@/common/appData';

const AlgorithmSEO = ({ children, algorithmId, customSEO = {} }) => {
  const router = useRouter();
  const algorithmSEO = getAlgorithmSEO(algorithmId);
  const title = algorithmSEO.title;
  const { name: algoName, category } =
    algorithms.findObj('id', algorithmId) || {};

  const seoConfig = {
    title: customSEO.title || title,
    description: customSEO.description || algorithmSEO.description,
    canonical: `https://see-algorithms.com${router.asPath}`,
    openGraph: {
      title: customSEO.title || title,
      description: customSEO.description || algorithmSEO.description,
      url: `https://see-algorithms.com${router.asPath}`,
      type: 'article',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: customSEO.keywords || algorithmSEO.keywords,
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
    description: algorithmSEO.description,
    educationalLevel: 'Beginner to Advanced',
    learningResourceType: 'Interactive Visualization',
    teaches: algoName,
    url: `https://see-algorithms.com${router.asPath}`,
    provider: {
      '@type': 'Organization',
      name: 'See Algorithms',
      url: 'https://see-algorithms.com',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: ['student', 'teacher'],
    },
    interactivityType: 'active',
    isPartOf: {
      '@type': 'Course',
      name: 'Algorithm Visualization Course',
      description:
        'Interactive course covering various computer science algorithms',
    },
  };

  return (
    <>
      <NextSeo
        {...seoConfig}
        additionalLinkTags={[
          {
            rel: 'canonical',
            href: seoConfig.canonical,
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
};

export default AlgorithmSEO;
