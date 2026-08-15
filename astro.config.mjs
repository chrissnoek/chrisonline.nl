// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Required for absolute canonical URLs, Open Graph images and the sitemap.
  site: 'https://www.chrisonline.nl',
  // De site blijft statisch: elke pagina wordt geprerenderd, behalve de enkele
  // on-demand route(s) die expliciet `export const prerender = false` zetten
  // (de AI-chat-endpoint). De Netlify-adapter draait die als één Function.
  output: 'static',
  adapter: netlify(),

  integrations: [
    mdx(),
    // React: het chat-eiland gebruikt @ai-sdk/react (useChat). Het eiland levert
    // zijn runtime alleen op pagina's waar het staat (de homepage).
    react(),
    sitemap({
      // A clean, modern lastmod helps crawlers; one entry per page.
      changefreq: 'monthly',
      priority: 0.7,
      // De bedankpagina is noindex en hoort daarom niet in de sitemap.
      filter: (page) => !page.includes('/bedankt/'),
    }),
  ],

  // Native Astro v6 Fonts API (stable): self-hosts + subsets de fonts,
  // generates fallback metrics (zero CLS) and injects the preload links.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    // Display-face voor grote koppen (h1/h2/hero-groet): karaktervolle,
    // licht hoekige grotesk die het hexagon-merk echoot. Body blijft Inter.
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      weights: ['500 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Tasteful, fast page transitions by default; Astro disables these
  // automatically under prefers-reduced-motion.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
