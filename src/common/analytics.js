// Only bounded, explicitly permitted fields can reach Google Analytics.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-CG2WRZ9YET';

const fields = {
  visualization_start: [],
  visualization_complete: [],
  visualization_control: ['action'],
  validation_failed: ['operation', 'reason'],
  input_modified: ['action'],
  ai_summary_toggled: ['enabled'],
  ai_summary_requested: [],
  ai_summary_succeeded: [],
  ai_summary_failed: ['reason'],
  feature_blocked: ['feature', 'reason'],
  visualization_saved: [],
  visualization_loaded: ['input_source'],
  share_url: [],
  login: ['method'],
  sign_up: ['method'],
  begin_checkout: ['currency', 'value', 'items'],
  checkout_failed: ['reason'],
  catalog_filter: ['filter_category'],
  catalog_search: ['search_query'],
  app_error: ['reason'],
};

export function analyticsEnabled() {
  return (
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_GA_DEBUG === 'true' ||
      (process.env.NODE_ENV === 'production' &&
        ['see-algorithms.com', 'www.see-algorithms.com'].includes(
          window.location.hostname,
        )))
  );
}

export function hasAnalyticsConsent() {
  try {
    return window.localStorage.getItem('analyticsConsent') === 'accepted';
  } catch {
    return false;
  }
}

const categories = ['sorting', 'graph', 'data-structures', 'other'];

export function analyticsContext(pathname) {
  const path = (pathname || window.location.pathname).split(/[?#]/)[0];
  const [, category, segment, embedAlgo] = path.split('/');
  const algoCategory = categories.includes(category) ? category : undefined;
  const algorithmId = algoCategory
    ? segment === 'embed'
      ? embedAlgo
      : segment
    : undefined;
  return algorithmId
    ? { algorithm_id: algorithmId, algorithm_category: category }
    : {};
}

const validText = (value) =>
  typeof value === 'string' && /^[a-zA-Z0-9_.+ /:-]{1,100}$/.test(value);

export function trackEvent(name, params = {}, context) {
  if (
    !Object.hasOwn(fields, name) ||
    !analyticsEnabled() ||
    !hasAnalyticsConsent() ||
    typeof window.gtag !== 'function'
  )
    return false;

  try {
    const safe = {};
    for (const key of fields[name]) {
      const value = params?.[key];
      if (
        typeof value === 'boolean' ||
        (typeof value === 'number' && Number.isFinite(value)) ||
        validText(value)
      ) {
        safe[key] = value;
      }
    }
    window.gtag('event', name, {
      page_location: window.location.origin + window.location.pathname,
      ...analyticsContext(),
      ...context,
      ...safe,
      ...(process.env.NEXT_PUBLIC_GA_DEBUG === 'true'
        ? { debug_mode: true }
        : {}),
    });
    return true;
  } catch {
    // A broken transport or invalid optional payload must not interrupt a product action.
    return false;
  }
}

export function setAnalyticsConsent(accepted) {
  try {
    window.localStorage.setItem(
      'analyticsConsent',
      accepted ? 'accepted' : 'declined',
    );
  } catch {
    /* Storage unavailable. */
  }
  window.dispatchEvent(new Event('analytics-consent-change'));
}

// A run owns its completion signal, including manual stepping and comparisons.
export function trackVisualization(total) {
  const context = analyticsContext();
  const started = trackEvent('visualization_start', {}, context);
  let remaining = total;
  let cancelled = false;
  return {
    wrap(generator) {
      return async function* (...args) {
        try {
          const result = yield* generator(...args);
          if (!cancelled && --remaining === 0) {
            if (started) trackEvent('visualization_complete', {}, context);
            cancelled = true;
          }
          return result;
        } catch (err) {
          cancelled = true;
          throw err;
        }
      };
    },
    control(action) {
      if (cancelled) return;
      trackEvent('visualization_control', { action }, context);
    },
    cancel() {
      cancelled = true;
    },
  };
}
