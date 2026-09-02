# Royal Cars

A car marketplace for the Jordanian market. Next.js 16 (App Router), React 19,
TypeScript, Tailwind v4, shadcn/ui on Radix, Prisma 7 + PostgreSQL, NextAuth v5,
Upstash Redis rate limiting, Cloudinary uploads.

## Getting started

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL and AUTH_SECRET
npx prisma migrate dev      # creates the schema
npm run db:seed             # optional sample data
npm run dev
```

Seeded accounts all use the password `Password123!`:
`admin@royalcars.jo`, `dealer@ammanluxury.jo`, `sara@gmail.com`.

## Database migrations

Migrations live in `prisma/migrations`. `0_init` is a **baseline** generated
from the schema that was previously applied with `prisma db push`.

If your database already has the schema (any environment created before
migrations existed), tell Prisma the baseline is already applied **once**,
before the first `migrate deploy`:

```bash
npx prisma migrate resolve --applied 0_init
```

Skipping this makes `migrate deploy` try to create tables that already exist
and fail. A brand-new database needs nothing special: `migrate deploy` runs
`0_init` and everything after it in order.

Never use `prisma db push` against an environment that matters — it applies
schema changes without recording them, which is what made the baseline
necessary in the first place.

## Architecture notes

- **Reads** live in `src/lib/data/*` and are marked `server-only`. They are
  cached with `unstable_cache` and invalidated by tag. They are *not* server
  actions, so they are never exposed as POST endpoints.
- **Writes** live in `src/lib/actions/*` as `"use server"` actions. Every one of
  them verifies the session, verifies ownership or role, validates input with a
  Zod schema from `src/lib/validations/*`, and passes through the Upstash rate
  limiter in `src/lib/rate-limit.ts`.
- **Cache invalidation** goes through `revalidateVehicleData()` in
  `src/lib/cache-tags.ts`. Any mutation that changes what a listing page would
  show must call it.
- **Design tokens** are defined in `src/app/globals.css`. Components use
  semantic classes (`bg-surface`, `text-muted`, `text-accent`), never literal
  palette values. See `.cursor/skills/royal-cars-standards/SKILL.md`.
- **Request-level auth** is handled by `src/proxy.ts` (the Next 16 replacement
  for `middleware.ts`).

## Environment

See `.env.example`. Notable optional values:

| Variable | Effect when unset |
| --- | --- |
| `UPSTASH_REDIS_REST_*` | Rate limiting is a no-op (fails open) |
| `NEXT_PUBLIC_CONTACT_*` | That contact method is not rendered anywhere |
| `CLOUDINARY_*` | Image upload returns a configuration error |
| `DATABASE_POOL_MAX` | Defaults to 5 connections per instance |

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (must exit clean) |
| `npm run db:migrate` | Create and apply a migration in development |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:seed` | Load sample data |
| `npm run db:studio` | Prisma Studio |
