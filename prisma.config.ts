/**
 * `DATABASE_URL` comes from `.env`, which is gitignored — a fresh clone
 * doesn't have one. Without this check Prisma reports "The datasource.url
 * property is required in your Prisma config file", and `prisma db seed`
 * fails further along with "SASL: client password must be a string", neither
 * of which points at the missing file.
 *
 * Migrations also need a direct connection.
 *
 * A pooled connection string (Neon's `-pooler` host, PgBouncer, the Supabase
 * pooler) runs in transaction mode, which drops the session state Prisma
 * Migrate depends on — advisory locks and `SET` in particular. This file is
 * loaded by the Prisma CLI only; the application builds its own pool from
 * DATABASE_URL in src/lib/db.ts. So the CLI takes DIRECT_DATABASE_URL when it
 * is set and the app keeps the pooled one, and neither can pick the wrong
 * endpoint by accident.
 */

import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `generate` and friends are codegen: they read the schema, write the client
 * and never open a connection. Demanding a URL for those turns a missing env
 * var into a failed `postinstall` — which on a Vercel preview build, or any CI
 * runner where DATABASE_URL is only set for production, fails the deploy within
 * seconds and blames the Prisma config instead of the missing variable.
 *
 * So require it only for the commands that actually connect.
 */
const OFFLINE_COMMANDS = ["generate", "validate", "format", "version"];
const connects = !process.argv
  .slice(2)
  .some((arg) => OFFLINE_COMMANDS.includes(arg));

const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!url && connects) {
  throw new Error(
    "DATABASE_URL is not set.\n\n" +
      "  This project reads it from a .env file, which is gitignored and so is\n" +
      "  never part of a clone. Create one:\n\n" +
      "    cp .env.example .env      (PowerShell: Copy-Item .env.example .env)\n\n" +
      "  then set DATABASE_URL to your PostgreSQL connection string and\n" +
      "  AUTH_SECRET to any random value. See the README."
  );
}

/**
 * `datasource.url` is required by the config schema even when nothing will
 * connect, and prisma/schema.prisma deliberately carries no `url` of its own.
 * This stands in for the offline commands only — anything that connects has
 * thrown above.
 */
const OFFLINE_PLACEHOLDER =
  "postgresql://prisma@127.0.0.1:5432/unused?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: { url: url ?? OFFLINE_PLACEHOLDER },
});
