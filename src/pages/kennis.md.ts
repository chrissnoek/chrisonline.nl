import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const articles = (await getCollection('knowledge')).sort((a, b) => a.data.order - b.data.order);
  const list = articles
    .map(
      (article) =>
        `- [${article.data.title}](${new URL(`/kennis/${article.id}.md`, site).href}): ${article.data.description}`,
    )
    .join('\n');

  const markdown = `# Shopify-kennisbank van Chris Online

Praktische Nederlandstalige gidsen over Shopify-conversie, productinformatie, levering, performance en meten.

Canonical HTML: ${new URL('/kennis/', site).href}
Auteur: Chris Snoek, Shopify-designer en frontenddeveloper in Volendam

## Gidsen

${list}

## Shopify-apps van Chris Online

- [SpecFinch](https://apps.shopify.com/specfinch): read-only catalogusregels en change-only monitoring.
- [Delivery Promise NL](https://apps.shopify.com/delivery-promise-nl): verwachte bezorgdatums volgens het werkschema van de merchant.

De apps lossen afgebakende problemen op. Ze garanderen geen conversie- of omzetstijging; effect moet per winkel worden gemeten.
`;

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
