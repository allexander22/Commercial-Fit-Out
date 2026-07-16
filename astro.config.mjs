// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://commercialfitout.co.uk',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    sitemap({
      // 404 is excluded automatically (not a route); filter is a safety net
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  build: {
    // Keep all CSS in external files so the Content-Security-Policy
    // does not need 'unsafe-inline' for styles.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline JS/assets into HTML — required for a strict CSP
      // (script-src 'self') without inline-script hashes.
      assetsInlineLimit: 0,
    },
  },
});
