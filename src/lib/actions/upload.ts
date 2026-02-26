"use server";

import { auth } from "@/lib/auth";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(formData: FormData): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file) return { success: false, error: "No file provided" };

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." };
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: "File too large. Maximum size is 5MB." };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { success: false, error: "Cloudinary is not configured. Add your credentials to .env" };
  }

  const secureFilename = crypto.randomUUID();
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = `folder=royal-cars&public_id=${secureFilename}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("signature", signature);
  uploadForm.append("public_id", secureFilename);
  uploadForm.append("folder", "royal-cars");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("Cloudinary upload failed:", body);
      return { success: false, error: "Upload failed. Check Cloudinary credentials." };
    }

    const data = await res.json();
    return { success: true, url: data.secure_url };
  } catch (e) {
    console.error("Upload error:", e);
    return { success: false, error: "Upload failed due to a network error." };
  }
}
