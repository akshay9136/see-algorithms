import { algorithms } from '@/common/appData';
import { getAlgorithmPath } from '@/data/catalog-items';
import db from '@/utils/firebase-utils';
import { addDays, dateInZone, datePosition, getPeriods } from './dates';
import { eventReport, getGa4, getReportingZone, inList } from './ga4';

// Earliest production activity verified for the custom product events.
const PRODUCT_TRACKING_START = '2026-10-20';

const VISUAL_EVENTS = {
  page_view: 'views',
  visualization_start: 'starts',
  visualization_complete: 'finishes',
  validation_failed: 'validations',
  input_modified: 'edits',
  visualization_loaded: 'loads',
  share_url: 'shares',
};
const FEATURE_EVENTS = {
  ai_summary_requested: 'requests',
  ai_summary_succeeded: 'successes',
  ai_summary_failed: 'failures',
  feature_blocked: 'blocked',
};
const TREND_KEYS = ['views', 'starts', 'finishes', 'validations'];
const MAX_DOCUMENTS = 10_000;
const visualizers = algorithms.map(({ id, name, category, path }) => ({
  id, name, category, path: getAlgorithmPath({ id, category, path }),
}));
const catalogIds = new Set(visualizers.map(({ id }) => id));
const paths = new Map();
for (const { id, path } of visualizers) {
  const variants = [path];
  if (!path.startsWith('/other/')) variants.push(path.replace(/^(\/[^/]+)\//, '$1/embed/'));
  for (const variant of variants) {
    for (const spelling of new Set([variant, variant.replace(/\+/g, '%2B')])) {
      paths.set(spelling.toLowerCase(), id);
      paths.set(`${spelling.toLowerCase()}/`, id);
    }
  }
}

function periodValues(periods, issue, since) {
  return [periods.current, periods.previous].map(({ dates }) =>
    dates.map((date) => issue || (since && date < since) ? null : 0),
  );
}

function sums(series) {
  return series.map((values) =>
    values.includes(null) ? null : values.reduce((total, value) => total + value, 0),
  );
}

function dateFromGa(date) {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

function summarizeVisualizers(report, periods) {
  const makeBucket = () => ({
    events: Object.fromEntries(Object.values(VISUAL_EVENTS).map((key) => [
      key,
      periodValues(periods, report.issue, key === 'views' ? null : PRODUCT_TRACKING_START),
    ])),
    devices: new Map(),
  });
  const overall = makeBucket();
  const buckets = new Map(visualizers.map(({ id }) => [id, makeBucket()]));

  for (const [date, path, event, device, count] of report.rows) {
    const key = VISUAL_EVENTS[event];
    const bucket = buckets.get(paths.get(path.toLowerCase()));
    const position = datePosition(dateFromGa(date), periods);
    if (!bucket || !key || !position) continue;
    const [period, day] = position;
    for (const target of [overall, bucket]) {
      const series = target.events[key][period];
      if (series[day] === null) continue;
      series[day] += count;
      if (key !== 'views' && key !== 'validations') continue;
      const label = ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'other';
      if (!target.devices.has(label)) {
        target.devices.set(label, { label, views: [0, 0], validations: [0, 0] });
      }
      target.devices.get(label)[key][period] += count;
    }
  }

  function summarize({ events, devices }) {
    const totals = Object.fromEntries(Object.entries(events).map(([key, series]) => [key, sums(series)]));
    return {
      totals,
      trend: Object.fromEntries(TREND_KEYS.map((key) => [key, events[key]])),
      devices: [...devices.values()].map(({ label, views, validations }) => ({
        label,
        views,
        validations: validations.map((value, index) => totals.validations[index] === null ? null : value),
      })),
    };
  }

  return {
    issue: report.issue,
    overall: summarize(overall),
    visualizers: visualizers.map((visualizer) => ({
      ...visualizer, ...summarize(buckets.get(visualizer.id)),
    })),
  };
}

function summarizeFeatureEvents(report, periods) {
  const events = Object.fromEntries(Object.values(FEATURE_EVENTS).map((key) => [
    key, periodValues(periods, report.issue, PRODUCT_TRACKING_START),
  ]));
  for (const [date, event, count] of report.rows) {
    const position = datePosition(dateFromGa(date), periods);
    if (!position) continue;
    const [period, day] = position;
    const series = events[FEATURE_EVENTS[event]][period];
    if (series[day] !== null) series[day] += count;
  }
  return Object.fromEntries(Object.entries(events).map(([key, trend]) => [
    key, { trend, totals: sums(trend), issue: report.issue },
  ]));
}

async function loadGaReport(request, label, run) {
  if (!request) return { issue: 'GA4 reporting credentials are missing or invalid.', rows: [] };
  try {
    return await run(request);
  } catch {
    console.warn(`Admin analytics: GA4 ${label} report failed.`);
    return { issue: 'GA4 could not load this report. Try again in a few minutes.', rows: [] };
  }
}

async function loadAppActivity(collection, periods, dateForZone) {
  let issue = db ? null : 'Firestore is not configured.';
  let docs = [];
  if (db) {
    let timeout;
    try {
      // Widen the UTC query to cover any reporting zone, then bucket by local day.
      const query = db.collection(collection)
        .where('createdAt', '>=', `${addDays(periods.previous.start, -1)}T00:00:00.000Z`)
        .where('createdAt', '<', `${addDays(periods.current.end, 2)}T00:00:00.000Z`)
        .select('createdAt', 'algoId')
        .limit(MAX_DOCUMENTS + 1);
      const snapshot = await Promise.race([
        query.get(),
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error('Report timed out')), 8_000);
        }),
      ]);
      if (snapshot.size > MAX_DOCUMENTS) {
        issue = 'Too many Firestore records for this range. Choose a shorter range.';
      } else {
        docs = snapshot.docs;
      }
    } catch {
      console.warn(`Admin analytics: Firestore ${collection} report failed.`);
      issue = 'Firestore could not load this report. Try again in a few minutes.';
    } finally {
      clearTimeout(timeout);
    }
  }

  const trend = periodValues(periods, issue);
  const byAlgorithm = new Map();
  for (const doc of docs) {
    const { createdAt, algoId } = doc.data();
    const timestamp = Date.parse(createdAt);
    if (!Number.isFinite(timestamp)) continue;
    const position = datePosition(dateForZone(timestamp), periods);
    if (!position) continue;
    const [period, day] = position;
    trend[period][day]++;
    const id = catalogIds.has(algoId) ? algoId : null;
    if (!byAlgorithm.has(id)) byAlgorithm.set(id, [0, 0]);
    byAlgorithm.get(id)[period]++;
  }

  return {
    issue,
    trend,
    totals: sums(trend),
    byAlgorithm: [...byAlgorithm].map(([id, totals]) => ({ id, totals })),
  };
}

export async function loadDashboard(query, now = new Date()) {
  const request = getGa4();
  let timeZone = null;
  if (request) {
    try {
      timeZone = await getReportingZone(request);
    } catch {
      console.warn('Admin analytics: GA4 reporting time zone lookup failed.');
    }
  }
  const dateForZone = dateInZone(timeZone || 'UTC');
  const periods = getPeriods(query, dateForZone(now));
  // Keep the period boundaries consistent across sources when the property zone is unknown.
  const gaForPeriods = (label, run) => request && !timeZone
    ? Promise.resolve({ issue: 'GA4 reporting time zone is unavailable.', rows: [] })
    : loadGaReport(request, label, run);
  const [visualReport, featureReport, charges, saves] = await Promise.all([
    gaForPeriods('visualizer', (ga) => eventReport(
      ga, periods, ['date', 'pagePath', 'eventName', 'deviceCategory'],
      Object.keys(VISUAL_EVENTS), [inList('pagePath', [...paths.keys()])],
    )),
    gaForPeriods('feature', (ga) => eventReport(
      ga, periods, ['date', 'eventName'], Object.keys(FEATURE_EVENTS),
    )),
    loadAppActivity('creditsUsed', periods, dateForZone),
    loadAppActivity('savedData', periods, dateForZone),
  ]);

  return {
    periods,
    timeZone: timeZone || 'UTC',
    usingUtcFallback: !timeZone,
    trackingStart: PRODUCT_TRACKING_START,
    visual: summarizeVisualizers(visualReport, periods),
    features: { ...summarizeFeatureEvents(featureReport, periods), charges, saves },
  };
}
