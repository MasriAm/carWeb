---
name: royal-cars-standards
description: Enforces Royal Cars project UI, backend, and animation standards. Use when editing or adding UI, API/server actions, or animations in the royal-cars Next.js app. Applies Luxury Black theme, Prisma for data, Upstash for rate limiting, and Framer Motion with spring physics.
---

# Royal Cars Standards

Apply these rules whenever changing or adding UI, server/API logic, or animations in this project.

## UI — Luxury Black Theme

- **Page/section backgrounds**: `bg-zinc-950`
- **Cards, panels, modals**: `bg-zinc-900` with `border border-zinc-800`
- **Primary accents** (buttons, links, highlights): `text-amber-500`, `bg-amber-500` for CTAs; hover `hover:bg-amber-400` or `hover:text-amber-400`
- **Text**: `text-zinc-100` / `text-white` for headings, `text-zinc-400` / `text-zinc-500` for secondary
- **Inputs & selects**: `bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500`
- **Labels**: `text-zinc-200` or `text-zinc-300`
- **Borders**: `border-zinc-800` or `border-zinc-700`; avoid `border-neutral-*` or `border-gray-*`
- **Shadows**: `shadow-lg shadow-black/20` for depth on dark; accent glow `shadow-amber-500/10` or `shadow-amber-500/20` where appropriate
- **Errors**: `bg-red-500/10 border-red-500/20 text-red-400`; rate-limit/warning: `bg-amber-500/10 border-amber-500/30 text-amber-400`

Do not introduce `bg-white`, `bg-neutral-*`, or `text-black` / `text-neutral-900` in new or updated components.

## Backend

- **Database**: Use Prisma ORM only. All reads/writes go through `db` from `@/lib/db`. No raw SQL or other ORMs unless explicitly required and documented.
- **Rate limiting**: Use Upstash Redis via `@/lib/rate-limit`. Use `authRateLimit` for login/register (IP-based); use `actionRateLimit` for mutation actions (identifier = `session.user.id`). Do not add ad-hoc or in-memory rate limiters.
- **Server actions**: Verify session with `auth()` at the start of any protected action. For vehicle mutations, confirm ownership or ADMIN role against the database before updating/deleting; throw `Error("Unauthorized")` on failure.
- **Validation**: Use Zod schemas from `@/lib/validations/*` for all server action inputs.

## Animations

- **Library**: Framer Motion only (`motion`, `AnimatePresence` from `framer-motion`).
- **Physics**: Prefer spring transitions. Example: `transition={{ type: "spring", stiffness: 500, damping: 30 }}` for layout/shared element; `stiffness: 400, damping: 17` for tactile buttons (`whileTap`).
- **Hover scale on media**: `whileHover={{ scale: 1.05 }}` with `transition={{ duration: 0.4, ease: "easeOut" }}`; parent must have `overflow-hidden`.
- **Lists/grids**: Use `AnimatePresence` with `mode="popLayout"` when items add/remove; give each item `layout` for smooth reflow. Use `initial` / `animate` / `exit` for enter/exit (e.g. opacity + y or scale).
- **Shared layout animation**: Use `layoutId` for sliding pill or shared element (e.g. active filter pill) with the same spring config.

Avoid CSS-only keyframe animations for interactive UI motion; reserve them for subtle effects (e.g. shimmer) if needed.

## Quick reference

| Area        | Use                          | Avoid                    |
|------------|------------------------------|--------------------------|
| Background | `bg-zinc-950`, `bg-zinc-900` | `bg-white`, `bg-neutral-*` |
| Accent     | `amber-500`                  | `blue-*`, `green-*` for primary |
| Data       | Prisma `db.*`                | Raw SQL, other ORMs      |
| Rate limit | `@/lib/rate-limit` (Upstash) | In-memory or custom      |
| Motion     | Framer Motion + spring       | CSS-only complex motion  |
