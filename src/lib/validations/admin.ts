import { z } from "zod";

/**
 * Admin action inputs. These actions are reachable as POST endpoints once
 * bundled, so every argument is validated even though the caller must already
 * hold an ADMIN session.
 */

export const RoleEnum = z.enum(["ADMIN", "DEALER", "USER"]);

export const cuidSchema = z.string().cuid("Invalid id");

export const updateUserRoleSchema = z.object({
  userId: cuidSchema,
  role: RoleEnum,
});

export const adminUpdateDealershipSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .optional(),
  description: z.string().max(2000).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  whatsappNumber: z
    .string()
    .regex(/^[0-9]{7,15}$/, "WhatsApp number: digits only, no + prefix")
    .optional()
    .or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

export const resetPasswordSchema = z.object({
  userId: cuidSchema,
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type AdminUpdateDealershipInput = z.infer<
  typeof adminUpdateDealershipSchema
>;
