/**
 * Standaard UTM-parameters voor uitgaande links vanuit het portfolio,
 * zodat in de analytics van de bestemming zichtbaar is dat het verkeer
 * van chrisonline.nl komt.
 */
const UTM_PARAMS = {
  utm_source: 'Website',
  utm_medium: 'Portfolio',
  utm_campaign: 'ChrisOnline',
} as const;

/**
 * Voegt de standaard UTM-parameters toe aan een externe URL.
 * Bestaande query-parameters blijven behouden.
 */
export function withUtm(url: string): string {
  const u = new URL(url);
  for (const [key, value] of Object.entries(UTM_PARAMS)) {
    u.searchParams.set(key, value);
  }
  return u.toString();
}
