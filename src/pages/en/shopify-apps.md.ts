import type { APIRoute } from 'astro';
import { getEnglishApps, englishAppsMarkdown } from '../../lib/english-apps';

export const GET: APIRoute = async () =>
  new Response(englishAppsMarkdown(await getEnglishApps()), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
