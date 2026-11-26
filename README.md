# commercialfitout.co.uk

Marketing website for **A2 Commercial Fit Out LTD**. It is a static Astro site, deployed to GitHub Pages and **live at <https://commercialfitout.co.uk/>**.

## Overview

- Framework: [Astro](https://astro.build) v5, `output: 'static'`, `trailingSlash: 'always'`
- Styling: hand-written global CSS tokens (`src/styles/global.css`) plus Astro scoped `<style>` per component, with no CSS framework
- Fonts: self-hosted Barlow, Barlow Condensed and IBM Plex Mono (`public/fonts/*.woff2`)
- Content: Astro Content Collections (Markdown + zod schemas) for sectors, case studies and insights articles
- Images: real photography through `astro:assets` + Sharp, with AVIF/WebP generated at build time
- Hosting: GitHub Pages with the custom domain `commercialfitout.co.uk`, deployed by GitHub Actions on every push to `main`

## Current state of the live site

| Area | Status |
|---|---|
| Domain / HTTPS | Live on the apex domain over HTTPS. `http://` and `www.` both 301-redirect to `https://commercialfitout.co.uk/`. |
| Pages | 30 URLs in `/sitemap-index.xml` (listed below). |
| Logo | Real supplied artwork (`src/assets/brand/logo-mark-transparent.png`) in the header and footer. |
| Photography | Real photos on all service, hub and article pages. The homepage hero is a looping background video (`public/A2 Commercial Fit Out Intro.mp4`, poster `hero.jpg`). |
| Case studies | **Placeholders.** All 3 carry the "Example project" label (`placeholder: true`). |
| Contact form | Live on `/contact/` and the homepage. Submissions go through Web3Forms to the inbox registered with the access key, with hCaptcha spam protection (see [Contact form](#contact-form)). |
| Phone number | **Not set.** `PHONE` is empty in `src/consts.ts`, so phone links are hidden site-wide. |
| Location pages | **Disabled.** `/locations/` returns 404 (see [Location pages](#location-pages-disabled)). |
| Cookie banner | Live (necessary / analytics choice, stored in `localStorage`). |
| Analytics | **None installed yet.** The cookie banner exposes `window.a2CookieConsent.hasAnalyticsConsent()` so that any future script can check consent first. |
| Accreditations | CHAS / SafeContractor shown on the homepage, about, contact and footer. |

### Site map (live)

- **Core:** `/`, `/about/`, `/contact/`, `/commercial-fit-out-statistics/`, `/privacy-policy/`, `/modern-slavery-statement/`
- **Services** (`/services/`): `office-fit-out`, `office-refurbishment`, `retail-fit-out`, `healthcare-fit-out`, `landlord-refurbishment`, `higher-education-fit-out`
- **Sectors** (`/sectors/`): `industrial`, `pubs-and-bars`, `shops`, `turnkey`, `bespoke-joinery-fit-out`
- **Projects** (`/projects/`): `maidstone-office-fit-out`, `london-retail-unit-fit-out`, `essex-industrial-unit-office-fit-out` (all example placeholders)
- **Insights** (`/insights/`): `cat-a-vs-cat-b-fit-out`, `commercial-fit-out-costs`, `calculating-office-refurbishment-costs-uk`, `managing-commercial-fit-out-projects-fixed-budget`, `benefits-of-out-of-hours-office-refurbishment`, `healthcare-fit-out-compliance-requirements`

Header nav: Home · Services · Sectors · Projects · Insights · About · Contact, plus a "Get a quote" button. Navigation is defined in `src/consts.ts`.

## Prerequisites

- Node.js 22.x (LTS). The deploy workflow pins the same version.
- npm

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the production build locally |

On Windows, if `node`/`npm` aren't on your PATH, prefix commands with:
`$env:Path = "$env:LOCALAPPDATA\Programs\nodejs;$env:Path"; `

## Project structure

```
src/
├─ consts.ts               # site name, email, PHONE, nav + service links (edit here first)
├─ content.config.ts       # Content Collections schemas
├─ content/
│  ├─ sectors/             # 5 sector pages
│  ├─ caseStudies/         # 3 example/placeholder project pages
│  ├─ insights/            # 6 articles
│  └─ locations/           # 4 location pages (content kept, routes disabled)
├─ _disabled/locations/    # location page routes, moved out of src/pages/ so they don't build
├─ layouts/BaseLayout.astro# <head>, CSP meta tag, header/footer, cookie banner
├─ components/             # Header, Footer, Logo, Seo, Hero, cards, ContactForm, CookieConsent,
│                          #   FaqAccordion, AccreditationBadges, UspGrid, schema/* (JSON-LD)
├─ styles/global.css       # design tokens (colour, type scale, spacing) + base styles
├─ scripts/                # nav.js (mobile nav), hero-video.js (reduced-motion pause),
│                          #   cookie-consent.js
├─ assets/brand/           # logo artwork
├─ assets/images/          # site photography
└─ pages/                  # routes: services/*.astro are hand-written pages;
                           #   sectors/, projects/, insights/ are generated from collections
public/                    # CNAME, robots.txt, favicon, og-image, fonts, hero video
docs/IMPLEMENTATION_PLAN.md# original build plan and keyword mapping (historical reference)
```

## Editing content

Every push to `main` rebuilds and redeploys the live site automatically, usually within a couple of minutes. Run `npm run build` locally first to catch errors.

### Replace an example case study with a real one

1. Edit (or create) `src/content/caseStudies/<slug>.md`. The frontmatter must match the schema in `src/content.config.ts`: `title`, `metaDescription`, `sector`, `location`, `sqFt`, `durationWeeks`, `outcome`, `placeholder`, `order`, and optionally `metaTitle`.
2. Write the body in Markdown. It becomes the page content below the facts panel.
3. Set `placeholder: false` once the project is real and verified. This removes the "Example project" flag from the card and the page.
4. The route `/projects/<slug>/` is generated automatically.

> The current example pages contain illustrative figures and outcomes. Replace or remove them before relying on them as real claims.

### Add an insights article

Create `src/content/insights/<slug>.md` with `title`, `metaDescription`, `publishDate` (YYYY-MM-DD), `summary` and `order`, plus the optional `metaTitle`, `readTime` and `faqs` (a list of `question`/`answer` pairs, rendered as an FAQ section). Route: `/insights/<slug>/`.

### Add a sector page

Create `src/content/sectors/<slug>.md` (`title`, `keyword`, `metaDescription`, `summary`, `order`, optional `heroImage`). It appears on `/sectors/` automatically.

### Service pages

The six service pages are individual `.astro` files in `src/pages/services/`. To add one, create a new file there, add it to `SERVICE_LINKS` in `src/consts.ts` (which feeds the footer and the 404 page), and add a card for it on `src/pages/services/index.astro`.

### Images

Put photography in `src/assets/images/` and import it statically in the page (`<Image>`/`<Picture>` need a static import, not a runtime path). Use 16:9 for heroes and 3:2 elsewhere. `scripts/generate-placeholders.mjs` is a leftover from the build phase. Don't re-run it, because it would overwrite the real photos.

### Contact form

The form (`src/components/ContactForm.astro`, used on `/contact/` and the homepage) posts to [Web3Forms](https://web3forms.com), which emails each enquiry to the address the access key was registered with.

- **Access key:** `WEB3FORMS_ACCESS_KEY` at the top of the component. It's meant to be public, so committing it is fine. If it's ever reset to a `YOUR_…` placeholder, the form automatically shows a "please email us" note instead.
- **Change the recipient inbox, subject line or other settings:** sign in at <https://app.web3forms.com> with the registered email.
- **Spam protection:** hCaptcha, through Web3Forms' free integration, using Web3Forms' shared free-plan site key (`HCAPTCHA_SITE_KEY`). There's no hCaptcha account involved. Web3Forms only checks the hCaptcha answer if **hCaptcha** is selected as the captcha in the form's settings at app.web3forms.com, so keep that setting on. (reCAPTCHA and Turnstile are paid Web3Forms Pro features, which is why they aren't used.)
- The CSP in `BaseLayout.astro` allows `hcaptcha.com` / `*.hcaptcha.com` and posting to `api.web3forms.com`. The privacy policy names Web3Forms and hCaptcha. Update both if the form provider changes.

### Location pages (disabled)

The London, Kent, Essex and Maidstone pages were taken off the site. Their content is still in `src/content/locations/` and their routes are in `src/_disabled/locations/`. To bring them back:

1. Move `src/_disabled/locations/` back to `src/pages/locations/`.
2. Restore `LOCATION_LINKS` in `src/consts.ts` (see git history) and wherever it was linked from (header, footer, homepage).
3. Rebuild. The pages will reappear in the sitemap automatically.

## Outstanding setup

### Phone number

Set `PHONE` in `src/consts.ts` (e.g. `'01622 000000'`). It then appears automatically in the header, footer, contact page and LocalBusiness schema.

### Analytics (optional)

[Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) and [Plausible](https://plausible.io) are both lightweight options. Add the script tag in `BaseLayout.astro`, add its host to `script-src` (and `connect-src` if needed) in the CSP, and load it only when `window.a2CookieConsent.hasAnalyticsConsent()` is true.

### Also pending (outside this repo)

- Google Business Profile (Maidstone) and Google Search Console sitemap submission
- Light-background logo artwork (`Logo.astro`'s `variant="light"` is currently a hand-made vector stand-in)
- Statistics page sources were last checked on 31 July 2026. Re-check them periodically.

## Hosting & deployment

- Workflow: `.github/workflows/deploy.yml`. It runs `withastro/action@v3` (Node 22) and then `actions/deploy-pages@v4` on push to `main` or on manual dispatch.
- **Settings → Pages:** the source is **GitHub Actions** and the custom domain is `commercialfitout.co.uk`, with **Enforce HTTPS** on. With an Actions deployment, the repo setting controls the domain and `public/CNAME` is ignored.
- DNS: four apex `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153` (plus optional `AAAA` records `2606:50c0:8000::153` … `8003::153`), and `www` as a `CNAME` to the account's `github.io` host. Keep the `MX`/`TXT` records for email.
- The domain is verified on the GitHub account to prevent takeover. Don't remove the `_github-pages-challenge-…` TXT record.

### Known limitation: no custom HTTP headers

GitHub Pages can't set response headers, so the Content-Security-Policy and Referrer-Policy are delivered as `<meta>` tags in `BaseLayout.astro`. The CSP is self-only, except for hCaptcha (script/style/frame/connect) and Web3Forms (form-action). `X-Frame-Options` and HSTS preload aren't possible on GitHub Pages alone. To add them, front the site with Cloudflare (free tier) and keep GitHub Pages as the origin.
