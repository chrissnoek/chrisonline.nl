/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Diensten — getoond in de "Diensten"-sectie op de homepage.
 *  Pas hier de teksten aan; de iconen verwijzen naar keys in Icon.astro.
 * ──────────────────────────────────────────────────────────────────────────
 */

export interface Service {
  /** Icoon-key (zie src/components/Icon.astro). */
  icon: string;
  title: string;
  intro: string;
  /** Concrete deliverables: vet kernwoord (lead) + korte toelichting (text). */
  points: { lead: string; text: string }[];
  /** Optioneel label, bijv. om een samenwerkingsvorm te markeren. */
  badge?: string;
  /** Optionele detailpagina voor deze dienst. */
  href?: string;
  /** Laat een dienst als brede uitgelichte kaart zien. */
  featured?: boolean;
}

export const SERVICES: Service[] = [
  {
    icon: 'automation',
    title: 'Procesautomatisering & AI',
    badge: 'nieuwe dienst',
    href: '/automatisering',
    featured: true,
    intro:
      'Laat je Shopify-webshop niet naast je bedrijfsprocessen bestaan. Ik koppel terugkerende gegevensstromen en bouw controleerbare workflows rond administratie, fulfillment en klantcontact.',
    points: [
      {
        lead: 'Administratie automatiseren',
        text: 'van offerte-opvolging en werkbonnen tot facturen en urenregistratie',
      },
      {
        lead: 'Systemen koppelen',
        text: 'informatie veilig doorzetten zonder kopiëren, plakken of dubbel invoeren',
      },
      {
        lead: 'AI als assistent',
        text: 'e-mail en documenten laten voorsorteren of voorbereiden, niet ongecontroleerd versturen',
      },
      {
        lead: 'Klein beginnen',
        text: 'eerst één duidelijke tijdvreter analyseren, bouwen en samen testen',
      },
    ],
  },
  {
    icon: 'pen',
    title: 'Shopify-webshopdesign',
    intro:
      'Een webshopontwerp waarin merkbeleving en koopgemak samenkomen, van navigatie en collecties tot productpagina, winkelmand en campagnepagina’s.',
    points: [
      {
        lead: 'Merkgedreven webshopdesign',
        text: 'een visuele wereld die herkenbaar van jou is en doorloopt tot in ieder winkelmoment',
      },
      {
        lead: 'Kooproute en informatiearchitectuur',
        text: 'logische navigatie, collectieopbouw en productkeuzes met minder frictie',
      },
      {
        lead: 'Mobile-first Shopify-systeem',
        text: 'herbruikbare componenten en secties voor elk schermformaat',
      },
      {
        lead: 'Prototype in Figma',
        text: 'belangrijke winkelmomenten getest voordat development begint',
      },
    ],
  },
  {
    icon: 'code',
    title: 'Shopify-thema op maat',
    intro:
      'Een snelle maatwerk Shopify-frontend die het ontwerp zorgvuldig vertaalt en door je team praktisch te beheren blijft.',
    points: [
      {
        lead: 'Maatwerk Liquid en frontend',
        text: 'een schaalbare theme-codebase zonder onnodige visuele beperkingen',
      },
      {
        lead: 'Flexibele storefront',
        text: 'herbruikbare secties waarmee je team pagina’s en campagnes zelf kan opbouwen',
      },
      {
        lead: 'Performance en toegankelijkheid',
        text: 'snel laden en prettig kopen op mobiel, desktop en met ondersteunende technologie',
      },
      {
        lead: 'Apps en integraties',
        text: 'alleen koppelingen die functioneel nodig zijn en de storefront niet onnodig belasten',
      },
    ],
  },
  {
    icon: 'cart',
    title: 'Shopify-webshop van A tot Z',
    intro:
      'Het complete Shopify-traject voor merken die boven een standaardthema zijn uitgegroeid: strategie, ontwerp, bouw, inrichting en een beheerste livegang.',
    points: [
      {
        lead: 'Nieuwe Shopify-webshop',
        text: 'van merkverhaal en structuur tot een ingerichte, geteste storefront',
      },
      {
        lead: 'Redesign van je huidige shop',
        text: 'een sterkere merkervaring en kooproute zonder je werkende basis blind weg te gooien',
      },
      {
        lead: 'Migratie naar Shopify',
        text: 'producten, content en essentiële URL’s gecontroleerd overzetten vanuit je huidige platform',
      },
      {
        lead: 'Doorontwikkeling',
        text: 'nieuwe secties, campagnepagina’s en optimalisaties na de livegang',
      },
    ],
  },
  {
    icon: 'megaphone',
    title: 'High-impact display advertising',
    intro:
      'Technische implementatie van opvallende digitale campagnes en rich media die bezoekers vanuit aandacht doorsturen naar een passende Shopify-landingspagina.',
    points: [
      {
        lead: 'Homepage Takeovers',
        text: 'HPTO’s voor platformen als Weborama en PXR',
      },
      {
        lead: 'Rich media',
        text: 'high-visibility advertentie-integraties',
      },
      {
        lead: 'Licht en snel',
        text: 'creatives die de host-pagina niet vertragen',
      },
      {
        lead: 'Campagnegericht',
        text: 'technische uitvoering afgestemd op performance',
      },
    ],
  },
  {
    icon: 'palette',
    title: 'Branding & visuele identiteit',
    badge: 'met vaste partners',
    intro:
      'Is je merk nog niet klaar voor een onderscheidende webshop? Met vaste partners vertaal ik positionering naar een visuele identiteit die van verpakking tot Shopify-storefront klopt.',
    points: [
      {
        lead: 'Logo-ontwerp',
        text: 'een merkteken dat overal werkt, van favicon tot drukwerk',
      },
      {
        lead: 'Visuele identiteit',
        text: 'kleur, typografie en beeldtaal die je verhaal vertellen',
      },
      {
        lead: 'Merkrichtlijnen',
        text: 'consistentie over alle kanalen en platformen',
      },
      {
        lead: 'Launch-ondersteuning',
        text: 'begeleiding bij merk- en websitelancering',
      },
    ],
  },
  {
    icon: 'chart',
    title: 'Shopify-analyse & optimalisatie',
    badge: 'met vaste partners',
    intro:
      'Meet waar klanten afhaken en welke winkelmomenten bijdragen aan resultaat, met een trackingbasis die je Shopify-data bruikbaar maakt voor gerichte verbetering.',
    points: [
      {
        lead: 'Google Analytics 4',
        text: 'inrichting die meet wat er echt toe doet',
      },
      {
        lead: 'Tag Manager',
        text: 'event-tracking van de acties die tellen',
      },
      {
        lead: 'Betrouwbare data',
        text: 'nauwkeurig en met oog voor privacy-compliance',
      },
      {
        lead: 'Google Ads-audits',
        text: 'betere attributie en campagne-performance',
      },
    ],
  },
];

/**
 * Samenwerkingsvormen — getoond als compacte keuzeblokken.
 */
export const COLLAB_OPTIONS = [
  {
    icon: 'pen',
    title: 'Alleen ontwerp',
    description:
      'Perfect als je al developers of een marketingteam hebt. Ik lever een ontwikkelklaar ontwerp aan.',
  },
  {
    icon: 'palette',
    title: 'Branding + website',
    description:
      'Een complete visuele identiteit gecombineerd met de development van je website of webshop.',
  },
  {
    icon: 'chart',
    title: 'Full digital package',
    description:
      'Branding, website of webshop, automatisering én analytics: het hele traject van strategie tot livegang en onderhoud.',
  },
] as const;
