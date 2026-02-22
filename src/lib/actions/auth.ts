"use server";

import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export type AuthResult = {
  success: boolean;
  error?: string;
};

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Invalid email or password" };
      }
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function registerAction(formData: FormData): Promise<AuthResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    phone: formData.get("phone") || "",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, password, phone } = parsed.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: "USER",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: true };
  }
}
