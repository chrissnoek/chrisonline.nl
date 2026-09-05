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
      /** Optionele, redactionelere kop voor de hero van een projectdetail. */
      heroTitle: z.string().optional(),
      /** Klant/merknaam (kan afwijken van de titel). */
      client: z.string(),
      /** Opdrachtgever — wie het werk in opdracht gaf (kan afwijken van de klant, bijv. een bureau). */
      opdrachtgever: z
        .object({
          name: z.string(),
          /** Optionele website van de opdrachtgever. */
          url: z.string().url().optional(),
        })
        .optional(),
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
      /** Optioneel label voor de link naar een live project of demo. */
      urlLabel: z.string().default('Bekijk live'),
      /** Optioneel wachtwoord voor een afgeschermde demo-omgeving. */
      demoPassword: z.string().optional(),
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
      /** Eigen Shopify-apps krijgen een productgerichte projectpagina. */
      projectType: z.enum(['client-project', 'shopify-app']).default('client-project'),
      /** Drie feitelijke kolommen voor probleem, mechanisme en doel. */
      highlights: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        )
        .max(3)
        .default([]),
      /** Relevante gidsen uit de kennisbank. */
      relatedKnowledge: z
        .array(
          z.object({
            title: z.string(),
            href: z.string(),
          }),
        )
        .default([]),
    }),
});

/**
 * Kennisbank. Dezelfde bron levert een leesbare HTML-pagina en een openbare
 * Markdown-route op, zodat zoekmachines en AI-clients niet uit elkaar lopen.
 */
const knowledge = defineCollection({
  loader: glob({ base: './src/content/kennis', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    intro: z.string(),
    answer: z.string(),
    category: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    readingMinutes: z.number().int().positive(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    keyTakeaways: z.array(z.string()).min(2).max(6),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects, knowledge };
