/**
 * AI-chat endpoint — de enige on-demand route op een verder statische site.
 *
 * Streamend antwoord, gegrond in de projectcatalogus, met tools (fase 2) en
 * harde kostenplafonds.
 *
 * Draait als één Netlify Function (via @astrojs/netlify). Let op de harde
 * 10s-wandkloklimiet van Netlify Functions — daarom Groq (zeer snelle stream)
 * + krappe maxOutputTokens + stopWhen.
 */
import type { APIRoute } from 'astro';
import { convertToModelMessages, streamText, stepCountIs, type UIMessage } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { buildSystemPrompt } from '../../lib/ai/system-prompt';
import { chatTools } from '../../lib/ai/tools';

// Deze route mag NIET geprerenderd worden — hij draait per request op de server.
export const prerender = false;

// --- harde limieten (kostenplafond — gratis, en het echte vangnet) ---
const MODEL = 'openai/gpt-oss-120b'; // Groq: snel + goedkoop, ondersteunt tool calling
// LET OP: maxOutputTokens is PER STEP, niet per request. Met stopWhen=stepCountIs(MAX_STEPS)
// is het worst-case per-request output-plafond MAX_STEPS × MAX_OUTPUT_TOKENS = 3 × 500 = 1500 tokens.
const MAX_OUTPUT_TOKENS = 500;
// Minimaal nodig is 2 (server-tool-step + narratie-step); 3 = bewuste marge.
// NIET verhogen — de Netlify-function heeft een harde 10s-limiet.
const MAX_STEPS = 3;
const MAX_MESSAGES = 20;
const MAX_CHARS = 8000; // ruwe input-truncatie-guard

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GROQ_API_KEY;
  if (!apiKey) {
    // Stub-modus: nog geen sleutel. Geef een duidelijke, nette fout terug
    // zodat de client iets toont i.p.v. een 500.
    return json(
      {
        error: 'chat_unconfigured',
        message:
          'De chat is nog niet geconfigureerd (GROQ_API_KEY ontbreekt). Voeg de sleutel toe in je omgeving.',
      },
      503,
    );
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Ongeldige JSON.' }, 400);
  }

  const messages = body.messages ?? [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'bad_request', message: 'Geen berichten meegestuurd.' }, 400);
  }
  if (messages.length > MAX_MESSAGES) {
    return json({ error: 'too_many_messages', message: 'Dit gesprek is te lang geworden.' }, 400);
  }

  // Ruwe lengte-guard: tel alle tekst-parts op.
  const totalChars = messages.reduce((n, m) => {
    const parts = (m as UIMessage).parts ?? [];
    return n + parts.reduce((s, p) => s + (p.type === 'text' ? p.text.length : 0), 0);
  }, 0);
  if (totalChars > MAX_CHARS) {
    return json({ error: 'too_long', message: 'Je bericht is te lang.' }, 400);
  }

  const groq = createGroq({ apiKey });

  const result = streamText({
    model: groq(MODEL),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    stopWhen: stepCountIs(MAX_STEPS),
    tools: chatTools,
    // gpt-oss-120b is een reasoning-model: condenseer de reasoning zodat het
    // het krappe per-step-budget niet opslokt.
    providerOptions: {
      groq: { reasoningFormat: 'hidden', reasoningEffort: 'low' },
    },
  });

  // UI-message-stream past bij `useChat` op de client (incl. tool-parts).
  // sendReasoning:false → de client krijgt/rendeert nooit de reasoning-stream.
  return result.toUIMessageStreamResponse({ sendReasoning: false });
};
