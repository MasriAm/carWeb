"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { revalidateVehicleData } from "@/lib/cache-tags";
import { actionRateLimit, safeLimit } from "@/lib/rate-limit";
import {
  adminUpdateDealershipSchema,
  cuidSchema,
  resetPasswordSchema,
  updateUserRoleSchema,
} from "@/lib/validations/admin";
import { formatJordanPhone } from "@/lib/format-jordan-phone";
import { PASSWORD_HASH_ROUNDS } from "@/lib/password";
import type { Role } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return session.user;
}

/** Admin check plus a per-admin rate limit, for every state-changing action. */
async function requireAdminMutation() {
  const admin = await requireAdmin();
  const { success } = await safeLimit(actionRateLimit, admin.id);
  if (!success) throw new Error("Rate limit exceeded. Please slow down.");
  return admin;
}

// ─── USERS ─────────────────────────────────────────────────────

export async function getAllUsers() {
  await requireAdmin();
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isSuspended: true,
      createdAt: true,
      phone: true,
      _count: { select: { vehicles: true } },
    },
  });
}

export async function updateUserRole(userId: string, role: Role) {
  const admin = await requireAdminMutation();

  const parsed = updateUserRoleSchema.safeParse({ userId, role });
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  if (admin.id === parsed.data.userId) {
    return { success: false as const, error: "Cannot change your own role" };
  }

  const user = await db.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) return { success: false as const, error: "User not found" };

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });
  revalidatePath("/dashboard/admin/users");
  return { success: true as const };
}

export async function toggleSuspendUser(userId: string) {
  const admin = await requireAdminMutation();

  const parsed = cuidSchema.safeParse(userId);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid user id" };
  }
  if (admin.id === parsed.data) {
    return { success: false as const, error: "Cannot suspend yourself" };
  }

  const user = await db.user.findUnique({ where: { id: parsed.data } });
  if (!user) return { success: false as const, error: "User not found" };

  await db.user.update({
    where: { id: parsed.data },
    data: { isSuspended: !user.isSuspended },
  });

  revalidatePath("/dashboard/admin/users");
  return { success: true as const, suspended: !user.isSuspended };
}

export async function deleteUser(userId: string) {
  const admin = await requireAdminMutation();

  const parsed = cuidSchema.safeParse(userId);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid user id" };
  }
  if (admin.id === parsed.data) {
    return { success: false as const, error: "Cannot delete yourself" };
  }

  const user = await db.user.findUnique({ where: { id: parsed.data } });
  if (!user) return { success: false as const, error: "User not found" };

  await db.user.delete({ where: { id: parsed.data } });
  revalidatePath("/dashboard/admin/users");
  await revalidateVehicleData();
  return { success: true as const };
}

// ─── VEHICLES (ADMIN) ──────────────────────────────────────────

export async function getAllVehiclesAdmin() {
  await requireAdmin();
  return db.vehicle.findMany({
    orderBy: { publicationDate: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      dealership: { select: { name: true } },
    },
  });
}

export async function adminDeleteVehicle(vehicleId: string) {
  await requireAdminMutation();

  const parsed = cuidSchema.safeParse(vehicleId);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid vehicle id" };
  }

  const vehicle = await db.vehicle.findUnique({ where: { id: parsed.data } });
  if (!vehicle) return { success: false as const, error: "Vehicle not found" };

  await db.vehicle.delete({ where: { id: parsed.data } });
  revalidatePath("/dashboard/admin/vehicles");
  await revalidateVehicleData(parsed.data);
  return { success: true as const };
}

export async function adminToggleVehicleStatus(vehicleId: string) {
  await requireAdminMutation();

  const parsed = cuidSchema.safeParse(vehicleId);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid vehicle id" };
  }

  const vehicle = await db.vehicle.findUnique({ where: { id: parsed.data } });
  if (!vehicle) return { success: false as const, error: "Vehicle not found" };

  const newStatus = vehicle.status === "ON_SALE" ? "SOLD" : "ON_SALE";
  await db.vehicle.update({
    where: { id: parsed.data },
    data: { status: newStatus },
  });

  revalidatePath("/dashboard/admin/vehicles");
  await revalidateVehicleData(parsed.data);
  return { success: true as const, status: newStatus };
}

export async function adminTogglePromoted(vehicleId: string) {
  await requireAdminMutation();

  const parsed = cuidSchema.safeParse(vehicleId);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid vehicle id" };
  }

  const vehicle = await db.vehicle.findUnique({ where: { id: parsed.data } });
  if (!vehicle) return { success: false as const, error: "Vehicle not found" };

  await db.vehicle.update({
    where: { id: parsed.data },
    data: { isPromoted: !vehicle.isPromoted },
  });

  revalidatePath("/dashboard/admin/vehicles");
  await revalidateVehicleData(parsed.data);
  return { success: true as const, isPromoted: !vehicle.isPromoted };
}

// ─── DEALERSHIPS (ADMIN) ───────────────────────────────────────

export async function getAllDealerships() {
  await requireAdmin();
  return db.dealership.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { vehicles: true } },
    },
  });
}

export async function adminDeleteDealership(dealershipId: string) {
  await requireAdminMutation();

  const parsed = cuidSchema.safeParse(dealershipId);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid dealership id" };
  }

  const dealership = await db.dealership.findUnique({
    where: { id: parsed.data },
  });
  if (!dealership) {
    return { success: false as const, error: "Dealership not found" };
  }

  await db.dealership.delete({ where: { id: parsed.data } });
  revalidatePath("/dashboard/admin/dealerships");
  await revalidateVehicleData();
  return { success: true as const };
}

export async function adminUpdateDealership(
  dealershipId: string,
  data: {
    name?: string;
    slug?: string;
    phone?: string;
    website?: string;
    address?: string;
    description?: string;
    whatsappNumber?: string;
  }
) {
  await requireAdminMutation();

  const idParsed = cuidSchema.safeParse(dealershipId);
  if (!idParsed.success) {
    return { success: false as const, error: "Invalid dealership id" };
  }

  const parsed = adminUpdateDealershipSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const existing = await db.dealership.findUnique({
    where: { id: idParsed.data },
  });
  if (!existing) return { success: false as const, error: "Dealership not found" };

  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const taken = await db.dealership.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (taken) return { success: false as const, error: "Slug already taken" };
  }

  await db.dealership.update({
    where: { id: idParsed.data },
    data: {
      name: parsed.data.name ?? undefined,
      slug: parsed.data.slug ?? undefined,
      phone: parsed.data.phone ?? undefined,
      website: parsed.data.website ?? undefined,
      address: parsed.data.address ?? undefined,
      description: parsed.data.description ?? undefined,
      whatsappNumber:
        parsed.data.whatsappNumber !== undefined
          ? parsed.data.whatsappNumber
            ? formatJordanPhone(parsed.data.whatsappNumber)
            : null
          : undefined,
    },
  });

  revalidatePath("/dashboard/admin/dealerships");
  await revalidateVehicleData();
  return { success: true as const };
}

export async function adminResetDealerPassword(
  userId: string,
  newPassword: string
) {
  await requireAdminMutation();

  const parsed = resetPasswordSchema.safeParse({ userId, newPassword });
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  const user = await db.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) return { success: false as const, error: "User not found" };

  const { hash } = await import("bcryptjs");
  const hashed = await hash(parsed.data.newPassword, PASSWORD_HASH_ROUNDS);

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { password: hashed },
  });

  revalidatePath("/dashboard/admin/dealerships");
  return { success: true as const };
}

// ─── STATS ─────────────────────────────────────────────────────

export async function getAdminStats() {
  await requireAdmin();
  const [users, vehicles, dealerships, onSale, sold] = await Promise.all([
    db.user.count(),
    db.vehicle.count(),
    db.dealership.count(),
    db.vehicle.count({ where: { status: "ON_SALE" } }),
    db.vehicle.count({ where: { status: "SOLD" } }),
  ]);
  return { users, vehicles, dealerships, onSale, sold };
}
