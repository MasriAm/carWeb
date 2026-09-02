import "server-only";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listSelect as SAVED_VEHICLE_SELECT } from "@/lib/data/vehicles";

/**
 * Session-scoped reads. These depend on the request's cookies, so they are
 * never cached across requests — only deduplicated within one render pass
 * with React `cache()`.
 *
 * Keeping them here, rather than in the root layout, is what lets the
 * marketing pages and the listing shell prerender: only the component that
 * actually needs a session becomes dynamic.
 */

export const getSessionUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

export const getSavedVehicleIds = cache(async (): Promise<string[]> => {
  const user = await getSessionUser();
  if (!user) return [];

  const saved = await db.savedVehicle.findMany({
    where: { userId: user.id },
    select: { vehicleId: true },
  });
  return saved.map((s) => s.vehicleId);
});

export const isVehicleSaved = cache(async (vehicleId: string) => {
  const user = await getSessionUser();
  if (!user) return false;

  const row = await db.savedVehicle.findUnique({
    where: { userId_vehicleId: { userId: user.id, vehicleId } },
    select: { id: true },
  });
  return Boolean(row);
});

/** Saved cars for the current user, in the card's list shape. */
export const getSavedVehicles = cache(async () => {
  const user = await getSessionUser();
  if (!user) return [];

  const rows = await db.savedVehicle.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      vehicleId: true,
      vehicle: { select: SAVED_VEHICLE_SELECT },
    },
  });

  return rows;
});
