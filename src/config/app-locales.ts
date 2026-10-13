export type AppLocale = 'nl' | 'en';

export const APP_LANGUAGE_PAGES = [
  { nl: '/shopify-apps/', en: '/en/shopify-apps/' },
  { nl: '/werk/specfinch/', en: '/en/shopify-apps/specfinch/' },
  { nl: '/werk/promofinch/', en: '/en/shopify-apps/promofinch/' },
] as const;

export function appLanguageAlternates(pathname: string) {
  const path = pathname.replace(/\/$/, '');
  const pair = APP_LANGUAGE_PAGES.find((page) =>
    Object.values(page).some((href) => href.replace(/\/$/, '') === path),
  );
  return pair
    ? [
        { lang: 'nl' as const, href: pair.nl },
        { lang: 'en' as const, href: pair.en },
      ]
    : [];
}

export const EN_APP_NAV = [
  { label: 'Shopify Apps', href: '/en/shopify-apps/' },
  { label: 'SpecFinch', href: '/en/shopify-apps/specfinch/' },
  { label: 'PromoFinch', href: '/en/shopify-apps/promofinch/' },
] as const;
