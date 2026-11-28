// Fails the build if any internal URL in dist/ ends in a trailing slash.
// Site rule: page URLs never end in "/" (the homepage "/" is the only exception).
// Runs automatically after `astro build` (see package.json "build").
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SITE = 'https://commercialfitout.co.uk';

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );

// href/src/content/action attributes, JSON-LD "item"/"url" values and sitemap <loc>.
const patterns = [
  /(?:href|action|content|value)="([^"]+)"/g,
  /"(?:item|url|@id)":"([^"]+)"/g,
  /<loc>([^<]+)<\/loc>/g,
];

const problems = [];
for (const file of walk(DIST).filter((f) => /\.(html|xml)$/.test(f))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const re of patterns) {
    for (const [, raw] of text.matchAll(re)) {
      let url = raw.replace(/[?#].*$/, '');
      if (url.startsWith(SITE)) url = url.slice(SITE.length);
      else if (!url.startsWith('/') || url.startsWith('//')) continue; // external / non-URL
      if (url.length > 1 && url.endsWith('/')) problems.push(`${file}: ${raw}`);
    }
  }
}

if (problems.length) {
  console.error(`\n✖ Trailing-slash URLs found (${problems.length}). Remove the final "/" from these links:\n`);
  for (const p of [...new Set(problems)]) console.error(`  ${p}`);
  process.exit(1);
}
console.log('✔ No trailing-slash URLs in dist/');
