import type { APIRoute } from 'astro';

/**
 * Dynamische robots.txt — leidt de sitemap-URL af uit de `site`-optie,
 * zodat hij altijd klopt, ongeacht het domein.
 */
const robotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(robotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
