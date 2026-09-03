import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Prints what is actually in the database this project is pointed at.
 *
 * Exists because "no cars on the page" has several possible causes — an
 * unseeded database, a stale cache, or the wrong DATABASE_URL — and they
 * are indistinguishable from the browser.
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({ adapter }) as InstanceType<typeof PrismaClient>;

async function main() {
  const url = process.env.DATABASE_URL ?? "(DATABASE_URL is not set)";
  // Never print the password.
  console.log("\nDatabase:", url.replace(/:\/\/[^@]*@/, "://***@"));
  console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "set" : "NOT SET — login will fail");

  const [vehicles, onSale, users, dealerships] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "ON_SALE" } }),
    prisma.user.count(),
    prisma.dealership.count(),
  ]);

  console.log("\n  Vehicles:     ", vehicles, vehicles === 0 ? "  <-- nothing to show; run: npx prisma migrate reset" : "");
  console.log("  On sale:      ", onSale);
  console.log("  Users:        ", users, users === 0 ? "  <-- no accounts; login cannot work" : "");
  console.log("  Dealerships:  ", dealerships);

  if (users > 0) {
    const accounts = await prisma.user.findMany({ select: { email: true, role: true } });
    console.log("\n  Accounts:");
    for (const a of accounts) console.log(`    ${a.email}  (${a.role})`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error("\nCould not read the database:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
