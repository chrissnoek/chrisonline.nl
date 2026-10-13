import type { APIRoute } from 'astro';
import { appsMarkdown, getShopifyApps } from '../../lib/shopify-apps';

// Behoud de bestaande AI-URL; de inhoud komt nu uit dezelfde bron als de HTML.
export const GET: APIRoute = async () =>
  new Response(appsMarkdown(await getShopifyApps()), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
