"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  createVehicleSchema,
  updateVehicleSchema,
  type CreateVehicleInput,
  type UpdateVehicleInput,
} from "@/lib/validations/vehicle";
import { revalidatePath } from "next/cache";
import { revalidateVehicleData } from "@/lib/cache-tags";
import { formatJordanPhone } from "@/lib/format-jordan-phone";
import { actionRateLimit, safeLimit } from "@/lib/rate-limit";

/**
 * Vehicle mutations.
 *
 * Reads live in `src/lib/data/vehicles.ts`. They are deliberately not in this
 * file: everything exported from a `"use server"` module becomes a callable
 * POST endpoint, and a read function has no reason to be one.
 */

export async function createVehicle(input: CreateVehicleInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { success } = await safeLimit(actionRateLimit, session.user.id);
  if (!success) throw new Error("Rate limit exceeded. Please slow down.");

  const parsed = createVehicleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  const vehicle = await db.vehicle.create({
    data: {
      ...data,
      videoUrl: data.videoUrl || null,
      instagramVideoUrl: data.instagramVideoUrl || null,
      specificWhatsapp: data.specificWhatsapp
        ? formatJordanPhone(data.specificWhatsapp)
        : null,
      fa7s: data.fa7s || null,
      waredWakaleh: data.waredWakaleh ?? false,
      specOrigin: data.specOrigin ?? null,
      userId: session.user.id,
      detailedSpecs: data.detailedSpecs ?? [],
    },
  });

  revalidatePath("/cars");
  await revalidateVehicleData(vehicle.id);
  return { success: true as const, vehicle };
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { success } = await safeLimit(actionRateLimit, session.user.id);
  if (!success) throw new Error("Rate limit exceeded. Please slow down.");

  const existing = await db.vehicle.findUnique({ where: { id } });
  if (!existing) return { success: false as const, error: "Vehicle not found" };

  if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = updateVehicleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const vehicle = await db.vehicle.update({
    where: { id },
    data: {
      ...parsed.data,
      videoUrl: parsed.data.videoUrl ?? undefined,
      instagramVideoUrl: parsed.data.instagramVideoUrl ?? undefined,
      specificWhatsapp:
        parsed.data.specificWhatsapp !== undefined
          ? parsed.data.specificWhatsapp
            ? formatJordanPhone(parsed.data.specificWhatsapp)
            : null
          : undefined,
      fa7s: parsed.data.fa7s ?? undefined,
      detailedSpecs: parsed.data.detailedSpecs ?? undefined,
    },
  });

  revalidatePath("/cars");
  revalidatePath(`/cars/${id}`);
  await revalidateVehicleData(id);
  return { success: true as const, vehicle };
}

export async function deleteVehicle(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { success } = await safeLimit(actionRateLimit, session.user.id);
  if (!success) throw new Error("Rate limit exceeded. Please slow down.");

  const existing = await db.vehicle.findUnique({ where: { id } });
  if (!existing) return { success: false as const, error: "Vehicle not found" };

  if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.vehicle.delete({ where: { id } });
  revalidatePath("/cars");
  await revalidateVehicleData(id);
  return { success: true as const };
}

export async function toggleSaveVehicle(vehicleId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { success } = await safeLimit(actionRateLimit, session.user.id);
  if (!success) throw new Error("Rate limit exceeded. Please slow down.");

  // A stale id from a cached page would otherwise surface as a raw
  // foreign-key error from Postgres.
  const vehicle = await db.vehicle.findUnique({
    where: { id: vehicleId },
    select: { id: true },
  });
  if (!vehicle) throw new Error("Vehicle not found");

  const existing = await db.savedVehicle.findUnique({
    where: { userId_vehicleId: { userId: session.user.id, vehicleId } },
  });

  if (existing) {
    await db.savedVehicle.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await db.savedVehicle.create({
    data: { userId: session.user.id, vehicleId },
  });
  return { saved: true };
}
