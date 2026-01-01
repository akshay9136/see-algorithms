import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

const pages = {
  about: {
    title: 'About Us',
    description:
      'Learn about See Algorithms - Our mission to make algorithms accessible through interactive visualizations.',
  },
  contact: {
    title: 'Contact Us',
    description:
      "Get in touch with See Algorithms - We'd love to hear your feedback, questions, or suggestions.",
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Privacy Policy for See Algorithms - Learn how we collect, use, and protect your data.',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Terms of Service for See Algorithms - Learn about the terms and conditions for using our educational platform.',
  },
};

function CustomSeo(props) {
  const { pathname } = useRouter();
  const { title, description } = pages[pathname.slice(1)] || props;

  const url = `https://see-algorithms.com${pathname || ''}`;
  const config = {
    title: title + ' - See Algorithms',
    description,
    canonical: url,
    openGraph: { url, title, description },
  };

  return <NextSeo {...config} />;
}

export default CustomSeo;
