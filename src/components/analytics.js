import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import {
  analyticsEnabled,
  analyticsContext,
  GA_ID,
  hasAnalyticsConsent,
  trackEvent,
} from '@/common/analytics';

function cleanUrl(value) {
  try {
    const url = new URL(value);
    return url.origin + url.pathname;
  } catch {
    return '';
  }
}

export default function Analytics() {
  const router = useRouter();
  const pagePath = router.asPath.split(/[?#]/)[0];
  const { data: session } = useSession();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const update = () => {
      const accepted = analyticsEnabled() && hasAnalyticsConsent();
      window[`ga-disable-${GA_ID}`] = !accepted;
      if (!accepted) {
        window.__seeGaLastPage = null;
        window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      }
      setAllowed(accepted);
    };
    update();
    window.addEventListener('analytics-consent-change', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('analytics-consent-change', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  useEffect(() => {
    if (!allowed || !router.isReady) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    const location = window.location.origin + pagePath;
    const referrer = window.__seeGaPreviousPage || cleanUrl(document.referrer);
    const page = {
      page_location: location,
      page_referrer: referrer,
      page_title: document.title,
    };
    window.gtag('consent', window.__seeGaInitialized ? 'update' : 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    if (!window.__seeGaInitialized) {
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { send_page_view: false, ...page });
      window.__seeGaInitialized = true;
    }
    if (window.__seeGaLastPage === location) return;
    window.gtag('set', page);
    window.gtag('event', 'page_view', {
      ...page,
      ...analyticsContext(pagePath),
      ...(process.env.NEXT_PUBLIC_GA_DEBUG === 'true'
        ? { debug_mode: true }
        : {}),
    });
    window.__seeGaPreviousPage = location;
    window.__seeGaLastPage = location;
  }, [allowed, router.isReady, pagePath]);

  useEffect(() => {
    if (!allowed || !session) return;
    try {
      const pending = JSON.parse(
        sessionStorage.getItem('analytics-login-pending') || 'null',
      );
      if (
        pending &&
        pending.method === session.user?.provider &&
        session.user.analyticsAuthTime &&
        session.user.analyticsAuthTime !== pending.previousAuthTime
      ) {
        const { method } = pending;
        sessionStorage.removeItem('analytics-login-pending');
        trackEvent('login', { method });
        if (session.user.analyticsNewAccount) trackEvent('sign_up', { method });
      }
    } catch {
      /* Optional session storage. */
    }
  }, [allowed, session]);

  return allowed ? (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
  ) : null;
}
