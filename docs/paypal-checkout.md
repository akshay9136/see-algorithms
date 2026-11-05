# PayPal USD checkout

`/buy-credits` uses Cashfree for INR and PayPal-hosted checkout for USD.
PayPal uses the Orders v2 API; no browser SDK or PayPal npm dependency is needed.

## Configuration

Add these server-side variables to `.env.local` and your hosting environment:

```dotenv
PAYPAL_CLIENT_ID=your_sandbox_app_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_app_secret
PAYPAL_MERCHANT_ID=your_sandbox_business_account_merchant_id
PAYPAL_WEBHOOK_ID=your_sandbox_app_webhook_id
PAYPAL_ENV=sandbox
# Optional: defaults to https://see-algorithms.com
PAYPAL_RETURN_BASE_URL=http://localhost:3000
```

The merchant ID identifies the receiving business account, not its email or app
ID. `PAYPAL_ENV` must explicitly be `sandbox` or `live`, independently of
`NODE_ENV`. No `NEXT_PUBLIC_` variables are needed. Missing credentials make
PayPal order creation unavailable; Cashfree continues to work.

Set `PAYPAL_RETURN_BASE_URL` to the site where you are testing, such as localhost
or your HTTPS preview domain. Use the production site URL when going live.
Never use a client-supplied URL or untrusted Host header for checkout callbacks.

For an Indian merchant account, finish PayPal's account verification and use
PayPal for international customers. Indian domestic customers should use INR.

## Checkout flow

1. The signed-in buyer selects a plan and USD, then clicks Buy Now.
2. The server snapshots the plan's price and credits, creates a PayPal order,
   and returns PayPal's approval URL. The browser redirects to that URL.
3. PayPal returns the buyer to `/buy-credits?paypal=approved&orderId=...`.
4. The page's server handler checks the session and order ownership, captures
   payment through PayPal, and shows the verified result. Expired sessions get
   a Sign in action that preserves the original return URL.
5. Cancel returns show a cancellation message without initiating capture.

Query parameters never award credits. Server-side PayPal details must match the
stored order ID, merchant, amount and currency. A Firestore transaction increments
credits and marks the order successful together, so repeat returns or overlapping
webhooks cannot grant credits twice. Stable PayPal request IDs protect retries.
Do not permit client writes to payment records or user credit balances.

## Webhook setup (required for recovery)

Register this HTTPS URL in the same PayPal REST app:

`https://see-algorithms.com/api/payments/paypal/webhook`

Use your HTTPS preview domain or a tunnel for sandbox webhooks. Set the matching
registration ID in `PAYPAL_WEBHOOK_ID` and subscribe to:

- `CHECKOUT.ORDER.APPROVED`
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.PENDING`
- `PAYMENT.CAPTURE.DECLINED`
- `PAYMENT.CAPTURE.REFUNDED`
- `PAYMENT.CAPTURE.REVERSED`

Approved events capture orders even if the buyer never returns to the site.
Completed events recover interrupted fulfillment. Pending and declined events
never award credits. Verification uses PayPal's signature verification API;
use actual sandbox purchases, since synthetic simulator events do not support
this verification method. Failures return non-2xx for PayPal to retry.

Refunds and reversals enter `paypalPaymentReviews` with `NEEDS_REVIEW`.
Review these operationally and adjust credits according to your refund policy;
automatic revocation of spent credits is not implemented.

## Before going live

Test each plan, cancellation, pending payments, expired sessions, another user's
order, duplicate return visits and repeated webhook deliveries. Interrupt a
return after capture and confirm a completed webhook recovers the credits once.

For production, use the live REST app's client ID, secret, merchant ID and
separately registered live webhook ID. Set `PAYPAL_ENV=live` and remove the local
return-base override or set it to your production URL. Redeploy and confirm a
small real purchase and its webhook delivery.

References:
- https://developer.paypal.com/whats-an-order/
- https://developer.paypal.com/docs/api/orders/v2/
- https://developer.paypal.com/api/rest/webhooks/rest/
