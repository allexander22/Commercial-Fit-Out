# commercialfitout.co.uk — Astro Static Site Implementation Plan

## Context

A2 Commercial Fit Out LTD (Maidstone, Kent) needs a new marketing website at **commercialfitout.co.uk**, launching ~August 2026 to capture the September search-demand peak. Acquisition is **organic SEO only**, so every page is mapped to a target keyword from the May 2025–Apr 2026 keyword research. The site must be SEO-optimised, WCAG-accessible, follow HTTPS/security best practices, and ship a near-zero JS/CSS bundle with built-in image optimisation.

**Confirmed decisions:** Astro (static output) · GitHub Pages hosting via GitHub Actions · vanilla scoped CSS (no framework) · Markdown Content Collections for editable content · full draft SEO copy written during the build.

**Hard content rules:**

- No references to any previous company, brand, or shared history anywhere in public content — A2 is presented as a standalone brand. Experience is stated generically ("over 15 years' experience delivering commercial projects across London and the South East").
- Delivery contractor positioning, **not** a design house — design keywords approached from the delivery angle.
- Lead everywhere with the 4 USPs: fixed-price quotes, in-house trades, out-of-hours working, speed of delivery.
- UK English, UK compliance references (Building Regulations, fire safety, CDM 2015), CHAS/SafeContractor badges site-wide.
- Exclude competitor brand names and non-UK terms from all content.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Astro (latest v5), `output: 'static'` |
| Styling | Global design-token stylesheet + Astro scoped `<style>` per component; no CSS framework |
| Content | Astro Content Collections (Markdown + zod schemas) for case studies, insights/blog, locations, sectors |
| Images | `astro:assets` (Sharp) — build-time AVIF/WebP, responsive `srcset`, enforced dimensions |
| Fonts | System font stack (zero network requests); brand feel via weight/spacing/colour |
| SEO plumbing | `@astrojs/sitemap`, hand-rolled `robots.txt`, JSON-LD components |
| Hosting | GitHub Pages + custom domain, HTTPS enforced, deployed by `withastro/action` on push to `main` |
| Client JS | ~0 KB. Single tiny script for mobile nav (`aria-expanded` toggle); everything else pure HTML/CSS |

**GitHub Pages caveat (documented in README):** Pages cannot send custom HTTP headers. Mitigations: CSP via `<meta http-equiv>` (everything is self-hosted so a strict policy works), `referrer-policy` via meta, no third-party embeds. `X-Frame-Options`/HSTS-preload can be added later by fronting with free Cloudflare — noted as an optional post-launch step, not required now.

## Site Map & Keyword Mapping

URLs are flat, lowercase, hyphenated, with trailing slashes; canonical = `https://commercialfitout.co.uk/...`.

| Page | URL | Primary keyword(s) |
|---|---|---|
| Home | `/` | commercial fit out, commercial fit out company |
| Office Fit Out | `/services/office-fit-out/` | office fitout, office fit out companies, office fit out contractors |
| Office Refurbishment | `/services/office-refurbishment/` | office refurbishment companies/contractors, commercial office refurbishment |
| Retail Fit Out | `/services/retail-fit-out/` | retail fit out companies/contractors, shop fitout |
| Healthcare Fit Out | `/services/healthcare-fit-out/` | healthcare fit out (sector credibility page) |
| Services hub | `/services/` | fit out company, fit out contractor, commercial fit out services |
| Sectors hub | `/sectors/` | interior fit out companies/contractors |
| Sector pages ×5 | `/sectors/industrial/`, `/sectors/pubs-and-bars/`, `/sectors/turnkey/`, `/sectors/bespoke-joinery-fit-out/`, `/sectors/shops/` | industrial fit out (+contractors), pub/bar fit out companies, turnkey fit out, bespoke fit out, shop fitout |
| Cost guide | `/commercial-fit-out-costs/` | fitout costs, commercial fit out costs, cost per m²/sq ft (FAQ-rich) |
| Locations hub | `/locations/` | fit out companies near me (via GBP + local signals) |
| Location pages ×4 | `/locations/london/`, `/locations/kent/`, `/locations/essex/`, `/locations/maidstone/` | "{service} + {location}" variants; Midlands deferred |
| Projects hub | `/projects/` | case-study index |
| Case studies ×3 | `/projects/<slug>/` | long-tail + internal-link source to services/locations |
| About | `/about/` | brand/experience/accreditations |
| Contact | `/contact/` | conversion page |
| Insights hub + 2 launch articles | `/insights/`, `/insights/<slug>/` | informational queries (e.g. "fit out costs per square foot explained", "cat a vs cat b fit out") |
| Privacy, 404 | `/privacy-policy/`, `/404.html` | — |

≈ 25 pages at launch. Case studies use realistic but clearly-marked placeholder data (type, location, sq ft, duration, outcome) awaiting the real 3–5 selected projects and photos.

## Project Structure

```
/
├─ .github/workflows/deploy.yml     # build + deploy to GitHub Pages
├─ astro.config.mjs                 # site URL, sitemap, image config
├─ public/
│  ├─ CNAME, robots.txt, favicon.svg, .nojekyll
├─ src/
│  ├─ styles/global.css             # tokens: colours, type scale, spacing, focus styles, reduced-motion
│  ├─ assets/                       # logo variants, hero/section images (optimised via astro:assets)
│  ├─ layouts/BaseLayout.astro      # <head> SEO block, skip link, header, footer, JSON-LD slot
│  ├─ components/
│  │  ├─ Header.astro / Footer.astro (nav, CHAS+SafeContractor badges, NAP)
│  │  ├─ Seo.astro                  # title, description, canonical, OG/Twitter, meta CSP
│  │  ├─ schema/ (LocalBusiness, Service, BreadcrumbList, FAQPage .astro components)
│  │  ├─ Hero, UspGrid, CtaBanner, FaqAccordion (<details>), CaseStudyCard,
│  │  │  ServiceCard, Breadcrumbs, ContactBlock, ResponsiveImage
│  ├─ content.config.ts             # zod schemas: caseStudies, insights, sectors, locations
│  ├─ content/ (caseStudies/, insights/, sectors/, locations/ as .md)
│  └─ pages/ (index, about, contact, privacy-policy, 404, commercial-fit-out-costs,
│             services/*, sectors/[slug], locations/[slug], projects/[slug], insights/[slug])
└─ README.md                        # editing guide, deploy notes, DNS + headers caveats
```

## Implementation Steps

1. **Scaffold** — Astro (minimal), add `@astrojs/sitemap`; configure `astro.config.mjs` with `site: 'https://commercialfitout.co.uk'`, trailing slashes, sitemap filter. Add `public/CNAME`, `.nojekyll`, `robots.txt` (allow all + sitemap URL).
2. **Design system** — `global.css` with brand tokens (near-black base `#0b0d10`, silver/steel greys, blue accent tuned for ≥4.5:1 contrast on both dark and light sections), fluid type scale via `clamp()`, spacing scale, visible `:focus-visible` styles, `prefers-reduced-motion` guard. Placeholder SVG logo (dark + light colourways) until final assets arrive.
3. **Core layout & components** — `BaseLayout` (lang="en-GB", skip-to-content link, semantic landmarks), `Seo.astro`, header with accessible mobile nav (tiny script toggling `aria-expanded`; works as fully-expanded list if JS absent), footer with NAP, accreditation badges, service/location link columns (internal-link mesh).
4. **Structured data** — `LocalBusiness` (site-wide: Maidstone address, `areaServed` London/Kent/Essex/South East), `Service` (service pages), `BreadcrumbList` (all non-home), `FAQPage` (cost guide + service FAQs). Email `info@commercialfitout.co.uk`; phone marked TBC placeholder.
5. **Content collections** — schemas + seed content: 3 case studies (placeholder-flagged), 5 sector docs, 4 location docs, 2 insights articles.
6. **Pages with full draft copy** — homepage first (4 USPs above the fold, services grid, projects teaser, FAQ, CTA), then services ×4 + hub, cost guide (band tables per m²/sq ft, FAQ schema, fixed-price CTA), sectors, locations (unique local copy — transport/compliance/project-type angles, no doorway-page boilerplate), projects, about, contact, insights, privacy, 404. Every page: unique title (≤60 chars), meta description (≤155), one `<h1>`, logical heading tree, keyword-mapped body copy, contextual internal links.
7. **Contact conversion** — prominent `mailto:` + phone placeholder on every page (header CTA + footer); contact page form markup wired for Web3Forms/Formspree (static-host-compatible) with the access key left as a clearly-marked TODO — mailto works meanwhile.
8. **Images** — all via `astro:assets`/`<Image>`: AVIF/WebP with fallback, width/height set (no CLS), `loading="lazy"` below the fold, hero preloaded + `fetchpriority="high"`, descriptive alt text. Local placeholder imagery until project photos arrive.
9. **Deploy pipeline** — `.github/workflows/deploy.yml` using `withastro/action` → `actions/deploy-pages`. README documents: repo setup, Pages custom-domain + "Enforce HTTPS" steps, DNS records (A/AAAA + CNAME), and the optional Cloudflare header upgrade.
10. **QA pass** — see Verification.

## Verification

- `npm run build` clean; inspect `dist/` — confirm **zero `<script>` payloads** except the ~0.5 KB nav toggle, single small CSS file, AVIF/WebP variants generated, sitemap + robots + CNAME present.
- `npm run preview` and click through every page and nav path (desktop + mobile widths).
- **Lighthouse** on home, one service page, cost guide — target ≥95 Performance/SEO/Accessibility/Best Practices.
- **Accessibility:** keyboard-only walkthrough (skip link, nav toggle, FAQ `<details>`, focus visibility), axe-core scan against preview, contrast checks of token pairs.
- **SEO:** validate JSON-LD with schema validator; check unique titles/descriptions/canonicals across `dist/`; confirm sitemap lists all indexable pages and excludes 404.
- **Content rules sweep:** search `dist/` for excluded brand names and non-UK spellings — must be zero hits.
- Post-approval: push to GitHub, enable Pages, verify live HTTPS + www→apex redirect behaviour.

## Out of Scope (flagged for later)

Real project photos/case-study data, final logo files, phone number, Google Business Profile setup, Midlands location pages, analytics choice (recommend Cloudflare Web Analytics or Plausible later — GA4 would add third-party JS), form access key.
