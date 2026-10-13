import type { APIRoute, GetStaticPaths } from 'astro';
import { getEnglishApps, englishAppMarkdown, type EnglishApp } from '../../../lib/english-apps';

export const getStaticPaths = (async () =>
  (await getEnglishApps()).map((app) => ({
    params: { id: app.project.id },
    props: { app },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(englishAppMarkdown(props.app as EnglishApp), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
