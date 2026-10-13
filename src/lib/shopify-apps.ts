import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../config/site';
import { appLanguageAlternates } from '../config/app-locales';

export async function getShopifyApps() {
  return (
    await getCollection(
      'projects',
      ({ data }) => data.projectType === 'shopify-app' && !data.placeholder,
    )
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function appName(entry: CollectionEntry<'projects'>) {
  return entry.data.application?.name ?? entry.data.title;
}

export function appStructuredData(entry: CollectionEntry<'projects'>) {
  const { data } = entry;
  const url = `${SITE.url}/werk/${entry.id}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: appName(entry),
    description: data.summary,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Shopify',
    datePublished: data.pubDate.toISOString().split('T')[0],
    creator: { '@id': `${SITE.url}/#person` },
    publisher: { '@id': `${SITE.url}/#business` },
    image: new URL(data.cover.src, SITE.url).href,
    screenshot: data.gallery.map((shot) => new URL(shot.src.src, SITE.url).href),
    ...(data.application
      ? {
          featureList: data.application.features,
          inLanguage: data.application.languages.map((language) =>
            language === 'Nederlands' ? 'nl' : language === 'Engels' ? 'en' : language,
          ),
          audience: { '@type': 'Audience', audienceType: data.application.audience },
        }
      : {}),
    ...(data.url ? { sameAs: [data.url], installUrl: data.url } : {}),
  };
}

export function appsMarkdown(entries: CollectionEntry<'projects'>[]) {
  return `# Shopify Apps van Chris Online

> Eigen Shopify-apps van Chris Snoek voor concrete problemen in de dagelijkse praktijk van een webshop.

Canonical: ${SITE.url}/shopify-apps/
Ontwikkelaar: Chris Snoek / Chris Online
Vestiging: Volendam, Noord-Holland, Nederland

${entries
  .map((entry) => {
    const { data } = entry;
    const englishPage = appLanguageAlternates(`/werk/${entry.id}/`).find(
      (alternate) => alternate.lang === 'en',
    );
    return `## ${appName(entry)}

${data.application?.tagline ?? data.summary}

${data.summary}

- Productpagina: ${SITE.url}/werk/${entry.id}/
- Productpagina in Markdown: ${SITE.url}/werk/${entry.id}.md
${englishPage ? `- English product page: ${SITE.url}${englishPage.href}\n` : ''}- Shopify App Store: ${data.url}
- Gepubliceerd: ${data.pubDate.toISOString().split('T')[0]}
${data.application ? `- Voor wie: ${data.application.audience}\n- App-talen: ${data.application.languages.join(', ')}\n\n### Functionaliteit\n\n${data.application.features.map((feature) => `- ${feature}`).join('\n')}` : ''}`;
  })
  .join('\n\n')}

## Meer informatie

De productpagina's beschrijven de werking en beperkingen van iedere app. Actuele prijzen en proefperiodes staan in de Shopify App Store. Er wordt geen hogere conversie, omzet of zoekpositie gegarandeerd.

- Shopify-kennisbank: ${SITE.url}/kennis/
- Contact met de ontwikkelaar: ${SITE.url}/contact/
`;
}
