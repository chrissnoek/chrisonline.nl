/**
 * Build-time projectcatalogus voor de AI-agent.
 *
 * Leest de `projects` content-collection en bouwt:
 *   - PROJECTS: een compacte, geserialiseerde lijst (voor de `showProjects`-tool
 *     en om als kaarten te renderen in de chat).
 *   - PROJECT_CATALOG: één regel per project, voor in de (byte-stabiele) systeemprompt
 *     zodat de agent gegrond is in echt werk en niets verzint.
 *
 * Dit draait bij module-load (één keer per cold start van de chat-function),
 * niet per request. Omdat de chat-route deel is van de Astro-build is
 * `astro:content` hier gewoon beschikbaar.
 */
import { getCollection } from 'astro:content';

export interface CatalogProject {
  slug: string;
  title: string;
  client: string;
  summary: string;
  role: string;
  skills: string[];
  accent: string;
  /** Beste beschikbare externe link: live-URL → opdrachtgever → eerste externe link. */
  url?: string;
}

const entries = await getCollection('projects', ({ data }) => !data.placeholder);

export const PROJECTS: CatalogProject[] = entries
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  .map((e) => ({
    slug: e.id,
    title: e.data.title,
    client: e.data.client,
    summary: e.data.summary,
    role: e.data.role,
    skills: e.data.skills,
    accent: e.data.accent,
    url: e.data.url ?? e.data.opdrachtgever?.url ?? e.data.externalLinks?.[0]?.url,
  }));

/** Eén regel per project, compact genoeg om volledig in de systeemprompt te passen. */
export const PROJECT_CATALOG: string = PROJECTS.map(
  (p) =>
    `- ${p.title} (${p.client}); rol: ${p.role}; skills: ${p.skills.join(', ') || 'onbekend'}. ${p.summary}`,
).join('\n');

/**
 * Filtert de catalogus op vrije trefwoorden en/of skills.
 * Server-side gebruikt door de `showProjects`-tool zodat het model alleen de
 * *filters* kiest en de data uit de echte collection komt (geen hallucinaties).
 */
export function filterProjects(
  source: CatalogProject[],
  opts: { query?: string; skills?: string[] } = {},
): CatalogProject[] {
  const q = opts.query?.trim().toLowerCase();
  const wantedSkills = (opts.skills ?? []).map((s) => s.toLowerCase());

  return source.filter((p) => {
    const haystack = [p.title, p.client, p.role, p.summary, ...p.skills].join(' ').toLowerCase();
    const matchesQuery = !q || haystack.includes(q);
    const matchesSkills =
      wantedSkills.length === 0 ||
      wantedSkills.some((w) => p.skills.some((s) => s.toLowerCase().includes(w)));
    return matchesQuery && matchesSkills;
  });
}
