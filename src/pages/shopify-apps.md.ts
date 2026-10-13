import type { APIRoute } from 'astro';
import { appsMarkdown, getShopifyApps } from '../lib/shopify-apps';

export const GET: APIRoute = async () =>
  new Response(appsMarkdown(await getShopifyApps()), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
