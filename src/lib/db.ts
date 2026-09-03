import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Connection pool sizing.
 *
 * Every serverless instance opens its own pool, so an unbounded `max` will
 * exhaust Postgres connections as soon as more than a handful of instances are
 * warm. Keep `max` small and point DATABASE_URL at a pooler (PgBouncer, Neon,
 * Supabase pooler) in production — see README.
 */
const POOL_MAX = Number(process.env.DATABASE_POOL_MAX ?? 5);

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number.isFinite(POOL_MAX) && POOL_MAX > 0 ? POOL_MAX : 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  const adapter = new PrismaPg(pool);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PrismaClient as any)({ adapter }) as PrismaClient;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
