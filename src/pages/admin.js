import { getServerSession } from 'next-auth/next';
import { NextSeo } from 'next-seo';
import Dashboard from '@/components/admin/dashboard';
import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.isAdmin !== true) return { notFound: true };

  const { loadDashboard } = await import('@/server/admin/analytics');
  return { props: await loadDashboard(query) };
}

export default function AdminPage(props) {
  return (
    <>
      <NextSeo title="Product analytics | See Algorithms" noindex nofollow />
      <Dashboard {...props} />
    </>
  );
}

AdminPage.noLayout = true;
