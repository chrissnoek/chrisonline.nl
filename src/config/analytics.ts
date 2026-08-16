/**
 * Centrale meetconfiguratie. De container wordt pas in de browser geladen
 * nadat een bezoeker expliciet toestemming geeft voor analyse-cookies.
 */
export const ANALYTICS = {
  googleTagManagerId: 'GTM-WC2B9RZS',
  googleAnalyticsMeasurementId: 'G-MM849XMZBR',
  consentCookieName: 'co_cookie_consent_v1',
  consentCookieMaxAge: 60 * 60 * 24 * 180,
} as const;
