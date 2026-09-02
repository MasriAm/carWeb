"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { actionRateLimit, safeLimit } from "@/lib/rate-limit";
import { formatJordanPhone } from "@/lib/format-jordan-phone";
import { updateProfileSchema } from "@/lib/validations/auth";
import {
  deleteSavedSearchSchema,
  saveSearchSchema,
} from "@/lib/validations/account";

/**
 * Account mutations. Same contract as every other action here: session check,
 * ownership check, Zod validation, rate limit.
 */

async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { success } = await safeLimit(actionRateLimit, session.user.id);
  if (!success) throw new Error("Rate limit exceeded. Please slow down.");

  return session.user;
}

/**
 * Update the signed-in user's profile.
 *
 * The profile form previously had no server action at all: it displayed
 * "Saved!" on a two-second timer and discarded the input.
 */
export async function updateProfile(input: {
  name?: string;
  phone?: string;
}) {
  const user = await requireUser();

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name ?? undefined,
      phone:
        parsed.data.phone !== undefined
          ? parsed.data.phone
            ? formatJordanPhone(parsed.data.phone)
            : null
          : undefined,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function saveSearch(input: { name: string; query: string }) {
  const user = await requireUser();

  const parsed = saveSearchSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  // Saving the same filter set twice renames it rather than piling up rows.
  await db.savedSearch.upsert({
    where: {
      userId_query: { userId: user.id, query: parsed.data.query },
    },
    create: {
      userId: user.id,
      name: parsed.data.name,
      query: parsed.data.query,
    },
    update: { name: parsed.data.name },
  });

  revalidatePath("/dashboard/searches");
  return { success: true as const };
}

export async function deleteSavedSearch(id: string) {
  const user = await requireUser();

  const parsed = deleteSavedSearchSchema.safeParse({ id });
  if (!parsed.success) {
    return { success: false as const, error: "Invalid id" };
  }

  const existing = await db.savedSearch.findUnique({
    where: { id: parsed.data.id },
    select: { userId: true },
  });
  if (!existing) return { success: false as const, error: "Search not found" };
  if (existing.userId !== user.id) throw new Error("Unauthorized");

  await db.savedSearch.delete({ where: { id: parsed.data.id } });

  revalidatePath("/dashboard/searches");
  return { success: true as const };
}
