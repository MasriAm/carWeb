"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleFilterSchema,
  type VehicleFilterInput,
  type CreateVehicleInput,
  type UpdateVehicleInput,
} from "@/lib/validations/vehicle";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";

// ─── READ ──────────────────────────────────────────────────────

export async function getVehicles(rawFilters: Partial<VehicleFilterInput> = {}) {
  const parsed = vehicleFilterSchema.safeParse(rawFilters);
  const filters = parsed.success ? parsed.data : ({} as VehicleFilterInput);

  const where: Prisma.VehicleWhereInput = {};

  if (filters.brand) where.brand = filters.brand;
  if (filters.model) where.model = { contains: filters.model, mode: "insensitive" };
  if (filters.condition) where.condition = filters.condition;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.transmission) where.transmission = filters.transmission;
  if (filters.fuelType) where.fuelType = filters.fuelType;
  if (filters.originSpec) where.originSpec = filters.originSpec;
  if (filters.status) where.status = filters.status;

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  if (filters.minYear || filters.maxYear) {
    where.productionYear = {};
    if (filters.minYear) where.productionYear.gte = filters.minYear;
    if (filters.maxYear) where.productionYear.lte = filters.maxYear;
  }

  const orderBy: Prisma.VehicleOrderByWithRelationInput =
    filters.sortBy === "price_asc"
      ? { price: "asc" }
      : filters.sortBy === "price_desc"
        ? { price: "desc" }
        : filters.sortBy === "year_desc"
          ? { productionYear: "desc" }
          : filters.sortBy === "year_asc"
            ? { productionYear: "asc" }
            : { publicationDate: "desc" };

  const limit = filters.limit ?? 12;
  const page = filters.page ?? 1;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    db.vehicle.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        dealership: { select: { name: true, slug: true } },
        user: { select: { name: true } },
      },
    }),
    db.vehicle.count({ where }),
  ]);

  return {
    vehicles,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getVehicleById(id: string) {
  return db.vehicle.findUnique({
    where: { id },
    include: {
      dealership: true,
      user: { select: { name: true, phone: true, image: true } },
    },
  });
}

export async function getDistinctBrands() {
  const result = await db.vehicle.findMany({
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });
  return result.map((r) => r.brand);
}

export async function getModelsByBrand(brand: string) {
  const result = await db.vehicle.findMany({
    where: { brand },
    select: { model: true },
    distinct: ["model"],
    orderBy: { model: "asc" },
  });
  return result.map((r) => r.model);
}

// ─── WRITE ─────────────────────────────────────────────────────

export async function createVehicle(input: CreateVehicleInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createVehicleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  if (data.videoUrl) {
    data.imageUrls = data.imageUrls;
  }

  const vehicle = await db.vehicle.create({
    data: {
      ...data,
      videoUrl: data.videoUrl || null,
      userId: session.user.id,
      detailedSpecs: data.detailedSpecs ?? [],
    },
  });

  revalidatePath("/cars");
  return { success: true as const, vehicle };
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.vehicle.findUnique({ where: { id } });
  if (!existing) return { success: false as const, error: "Vehicle not found" };

  if (
    existing.userId !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    return { success: false as const, error: "You can only edit your own vehicles" };
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
      detailedSpecs: parsed.data.detailedSpecs ?? undefined,
    },
  });

  revalidatePath("/cars");
  return { success: true as const, vehicle };
}

export async function deleteVehicle(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.vehicle.findUnique({ where: { id } });
  if (!existing) return { success: false as const, error: "Vehicle not found" };

  if (
    existing.userId !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    return { success: false as const, error: "You can only delete your own vehicles" };
  }

  await db.vehicle.delete({ where: { id } });
  revalidatePath("/cars");
  return { success: true as const };
}

// ─── FAVORITES ─────────────────────────────────────────────────

export async function toggleSaveVehicle(vehicleId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

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

export async function getSavedVehicleIds() {
  const session = await auth();
  if (!session?.user) return [];

  const saved = await db.savedVehicle.findMany({
    where: { userId: session.user.id },
    select: { vehicleId: true },
  });
  return saved.map((s) => s.vehicleId);
}
