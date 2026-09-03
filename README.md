# Royal Cars

A car marketplace for the Jordanian market. Next.js 16 (App Router), React 19,
TypeScript, Tailwind v4, shadcn/ui on Radix, Prisma 7 + PostgreSQL, NextAuth v5,
Upstash Redis rate limiting, Cloudinary uploads.

## Getting started

```bash
npm install                 # also generates the Prisma client
cp .env.example .env        # then fill in DATABASE_URL and AUTH_SECRET
npx prisma migrate deploy   # creates the schema
npm run db:seed             # sample inventory — without it the site is empty
npm run dev
```

`DATABASE_URL` must point at **PostgreSQL**. The search column is a Postgres
generated `tsvector` and the fuzzy matching needs `pg_trgm`; neither exists in
MySQL.

Use `migrate deploy`, not `migrate dev`. `migrate dev` re-diffs the whole
schema and emits an `ALTER COLUMN` for the generated `searchVector` column
that Postgres rejects — see **Database migrations** below.

The seed is not optional in practice. It clears the database and recreates
it, so never run it against data you care about, but without it every listing
section on the home page correctly renders nothing and the site looks broken.

Seeded accounts all use the password `Password123!`:
`admin@royalcars.jo`, `dealer@ammanluxury.jo`, `rami@wadisaqramotors.jo`,
`sara@gmail.com`.

### Listing photos

Seeded listings show a body-type silhouette from `public/placeholder/`, not a
photograph. Stock photos cannot be verified from an environment with no image
egress, and an unverified photo is worse than none — an earlier revision of the
seed put a BMW on the Civic and a stock portrait of a person on the Golf GTI.

To give a listing real photos, put URLs in `prisma/seed-photos.json` keyed by
`"Brand Model"` and re-seed. Anything left empty keeps its placeholder. The
host must also appear in `next.config.ts` under `images.remotePatterns`.

In production photos come from sellers through Cloudinary; none of this
applies there.

If a page shows no cars, check the database rather than the browser:

```bash
npm run db:check            # row counts, accounts, and whether AUTH_SECRET is set
```

Reads are cached until a mutation invalidates them, so seeding *while the app
is running* leaves the old empty result in place. Delete `.next` and restart
after seeding by hand.

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
| `npm run db:check` | Print row counts and accounts for the current `DATABASE_URL` |
