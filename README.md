# RealEstate.co

A complete fictional Delhi NCR property advisory, originally briefed as Northstone Realty and renamed RealEstate.co by the owner. Built around search → property → map → enquiry → site visit.

## Stack and architecture

- React 19, TypeScript, Vite and Tailwind CSS with a bespoke responsive stylesheet.
- Structured demo inventory in `src/data/properties.ts`: 15 listings spanning seven property types and six cities.
- React Router with 48 statically pre-rendered public routes, route metadata, Open Graph, JSON-LD, sitemap, robots and a real 404 page. No SPA rewrite needed: known routes have their own HTML.
- Lazy-loaded MapLibre GL JS using OpenStreetMap raster tiles. `src/lib/map-provider.ts` is the provider boundary for replacing the map integration. Markers and list selection stay synchronized; mobile uses separate List / Map views.
- Cloudflare Pages Functions endpoint at `/api/enquiries`, with Cloudflare D1 persistence. Server-side validation, same-origin checks, consent, honeypot, request-size limits and atomic rate limiting (five requests per IP-derived daily key per hour).
- No advertising scripts, tracking cookies, frontend secrets or real-time 3D engine. Fonts and WebP imagery are served locally.

## Local development

Requires Node.js 22 or newer and pnpm 10.11.0.

```sh
corepack enable
pnpm install
pnpm dev
```

The Vite development server serves the frontend. To exercise the real API locally:

```sh
pnpm build
pnpm exec wrangler d1 migrations apply realestate-enquiries --local
pnpm exec wrangler pages dev dist
```

## Checks and production build

```sh
pnpm check
pnpm test
pnpm build
```

Build creates the optimized browser bundle, an ephemeral server-rendering bundle, and static HTML for every public route. The server-rendering intermediate is removed. Only `dist` is deployed, and it is ignored by Git.

## Cloudflare Pages

- Project: `realestate-co`
- Production branch: `main`
- Build command: `npx --yes pnpm@10.11.0 install --frozen-lockfile && npx --yes pnpm@10.11.0 run build`
- Output directory: `dist`
- Node version: `22`
- Functions directory: `functions`
- D1 binding: `ENQUIRIES`; database: `realestate-enquiries`
- `wrangler.toml` contains the public database resource ID, not credentials.
- `public/_headers` configures security headers and immutable caching for fingerprinted assets.

Apply schema changes before deploying functions that require them:

```sh
pnpm exec wrangler d1 migrations apply realestate-enquiries --remote
```

Git-integrated Pages builds deploy automatically after pushes to `main`. Wrangler can also deploy the same project when needed:

```sh
pnpm exec wrangler pages deploy dist --project-name realestate-co
```

## Configuration

The owner-authorized contact defaults are +91 97621 10536 and mayodevs01@gmail.com. Optional public build variables:

| Variable | Purpose |
| --- | --- |
| `VITE_CONTACT_PHONE` | International digits for calls and WhatsApp |
| `VITE_CONTACT_EMAIL` | Enquiry and privacy email |
| `VITE_SITE_URL` | Canonical origin, sitemap and social metadata; default https://realestate-co.pages.dev |

`.env.example` documents these. Never commit `.env`, Cloudflare tokens or other secrets. When using a custom domain, set `VITE_SITE_URL` and rebuild. Naming the brand RealEstate.co does not assert ownership of that domain.

## Enquiries and operations

Successful requests are stored in the private D1 `enquiries` table. The public endpoint cannot list or retrieve them. Review requests in Cloudflare Dashboard → Workers & Pages → D1 → realestate-enquiries → Console; `payload` contains the submitted requirement. No email notification is implied or sent. WhatsApp opens a prefilled message for the visitor to send.

An appointment is only a request until the advisor confirms it. On submission errors, the form retains the details and provides a WhatsApp fallback. PII is not saved in browser storage or application logs.

Expired requests are removed during successful submissions; the operator should also run the following at least monthly when traffic is low:

```sql
DELETE FROM enquiries WHERE created_at < datetime('now','-90 days');
```

Daily IP hashes are cleared after one day during submissions. For a high-volume public launch, add Cloudflare Turnstile and platform rate limiting, notification delivery, monitoring and a scheduled retention job. No paid services were required for this demo. Preview environments should use a separate D1 database; do not send preview tests to the production database.

## Content and imagery

All inventory is illustrative and marked accordingly; no availability or RERA registration is claimed. Project and customer stories are fictional, except the explicitly illustrative ATS Pristine example. Representative stock images are not photographs of listed properties. Rental estimates and gross yields are not guaranteed. Replace this data with authorised inventory and verified compliance details before operating as a real brokerage.

The blue-glass tower is a custom AI-generated architectural asset. Stock imagery is from Unsplash: photo IDs and download/optimization process are recorded in `scripts/assets.mjs`. Existing assets are checked in and are sufficient to build; regeneration is optional. Pass a source PNG path to `node scripts/assets.mjs /path/to/tower.png` to replace the tower; omit the argument to regenerate only stock photos. `node scripts/fonts.mjs` refreshes the local variable fonts. Fonts are DM Sans and Manrope from Google Fonts, with open font licenses in `public/fonts`.

## Structure

```text
src/components/   Reusable search, cards, map, forms and layout
src/pages/        Home, detail, discovery, contact and legal pages
src/data/         Structured properties and locality data
src/lib/          Formatting, filtering, contact links and map provider
src/types/        TypeScript models
functions/api/    Validated enquiry endpoint
migrations/       D1 schema
scripts/          Static generation and asset preparation
tests/            Inventory and enquiry validation tests
public/           Optimized assets, fonts and security headers
```
