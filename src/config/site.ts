/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Centrale site-configuratie
 *  Pas hier je naam, merk, social links en SEO-standaarden aan.
 *  Dit is de enige plek waar je deze gegevens hoeft te wijzigen.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  /** Canonieke productie-URL (zonder trailing slash). Ook ingesteld in astro.config.mjs. */
  url: 'https://chrisonline.nl',

  /** Merknaam zoals getoond in de UI en in de browser-titel. */
  brand: 'Chris Online',

  /** Volledige naam (gebruikt in JSON-LD Person en in de footer). */
  author: 'Chris Snoek',

  /** Beroep / functietitel. */
  jobTitle: 'Digital designer & frontend developer',

  /** Korte tagline onder de merknaam. */
  tagline: 'Strategie, design en levende frontends die merken laten groeien.',

  /** Taal van de site (gebruikt in <html lang>). */
  lang: 'nl',

  /** Standaard locale voor Open Graph (og:locale). */
  ogLocale: 'nl_NL',
} as const;

/**
 * SEO-standaarden. Worden per pagina overschreven waar nodig.
 */
export const SEO = {
  defaultTitle: 'Chris Snoek, digital design & development | Chris Online',
  titleTemplate: '%s | Chris Online',
  defaultDescription:
    'Chris Snoek ontwerpt en bouwt onderscheidende digitale ervaringen. ' +
    'Van een sterk verhaal en doordacht design tot een snelle frontend die blijft presteren.',
  /** Standaard Open Graph-afbeelding (in /public, absoluut gemaakt op basis van SITE.url). */
  defaultOgImage: '/og/og-default.png',
} as const;

/**
 * Contactgegevens.
 */
export const CONTACT = {
  email: 'info@chrisonline.nl',
  /** Wordt gebruikt voor het mailto-fallback onderwerp. */
  emailSubject: 'Aanvraag via chrisonline.nl',
  /** Boekingslink voor een (video)gesprek — zelfde bron als de chat (PUBLIC_BOOKING_URL). */
  bookingUrl: import.meta.env.PUBLIC_BOOKING_URL || 'https://cal.eu/chrissnoek/30min',
} as const;

/**
 * Social profielen. De `url`-waarden komen ook in JSON-LD `sameAs` terecht,
 * dus houd ze volledig en correct.
 */
export const SOCIALS = [
  {
    name: 'LinkedIn',
    handle: 'chrissnoek',
    url: 'https://www.linkedin.com/in/chrissnoek',
    icon: 'linkedin',
  },
  {
    name: 'E-mail',
    handle: CONTACT.email,
    url: `mailto:${CONTACT.email}`,
    icon: 'mail',
  },
] as const;

/**
 * Hoofdnavigatie. `href` is relatief aan de root; anchor-links (#...) scrollen
 * op de homepage naar de betreffende sectie.
 */
export const NAV = [
  { label: 'Werk', href: '/#werk' },
  { label: 'Werkwijze', href: '/#werkwijze' },
  { label: 'Over mij', href: '/#over' },
  { label: 'Diensten', href: '/#diensten' },
  { label: 'Automatisering', href: '/automatisering' },
] as const;

export type Social = (typeof SOCIALS)[number];
export type NavItem = (typeof NAV)[number];
