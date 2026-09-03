---
name: royal-cars-standards
description: Enforces Royal Cars project UI, backend, and animation standards. Use when editing or adding UI, API/server actions, or animations in the royal-cars Next.js app. Applies the semantic design-token system, Prisma-only data access with cached reads, Upstash rate limiting, and the CSS-first motion policy.
---

# Royal Cars Standards

Apply these rules whenever changing or adding UI, server/API logic, or
animations in this project.

## UI — semantic tokens, never literal palette values

The palette lives in `src/app/globals.css` and nowhere else. Components
reference a **role**, not a colour. `bg-zinc-900` and `text-amber-500` are
forbidden in components; `bg-surface` and `text-brand-strong` are the same
intent expressed so the palette can change in one file.

| Role | Class | Use for |
|---|---|---|
| Page ground | `bg-canvas` | The page behind everything |
| Card / panel | `bg-surface` | Cards, sheets, popovers, the header |
| Subtle fill | `bg-surface-2` | Inputs, table headers, hover states |
| Stronger fill | `bg-surface-3` | Pressed states, slider tracks |
| Dark band | `bg-inverse` + `text-inverse-ink` | Hero band, footer, tooltips |
| Primary text | `text-ink` | Headings, prices, values |
| Secondary text | `text-ink-2` | Body copy, labels |
| Tertiary text | `text-ink-3` | Metadata, captions, placeholders |
| Hairline | `border-line` | Dividers and card edges |
| Control edge | `border-line-control` | Input and button borders (3:1) |

### Brand accent

Amber is the **action** colour. It is a fill with dark text, or the
darkened `brand-strong` cut when it must be text.

- Fill: `bg-brand text-brand-ink`, hover `hover:bg-brand-hover`
- Text and links: `text-brand-strong` (never `text-brand` — it fails AA
  on light grounds)
- Tint background: `bg-brand-soft`
- Edge: `border-brand`

### Semantic status — separate from the accent

Colour that means something is not the accent, and never decorative.

- `text-trust` / `bg-trust-soft` — agency import, inspected, active. The
  only green besides WhatsApp.
- `bg-wa` / `hover:bg-wa-hover` — WhatsApp actions only.
- `text-danger` / `bg-danger-soft` — errors, sold, destructive actions.
- `text-warn` / `bg-warn-soft` — rate limits and warnings.

Never colour a tile, badge or icon for variety. If two things are
different colours, that difference must carry meaning.

### Type

Use the scale. Arbitrary sizes (`text-[11px]`) are forbidden and **12px
is the floor** — nothing smaller ships.

`text-caption` 12 · `text-meta` 13 · `text-body-sm` 14 · `text-body` 16 ·
`text-lead` 18 · `text-title` 22 · `text-h2` 26 · `text-h1` 32 ·
`text-display` 40 · `text-hero` 48

Weights: 400, 500, 600, 700 only. Uppercase labels take
`tracking-[0.06em]`.

**`font-display`** (Archivo semi-expanded 700) is reserved for prices and
top-level headings. It is the one distinctly Royal Cars typographic move,
so spending it elsewhere dilutes it. Every figure a buyer compares gets
`tabular-nums` — the `.tabular` utility or `data-numeric`.

**Prices are exact.** `45,000 JOD`, never `45K`. A car listing is a
purchase decision, not a dashboard metric.

### Spacing, radius, layout

- Only Tailwind's 4px scale. No arbitrary lengths in components.
- One container: `max-w-page` (1280px). Gutters `px-4 sm:px-6 lg:px-8`.
- Header height and sidebar width are tokens: `h-header`, `pt-header`,
  `top-header`, `w-sidebar`. Never hand-count a sticky offset.
- Radius: `rounded-control` (8px) for controls, `rounded-card` (12px) for
  cards, `rounded-full` for pills. Not one radius on everything.
- Elevation: hairline borders by default. `shadow-card` for resting
  cards, `shadow-lift` on hover, `shadow-overlay` for things that float.
- Touch targets are at least 44px; pointer targets at least 36px.
- Use **logical** properties so Arabic and RTL stay cheap later: `ms-`,
  `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `text-end`. Never
  `ml-`, `pr-`, `left-`, `text-left`.

### Accessibility

- Focus is handled globally in `globals.css`. Do not remove outlines and
  do not add per-component focus hacks.
- Every interactive element needs an accessible name. Icon-only controls
  take `aria-label`.
- Contrast is non-negotiable: body text 4.5:1, control borders 3:1. The
  tokens above are all verified; a raw hex value in a component is not.

## Backend

- **Reads** live in `src/lib/data/*` and are marked `server-only`.
  Cross-request caching is the `"use cache"` directive plus `cacheTag()`
  from `src/lib/cache-tags.ts` and `cacheLife()`; session-scoped reads
  (`src/lib/data/session.ts`) use React `cache()` only, so they dedupe
  within a render but never persist across requests. Reads are **not**
  server actions — a `"use server"` file exposes every export as a public
  POST endpoint.
- **Never `export const revalidate`.** Cache Components rejects the route
  segment config outright and the build fails. A route that needs caching
  declares `"use cache"` in the function body and takes a tag, so a
  mutation invalidates it instead of a timer expiring it.
- **Writes** live in `src/lib/actions/*` as `"use server"` actions. Every
  one of them, with no exceptions:
  1. verifies the session with `auth()`,
  2. verifies ownership or role against the database,
  3. validates input with a Zod schema from `src/lib/validations/*`,
  4. passes through `safeLimit` from `src/lib/rate-limit`
     (`authRateLimit` keyed by IP for auth, `actionRateLimit` keyed by
     `session.user.id` for everything else),
  5. calls `revalidateVehicleData()` if it changed what a listing shows.
- **Database**: Prisma only, through `db` from `@/lib/db`. The single
  documented exception is the full-text search query, which needs
  Postgres `tsvector` ranking that Prisma cannot express; it is
  parameterised and isolated in one function.
- **Schema changes** ship as migrations in `prisma/migrations`. Never
  `prisma db push` against an environment that matters.

## Motion

**The rule: nothing readable animates in from invisible.** Server-rendered
content is at rest when the HTML arrives. A card that ships as
`opacity: 0` waiting for hydration is a bug, not a transition — it was the
single largest cause of this app feeling slow.

- **CSS first** for hover, press, and overlay transitions: 150–200ms
  `ease-out`. Sheets and dialogs use the existing `tw-animate-css`
  `data-[state]` classes.
- **Framer Motion** only where CSS genuinely cannot do the job: shared
  layout transitions (`layoutId` for the sliding filter indicator),
  drag and swipe gestures (the gallery lightbox), and spring physics on
  a deliberate micro-interaction (the save heart). Import it in the
  component that needs it so it stays off the critical path elsewhere.
- Reduced motion is handled globally by `MotionConfig reducedMotion="user"`
  in the root layout and a `prefers-reduced-motion` block in
  `globals.css`. Do not re-implement it per component.
- Loading states are skeletons that match the real layout, plus
  `aria-busy` on the region. Never a blank.

## Quick reference

| Area | Use | Avoid |
|---|---|---|
| Background | `bg-canvas`, `bg-surface` | `bg-zinc-*`, `bg-white` |
| Text | `text-ink`, `text-ink-2`, `text-ink-3` | `text-zinc-*`, sizes under 12px |
| Accent | `bg-brand text-brand-ink`, `text-brand-strong` | `text-amber-*`, amber as small text |
| Price | exact figure, `font-display`, `tabular-nums` | `45K` |
| Spacing | Tailwind scale, `h-header`, `max-w-page` | `top-[88px]`, `px-[18px]` |
| Direction | `ms-`, `pe-`, `text-start` | `ml-`, `pr-`, `text-left` |
| Reads | `src/lib/data` + `server-only` + cache tag | reads in `"use server"` files |
| Writes | session + ownership + Zod + rate limit | any mutation missing one |
| Motion | CSS transitions; Framer for layout/gesture | SSR content at `opacity: 0` |
