import type { CollectionEntry } from 'astro:content';
import { SITE } from '../config/site';

export function englishGuideMarkdown(entry: CollectionEntry<'englishGuides'>) {
  const { data } = entry;
  return `# ${data.title}

> ${data.description}

Canonical: ${SITE.url}/en/guides/${entry.id}/
Language: English
Author: Chris Snoek, Chris Online
Published: ${data.pubDate.toISOString().split('T')[0]}
Updated: ${data.updatedDate.toISOString().split('T')[0]}

## Short answer

${data.answer}

## Key points

${data.keyTakeaways.map((item) => `- ${item}`).join('\n')}

${entry.body?.trim() ?? ''}

## Related product

[${data.appName}](${SITE.url}/en/shopify-apps/${data.appId}/)
`;
}
