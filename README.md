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

Photos for seeded listings live in `prisma/seed-photos.json`, keyed by
`"Brand Model"`. Eleven of the sixteen budget listings carry real photos;
the rest fall back to a body-type silhouette from `public/placeholder/`.

Every URL in that file was opened and looked at before being added. An
unverified photo is worse than none — an earlier revision of the seed put a
BMW on the Civic and a stock portrait of a person on the Golf GTI, and search
results for a model name are mostly other cars (a Sonata comes back for
"Hyundai Elantra", a Tacoma for "Toyota Hilux"). Five listings are still empty
because no photo of that car could be found, and a silhouette is the honest
answer there.

To add or replace photos, put URLs in the file and re-seed. Anything left
empty keeps its placeholder. The host must also appear in `next.config.ts`
under `images.remotePatterns`.

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

## Deploying to Vercel

Set these in **Settings → Environment Variables** before the first deploy.
`NEXT_PUBLIC_*` values are inlined at build time, so changing one needs a
redeploy, not just a restart.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | The **pooled** connection string. Every serverless instance opens its own pool; a direct connection exhausts Postgres as soon as a few instances are warm. On Neon this is the host containing `-pooler`. |
| `DIRECT_DATABASE_URL` | when pooling | The **unpooled** string, used only by the Prisma CLI for migrations. Transaction-mode pooling drops the session state Prisma Migrate needs. On Neon it is the same string with `-pooler` removed from the host. |
| `AUTH_SECRET` | yes | Any random 32-byte value. |
| `AUTH_URL` | yes | The deployed origin, e.g. `https://royalcars.jo`. |
| `NEXT_PUBLIC_APP_URL` | yes | Same origin. Wrong values break canonical URLs, the sitemap and share links. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | yes in production | Without them the rate limiter is a no-op and **fails open** — silently, with no error. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for uploads | Dealers can't add photos without them. |
| `NEXT_PUBLIC_CONTACT_*` | optional | Drive the footer; anything unset is not rendered. |

**The build queries the database.** The home page, browse facets and dealer
pages are prerendered, so `DATABASE_URL` must be reachable from Vercel's
build step, not only at runtime. A build against an unreachable database
fails rather than degrading.

**Migrations do not run on deploy.** Vercel runs `next build`, not
`migrate deploy`. Apply them yourself before promoting a deploy, using the
**unpooled** string:

```bash
DIRECT_DATABASE_URL="<unpooled url>" npx prisma migrate deploy
```

`prisma.config.ts` prefers `DIRECT_DATABASE_URL` when it is set, so once both
are in your `.env` the CLI uses the direct endpoint and the application keeps
the pooled one — neither can pick the wrong endpoint by accident.

If the production database predates migrations, run the one-time baseline
first — see **Database migrations** above.

`prisma generate` runs in **both** `postinstall` and the `build` script. That
looks redundant and is not: Vercel reuses a cached `node_modules` between
builds and skips install scripts when it does, which leaves the generated
client missing and the build fails with `Can't resolve
'@/generated/prisma/client'`. Generating again from the build command costs
about 100ms and removes the failure mode. Verified with
`npm ci --ignore-scripts`, which is the worst case: the build still succeeds.

Node is pinned to 22 via `engines`.

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
