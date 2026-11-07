import { trackEvent } from '@/common/analytics';

const SESSION_KEY = 'checkoutParams';

function saveCheckoutParams(params) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(params));
  } catch {
    /* storage unavailable */
  }
}

function popCheckoutParams() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const PAYPAL_RETURN_EVENTS = {
  SUCCESS: (params) => trackEvent('purchase', params),
  CANCELLED: (params) => trackEvent('checkout_cancelled', params),
  FAILED: (params) =>
    trackEvent('checkout_failed', { ...params, reason: 'payment_declined' }),
  ERROR: (params) =>
    trackEvent('checkout_failed', { ...params, reason: 'capture_error' }),
};

// Fires the correct GA event on PayPal's return page, using params saved before the redirect.
export function trackPaypalReturn(paymentStatus) {
  const handler = PAYPAL_RETURN_EVENTS[paymentStatus];
  if (handler) handler(popCheckoutParams());
}

// Fires checkout_started and returns pre-bound trackers for the rest of the funnel.
export function beginCheckout(plan, currency) {
  const checkoutParams = {
    currency,
    value: currency === 'USD' ? plan.usd : plan.inr,
    plan_id: plan.id,
    credits: plan.credits,
    payment_method: currency === 'USD' ? 'paypal' : 'cashfree',
  };

  trackEvent('checkout_started', checkoutParams);

  return {
    saveForReturn: () => saveCheckoutParams(checkoutParams),
    trackProgress: () => trackEvent('checkout_progress', checkoutParams),
    trackCancelled: () => trackEvent('checkout_cancelled', checkoutParams),
    trackPurchase: () => trackEvent('purchase', checkoutParams),
    trackFailed: (reason) =>
      trackEvent('checkout_failed', { ...checkoutParams, reason }),
  };
}
