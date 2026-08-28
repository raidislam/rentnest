export const sslcommerzConfig = {
  storeId: process.env.SSLCOMMERZ_STORE_ID!,
  storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD!,
  isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",

  successUrl: process.env.SSLCOMMERZ_SUCCESS_URL!,
  failUrl: process.env.SSLCOMMERZ_FAIL_URL!,
  cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL!,
  ipnUrl: process.env.SSLCOMMERZ_IPN_URL!,
};