// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://commercialfitout.co.uk',
  // URLs never end in a slash (except the homepage "/"). See README → URLs.
  trailingSlash: 'never',
  output: 'static',
  integrations: [
    sitemap({
      // 404 is excluded automatically (not a route); filter is a safety net
      filter: (page) => !page.includes('/404') && !page.includes('/thank-you'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  build: {
    // Emit about.html rather than about/index.html so the server can serve
    // /about directly, without redirecting it to /about/ (see public/.htaccess).
    format: 'file',
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
