import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * `DATABASE_URL` comes from `.env`, which is gitignored — a fresh clone
 * doesn't have one. Without this check Prisma reports "The datasource.url
 * property is required in your Prisma config file", and `prisma db seed`
 * fails further along with "SASL: client password must be a string", neither
 * of which points at the missing file.
 */
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL is not set.\n\n" +
      "  This project reads it from a .env file, which is gitignored and so is\n" +
      "  never part of a clone. Create one:\n\n" +
      "    cp .env.example .env      (PowerShell: Copy-Item .env.example .env)\n\n" +
      "  then set DATABASE_URL to your PostgreSQL connection string and\n" +
      "  AUTH_SECRET to any random value. See the README."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: { url },
});
