import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { SITE_URL } from '@/utils/constants';

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
  'refund-policy': {
    title: 'Refund Policy',
    description:
      'Refund Policy for See Algorithms - Learn about our refund eligibility, process, and timeline.',
  },
};

function CustomSeo(props) {
  const router = useRouter();
  const { pathname, asPath } = router;
  const { title, description } = pages[pathname.slice(1)] || props;

  const cleanPath = asPath.split('?')[0].split('#')[0];
  const url = SITE_URL + (cleanPath === '/' ? '' : cleanPath);
  const config = {
    title: title + ' - See Algorithms',
    description,
    canonical: url,
    openGraph: { url, title, description },
  };

  return <NextSeo {...config} />;
}

export default CustomSeo;
