# Project rules

## URLs: no trailing slashes

Page URLs never end in `/`. The homepage `/` is the only exception. This applies to every new page and every link: `href`s, Markdown links in `src/content`, `src/consts.ts` nav lists, `Breadcrumbs` items, `ServiceSchema` `url`, `canonicalPath`, and template literals such as `` `/insights/${article.id}` ``.

`astro.config.mjs` uses `trailingSlash: 'never'` and `build.format: 'file'`, and `public/.htaccess` serves the extensionless URLs. `npm run build` fails if any internal URL in `dist/` ends in `/` (`scripts/check-trailing-slashes.mjs`). Full details are in the README, under "URLs: no trailing slashes".
