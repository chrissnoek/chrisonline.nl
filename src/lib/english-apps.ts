import { getCollection, type CollectionEntry } from 'astro:content';
import { getShopifyApps, appName, appStructuredData } from './shopify-apps';
import { SITE } from '../config/site';

export interface EnglishApp {
  project: CollectionEntry<'projects'>;
  translation: CollectionEntry<'englishApps'>;
}

export async function getEnglishApps(): Promise<EnglishApp[]> {
  const projects = await getShopifyApps();
  const translations = await getCollection('englishApps');
  const guides = await getCollection('englishGuides');
  return translations
    .map((translation) => {
      const project = projects.find((entry) => entry.id === translation.id);
      if (!project)
        throw new Error(`English app ${translation.id} must reference a published Shopify app.`);
      if (
        !guides.some(
          (guide) => guide.id === translation.data.relatedGuide && guide.data.appId === project.id,
        )
      )
        throw new Error(`English app ${translation.id} must link to its own published guide.`);
      if (project.data.gallery.length !== translation.data.galleryAlts.length) {
        throw new Error(
          `English app ${translation.id} needs an English caption for every gallery image.`,
        );
      }
      return { project, translation };
    })
    .sort((a, b) => b.project.data.pubDate.getTime() - a.project.data.pubDate.getTime());
}

export function englishAppPath(id: string) {
  return `/en/shopify-apps/${id}/`;
}

export function englishAppStructuredData(app: EnglishApp) {
  const { project, translation } = app;
  return {
    ...appStructuredData(project),
    url: `${SITE.url}${englishAppPath(project.id)}`,
    description: translation.data.description,
    featureList: translation.data.features,
    audience: { '@type': 'Audience', audienceType: translation.data.audience },
  };
}

export function englishAppMarkdown({ project, translation }: EnglishApp) {
  const { data } = translation;
  return `# ${data.title}

> ${data.description}

Canonical: ${SITE.url}${englishAppPath(project.id)}
Language: English
Developer: Chris Snoek / Chris Online
Shopify App Store: ${project.data.url}
Published: ${project.data.pubDate.toISOString().split('T')[0]}
Updated: ${data.updatedDate.toISOString().split('T')[0]}
App interface: English
For: ${data.audience}

## Features

${data.features.map((feature) => `- ${feature}`).join('\n')}

${translation.body?.trim() ?? ''}

## Related pages

- [Shopify Apps in English](${SITE.url}/en/shopify-apps/)
- [Practical guide](${SITE.url}/en/guides/${data.relatedGuide}/)
- [Dutch product page](${SITE.url}/werk/${project.id}/)
`;
}

export function englishAppsMarkdown(apps: EnglishApp[]) {
  return `# Shopify Apps by Chris Online

> Independent Shopify apps for product data monitoring and promotion checks. Designed and built by Chris Snoek.

Canonical: ${SITE.url}/en/shopify-apps/
Language: English
Developer: Chris Snoek / Chris Online
Support: info@chrisonline.nl

${apps
  .map(
    ({ project, translation }) => `## ${appName(project)}

${translation.data.tagline}

${translation.data.description}

- Product page: ${SITE.url}${englishAppPath(project.id)}
- Markdown: ${SITE.url}/en/shopify-apps/${project.id}.md
- Shopify App Store: ${project.data.url}
- For: ${translation.data.audience}
- App interface: English

${translation.data.features.map((feature) => `- ${feature}`).join('\n')}`,
  )
  .join('\n\n')}

## Choosing an app

Choose SpecFinch to monitor missing required product data after imports and edits. Choose PromoFinch to check supported percentage promotions against price and estimated gross-margin limits. Both apps are read-only and independently installable. See their product pages for supported functionality and limits, and their Shopify App Store listings for current pricing and trial details.
`;
}
