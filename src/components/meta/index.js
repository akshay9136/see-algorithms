import { NextSeo } from 'next-seo';

function Meta({ title, description }) {
  return (
    <NextSeo
      title={`${
        title || 'SEE ALGORITHMS'
      } | Visualization of Algorithms`}
      description={
        description ||
        'Learn basic algorithms by visualzing them through interactive animations.'
      }
      additionalMetaTags={[
        {
          name: 'keywords',
          content: [
            title,
            'algorithms',
            'interactive animations',
            'learning',
            'visualization',
            'sorting',
            'searching',
            'data structures',
            'computer science',
            'programming',
          ].join(),
        },
      ]}
    />
  );
}

export default Meta;
