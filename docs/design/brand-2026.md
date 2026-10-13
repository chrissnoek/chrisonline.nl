# Merk en designsysteem — oktober 2026

## Uitgangspunt

Chris Online bouwt frontends die leven: Boonsoir heeft een Avondstand, PietjeMarietje laat
dezelfde woonkamer van ochtend naar avond verschuiven. De eigen site doet hetzelfde. Dat is de
ene gedenkwaardige keuze; al het andere blijft rustig.

## Dag- en avondstand

- `<html data-daypart="morning|day|evening|night" data-scheme="light|dark">` wordt vóór de
  eerste paint gezet (`src/components/Daylight.astro`). Fase volgt de klok van de bezoeker.
- Ochtend en dag: studiowit papier; avond: warmer papier met een lager, oranje "studiolicht";
  nacht: donker schema. De bezoeker kan de stand in de footer vastzetten (localStorage).
- Het studiolicht is één element (`.sun`) waarvan positie, grootte en kleur per fase uit tokens
  komen (`--sun-x`, `--sun-y`, `--sun-size`, `--sun-color`).

## Kleur

| Token             | Dag       | Nacht     | Rol                                   |
| ----------------- | --------- | --------- | ------------------------------------- |
| `--paper`         | `#f4f4ef` | `#121311` | basis (studiowit, geen crème)         |
| `--paper-deep`    | `#e9eae3` | `#1f201c` | tweede vlak, podia op papier          |
| `--ink`           | `#141512` | `#f1f0ea` | tekst                                 |
| `--ink-soft`      | `#52544c` | `#b1b2a9` | gedempte tekst (≥ 4.5:1)              |
| `--vermilion`     | `#ee4b24` | gelijk    | enig accent: beeldmerk, lint, knoppen |
| `--vermilion-ink` | `#c1360f` | `#ff7b55` | accent als tekst                      |
| `--stage`         | `#141512` | `#0b0c0a` | donkere podia (werkwijze, slot-CTA)   |

## Typografie

- Koppen (h1, h2, grote uitspraken): Instrument Serif 400, cursief voor nadruk in lopende tekst.
- Body en UI: Inter variable. h3 en kleiner blijven Inter.
- Schaal: `display-xl` (hero) → `display-lg` (paginakoppen) → `display-md` (secties) →
  `display-sm` (titels in lijsten). Geen kapitalen-eyebrows, geen decoratieve nummering, geen
  monospace buiten letterlijke code.

## Beeldmerk

Vier stroken die elkaar kruisen: ster, kompas, kruispunt van design, development en onderhoud.
In de header draait het mee met de scrollpositie; in de footer sluit het groot af.

## Motion

- Eén georkestreerde entree per pagina (hero: regels, portret, licht).
- Secties lichten op bij binnenkomst (`lift-in`, `reveal-up`) via scroll-gedreven CSS; zonder
  ondersteuning of met reduced motion is alles direct zichtbaar.
- Interactie toont wat verandert: uitklappers met hoogte, pijlen die meeschuiven, carrousel met
  voortgang. Geen losse hover-gimmicks op ieder kaartje.

## Conversie

- Eén primaire actie per scherm; "Bespreek je webshop" in de header, boekingslink als tweede route.
- Reactietermijn als geruststelling bij iedere actie; contactpagina met formulier, agenda en e-mail
  naast elkaar; vooringevulde berichten per dienst.
- Iedere subpagina sluit af met een inhoudelijke uitnodiging (`CtaBand`) en zichtbare
  broodkruimels bovenaan.

## SEO en GEO

- Eén h1 per pagina, zichtbare broodkruimels met gelijke `BreadcrumbList`-data, FAQ-data uit
  dezelfde bron als de zichtbare FAQ.
- Antwoord-eerst op kennisartikelen ("Kort antwoord"), feiten-eerst op app-pagina's.
- `/llms.txt` (index) en `/llms-full.txt` (alle openbare tekst), Markdown-alternates per pagina,
  `hreflang` inclusief `x-default`, nieuwe OG-afbeelding uit `npm run og`.
