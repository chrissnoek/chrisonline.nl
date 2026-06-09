# Chris Online — portfolio

De persoonlijke portfolio-website van **Chris Snoek** ([chrisonline.nl](https://chrisonline.nl)).
Een statische, razendsnelle site gebouwd met Astro, met topscores op het oog: minimale
client-side JavaScript, geoptimaliseerde afbeeldingen, self-hosted fonts en volledige
toegankelijkheid (WCAG 2.2 AA).

## Stack

| Onderdeel       | Keuze                                                         |
| --------------- | ------------------------------------------------------------- |
| Framework       | [Astro](https://astro.build) (statische output)               |
| Taal            | TypeScript (strict)                                           |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first tokens) |
| Interactiviteit | Vue 3 — alleen als _island_ waar nodig (contactformulier)     |
| Fonts           | Inter (self-hosted & gesubset via de Astro Fonts API)         |
| Afbeeldingen    | `astro:assets` → AVIF/WebP, responsive, zonder layout shift   |
| Content         | Astro Content Collections (Markdown/MDX + Zod-validatie)      |
| Hosting         | Netlify (statisch) + Netlify Forms voor het contactformulier  |

## Lokaal draaien

Vereist **Node 20 of 22**.

```bash
npm install        # dependencies installeren
npm run dev        # ontwikkelserver op http://localhost:4321
```

Andere scripts:

```bash
npm run build      # productiebuild naar ./dist
npm run preview    # bekijk de productiebuild lokaal
npm run check      # TypeScript- en Astro-typecheck (moet schoon zijn)
npm run lint       # ESLint + Prettier-check
npm run format     # code automatisch formatteren
```

## Content aanpassen

### Site-brede instellingen

Alle merk-, contact- en SEO-gegevens staan op één plek:

- **`src/config/site.ts`** — naam, merknaam, tagline, e-mail, social links, navigatie en
  SEO-standaarden. Pas hier je gegevens aan en ze werken overal door (inclusief de JSON-LD
  structured data en de footer).
- **`src/config/services.ts`** — de diensten en samenwerkingsvormen die op de homepage staan.

### Projecten / werk toevoegen of bewerken

Projecten zijn losse bestanden in **`src/content/projects/`**. Voeg een project toe door een nieuw
`.mdx`-bestand aan te maken (kopieer een bestaand bestand als startpunt). De frontmatter wordt
gevalideerd tegen het schema in `src/content.config.ts`:

```yaml
---
title: 'Projecttitel'
client: 'Klantnaam'
summary: 'Korte samenvatting (1–2 zinnen). Wordt ook gebruikt als meta description.'
role: 'Designer & Developer'
skills:
  - Webdesign
  - Webdevelopment
cover: '../../assets/projects/mijn-mockup.png' # afbeelding in src/assets/projects/
coverAlt: 'Beschrijvende alt-tekst voor de afbeelding.'
pubDate: 2026-02-11 # ISO-datum
order: 1 # volgorde in de grid (lager = eerder)
url: 'https://voorbeeld.nl' # optioneel, live-link
placeholder: false # zet op true zolang het placeholder-content is
accent: '#00B0D5' # accentkleur die past bij de mockup-achtergrond
---
## De opdracht

De inhoud van de projectpagina in **Markdown of MDX**…
```

- Leg de coverafbeelding in `src/assets/projects/` — die wordt automatisch geoptimaliseerd
  (AVIF/WebP, juiste afmetingen, geen layout shift).
- De URL van het project wordt afgeleid van de bestandsnaam: `mijn-project.mdx` →
  `/werk/mijn-project`.
- Verwijder de `> _Placeholder-tekst …_`-blokken en zet `placeholder: false` zodra de definitieve
  inhoud erin staat. Projecten met `placeholder: true` tonen een zichtbaar "placeholder"-label.

> **Let op (placeholder-content):** de huidige projectteksten zijn deels placeholder. De drie
> ingevoerde projecten (VI Travel, VoetbalreizenXL, Centrym Fysiotherapie) bevatten realistische
> Nederlandse teksten op basis van de aangeleverde omschrijvingen — vervang of vul ze aan waar
> nodig.

### Profielfoto

De hero-foto staat in `src/assets/me/chris-snoek.jpg`. Vervang dit bestand (zelfde naam) om de
foto te wijzigen.

### Open Graph / social share-afbeelding

De standaard share-afbeelding staat in `public/og/og-default.png` (1200×630). Per pagina kun je een
andere meegeven via de `image`-prop op `BaseLayout`.

## Toegankelijkheid & performance

- Semantische HTML met landmarks, één `<h1>` per pagina en een logische heading-structuur.
- Skip-to-content-link, zichtbare focus-states en volledige toetsenbordnavigatie.
- Kleurcontrast gecontroleerd tegen WCAG AA (zie de tokens in `src/styles/global.css`).
- Alle animaties (scroll-reveal, hover, page transitions) worden uitgeschakeld bij
  `prefers-reduced-motion`.
- Light- én dark-mode met een toegankelijke toggle (slaat de voorkeur op, volgt anders het OS).

## Contactformulier (Netlify Forms)

Het contactformulier draait op **Netlify Forms** en heeft geen API-sleutel of externe service
nodig. Het werkt automatisch zodra de site op Netlify staat:

1. Deploy de site naar Netlify (zie hieronder).
2. Schakel in het Netlify-dashboard onder **Forms** de formulierdetectie in (eenmalig).
3. Inzendingen verschijnen in het Netlify-dashboard; stel daar eventueel e-mailnotificaties in.

Het formulier valt bij succes terug op de bedankpagina (`/bedankt`) en gebruikt een honeypot-veld
tegen spam (geen reCAPTCHA nodig).

## Deployen naar Netlify

De `netlify.toml` is al ingesteld (`build = npm run build`, `publish = dist`, Node 22).

1. Push deze repository naar GitHub/GitLab.
2. Maak in Netlify een nieuwe site aan vanuit de repository — de build-instellingen worden uit
   `netlify.toml` gelezen.
3. Zet je productiedomein. De canonieke URL staat in `astro.config.mjs` (`site:`) en in
   `src/config/site.ts`; pas die aan als het domein wijzigt.

## Projectstructuur

```
src/
├─ assets/            # afbeeldingen (geoptimaliseerd via astro:assets)
│  ├─ me/             #   profielfoto
│  └─ projects/       #   project-mockups
├─ components/        # herbruikbare componenten
│  ├─ sections/       #   homepage-secties (Hero, About, Services, …)
│  ├─ BaseHead.astro  #   SEO: meta, OG, Twitter, JSON-LD
│  ├─ ContactForm.vue #   contactformulier (Vue-island)
│  └─ …
├─ config/            # site.ts + services.ts — centrale configuratie
├─ content/projects/  # projecten als MDX (content collection)
├─ layouts/           # BaseLayout (head, header, footer, transitions)
├─ pages/             # routes: index, contact, bedankt, werk/[id], robots.txt
└─ styles/            # global.css — design tokens & basisstijlen
```
