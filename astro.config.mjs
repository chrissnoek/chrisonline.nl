// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Required for absolute canonical URLs, Open Graph images and the sitemap.
  site: 'https://chrisonline.nl',
  // De site blijft statisch: elke pagina wordt geprerenderd, behalve de enkele
  // on-demand route(s) die expliciet `export const prerender = false` zetten
  // (de AI-chat-endpoint). De Netlify-adapter draait die als één Function.
  output: 'static',
  adapter: netlify(),

  integrations: [
    mdx(),
    vue(),
    sitemap({
      // A clean, modern lastmod helps crawlers; one entry per page.
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],

  // Native Astro v6 Fonts API (stable): self-hosts + subsets Inter,
  // generates fallback metrics (zero CLS) and injects the preload link.
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
