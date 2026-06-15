# AI-Chat-First Portfolio — Research Brief

> Onderzoeksdocument voor het ombouwen van chrisonline.nl van een statische landingspagina
> naar een **input-first AI-agent interface**. Verzameld juni 2026. Alle prijzen/limieten
> geverifieerd tegen actuele bronnen (zie voetnoten per sectie).

---

## 0. De kern van het idee

Vervang de statische hero door een **AI-assistent home** (zoals de referentievideo): een
levende iriserende orb, een groet, een glassmorphism prompt-veld, en klikbare
voorbeeld-prompts. De bezoeker "praat" met een agent die namens Chris:

- **portfolioprojecten toont** (bv. chip "Bekijk advertising-projecten" → inline projectkaarten);
- **een contactformulier opent** in de chat;
- **conversationeel een offerteaanvraag verzamelt** en verstuurt (e-mail + opgeslagen record).

De rest van de site (projectdetailpagina's, `/contact`) blijft gewoon bestaan.

---

## 1. Referentievideo — wat we naadoen

15s loop van één scherm ("LIX"). Alleen de **iriserende orb** beweegt. Layout:

- Donker bijna-zwart canvas, één felle accentkleur (cyaan), zachte ambient glow onderaan.
- Smalle linker icon-rail (logo boven, ronde nav-iconen, avatar onder).
- Midden: **orb** → groet (`Hi, …` / `How can I help today?`) → subtitel → **prompt-veld**
  (placeholder "Ask me anything…", links pill-knoppen `Import file`/`Tools`, rechts mic +
  cyaan ronde send-knop) → **3 voorbeeld-prompt-kaarten** (emoji + titel + 1 regel uitleg).

Belangrijk: de referentie-accentkleur (cyaan) is vrijwel identiek aan jouw merk-cyaan
`#00B0D5` — de futuristische look voelt dus als *jouw merk*, niet als een kostuum.

---

## 2. Huidige codebase (inventaris)

| | |
|---|---|
| Framework | Astro **6.4.5**, `output: 'static'`, **geen adapter** |
| Islands | Vue 3 (`@astrojs/vue`) — enige Vue-component is `ContactForm.vue` |
| Styling | Tailwind CSS 4 (CSS-first `@theme` in `src/styles/global.css`) |
| Font | Inter Variable (self-hosted) |
| Deploy | **Netlify** (`netlify.toml`, Node 22), contactform via **Netlify Forms** |
| API routes | geen |
| Projecten | content collection `projects` (MDX), `src/content.config.ts` |

**Merk-tokens (exact, uit `global.css`):**

- Accent: `--color-accent-500: #00B0D5` (schaal 50→900; `600 #008cab`, `700 #007a95` zijn AA op wit).
- Donkere basis: `ink-950 #0a0b15`, `ink-900 #0e0f1c`, `ink-800 #16182b`, `ink-700 #20233c`.
- Tekst op donker: `text-invert #f8fafc`, `muted-invert #94a3b8`. Lijnen donker: `line-invert #2a2d44`.
- Radius: `--radius-card 1.25rem`, `--radius-pill 9999px`. Easing: `--ease-out-soft cubic-bezier(.22,1,.36,1)`.
- Globale `prefers-reduced-motion` net in `global.css` (regels ~144-155) zet animatieduur op ~0.

**Herbruikbare assets:**

- `src/components/ParticleField.astro` — muis-reactief **Canvas-2D** veld (spring-physics,
  pre-rendered glow-sprites via `maakSprite()` ~regel 81, 60fps cap, pause-offscreen via
  IntersectionObserver, `document.hidden`-gating, reduced-motion guard). **Dit is onze ambient
  achtergrond — gratis.** De orb kan op *dezelfde* `frame()`-loop meeliften (0 KB, 0 extra loop).
- `IntroOverlay.astro` — cinematische merk-opening (kan blijven als pre-roll).
- Projecten (5, groeibaar): frontmatter `title, client, summary, role, skills[], accent, url, gallery[]`.

Huidige projecten zijn **reis/fysio/betting** (geen Shopify). De voorbeeld-chips moeten dus
matchen met je échte werk (bv. "Bekijk reisplatform-projecten", "Advertising / rich media",
"Maatwerk + CMS") — óf je voegt eerst Shopify-projecten toe.

---

## 3. Goedkope LLM — keuze & actuele prijzen (mid-2026)

| Provider | Model | Prijs /1M (in/out) | Gratis tier (geen card) | Tool calling | Edge |
|---|---|---|---|---|---|
| **Groq** ✅ | `gpt-oss-120b` | $0.15 / $0.60 | ~30 RPM, ~1.000 RPD/model | ✅ | ✅ |
| Groq | `llama-3.1-8b` | $0.05 / $0.08 | idem | ✅ | ✅ |
| Google | Gemini 2.5 **Flash-Lite** | $0.10 / $0.40 | ~15 RPM / 1.000 RPD | ✅ | ✅ |
| OpenAI | `gpt-4.1-nano` | $0.10 / $0.40 | **geen** gratis tier meer | ✅ | ✅ |
| Anthropic | Claude Haiku 4.5 | $1.00 / $5.00 | nee | ✅ | ✅ |

**Aanbeveling: Groq `gpt-oss-120b`.** Reden naast prijs: Groq streamt extreem snel, wat
cruciaal is omdat Netlify Functions een **harde 10s-limiet** hebben (zie §5). Gemini
Flash-Lite is de iets goedkopere fallback.

**Gotchas (geverifieerd):**

1. **Gemini gratis tier traint op je data** — Google gebruikt free-tier prompts/outputs om
   modellen te verbeteren. Prima voor een publieke demo, maar bezoekerstekst gaat mee in training.
   (Betaalde tier / Vertex / EU-regio = geen training.)
2. **Gemini billing-val:** billing aanzetten *verwijdert* de gratis allowance op dat project
   (alles wordt billable). Workaround = apart GCP-project.
3. **Gemini free-limieten zijn instabiel** (50-80% verlaagd dec 2025); Gemini Pro is sinds
   1 apr 2026 **alleen betaald**.
4. **OpenRouter** "gratis" = 50 req/dag tot je éénmalig $10 koopt (dan 1.000/dag).
5. **OpenAI** heeft geen echte gratis tier meer (card + ~$5 prepay vereist).

**Kostenraming:** systeemprompt ~300-2.700 tokens → **<$0.001 per chat** op Groq. Bij
portfolio-verkeer effectief gratis.

> Bronnen: aifreeapi.com/google-gemini-free-tier · usagebox.com (Gemini billing) ·
> docs.bswen.com (Gemini privacy) · tokenmix.ai/groq-free-tier-2026 · eesel.ai/groq-pricing ·
> devtk.ai/openai-pricing-2026 · evolink.ai/claude-pricing-2026 · cloudzero.com/groq-pricing ·
> artificialanalysis.ai (gpt-oss-120b vs Gemini Flash-Lite).

---

## 4. Vercel AI SDK (v6) + Astro

Werkt met Astro via een SSR API-route + een client-island met streaming chat & tool calling.

**Let op — de SDK is sterk veranderd; target v6:**

- `parameters:` → **`inputSchema:`** in tool-definities (v4-stijl faalt stil in v5/v6).
- `StreamingTextResponse` / `toAIStream()` → **verwijderd**. Gebruik **`result.toUIMessageStreamResponse()`**.
- `maxSteps` op `useChat` → weg; tool-loop server-side begrenzen met **`stopWhen: stepCountIs(N)`**.
- `useChat` beheert geen input-state meer (transport-based rewrite).
- Bekende vroege-v6 bug: vercel/ai#13460 (tool schema valt door naar leeg) — pin een gepatchte versie.

**UI-framework keuze: bouw de chat als een React-island** (`@ai-sdk/react`), náást de bestaande
Vue. Reden: de generative-UI tooling (tool-part rendering, `addToolOutput`, `onToolCall`) is
React-first en het best gedocumenteerd. `@ai-sdk/vue` bestaat (v6 = `Chat`-class i.p.v.
`useChat`-composable) maar kost extra porting-tijd. Astro is multi-framework; `@astrojs/react`
naast `@astrojs/vue` is first-class. `ContactForm.vue` blijft op de statische `/contact`.

> Bronnen: ai-sdk.dev migration guides (4→5→6) · vercel.com/blog/ai-sdk-6 ·
> rogerstringer.com (AI SDK + Astro) · getstream.io (Astro islands chat) · github vercel/ai#13460.

---

## 5. Architectuur

**Endpoint:** voeg `@astrojs/netlify` toe, hou `output:'static'`, en maak **één** on-demand
route `src/pages/api/chat.ts` met `export const prerender = false`. Rest van de site blijft
statisch. Voordeel boven een losse Netlify Function: directe `getCollection('projects')` voor
build-time grounding, één toolchain, type-safe.

- Netlify Functions **streamen** natively in 2026 (return `Response` met `ReadableStream`).
- **Harde 10s wall-clock limiet** (en 20MB cap). Daarom: Groq + `maxOutputTokens ~500` +
  `stopWhen: stepCountIs(3)`. Background functions kunnen niet streamen.
- Cold start ~200-500ms (gemaskeerd door streaming UI). Test streaming op een deploy-preview,
  niet alleen `netlify dev`.

**Tools:**

| Tool | execute? | Waar | Side effect |
|---|---|---|---|
| `showProjects(query?, skills?, limit)` | ja (filtert build-time lijst) | server filtert, client rendert kaarten | geen |
| `openContactForm(reason?)` | **nee** | client UI-signaal | geen |
| `submitQuoteRequest({naam,bedrijf,email,projecttype,budget,timeline,omschrijving})` | ja (ná client-bevestiging) | server | **e-mail + record** |
| `bookCall(context?)` | **nee** | client rendert Cal.com/Calendly embed | geen |

Veiligheid: `submitQuoteRequest` pas vuren ná expliciete bevestiging (systeemprompt-regel +
client-confirmation kaart "Verstuur deze aanvraag?"). Server-side Zod-validatie is de echte guard.

**Grounding:** géén RAG. Alle projecten als één-regel-catalogus in de systeemprompt
(~60-90 tokens/project; 30 projecten ≈ <3k tokens). Injecteer via `getCollection('projects')`
in `src/lib/projects.ts`. Hou de systeemprompt **byte-stabiel** (persona + tool-regels +
catalogus) voor prompt-caching; dynamische dingen erna.

**Rendering (generative UI):** assistant-message `parts[]` bevat `tool-{naam}` parts met
`state` (`input-available` → `output-available`). Client switcht op `part.type`/`part.state`
en mapt naar een component (`ProjectGallery`, `QuoteForm`, `QuoteConfirmation`, `CalEmbed`).

**Abuse / rate-limit (minimaal om verrassingsrekening te vermijden):**

1. Harde caps (gratis, eerst): `maxOutputTokens 500`, `stopWhen stepCountIs(3)`, max 20
   messages/sessie, input-truncatie.
2. **Upstash Redis** sliding-window per IP (10/min, 50/dag) — gratis tier 500K cmd/mnd.
   (In-memory counters werken niet op ephemeral Netlify Functions.)
3. **Cloudflare Turnstile** (gratis, host-agnostisch) achter de hand voor als er misbruik is.
4. **Globale dag-plafond** teller (~50k output-tokens/dag) → daarna vriendelijke "chat offline".
   Plus provider-side budget-alert bij Groq/Google.

**Submissions:** **Resend** (e-mail notificatie naar `info@chrisonline.nl` + auto-reply;
gratis 3.000/mnd, 100/dag) **+ Netlify Forms** (opgeslagen record, hergebruikt bestaande stack).
Supabase/Turso alleen als je later een queryable DB wilt.

> Bronnen: docs.netlify.com/functions/api · netlify.com/blog/functions-2.0 ·
> docs.astro.build/on-demand-rendering · ai-sdk.dev/tools-and-tool-calling ·
> ai-sdk.dev/chatbot-tool-usage · github vercel/ai#7510 (Vue) · upstash.com/pricing ·
> vercel.com/kb (BotID vs Turnstile — BotID is Vercel-only, valt af) ·
> automationatlas.io (Resend free tier 2026).

---

## 6. Design-richting (futuristisch, in jouw merk)

Alles geverifieerd; libraries gecheckt op npm/GitHub (mid-2026).

**Iriserende orb — twee opties:**

- *Echte referentie-look:* vanilla **`@paper-design/shaders`** `MeshGradient` op eigen kleine
  `<canvas>` (~8-15 KB gz tree-shaken, **0 deps**, v0.0.76 / mei 2026, GPU-goedkoop). Opent wel
  een 2e WebGL-context naast je 2D particle-canvas (prima voor één orb).
- *Absoluut lichtst:* orb als **pre-rendered iriserende sprites in je bestaande ParticleField
  `frame()`-loop** (Route a → canvas): 0 KB, 0 extra loop/context, erft alle pause/reduced-motion
  gating. Minder "vloeibaar" dan de shader, maar onverslaanbaar qua integratie.
- **Vermijd** geanimeerde `feTurbulence` (CPU-duur, valt buiten je reduced-motion net).

**Glassmorphism prompt-veld:** `backdrop-filter: blur(16px) saturate(160%)` (+ `-webkit-`),
dubbele-gradient border via `background-clip: padding-box, border-box`, inner sheen + accent
focus-ring `0 0 0 2px rgba(0,176,213,.55)` + bloom op `:focus-within`. Niet glas-op-glas stacken.

**Ambient aurora:** 2-3 grote `radial-gradient` blobs, `filter: blur(80px)`,
`mix-blend-mode: screen`, trage `translate3d`-drift. Lagen: aurora `z-index:-2` → particle
canvas `-1` → content. Hou aurora-opacity laag (~0.4-0.55) zodat twee `screen`-lagen niet
wit-blowen. Mobiel: 1 blob, `blur(50px)`.

**Chips micro-interacties:** hover-glow + shimmer-sweep (pure CSS, default), animated conic
border via `@property --a` (hover-only), magnetic follow (~15 regels JS, alleen `pointer:fine` +
no-reduced-motion).

**Streaming tekst:** per-woord fade+deblur (`.stream-word` class alléén op nieuwe tokens),
knipperende accent-caret, shimmer skeleton vóór eerste token. Lib `FlowToken` bestaat (React)
maar CSS-aanpak is lichter.

**Performance/a11y:** alleen `transform`/`opacity` animeren; `will-change` alleen tijdens
animatie; `contain`+`isolation` op orb/aurora; orb pauzeren offscreen (hergebruik ParticleField
patroon); expliciete reduced-motion guards voor JS-gedreven orb, magnetic chips, SVG SMIL en
streaming. `backdrop-filter` = grootste mobiele kost → niet stacken, evt. flat fill onder breakpoint.

> Bronnen: npmjs.com/@paper-design/shaders-react · github paper-design/shaders ·
> shaders.paper.design/mesh-gradient · MDN backdrop-filter · caniuse css-backdrop-filter ·
> Codrops feTurbulence · github Ephibbs/flowtoken.

---

## 7. Voorgesteld bouwplan (fasen)

1. **Fundering (SSR + model):** `@astrojs/netlify` adapter, `src/pages/api/chat.ts`
   (`prerender=false`), `@ai-sdk/groq` + `ai` (v6), `GROQ_API_KEY` in Netlify env.
   Eerste streamende `streamText` zonder tools. Test op deploy-preview (10s-limiet).
2. **Grounding + showProjects:** `src/lib/projects.ts` (`getCollection`), `PROJECT_CATALOG` in
   systeemprompt, `showProjects` tool. Eerste echte agent-antwoord.
3. **React chat-island UI:** `@astrojs/react`, `useChat`, `parts[]`-rendering, orb +
   glass-veld + voorbeeld-chips. Vervang/dek de hero (achter de IntroOverlay).
4. **Generative UI componenten:** `ProjectGallery` (inline kaarten), tekststreaming-animatie.
5. **Contact/offerte:** `openContactForm` + `submitQuoteRequest` (Zod), client-confirmation,
   Resend + Netlify Forms record.
6. **Bescherming:** Upstash rate-limit, harde caps, globaal dag-plafond, provider budget-alert.
   Turnstile achter de hand.
7. **Polish:** aurora, micro-interacties, mobiel/reduced-motion QA, fallback "chat offline".

**Beslissingen (vastgelegd door Chris, juni 2026):**

- **Layout:** cinematische opening die **overgaat in** de AI-chat (orb materialiseert uit de
  intro — IntroOverlay wordt herwerkt tot één vloeiende beweging i.p.v. twee losse momenten).
  De **AI-chat is de nieuwe hero**. Bij scrollen volgen de bestaande secties eronder, maar
  herzien op relevantie. **De "over mij" + coverfoto mag NIET verdwijnen** — krijgt een eigen
  plek verderop de pagina.
- **Orb:** **beide prototypen** (Paper Shaders `MeshGradient` vs. canvas-sprite op de
  ParticleField-loop) en naast elkaar vergelijken vóór de keuze.
- **Voorbeeld-chips:** **generieke capability-chips** (niet projectspecifiek), bv.
  "Wat kun je voor mij bouwen?", "Vraag een offerte aan", "Bekijk mijn werk". Werkt nu al,
  los van welke projecten bestaan.
- **Framework:** **React-island** voor de chat, naast de bestaande Vue. (`@astrojs/react` +
  `@ai-sdk/react`.) `ContactForm.vue` blijft op `/contact`.

---

## Geverifieerde stack-samenvatting

| Concern | Keuze |
|---|---|
| Endpoint | `@astrojs/netlify`, `output:'static'`, één `prerender=false` route |
| Streaming | native Netlify Functions (`ReadableStream`), let op **10s** limiet |
| LLM | **Groq `gpt-oss-120b`** ($0.15/$0.60); Gemini 2.5 Flash-Lite fallback |
| SDK | Vercel **AI SDK v6** (`ai` + `@ai-sdk/groq`) |
| Chat UI | **React island** (`@ai-sdk/react`) naast bestaande Vue |
| Grounding | alle projecten in systeemprompt, geen RAG |
| Rate-limit | Upstash sliding window + harde caps + dag-plafond; Turnstile reserve |
| Submissions | **Resend** (mail + auto-reply) + **Netlify Forms** (record) |
| Orb | Paper Shaders `MeshGradient` (mooist) óf canvas-sprite op ParticleField-loop (lichtst) |
| Overig UI | glass-veld, aurora, chips, streaming — pure CSS + minimale JS |
