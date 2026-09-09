"use server";

import crypto from "crypto";
import { auth } from "@/lib/auth";
import { actionRateLimit, safeLimit } from "@/lib/rate-limit";

export type UploadKind = "image" | "video";

export type UploadTicket = {
  /** Cloudinary endpoint for this resource type. */
  uploadUrl: string;
  /** Signed form fields to send alongside the file. */
  fields: Record<string, string>;
};

export type UploadTicketResult =
  | { success: true; ticket: UploadTicket }
  | { success: false; error: string };

const ALLOWED_FORMATS: Record<UploadKind, string> = {
  image: "jpg,jpeg,png,webp",
  video: "mp4,webm,mov",
};

const FOLDER = "royal-cars";

/**
 * Hand the browser a short-lived signature so it can post the file straight to
 * Cloudinary.
 *
 * The file used to travel through a server action, which capped every upload
 * at the Server Actions body limit — 1MB unless configured otherwise. A photo
 * straight off a phone clears that on its own and no video comes close, so
 * uploads failed with a body-size error that surfaced to the dealer as a bare
 * "upload failed". Going direct also keeps a 100MB video out of the
 * serverless function's memory and request-size ceiling entirely.
 *
 * The signature authorises one upload of one resource type into one folder
 * under a public_id we choose, so it cannot be replayed to overwrite an
 * existing asset. Format is constrained in the signed parameters, so the
 * browser cannot widen it.
 */
export async function createUploadTicket(
  kind: UploadKind
): Promise<UploadTicketResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  // Uploads cost money at the Cloudinary end, so they are limited like any
  // other mutation.
  const { success: withinLimit } = await safeLimit(
    actionRateLimit,
    session.user.id
  );
  if (!withinLimit) {
    return { success: false, error: "Too many uploads. Please slow down." };
  }

  if (kind !== "image" && kind !== "video") {
    return { success: false, error: "Unsupported upload type." };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      success: false,
      error: "Cloudinary is not configured. Add your credentials to .env",
    };
  }

  const signed: Record<string, string> = {
    allowed_formats: ALLOWED_FORMATS[kind],
    folder: FOLDER,
    public_id: crypto.randomUUID(),
    timestamp: String(Math.floor(Date.now() / 1000)),
  };

  // Cloudinary signs the parameters sorted by key, joined as a query string,
  // with the API secret appended.
  const toSign = Object.keys(signed)
    .sort()
    .map((key) => `${key}=${signed[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return {
    success: true,
    ticket: {
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${kind}/upload`,
      fields: { ...signed, api_key: apiKey, signature },
    },
  };
}
