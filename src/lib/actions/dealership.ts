"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  createDealershipSchema,
  updateDealershipSchema,
  type CreateDealershipInput,
  type UpdateDealershipInput,
} from "@/lib/validations/dealership";
import { formatJordanPhone } from "@/lib/format-jordan-phone";

export async function getMyDealership() {
  const session = await auth();
  if (!session?.user) return null;

  return db.dealership.findUnique({
    where: { userId: session.user.id },
    include: { _count: { select: { vehicles: true } } },
  });
}

export async function createDealership(input: CreateDealershipInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.dealership.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return { success: false as const, error: "You already have a dealership" };
  }

  const parsed = createDealershipSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const slugTaken = await db.dealership.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (slugTaken) {
    return { success: false as const, error: "This slug is already taken" };
  }

  const dealership = await db.dealership.create({
    data: {
      ...parsed.data,
      logoUrl: parsed.data.logoUrl || null,
      description: parsed.data.description || null,
      address: parsed.data.address || null,
      phone: parsed.data.phone || null,
      whatsappNumber: parsed.data.whatsappNumber ? formatJordanPhone(parsed.data.whatsappNumber) : null,
      website: parsed.data.website || null,
      userId: session.user.id,
    },
  });

  if (session.user.role === "USER") {
    await db.user.update({
      where: { id: session.user.id },
      data: { role: "DEALER" },
    });
  }

  revalidatePath("/dashboard");
  return { success: true as const, dealership };
}

export async function updateDealership(input: UpdateDealershipInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.dealership.findUnique({
    where: { userId: session.user.id },
  });
  if (!existing) {
    return { success: false as const, error: "Dealership not found" };
  }

  const parsed = updateDealershipSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugTaken = await db.dealership.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (slugTaken) {
      return { success: false as const, error: "This slug is already taken" };
    }
  }

  const dealership = await db.dealership.update({
    where: { id: existing.id },
    data: {
      ...parsed.data,
      logoUrl: parsed.data.logoUrl ?? undefined,
      description: parsed.data.description ?? undefined,
      address: parsed.data.address ?? undefined,
      phone: parsed.data.phone ?? undefined,
      whatsappNumber: parsed.data.whatsappNumber !== undefined
        ? (parsed.data.whatsappNumber ? formatJordanPhone(parsed.data.whatsappNumber) : null)
        : undefined,
      website: parsed.data.website ?? undefined,
    },
  });

  revalidatePath("/dashboard");
  return { success: true as const, dealership };
}

export async function getMyVehicles() {
  const session = await auth();
  if (!session?.user) return [];

  return db.vehicle.findMany({
    where: { userId: session.user.id },
    orderBy: { publicationDate: "desc" },
    include: {
      dealership: { select: { name: true } },
      _count: { select: { savedBy: true } },
    },
  });
}

export async function getDealerStats() {
  const session = await auth();
  if (!session?.user) return null;

  const [totalListings, onSale, sold, totalSaves] = await Promise.all([
    db.vehicle.count({ where: { userId: session.user.id } }),
    db.vehicle.count({ where: { userId: session.user.id, status: "ON_SALE" } }),
    db.vehicle.count({ where: { userId: session.user.id, status: "SOLD" } }),
    db.savedVehicle.count({
      where: { vehicle: { userId: session.user.id } },
    }),
  ]);

  return { totalListings, onSale, sold, totalSaves };
}
