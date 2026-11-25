# Admin analytics

Sign in to See Algorithms with an allowlisted account and open **Product analytics** in the account menu, or visit `/admin`. The page checks the existing NextAuth session on every server request. Anonymous and non-admin visitors receive a 404, including when they request the Next.js page data directly.

## Setup

1. Set `ADMIN_EMAILS` to the comma-separated email addresses used by the existing NextAuth check. Match the session email exactly and omit spaces around delimiters. Use the app's existing NextAuth provider, URL, and secret configuration.
2. Enable the **Google Analytics Data API** in the service account's Google Cloud project. In GA4 **Property access management**, add the service account as a **Viewer** for the See Algorithms property.
3. Set these server environment variables in the deployment and in `.env.local` for local development.
   - `GA4_PROPERTY_ID` is the numeric GA4 property ID.
   - `GA4_CLIENT_EMAIL` is the service account email.
   - `GA4_PRIVATE_KEY` is its PEM private key. Both literal and escaped newlines work.
4. Set the app's existing `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` for the Firestore reports. The dashboard reads only `createdAt` and `algoId` from `creditsUsed` and `savedData`.

Keep service credentials in server environment variables. The server exchanges the GA4 credentials for an `analytics.readonly` access token. Only aggregate counts and catalog metadata are serialized into the admin page. The route sends private, no-store and noindex headers and is excluded from the sitemap. The dashboard page omits public ad and analytics scripts.

## Metric definitions

| Metric | Source and scope |
| --- | --- |
| Visualizer views, starts, and finishes | GA4 event counts on catalog routes under the production hostnames, including recognized comparison and embed routes. A comparison run emits one finish when all its animations finish. |
| Finishes per 100 starts | Finish events ÷ start events × 100 for the same scope and calendar period. The denominator is the number of start events. A finish can land in a later period, and a person can start several runs. |
| Validation events | GA4 checks that blocked an attempt or stopped an operation. The device drill-down divides validation events by page views on the same visualizer and device, then multiplies by 100. A zero denominator yields an unavailable ratio. |
| Input edits, inputs loaded, shares | GA4 `input_modified`, `visualization_loaded`, and `share_url` events. Load counts combine saved, shared, and example inputs where tracked. Share counts reflect the tracked share action. |
| AI requests, successes, failures | GA4 client events from the production sites. Success is emitted after the browser reads the summary stream. User-aborted requests skip the failure event. |
| Feature blocks | GA4 sign-in and credit gates across saving and AI. An insufficient-credits response can produce both a block and an AI failure. |
| AI summaries charged | Firestore `creditsUsed` records written when a summary charge commits, including usage without GA4 consent. |
| Saved visualizations | Firestore `savedData` documents created in the period and still present. Deletions can change a past count. |

Date filters use inclusive calendar dates through yesterday in the GA4 property's reporting time zone. The comparison immediately precedes the selected range and contains the same number of days. The dashboard defaults to the last 14 complete days and caps selections at 90 days. It uses UTC for available Firestore reports if the property time zone is unavailable. GA4 can take time to process recent activity.

A successful report with no recorded events shows zero. Missing credentials, failed queries, incomplete GA4 reports (sampling, thresholding, or row loss), and missing tracking coverage show **Unavailable**. October 20, 2026 was the first verified day of production visualization tracking. The custom event period totals require every day to be on or after that date. Charts can display covered days independently.

## Audit and tracking gaps

- The November 25, 2026 live audit found active visualization, input, validation, share, save/load, sign-in, catalog, AI, and feature-gate events. Playback and validation counts were the strongest signals for comparing visualizers. The dashboard joins built-in GA4 page paths and device categories to the app catalog, so these views work without registered algorithm dimensions.
- The property exposes `operation`, `reason`, `payment_method`, and `plan_id` as event-scoped custom dimensions. During the audit, validation, gate, and AI-failure reports returned only `(not set)` for the requested reason or operation breakdown. The dashboard uses event counts and device context. Verify that live events populate the registered dimensions before using them to diagnose cause. **Feature**, example source, and control action would need usable event-scoped dimensions for richer splits.
- From October 28 through November 24, 2026, Firestore recorded 74 summary charges and 65 retained saves. GA4 reported 13 summary successes. The sources have different coverage and recording points. The dashboard shows them alongside each other as separate counts and uses Firestore for by-visualizer charges and retained saves.
- GA4 returned no checkout events in the 90-day audit, and the app had only a few recent provider records. Checkout tracking has no shared attempt identifier, and PayPal browser returns depend on tab storage and consent. The app's provider records do not label sandbox versus live. Use provider records to verify individual payments and validate production checkout telemetry before adding a checkout journey.
- The emitted playback events have no run ID in GA4. A start and finish can be counted, but aggregated counts do not reconstruct ordered runs. The dashboard uses comparisons and omits funnels. For attempt-level analysis, start by defining correlation and cancellation semantics and a source that preserves event order.
- The existing daily job's sign-in count is based on the latest `lastSignIn` stored for each account. That field is overwritten on subsequent sign-ins. The dashboard omits it as a historical engagement measure. The summary feedback counters are cumulative and lack timestamps for date comparison.

See the [GA4 Data API setup guide](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart) and [GA4 reporting data expectations](https://developers.google.com/analytics/devguides/reporting/data/v1/reporting-data-expectations).
