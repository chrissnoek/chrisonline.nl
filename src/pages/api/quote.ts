/**
 * Offerte-aanvraag endpoint — NIET bereikbaar voor het AI-model.
 *
 * Draait alleen op een echte POST vanuit de bevestigingskaart in de chat
 * (de gebruiker klikt zelf op "Verstuur"). Her-valideert onafhankelijk met
 * hetzelfde `quoteSchema` en verstuurt daarna pas via Resend. Het model heeft
 * geen fetch en deze route staat niet in de tools-set, dus de LLM kan dit
 * structureel niet triggeren.
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';
import { quoteSchema } from '../../lib/ai/quote-schema';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(
      { error: 'quote_unconfigured', message: 'E-mail is nog niet geconfigureerd (RESEND_API_KEY ontbreekt).' },
      503,
    );
  }

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

  const resend = new Resend(apiKey);
  const TO_CHRIS = import.meta.env.QUOTE_TO_EMAIL ?? 'chris@plugandpay.com';
  // Pas dit aan naar een geverifieerd domein zodra chrisonline.nl in Resend is gezet.
  const FROM = import.meta.env.QUOTE_FROM_EMAIL ?? 'onboarding@resend.dev';

  // Subject uit gevalideerde, één-regel-waarden (naam is CRLF-vrij gegarandeerd door het schema).
  const subject = `Nieuwe offerteaanvraag: ${q.projecttype} — ${q.naam}`;
  const body =
    `Naam: ${q.naam}\n` +
    `Bedrijf: ${q.bedrijf ?? '—'}\n` +
    `E-mail: ${q.email}\n` +
    `Type: ${q.projecttype}\n` +
    `Budget: ${q.budget}\n` +
    `Timeline: ${q.timeline}\n\n` +
    `${q.omschrijving}\n`;

  // 1) Notificatie naar Chris (werkt ook in test via onboarding@resend.dev).
  const notify = await resend.emails.send({
    from: FROM,
    to: TO_CHRIS,
    replyTo: q.email,
    subject,
    text: body,
  });
  if (notify.error) {
    return json({ error: 'send_failed', message: notify.error.message }, 502);
  }

  // 2) Auto-reply naar de bezoeker — ALLEEN bij een geverifieerd domein
  //    (onboarding@resend.dev levert niet aan externe adressen).
  const domainVerified = import.meta.env.RESEND_DOMAIN_VERIFIED === 'true';
  if (domainVerified) {
    await resend.emails.send({
      from: FROM,
      to: q.email,
      subject: 'Bedankt voor je aanvraag — Chris Online',
      text: `Hoi ${q.naam},\n\nBedankt voor je aanvraag. Chris neemt snel contact met je op.\n\n— Chris Online`,
    });
  }

  return json({ ok: true, notified: true, autoReply: domainVerified });
};
