/**
 * AI-tools voor de chat-agent (AI SDK v6).
 *
 * Conventie: `inputSchema` (niet `parameters`); een tool ZONDER `execute` is een
 * client-side tool — de SDK voert niets uit, maar stuurt de tool-call naar de UI
 * (state input-available) zodat de client iets rendert. Dit is de structurele basis
 * van de veiligheid: het model kan met een no-execute tool NOOIT een side-effect
 * (mail, opslag) veroorzaken — het kan alleen iets vóórstellen; de gebruiker beslist.
 */
import { tool } from 'ai';
import { z } from 'zod';
import { PROJECTS, filterProjects, type CatalogProject } from './projects';
import { quoteToolSchema } from './quote-schema';

/**
 * showProjects — SERVER-executed. Het model kiest alleen filters; de échte data
 * komt uit de content-collection (geen hallucinatie). `toModelOutput` geeft het
 * model alleen een korte samenvatting terug (niet de volledige JSON), zodat het
 * narrateert i.p.v. de kaarten als tekst te herhalen — en het per-step-budget spaart.
 */
export const showProjects = tool({
  description:
    'Toon relevante projecten uit het portfolio van Chris als kaarten in de chat. ' +
    'Gebruik dit zodra de bezoeker vraagt naar werk, voorbeelden, ervaring of een type project ' +
    '(bv. webshop, advertising, reisbranche). Kies alleen filters; de echte projectdata komt uit de catalogus.',
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe('Vrij trefwoord, bv. "webshop", "reisbranche", "Shopify". Leeg = alles.'),
    skills: z.array(z.string()).optional().describe('Optionele skills-filter, bv. ["Webdesign"].'),
    limit: z.number().int().min(1).max(6).default(3).describe('Aantal kaarten (max 6).'),
  }),
  execute: async ({ query, skills, limit }) => {
    const matches = filterProjects(PROJECTS, { query, skills }).slice(0, limit ?? 3);
    return { count: matches.length, projects: matches } satisfies {
      count: number;
      projects: CatalogProject[];
    };
  },
  // Het model krijgt NIET de JSON terug, alleen een korte samenvatting → het narrateert.
  toModelOutput: ({ output }) => {
    if (output.count === 0) {
      return {
        type: 'text',
        value: 'Geen projecten gevonden voor deze filters. Stel evt. een gerichte vervolgvraag.',
      };
    }
    const titles = output.projects.map((p) => p.title).join(', ');
    return {
      type: 'text',
      value: `${output.count} project(en) als kaarten getoond: ${titles}. Vat kort samen; herhaal de kaarten niet als tekst.`,
    };
  },
});

/**
 * openContactForm — GEEN execute (client-side). Signaleert de UI om het
 * contactformulier te tonen. Het model voert niets uit.
 */
export const openContactForm = tool({
  description:
    'Open het contactformulier in de chat. Gebruik dit als de bezoeker contact wil, een vraag voor ' +
    'Chris heeft of wil overleggen — maar (nog) geen concrete offerte aanvraagt.',
  inputSchema: z.object({
    reason: z
      .string()
      .optional()
      .describe('Korte reden/aanleiding; wordt voorgevuld in het formulier.'),
  }),
  // GEEN execute → client-side tool.
});

/**
 * submitQuoteRequest — GEEN execute (client-side). Toont een BEVESTIGINGSKAART met
 * de verzamelde velden. Verstuurt NIETS: pas als de bezoeker op "Verstuur" klikt,
 * POST de client naar /api/quote.ts (niet bereikbaar voor het model). Zo kan het
 * model structureel nooit zelf een e-mail triggeren.
 */
export const submitQuoteRequest = tool({
  description:
    'Vul een offerte-aanvraag in en toon een BEVESTIGINGSKAART aan de bezoeker. ' +
    'Dit verstuurt NIETS — de bezoeker moet zelf op "Verstuur" klikken. ' +
    'Roep dit pas aan als alle velden via het gesprek zijn verzameld.',
  inputSchema: quoteToolSchema,
  // GEEN execute → puur client-side; het model kan hiermee NOOIT een e-mail sturen.
});

/**
 * bookCall — GEEN execute (client-side). Toont een "plan een gesprek"-knop. De
 * boekings-URL leeft in de client (env), niet hier, dus buiten het modelbereik.
 */
export const bookCall = tool({
  description:
    'Toon een "plan een gesprek"-knop (Cal.com/Calendly) in de chat. Gebruik dit als de bezoeker ' +
    'liever belt/videobelt of als het gesprek daar logisch naartoe leidt.',
  inputSchema: z.object({
    context: z
      .string()
      .optional()
      .describe('Korte aanleiding voor het gesprek, bv. "webshop-migratie bespreken".'),
  }),
  // GEEN execute → client rendert de boekingslink.
});

export const chatTools = { showProjects, openContactForm, submitQuoteRequest, bookCall };
