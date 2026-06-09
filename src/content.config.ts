import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projecten / werk. Voeg een nieuw project toe door een .md- of .mdx-bestand
 * in src/content/projects/ te plaatsen met de frontmatter hieronder.
 * De `cover` verwijst naar een afbeelding in src/assets/ (relatief vanaf het md-bestand
 * of vanaf src/assets) en wordt automatisch geoptimaliseerd via astro:assets.
 */
const projects = defineCollection({
  // v6: glob-loader negeert standaard bestanden die met _ beginnen.
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      /** Titel van het project. */
      title: z.string(),
      /** Klant/merknaam (kan afwijken van de titel). */
      client: z.string(),
      /** Korte samenvatting (gebruikt in de grid en als meta description). */
      summary: z.string(),
      /** Jouw rol, bijv. "Designer" of "Designer & Developer". */
      role: z.string(),
      /** Skills / deliverables als tags. */
      skills: z.array(z.string()).default([]),
      /** Coverafbeelding (mockup). */
      cover: image(),
      /** Alt-tekst voor de coverafbeelding (toegankelijkheid). */
      coverAlt: z.string(),
      /** Publicatiedatum (ISO 8601, bijv. 2026-02-11). */
      pubDate: z.coerce.date(),
      /** Volgorde in de grid; lager = eerder getoond. */
      order: z.number().default(99),
      /** Optionele live-URL van het project. */
      url: z.string().url().optional(),
      /** Markeer als placeholder-content die nog vervangen moet worden. */
      placeholder: z.boolean().default(false),
      /** Accentkleur die past bij de mockup-achtergrond (voor de kaart-gradient). */
      accent: z.string().default('#00B0D5'),
      /**
       * Galerij met extra ontwerpbeelden voor op de detailpagina.
       * Leg de afbeeldingen in src/assets/projects/<slug>/ en verwijs relatief.
       */
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            /** Optioneel label in de adresbalk van het browser-frame (bijv. een domein/pad). */
            url: z.string().optional(),
          }),
        )
        .default([]),
      /**
       * Externe links (bijv. live previews van campagnes). Worden als knoppen getoond.
       */
      externalLinks: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
          }),
        )
        .default([]),
    }),
});

export const collections = { projects };
