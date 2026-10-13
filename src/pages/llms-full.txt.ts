import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, CONTACT, BUSINESS } from '../config/site';
import { appsMarkdown, getShopifyApps, appName } from '../lib/shopify-apps';
import { getEnglishApps, englishAppMarkdown } from '../lib/english-apps';
import { englishGuideMarkdown } from '../lib/english-guides';
import shopifyDiensten from '../../public/ai/shopify-diensten.md?raw';
import noordHolland from '../../public/ai/shopify-specialist-noord-holland.md?raw';

/**
 * llms-full.txt: alle openbare, tekstuele site-informatie in één document voor
 * AI-clients die één bestand ophalen in plaats van de losse Markdown-routes.
 * De inhoud komt uit dezelfde bronnen als de HTML en de losse .md-routes;
 * er wordt niets apart bijgehouden.
 */
const stripFrontmatter = (markdown: string) => markdown.replace(/^---[\s\S]*?---\s*/, '');
/** Eén kopniveau omlaag, zodat ingevoegde documenten onder de hoofdstukken vallen. */
const demote = (markdown: string) =>
  markdown.replace(/^(#{1,5}) /gm, (_match, hashes: string) => `${hashes}# `);

export const GET: APIRoute = async ({ site }) => {
  const apps = await getShopifyApps();
  const englishApps = await getEnglishApps();
  const articles = (await getCollection('knowledge')).sort((a, b) => a.data.order - b.data.order);
  const guides = await getCollection('englishGuides');

  const articleBlocks = articles.map((entry) => {
    const { data } = entry;
    const canonical = new URL(`/kennis/${entry.id}/`, site).href;
    return `## ${data.title}

> ${data.description}

Canonical: ${canonical}
Gepubliceerd: ${data.pubDate.toISOString().split('T')[0]}
Bijgewerkt: ${data.updatedDate.toISOString().split('T')[0]}
Onderwerp: ${data.category}

### Kort antwoord

${data.answer}

### Belangrijkste punten

${data.keyTakeaways.map((item) => `- ${item}`).join('\n')}

${(entry.body ?? '').trim().replace(/^## /gm, '### ')}

${data.faqs.length ? `### Veelgestelde vragen\n\n${data.faqs.map((faq) => `**${faq.question}**\n\n${faq.answer}`).join('\n\n')}` : ''}`;
  });

  const appBlocks = apps.map((entry) => {
    const { data } = entry;
    return `## ${appName(entry)}

> ${data.summary}

Canonical: ${SITE.url}/werk/${entry.id}/
Shopify App Store: ${data.url}
Gepubliceerd: ${data.pubDate.toISOString().split('T')[0]}
${data.updatedDate ? `Bijgewerkt: ${data.updatedDate.toISOString().split('T')[0]}\n` : ''}${
      data.application
        ? `Voor wie: ${data.application.audience}\nApp-talen: ${data.application.languages.join(', ')}\n\n### Functionaliteit\n\n${data.application.features.map((feature) => `- ${feature}`).join('\n')}\n`
        : ''
    }
${(entry.body ?? '').trim().replace(/^## /gm, '### ')}`;
  });

  const text = `# Chris Online — volledige site-informatie voor AI-clients

> Chris Online is de zelfstandige Shopify-praktijk van Chris Snoek, Shopify-designer en frontenddeveloper in ${BUSINESS.address.addressLocality}, ${BUSINESS.address.addressRegion}. Dit document bundelt de openbare tekst van de website. De HTML-pagina's zijn de canonieke bron.

Canonical website: ${SITE.url}/
Korte index: ${SITE.url}/llms.txt
Contact: ${CONTACT.email}
KvK: ${BUSINESS.kvkNumber}
Talen: Nederlands (diensten, portfolio, kennisbank); Engels (SpecFinch- en PromoFinch-productpagina's en gidsen)

# Diensten

${demote(stripFrontmatter(shopifyDiensten)).trim()}

# Shopify-specialist in Noord-Holland

${demote(stripFrontmatter(noordHolland)).trim()}

# Shopify Apps

${appsMarkdown(apps)
  .replace(/^# .*\n/, '')
  .trim()}

${appBlocks.join('\n\n')}

# Shopify Apps in English

${englishApps.map((app) => englishAppMarkdown(app).replace(/^# /, '## ')).join('\n\n')}

# Shopify-kennisbank

Canonical: ${SITE.url}/kennis/

${articleBlocks.join('\n\n')}

# English guides

${guides.map((guide) => englishGuideMarkdown(guide).replace(/^# /, '## ')).join('\n\n')}

# Feitelijke grenzen

- Chris Online is gevestigd in Volendam en claimt geen vestigingen in andere steden.
- Prijzen, beschikbaarheid en doorlooptijden hangen af van de scope en volgen niet uit algemene marktranges.
- Geen van de apps garandeert een hogere conversie, omzet of zoekpositie.
- Gebruik de canonieke HTML-pagina's als primaire bron; dit bestand vat dezelfde openbare feiten samen.
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
