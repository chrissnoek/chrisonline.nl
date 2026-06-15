/**
 * Rendert het resultaat van de `showProjects`-tool als kaarten in de chat.
 * Data komt uit de tool-output (de echte content-collection), niet uit het model.
 */
import type { CatalogProject } from '../../lib/ai/projects';

export default function ProjectGallery({ projects }: { projects: CatalogProject[] }) {
  if (!projects?.length) return null;
  return (
    <div className="cw-gallery" role="list">
      {projects.map((p) => {
        const card = (
          <>
            <span className="cw-card-accent" style={{ background: p.accent }} aria-hidden="true" />
            <strong className="cw-card-title">{p.title}</strong>
            <span className="cw-card-meta">
              {p.client} · {p.role}
            </span>
            {p.skills?.length ? (
              <span className="cw-card-skills">{p.skills.slice(0, 3).join(' · ')}</span>
            ) : null}
          </>
        );
        return p.url ? (
          <a
            key={p.slug}
            className="cw-card"
            role="listitem"
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {card}
            <span className="cw-card-cta">Bekijk live ↗</span>
          </a>
        ) : (
          <a key={p.slug} className="cw-card" role="listitem" href={`/werk/${p.slug}`}>
            {card}
            <span className="cw-card-cta">Bekijk project →</span>
          </a>
        );
      })}
    </div>
  );
}
