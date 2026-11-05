export function paymentError(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

export function paypalConfig() {
  const {
    PAYPAL_ENV,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
    PAYPAL_MERCHANT_ID,
  } = process.env;
  if (
    // !['sandbox', 'live'].includes(PAYPAL_ENV) ||
    !PAYPAL_CLIENT_ID ||
    !PAYPAL_CLIENT_SECRET ||
    !PAYPAL_MERCHANT_ID
  ) {
    throw paymentError('PayPal checkout is currently unavailable.', 503);
  }
  return {
    base:
      PAYPAL_ENV === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com',
    clientId: PAYPAL_CLIENT_ID,
    secret: PAYPAL_CLIENT_SECRET,
    merchantId: PAYPAL_MERCHANT_ID,
  };
}

export function validOrderId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9-]{1,64}$/.test(id);
}

async function getAccessToken(config) {
  const tokenResponse = await fetch(`${config.base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(15000),
  });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok || !token.access_token) {
    throw paymentError('PayPal authentication failed.', 502);
  }
  return token.access_token;
}

export async function paypalRequest(
  path,
  { method = 'GET', body, requestId } = {},
) {
  const config = paypalConfig();
  const accessToken = await getAccessToken(config);
  const response = await fetch(`${config.base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(requestId ? { 'PayPal-Request-Id': requestId } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error('PayPal API error', {
      method,
      path,
      status: response.status,
      name: data.name,
      debugId: data.debug_id,
      message: data.message,
      details: data.details?.map(({ issue, description, field, location }) => ({
        issue,
        description,
        field,
        location,
      })),
    });
    throw paymentError(
      'Unable to confirm PayPal payment. Please try again.',
      502,
    );
  }
  return data;
}

export function paypalApiError(res, err) {
  console.error('PayPal checkout:', err.message);
  return res.status(err.status || 500).json({
    error: err.status
      ? err.message
      : 'Unable to process payment. Please try again.',
  });
}
