import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { englishGuideMarkdown } from '../../../lib/english-guides';

export const getStaticPaths = (async () =>
  (await getCollection('englishGuides')).map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(englishGuideMarkdown(props.entry as CollectionEntry<'englishGuides'>), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
