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
import { formatJordanPhone } from "@/lib/format-jordan-phone";
import { actionRateLimit, safeLimit } from "@/lib/rate-limit";

/** Minimal vehicle shape for marketplace grid cards (reduces RSC payload). */
const marketplaceListSelect = {
  id: true,
  status: true,
  videoUrl: true,
  imageUrls: true,
  brand: true,
  model: true,
  price: true,
  shortDescription: true,
  condition: true,
  bodyType: true,
  transmission: true,
  engineCapacityCC: true,
  fuelType: true,
  mileageKm: true,
  productionYear: true,
  isPromoted: true,
  waredWakaleh: true,
  specificWhatsapp: true,
  dealership: {
    select: {
      name: true,
      slug: true,
      whatsappNumber: true,
      phone: true,
    },
  },
  user: {
    select: {
      name: true,
      phone: true,
    },
  },
} satisfies Prisma.VehicleSelect;

export type MarketplaceListVehicle = Prisma.VehicleGetPayload<{
  select: typeof marketplaceListSelect;
}>;

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
  if (filters.status) where.status = filters.status;

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  if (filters.year) {
    where.productionYear = filters.year;
  } else if (filters.minYear || filters.maxYear) {
    where.productionYear = {};
    if (filters.minYear) (where.productionYear as Prisma.IntFilter).gte = filters.minYear;
    if (filters.maxYear) (where.productionYear as Prisma.IntFilter).lte = filters.maxYear;
  }

  // createdAt_desc: Vehicle has no createdAt; use publicationDate desc (listing chronology).
  const sortBy = filters.sortBy ?? "createdAt_desc";
  const secondarySort: Prisma.VehicleOrderByWithRelationInput =
    sortBy === "price_asc"
      ? { price: "asc" }
      : sortBy === "price_desc"
        ? { price: "desc" }
        : sortBy === "year_desc"
          ? { productionYear: "desc" }
          : sortBy === "oldest"
            ? { publicationDate: "asc" }
            : { publicationDate: "desc" };

  const orderBy: Prisma.VehicleOrderByWithRelationInput[] = [
    { isPromoted: "desc" },
    secondarySort,
  ];

  const limit = filters.limit ?? 12;
  const page = filters.page ?? 1;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    db.vehicle.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: marketplaceListSelect,
    }),
    db.vehicle.count({ where }),
  ]);

  return { vehicles, total, page, totalPages: Math.ceil(total / limit) };
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
      specificWhatsapp: data.specificWhatsapp ? formatJordanPhone(data.specificWhatsapp) : null,
      fa7s: data.fa7s || null,
      waredWakaleh: data.waredWakaleh ?? false,
      userId: session.user.id,
      detailedSpecs: data.detailedSpecs ?? [],
    },
  });

  revalidatePath("/cars");
  revalidatePath(`/cars/${vehicle.id}`);
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
      specificWhatsapp: parsed.data.specificWhatsapp !== undefined
        ? (parsed.data.specificWhatsapp ? formatJordanPhone(parsed.data.specificWhatsapp) : null)
        : undefined,
      fa7s: parsed.data.fa7s ?? undefined,
      detailedSpecs: parsed.data.detailedSpecs ?? undefined,
    },
  });

  revalidatePath("/cars");
  revalidatePath(`/cars/${id}`);
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
  revalidatePath(`/cars/${id}`);
  return { success: true as const };
}

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
