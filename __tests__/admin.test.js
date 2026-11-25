import { getServerSession } from 'next-auth/next';
import { getServerSideProps } from '@/pages/admin';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { loadDashboard } from '@/server/admin/analytics';
import { dateInZone, getPeriods } from '@/server/admin/dates';
import { rangeLabel } from '@/components/admin/format';

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
jest.mock('@/pages/api/auth/[...nextauth]', () => ({ authOptions: {} }));
jest.mock('@/server/admin/analytics', () => ({ loadDashboard: jest.fn() }));
jest.mock('@/components/admin/dashboard', () => function Dashboard() { return null; });

beforeEach(() => jest.clearAllMocks());

describe('/admin server access', () => {
  const req = {};
  const res = { setHeader: jest.fn() };
  const query = { days: '7' };

  test.each([null, { user: {} }, { user: { isAdmin: false } }, { user: { isAdmin: 'true' } }])(
    'denies session %p before calling the analytics loader',
    async (session) => {
      getServerSession.mockResolvedValue(session);

      await expect(getServerSideProps({ req, res, query })).resolves.toEqual({ notFound: true });
      expect(getServerSession).toHaveBeenCalledWith(req, res, authOptions);
      expect(loadDashboard).not.toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', expect.stringContaining('no-store'));
    },
  );

  test('loads aggregate data for a server-verified admin with private response headers', async () => {
    getServerSession.mockResolvedValue({ user: { isAdmin: true } });
    loadDashboard.mockResolvedValue({ periods: {} });

    await expect(getServerSideProps({ req, res, query })).resolves.toEqual({ props: { periods: {} } });
    expect(loadDashboard).toHaveBeenCalledWith(query);
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', expect.stringContaining('private'));
    expect(res.setHeader).toHaveBeenCalledWith('X-Robots-Tag', 'noindex, nofollow');
  });
});

describe('reporting periods', () => {
  test('compares inclusive calendar days across a leap day and daylight saving change', () => {
    const { current, previous } = getPeriods(
      { start: '2024-03-09', end: '2024-03-11' },
      '2024-03-12',
    );
    expect(current.dates).toEqual(['2024-03-09', '2024-03-10', '2024-03-11']);
    expect(previous.dates).toEqual(['2024-03-06', '2024-03-07', '2024-03-08']);
    expect(getPeriods({ start: '2024-02-29', end: '2024-02-29' }, '2024-03-12').previous.start)
      .toBe('2024-02-28');
    expect(dateInZone('America/New_York')(new Date('2024-03-12T00:30:00Z')))
      .toBe('2024-03-11');
  });

  test.each([
    { start: '2026-02-30', end: '2026-03-02' },
    { start: ['2026-11-01'], end: '2026-11-09' },
    { start: '2026-11-01', end: '2026-11-25' },
    { start: '2026-01-01', end: '2026-11-24' },
  ])('falls back to the last 14 complete days for %p', (query) => {
    const { error, current, previous } = getPeriods(query, '2026-11-25');
    expect(error).toBeTruthy();
    expect(current).toMatchObject({ start: '2026-11-11', end: '2026-11-24' });
    expect(previous).toMatchObject({ start: '2026-10-28', end: '2026-11-10' });
  });
});

describe('date range formatting', () => {
  test('formats ranges deterministically without ICU-dependent thin spaces', () => {
    expect(rangeLabel({ start: '2026-11-11', end: '2026-11-11' })).toBe('Nov 11, 2026');
    expect(rangeLabel({ start: '2026-11-11', end: '2026-11-24' })).toBe('Nov 11 – 24, 2026');
    expect(rangeLabel({ start: '2026-10-28', end: '2026-11-10' })).toBe('Oct 28 – Nov 10, 2026');
    expect(rangeLabel({ start: '2025-12-28', end: '2026-01-10' })).toBe('Dec 28, 2025 – Jan 10, 2026');
  });
});
