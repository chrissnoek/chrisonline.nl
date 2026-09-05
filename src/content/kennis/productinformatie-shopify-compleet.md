---
title: 'Complete productinformatie in Shopify: van catalogusdata naar koopvertrouwen'
description: 'Maak Shopify-productinformatie bruikbaar voor klanten, filters, thema’s en verkoopkanalen met duidelijke velden, metafields en een controleerbaar catalogusproces.'
intro: 'Goede productinformatie is tegelijk verkooptekst, beslisondersteuning en technische infrastructuur. Zodra één van die drie ontbreekt, ontstaan twijfel bij klanten en herstelwerk voor het team.'
answer: 'Bepaal per producttype welke informatie nodig is om te kiezen en te vergelijken. Modelleer herhaalbare gegevens in Shopify-metafields, toon ze op de juiste plek en controleer na imports of edits of vereiste velden gevuld blijven.'
category: 'Productinformatie'
pubDate: 2026-09-05
updatedDate: 2026-09-05
readingMinutes: 8
order: 1
featured: false
keyTakeaways:
  - 'Definieer vereiste informatie per producttype in plaats van één universele checklist.'
  - 'Gebruik metafields voor gestructureerde waarden die thema’s, filters of feeds hergebruiken.'
  - 'Controleer zowel aanwezigheid als betekenis; “gevuld” is niet automatisch “goed”.'
  - 'Behandel imports en bulkedits als wijzigingen die een datacontrole verdienen.'
faqs:
  - question: 'Welke productvelden zijn belangrijk in Shopify?'
    answer: 'Dat hangt af van het product. Titel, beschrijving, media, prijs en varianten zijn vaak de basis; maat, materiaal, compatibiliteit, ingrediënten of technische specificaties kunnen per producttype essentieel zijn.'
  - question: 'Wanneer gebruik je een Shopify-metafield?'
    answer: 'Gebruik een metafield voor een herhaalbare, getypeerde waarde die je apart wilt beheren of hergebruiken, zoals materiaal, afmetingen, onderhoudsinstructies of een maattabel.'
  - question: 'Kan SpecFinch productinformatie automatisch herstellen?'
    answer: 'Nee. SpecFinch is bewust read-only: de app signaleert afwijkingen volgens de regels van de merchant, maar wijzigt geen productdata.'
---

## Begin bij de vraag van de klant

Een goede producttitel of omschrijving is niet simpelweg “lang genoeg”. De inhoud moet de risico's
van de aankoop verkleinen. Bij kleding zijn pasvorm en materiaal vaak doorslaggevend. Bij
onderdelen gaat het om compatibiliteit. Bij verzorging kunnen ingrediënten en gebruik essentieel
zijn. Maak daarom per producttype een korte set beslisvragen en koppel elke vraag aan een bronveld.

Voor een stoel kan dat bijvoorbeeld zijn: afmetingen, zithoogte, materiaal, draagvermogen,
montage, levertijd en retourvoorwaarden. De commerciële tekst geeft context; de gestructureerde
velden maken vergelijken, filteren en hergebruik mogelijk.

## Gebruik metafields voor herhaalbare feiten

Shopify-metafields voegen getypeerde informatie toe aan producten en andere resources. Shopify
noemt onder meer specificaties, maattabellen, documenten, afbeeldingen en onderdeelnummers als
gebruikssituaties. De [officiële uitleg over
metafields](https://shopify.dev/docs/apps/build/metafields) beschrijft ook waarom definities
belangrijk zijn voor typevalidatie, filtering en hergebruik.

Een praktische verdeling:

- gebruik de standaard productvelden voor informatie die Shopify al modelleert;
- gebruik standaard metafield-definities wanneer die bij de betekenis passen;
- maak merchant-eigen metafields voor stabiele, winkelspecifieke gegevens;
- stop geen losse JSON of HTML in één veld als afzonderlijke getypeerde waarden beter te beheren
  zijn.

De waarde zit niet in zoveel mogelijk velden, maar in een model dat redacteuren begrijpen en het
thema daadwerkelijk gebruikt.

## Maak dezelfde waarheid zichtbaar én machineleesbaar

Toon belangrijke informatie in de zichtbare productpagina. Structured data is geen vervanging voor
inhoud die klanten kunnen lezen. Controleer daarnaast of prijs, beschikbaarheid, merk, varianten en
andere ondersteunde eigenschappen correct in `Product`-structured data terechtkomen. Google legt
uit dat productdata daarmee in aanmerking kan komen voor rijkere zoekervaringen, waaronder prijs
en beschikbaarheid. Zie [Product structured data van Google Search
Central](https://developers.google.com/search/docs/appearance/structured-data/product).

Houd de storefront, structured data en eventuele productfeed inhoudelijk gelijk. Tegenstrijdige
prijs- of voorraadinformatie schaadt juist de betrouwbaarheid.

## Controleer het proces rond wijzigingen

Catalogi worden kwetsbaar wanneer meerdere systemen of mensen dezelfde velden aanpassen. Maak
daarom voor iedere belangrijke wijzigingsroute duidelijk:

- wie eigenaar is van het veld;
- welk systeem de bron is;
- welke waarden toegestaan zijn;
- wat bij een lege of ongeldige waarde gebeurt;
- hoe je na import, migratie of bulkedit controleert.

Een steekproef kan bij een kleine catalogus voldoende zijn. Bij grotere of vaker veranderende
catalogi is een vaste, herhaalbare controle betrouwbaarder.

## Wanneer SpecFinch helpt

[SpecFinch](/werk/specfinch) laat een merchant regels maken voor vereiste ingebouwde product- en
variantvelden en bestaande metafields. De eerste scan legt een baseline vast; latere scans houden
nieuwe, teruggekeerde of verergerde afwijkingen apart van de bestaande achterstand. De app vraagt
alleen productleestoegang en voert geen correcties uit.

Dat past vooral bij winkels waar imports, leveranciers of meerdere redacteuren een expliciet
datacontract nodig maken. Voor inhoudelijke kwaliteit, spelling of overtuigingskracht blijft
menselijke beoordeling nodig.

## Praktische controlelijst

Kies één producttype en controleer tien representatieve producten. Kan een klant het product
vinden, vergelijken, begrijpen en bestellen zonder een voorspelbare servicevraag te stellen? Zijn
dezelfde gegevens bruikbaar in filters, themaonderdelen, structured data en feeds? En weet het team
direct welke bron moet worden hersteld als een waarde ontbreekt?

Als die antwoorden helder zijn, wordt productinformatie meer dan content: het wordt betrouwbare
verkoopinfrastructuur.
