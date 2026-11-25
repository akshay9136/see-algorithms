import { JWT } from 'google-auth-library';
import { SITE_URL } from '@/utils/constants';

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const LIMIT = 100_000;
const TIMEOUT = 8_000;
const host = new URL(SITE_URL).hostname;
const hostFilter = inList('hostName', [host, `www.${host}`]);
let credentials;
let reportingZone;

export function inList(fieldName, values) {
  return { filter: { fieldName, inListFilter: { values, caseSensitive: false } } };
}

export function getGa4() {
  const { GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY } = process.env;
  if (!/^\d+$/.test(GA4_PROPERTY_ID ?? '') || !GA4_CLIENT_EMAIL || !GA4_PRIVATE_KEY) {
    return null;
  }
  if (!credentials) {
    credentials = new JWT({
      email: GA4_CLIENT_EMAIL,
      key: GA4_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [SCOPE],
      transporterOptions: { timeout: TIMEOUT },
    });
  }
  const base = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}`;

  return async function request(path, body) {
    const { token } = await credentials.getAccessToken();
    const response = await fetch(base + path, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`GA4 HTTP ${response.status}`);
    return response.json();
  };
}

export async function getReportingZone(request) {
  if (reportingZone?.expires > Date.now()) return reportingZone.value;
  const { metadata } = await request(':runReport', {
    dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
    metrics: [{ name: 'eventCount' }],
  });
  const value = metadata?.timeZone;
  if (!value) throw new Error('Missing GA4 reporting time zone');
  // Validate the property time zone before sharing it with the date controls.
  new Intl.DateTimeFormat('en', { timeZone: value });
  reportingZone = { value, expires: Date.now() + 15 * 60_000 };
  return value;
}

export async function eventReport(request, periods, dimensions, events, filters = []) {
  const { rows = [], rowCount = 0, metadata = {} } = await request(':runReport', {
    dateRanges: [{ startDate: periods.previous.start, endDate: periods.current.end }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: { andGroup: { expressions: [hostFilter, inList('eventName', events), ...filters] } },
    limit: String(LIMIT),
  });

  if (
    metadata.subjectToThresholding ||
    metadata.dataLossFromOtherRow ||
    metadata.samplingMetadatas?.length ||
    metadata.schemaRestrictionResponse?.activeMetricRestrictions?.length ||
    metadata.dataTruncationReasons?.length ||
    rowCount > rows.length
  ) {
    return { issue: 'GA4 returned an incomplete report for this range.', rows: [] };
  }

  return {
    issue: null,
    rows: rows.map(({ dimensionValues, metricValues }) => [
      ...dimensionValues.map(({ value }) => value),
      Number(metricValues[0].value),
    ]),
  };
}
