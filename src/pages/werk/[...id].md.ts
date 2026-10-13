import type { APIRoute, GetStaticPaths } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { appName, getShopifyApps } from '../../lib/shopify-apps';
import { SITE } from '../../config/site';

export const getStaticPaths = (async () =>
  (await getShopifyApps()).map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const entry = props.entry as CollectionEntry<'projects'>;
  const { data } = entry;
  const markdown = `# ${appName(entry)}

> ${data.summary}

Canonical: ${SITE.url}/werk/${entry.id}/
Ontwikkelaar: Chris Snoek / Chris Online
Shopify App Store: ${data.url}
Gepubliceerd: ${data.pubDate.toISOString().split('T')[0]}
${data.application ? `Voor wie: ${data.application.audience}\nApp-talen: ${data.application.languages.join(', ')}\n\n## Functionaliteit\n\n${data.application.features.map((feature) => `- ${feature}`).join('\n')}` : ''}

${entry.body?.trim() ?? ''}

## Gerelateerde pagina's

- [Alle Shopify Apps](${SITE.url}/shopify-apps/)
${data.relatedKnowledge.map((item) => `- [${item.title}](${new URL(item.href, SITE.url).href})`).join('\n')}
`;
  return new Response(markdown, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
