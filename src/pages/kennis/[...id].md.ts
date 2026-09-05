import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const getStaticPaths = (async () => {
  const articles = await getCollection('knowledge');
  return articles.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) => {
  const entry = props.entry as CollectionEntry<'knowledge'> & { body: string };
  const { data } = entry;
  const canonical = new URL(`/kennis/${entry.id}/`, site).href;
  const takeaways = data.keyTakeaways.map((item) => `- ${item}`).join('\n');
  const faqs = data.faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n');
  const markdown = `# ${data.title}

> ${data.description}

Canonical: ${canonical}
Auteur: Chris Snoek, Chris Online
Gepubliceerd: ${data.pubDate.toISOString().split('T')[0]}
Bijgewerkt: ${data.updatedDate.toISOString().split('T')[0]}
Onderwerp: ${data.category}

## Kort antwoord

${data.answer}

## Belangrijkste punten

${takeaways}

${entry.body.trim()}

## Veelgestelde vragen

${faqs}
`;

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
