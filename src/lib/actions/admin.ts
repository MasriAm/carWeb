"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { Role } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return session.user;
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
  const admin = await requireAdmin();
  if (admin.id === userId) {
    return { success: false as const, error: "Cannot change your own role" };
  }

  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/dashboard/admin/users");
  return { success: true as const };
}

export async function toggleSuspendUser(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) {
    return { success: false as const, error: "Cannot suspend yourself" };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false as const, error: "User not found" };

  await db.user.update({
    where: { id: userId },
    data: { isSuspended: !user.isSuspended },
  });

  revalidatePath("/dashboard/admin/users");
  return { success: true as const, suspended: !user.isSuspended };
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) {
    return { success: false as const, error: "Cannot delete yourself" };
  }

  await db.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/admin/users");
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
  await requireAdmin();
  await db.vehicle.delete({ where: { id: vehicleId } });
  revalidatePath("/dashboard/admin/vehicles");
  revalidatePath("/cars");
  return { success: true as const };
}

export async function adminToggleVehicleStatus(vehicleId: string) {
  await requireAdmin();
  const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return { success: false as const, error: "Vehicle not found" };

  const newStatus = vehicle.status === "ON_SALE" ? "SOLD" : "ON_SALE";
  await db.vehicle.update({
    where: { id: vehicleId },
    data: { status: newStatus },
  });

  revalidatePath("/dashboard/admin/vehicles");
  revalidatePath("/cars");
  return { success: true as const, status: newStatus };
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
  await requireAdmin();
  await db.dealership.delete({ where: { id: dealershipId } });
  revalidatePath("/dashboard/admin/dealerships");
  return { success: true as const };
}

export async function adminUpdateDealership(
  dealershipId: string,
  data: { name?: string; slug?: string; phone?: string; website?: string; address?: string; description?: string; whatsappNumber?: string }
) {
  await requireAdmin();
  const existing = await db.dealership.findUnique({ where: { id: dealershipId } });
  if (!existing) return { success: false as const, error: "Dealership not found" };

  if (data.slug && data.slug !== existing.slug) {
    const taken = await db.dealership.findUnique({ where: { slug: data.slug } });
    if (taken) return { success: false as const, error: "Slug already taken" };
  }

  await db.dealership.update({
    where: { id: dealershipId },
    data: {
      name: data.name ?? undefined,
      slug: data.slug ?? undefined,
      phone: data.phone ?? undefined,
      website: data.website ?? undefined,
      address: data.address ?? undefined,
      description: data.description ?? undefined,
      whatsappNumber: data.whatsappNumber ?? undefined,
    },
  });

  revalidatePath("/dashboard/admin/dealerships");
  return { success: true as const };
}

export async function adminResetDealerPassword(userId: string, newPassword: string) {
  await requireAdmin();
  if (!newPassword || newPassword.length < 6) {
    return { success: false as const, error: "Password must be at least 6 characters" };
  }

  const { hash } = await import("bcryptjs");
  const hashed = await hash(newPassword, 12);

  await db.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  revalidatePath("/dashboard/admin/dealerships");
  return { success: true as const };
}

export async function adminTogglePromoted(vehicleId: string) {
  await requireAdmin();
  const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return { success: false as const, error: "Vehicle not found" };

  await db.vehicle.update({
    where: { id: vehicleId },
    data: { isPromoted: !vehicle.isPromoted },
  });

  revalidatePath("/dashboard/admin/vehicles");
  revalidatePath("/cars");
  return { success: true as const, isPromoted: !vehicle.isPromoted };
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
