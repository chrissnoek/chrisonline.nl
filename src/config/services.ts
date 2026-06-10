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
}

export const SERVICES: Service[] = [
  {
    icon: 'pen',
    title: 'Website-ontwerp & UI/UX',
    intro:
      'Een ontwerp dat past bij je merk én je bezoekers overtuigt, van de eerste schets tot een ontwikkelklaar bestand in Figma.',
    points: [
      {
        lead: 'Maatwerk ontwerp',
        text: 'websites en landingspagina’s, afgestemd op je merk en doelgroep',
      },
      {
        lead: 'Conversiegericht UX',
        text: 'wireframes en user flows gericht op meer aanvragen',
      },
      {
        lead: 'Mobile-first designsysteem',
        text: 'consistent en responsive op elk schermformaat',
      },
      {
        lead: 'Ontwikkelklaar in Figma',
        text: 'direct bruikbaar voor mij of je eigen team',
      },
    ],
  },
  {
    icon: 'code',
    title: 'Maatwerk website-development',
    intro:
      'Technisch sterke en snelle websites, pixel-perfect gebouwd op een schone, schaalbare codebasis.',
    points: [
      {
        lead: 'Moderne frontend',
        text: 'Vue en React op een nette, schaalbare code-architectuur',
      },
      {
        lead: 'ProcessWire CMS',
        text: 'maatwerk marketingwebsites met makkelijk te beheren content',
      },
      {
        lead: 'Snel en SEO-sterk',
        text: 'performance en technische vindbaarheid als uitgangspunt',
      },
      {
        lead: 'Pixel-perfect',
        text: 'realisatie die het Figma-ontwerp exact volgt',
      },
    ],
  },
  {
    icon: 'cart',
    title: 'Shopify webshop-development',
    intro:
      'Een webshop die verkoopt: van maatwerk thema tot een afrekenproces dat is geoptimaliseerd voor conversie.',
    points: [
      {
        lead: 'Maatwerk thema',
        text: 'ontwerp en development, uniek voor jouw winkel',
      },
      {
        lead: 'Conversie-optimalisatie',
        text: 'product- en afrekenpagina’s die beter verkopen',
      },
      {
        lead: 'Inrichting en integraties',
        text: 'winkelconfiguratie, apps en performance',
      },
      {
        lead: 'Redesign en migratie',
        text: 'een nieuw jasje voor bestaande Shopify-winkels',
      },
    ],
  },
  {
    icon: 'megaphone',
    title: 'High-impact display advertising',
    intro:
      'Technische implementatie van opvallende, paginavullende advertentieformaten die aansluiten op je campagnedoelen, onder andere voor BetCity.',
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
      'Samen met betrouwbare partners zorg ik voor een consistente merkidentiteit die overal klopt, van logo tot complete launch.',
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
    title: 'Tracking, analytics & performance',
    badge: 'met vaste partners',
    intro:
      'Meet wat ertoe doet: betrouwbare data en heldere attributie voor betere marketingbeslissingen.',
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
    title: 'Alleen ontwerp',
    description:
      'Perfect als je al developers of een marketingteam hebt. Ik lever een ontwikkelklaar ontwerp aan.',
  },
  {
    title: 'Branding + website',
    description:
      'Een complete visuele identiteit gecombineerd met de development van je website of webshop.',
  },
  {
    title: 'Full digital package',
    description:
      'Branding, website of webshop én analytics: het hele traject van strategie tot livegang en onderhoud.',
  },
] as const;
