/**
 * Eén bron van waarheid voor de offerte-aanvraag.
 *
 * Wordt geïmporteerd door ZOWEL het tool (`submitQuoteRequest`, als inputSchema)
 * ALS de server-endpoint (`/api/quote.ts`, voor onafhankelijke her-validatie),
 * zodat de twee nooit uit elkaar kunnen lopen.
 *
 * Beveiliging: vrije-tekstvelden die in de e-mail (m.n. de subject-regel) terechtkomen
 * mogen GEEN control-/newline-tekens bevatten — anders is header-injection in theorie
 * mogelijk als de transport ooit wisselt (nu draait het via Resend's HTTPS-JSON-API).
 * Daarom een expliciete guard i.p.v. te leunen op de transport.
 */
import { z } from 'zod';

/** Verbiedt ALLE control-chars (C0-bereik \x00-\x1F + DEL \x7F) — één-regel-velden. */
// eslint-disable-next-line no-control-regex
const hasControlChar = (s: string) => /[\x00-\x1f\x7f]/.test(s);
/** Als bovenstaande, maar staat newline (\n) en tab (\t) toe — voor de body-tekst. */
// eslint-disable-next-line no-control-regex
const hasDisallowedControlChar = (s: string) => /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(s);

/** Eén regel: geen control-chars (header-injection-guard, voor o.a. de subject). */
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .min(2)
    .max(max)
    .refine((s) => !hasControlChar(s), 'Mag geen regeleinden of speciale tekens bevatten.');

/**
 * Omschrijving — mag meerdere regels (newline/tab OK), maar komt ALLEEN in de body,
 * nooit in de subject. Andere control-chars worden geweigerd. De validatie is
 * identiek voor tool én endpoint; alleen de model-facing `.describe()` verschilt
 * (zie quoteToolSchema), zodat het model hier álle scope-details in giet.
 */
const omschrijving = z
  .string()
  .trim()
  .min(10)
  .max(2000)
  .refine((s) => !hasDisallowedControlChar(s), 'Bevat ongeldige tekens.');

// Velden die identiek zijn voor tool én endpoint.
const sharedShape = {
  /** Naam — komt in de subject-regel, dus strikt één regel. */
  naam: singleLine(100),
  /** Bedrijf — optioneel, ook één regel. */
  bedrijf: singleLine(120).optional(),
  projecttype: z.enum(['website', 'webshop', 'advertising', 'onderhoud', 'anders']),
  budget: z.enum(['<2k', '2k-5k', '5k-10k', '10k+', 'onbekend']),
  timeline: z.enum(['asap', '1-3-maanden', '3-6-maanden', 'flexibel']),
  omschrijving,
};

/**
 * SERVER-schema — de échte guard. `z.email()` (zod 4) weigert CRLF, meerdere
 * ontvangers en display-namen. Gebruikt door /api/quote.ts voor her-validatie.
 */
export const quoteSchema = z.object({
  ...sharedShape,
  email: z.email(),
});

/**
 * TOOL-schema (model-facing) — identiek, MAAR e-mail als simpele string-validatie.
 * Reden: `z.email()` genereert een JSON-Schema `pattern` met een lookahead-regex,
 * en Groq's tool-schema-validator (draft-07) wijst lookaheads af ("not a valid regex").
 * Het model vult dit slechts; de echte validatie gebeurt server-side met `quoteSchema`.
 */
export const quoteToolSchema = z.object({
  ...sharedShape,
  // Override met een sturende, model-facing beschrijving (validatie identiek).
  omschrijving: omschrijving.describe(
    'Een volledige samenvatting van het project in lopende tekst, met ALLE scope-details die ' +
      'je hebt uitgevraagd: aantal en soorten pagina\'s, gewenste functionaliteiten ' +
      '(bv. contactformulier, projectoverzicht/detailpagina\'s, boekingsmodule, login), ' +
      'design (maatwerk of thema), stijl/sfeer en mate van animatie, koppelingen/integraties, ' +
      'meertaligheid, wie de content levert, en eventueel aantal producten bij een webshop. ' +
      'Vat samen wat de bezoeker zei; verzin geen details die niet besproken zijn.',
  ),
  email: z
    .string()
    .trim()
    .min(5)
    .max(254)
    .refine((s) => s.includes('@') && !hasControlChar(s), 'Geef een geldig e-mailadres.')
    .describe('E-mailadres van de bezoeker.'),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
