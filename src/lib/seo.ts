import { SITE } from '../config/site';

export interface Crumb {
  label: string;
  /** Site-relatief pad; weglaten voor de huidige pagina. */
  href?: string;
}

/** BreadcrumbList-structured data, gelijk aan de zichtbare broodkruimels. */
export function breadcrumbLd(items: Crumb[], currentPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.href ?? currentPath, SITE.url).href,
    })),
  };
}

/** FAQPage-structured data uit een lijst vraag/antwoord. */
export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
