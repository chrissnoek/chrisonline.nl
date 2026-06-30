/**
 * Offerte-aanvraag endpoint — NIET bereikbaar voor het AI-model.
 *
 * Draait alleen op een echte POST vanuit de bevestigingskaart in de chat
 * (de gebruiker klikt zelf op "Verstuur"). Her-valideert onafhankelijk met
 * hetzelfde `quoteSchema` en stuurt de aanvraag daarna door naar Netlify Forms.
 * Het model heeft geen fetch en deze route staat niet in de tools-set, dus de
 * LLM kan dit structureel niet triggeren.
 *
 * Waarom Netlify Forms i.p.v. een mailprovider: geen API-key, geen DNS/DKIM/SPF
 * te verifiëren. Aanvragen komen binnen in het Netlify-dashboard onder
 * Forms → "offerte"; stel daar een e-mailnotificatie in (Netlify → Forms →
 * Notifications) om ze in je inbox te krijgen. Netlify detecteert het formulier
 * bij de build via het verborgen blueprint-form in `src/pages/contact.astro`.
 */
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { quoteSchema } from '../../lib/ai/quote-schema';
import { SITE } from '../../config/site';

export const prerender = false;

/** Netlify-form waar offerte-aanvragen op binnenkomen (zie blueprint in contact.astro). */
const FORM_NAME = 'offerte';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Ongeldige JSON.' }, 400);
  }

  // Onafhankelijke her-validatie aan de serverkant — vertrouw nooit de model-output.
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ error: 'validation', issues: z.flattenError(parsed.error) }, 422);
  }
  const q = parsed.data;

  // Netlify Forms verwacht een URL-encoded POST naar een pagina van de site,
  // mét een `form-name` dat overeenkomt met een bij de build gedetecteerd form.
  const payload = new URLSearchParams({
    'form-name': FORM_NAME,
    naam: q.naam,
    bedrijf: q.bedrijf ?? '',
    email: q.email,
    projecttype: q.projecttype,
    budget: q.budget,
    timeline: q.timeline,
    omschrijving: q.omschrijving,
  });

  // In productie zet Netlify `URL` (de canonieke site-URL); lokaal valt het
  // terug op de geconfigureerde site-URL. Het pad maakt niet uit zolang het
  // een bestaande pagina is — Netlify herkent de submit aan `form-name`.
  const base = import.meta.env.URL ?? SITE.url;

  try {
    const res = await fetch(`${base}/contact/`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    if (!res.ok) {
      return json({ error: 'send_failed', message: `Netlify Forms gaf status ${res.status}.` }, 502);
    }
  } catch (err) {
    return json(
      { error: 'send_failed', message: err instanceof Error ? err.message : 'Onbekende fout.' },
      502,
    );
  }

  return json({ ok: true, notified: true });
};
