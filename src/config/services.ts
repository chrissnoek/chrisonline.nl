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
  /** Concrete deliverables / bullets. */
  points: string[];
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
      'Maatwerk website- en landingspagina-ontwerp afgestemd op je merk en doelgroep',
      'Conversiegericht UX-ontwerp dat betrokkenheid en leads verhoogt',
      'Mobile-first, volledig responsive designsystemen',
      'Ontwerp klaar voor ontwikkeling of samenwerking met jouw team',
      'Wireframing en optimalisatie van de volledige user flow',
    ],
  },
  {
    icon: 'code',
    title: 'Maatwerk website-development',
    intro:
      'Technisch sterke en snelle websites, pixel-perfect gebouwd op een schone, schaalbare codebasis.',
    points: [
      'Moderne frontend-development met Vue en React',
      'Maatwerk marketingwebsites met ProcessWire CMS',
      'Volledig schaalbare en makkelijk te beheren contentstructuren',
      'Performance-optimalisatie voor snelheid en SEO-structuur',
      'Pixel-perfecte realisatie op basis van Figma-ontwerpen',
      'Technisch SEO-vriendelijke builds en nette code-architectuur',
    ],
  },
  {
    icon: 'cart',
    title: 'Shopify webshop-development',
    intro:
      'Een webshop die verkoopt: van maatwerk thema tot een afrekenproces dat is geoptimaliseerd voor conversie.',
    points: [
      'Maatwerk Shopify-thema-development en -ontwerp',
      'Inrichting en configuratie van je Shopify-winkel',
      'Conversiegerichte optimalisatie van product- en afrekenpagina’s',
      'App-integraties en performance-optimalisatie',
      'Redesign en migratie van bestaande Shopify-winkels',
    ],
  },
  {
    icon: 'megaphone',
    title: 'High-impact display advertising',
    intro:
      'Technische implementatie van opvallende, paginavullende advertentieformaten die aansluiten op je campagnedoelen, onder andere voor BetCity.',
    points: [
      'Homepage Takeovers (HPTO) voor Weborama en PXR',
      'Rich media en high-visibility advertentie-integraties',
      'Strakke, snelle creatives die de host-pagina niet vertragen',
      'Technische uitvoering afgestemd op campagne-performance',
    ],
  },
  {
    icon: 'palette',
    title: 'Branding & visuele identiteit',
    badge: 'via vertrouwd netwerk',
    intro:
      'Samen met betrouwbare partners zorg ik voor een consistente merkidentiteit die overal klopt, van logo tot complete launch.',
    points: [
      'Logo-ontwerp en complete ontwikkeling van je merkidentiteit',
      'Merkrichtlijnen en visuele consistentie over alle platformen',
      'Volledige ondersteuning bij merk- en websitelancering',
    ],
  },
  {
    icon: 'chart',
    title: 'Tracking, analytics & performance',
    badge: 'via gespecialiseerde partners',
    intro:
      'Meet wat ertoe doet: betrouwbare data en heldere attributie voor betere marketingbeslissingen.',
    points: [
      'Google Analytics 4 inrichting en configuratie',
      'Google Tag Manager-implementatie en event-tracking',
      'Datanauwkeurigheid en ondersteuning bij privacy-compliance',
      'Google Ads-audits en performance-optimalisatie',
      'Trackingstrategieën voor betere campagne-attributie',
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
