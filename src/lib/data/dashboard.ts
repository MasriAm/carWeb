import "server-only";

import { cache } from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/data/session";
import { listSelect } from "@/lib/data/vehicles";

/**
 * Dashboard reads.
 *
 * These were exported from `"use server"` files, where every export is
 * reachable as an anonymous POST endpoint — the admin counts included. They
 * depend on the caller's session, so like everything in `data/session.ts`
 * they are deduplicated within a render and never cached across requests.
 */

export const getDealerOverview = cache(async () => {
  const user = await getSessionUser();
  if (!user) return null;

  const [totalListings, onSale, sold, totalSaves, recent] = await Promise.all([
    db.vehicle.count({ where: { userId: user.id } }),
    db.vehicle.count({ where: { userId: user.id, status: "ON_SALE" } }),
    db.vehicle.count({ where: { userId: user.id, status: "SOLD" } }),
    db.savedVehicle.count({ where: { vehicle: { userId: user.id } } }),
    db.vehicle.findMany({
      where: { userId: user.id },
      orderBy: { publicationDate: "desc" },
      take: 5,
      select: { ...listSelect, _count: { select: { savedBy: true } } },
    }),
  ]);

  return { totalListings, onSale, sold, totalSaves, recent };
});

export const getAdminOverview = cache(async () => {
  const user = await getSessionUser();
  if (user?.role !== "ADMIN") return null;

  const [users, vehicles, dealerships, onSale, sold, recent] =
    await Promise.all([
      db.user.count(),
      db.vehicle.count(),
      db.dealership.count(),
      db.vehicle.count({ where: { status: "ON_SALE" } }),
      db.vehicle.count({ where: { status: "SOLD" } }),
      db.vehicle.findMany({
        orderBy: { publicationDate: "desc" },
        take: 5,
        select: { ...listSelect, user: { select: { name: true } } },
      }),
    ]);

  return { users, vehicles, dealerships, onSale, sold, recent };
});
