# Royal Cars — UX/UI and performance overhaul

Phased rebuild of the front end. The written review that produced this plan
covers the findings, the measured performance diagnosis and the design
rationale; this file is the working checklist.

## Approved decisions

| # | Decision |
| --- | --- |
| 1 | Palette moves to **Daylight** — light ground, amber kept as the action colour. A refined dark palette stays defined as a token set. |
| 2 | Add **Archivo** (semi-expanded 700) as a display face for prices and headlines. Geist remains the UI face. |
| 3 | Rendering: attempt Next 16 **Cache Components** (static shell + streamed dynamic holes); fall back to static/ISR plus a client session island if the NextAuth beta blocks it. |
| 4 | Brand logos: **typographic tiles** with live counts, not third-party logo files. An optional logo slot stays for licensed SVGs. |
| 5 | Promoted listings: **pin two per page**, labelled "Featured", instead of sorting all promoted rows first. |
| 6 | **Remove** the floating WhatsApp/Instagram buttons. Contact lives on cards, detail pages and the footer, from environment variables. |
| 7 | URL parameters: keep existing names, add `q`, `model`, `maxKm`, `agency`, `dealer`, `spec`, `includeSold`. Multi-select uses comma lists. |
| 8 | Add a nullable `specOrigin` enum to `Vehicle`. |
| 9 | Replace unverifiable trust claims with what the product actually does. |
| 10 | Baseline migration `0_init`; run `prisma migrate resolve --applied 0_init` once against existing databases. |

## Phases

- [x] **0 — Baseline and guardrails.** Lint clean, `middleware.ts` → `proxy.ts`,
  baseline migration, pool sizing, rate limits and Zod on every mutation,
  `media-src` in the CSP, floating socials removed, contact from env.
- [x] **1 — Design tokens and primitives.** Semantic tokens, type scale,
  spacing and radius, focus-visible, reduced motion, every component migrated
  off literal palette classes, standards file rewritten.
- [x] **2 — Rendering and data architecture.** `src/lib/data` with `server-only`
  and cache tags, composite indexes, session out of the root layout, no
  server-rendered invisible content, image priority, pagination as links.
- [x] **3 — Filters and search.** Full-text search, multi-select facets,
  mileage, agency import, spec origin, dealer, include-sold, log-scale price
  slider, count preview, no-results recovery.
- [x] **4 — Card and grid.** One link target, exact price, controls outside the
  link, image fallback.
- [x] **5 — Landing page.** Hero with search, real inventory, browse by body
  type and budget, real counts.
- [x] **6 — Detail page.** Gallery with lightbox and video, price context,
  similar cars, share, structured data.
- [x] **7 — Dealer pages and site SEO.** `/dealers`, sitemap, robots.
- [x] **8 — Account features.** Saved searches, working profile form.
- [x] **9 — Dealer tooling polish.** Spec origin in the listing form, honest
  verified state.

## Definition of done for every phase

1. `npm run build` exits clean.
2. `npm run lint` exits clean.
3. No server-rendered content is invisible at first paint.
4. No text below 12px, every interactive element has a visible focus state.
5. Filter state survives a copy-pasted URL and a refresh.
6. Layout verified at 360px before desktop is considered done.

## Notes for whoever picks this up

**Migrations touching `Vehicle` need a hand.** `searchVector` is a Postgres
GENERATED column and Prisma has no way to express one, so it is declared
`Unsupported("tsvector")`. `prisma migrate dev` re-diffs the whole schema and
emits an `ALTER COLUMN ... SET DEFAULT` for it that Postgres rejects. Write
migrations that touch the Vehicle table by hand and apply them with
`prisma migrate deploy`; everything else can go through `migrate dev`.

**One raw SQL query.** `src/lib/data/search.ts` uses a parameterised
`$queryRaw` for full-text ranking and trigram similarity, which Prisma's query
builder cannot express. It returns ids only; the rows are loaded through
Prisma as usual.

## Not in this pass

Arabic and RTL. Every component built here uses logical CSS properties
(`ms-`, `pe-`, `start-`, `text-start`) and the root layout takes `lang`/`dir`
from one place, so adding Arabic later is a translation task rather than a
rebuild. Estimated 3–5 days once the English product is settled.
