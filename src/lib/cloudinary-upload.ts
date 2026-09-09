import { createUploadTicket, type UploadKind } from "@/lib/actions/upload";

/** Client-side ceilings. Cloudinary enforces its own account limits too. */
export const MAX_UPLOAD_BYTES: Record<UploadKind, number> = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
};

export const ACCEPT_ATTR: Record<UploadKind, string> = {
  image: "image/jpeg,image/png,image/webp",
  video: "video/mp4,video/webm,video/quicktime",
};

export function formatBytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

/**
 * Ask the server to sign an upload, then send the file straight to Cloudinary.
 *
 * The file never passes through our own server, so nothing here is bounded by
 * the Server Actions body limit. `connect-src` in the CSP already allows
 * api.cloudinary.com.
 */
export async function uploadToCloudinary(
  file: File,
  kind: UploadKind
): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES[kind]) {
    throw new Error(
      `${file.name} is larger than ${formatBytes(MAX_UPLOAD_BYTES[kind])}.`
    );
  }

  const result = await createUploadTicket(kind);
  if (!result.success) throw new Error(result.error);

  const form = new FormData();
  form.append("file", file);
  for (const [key, value] of Object.entries(result.ticket.fields)) {
    form.append(key, value);
  }

  const res = await fetch(result.ticket.uploadUrl, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    // Cloudinary explains refusals (wrong format, over quota) in the body.
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error?.message ?? "Cloudinary rejected the file.");
  }

  const data = await res.json();
  if (typeof data.secure_url !== "string") {
    throw new Error("Upload finished but returned no URL.");
  }
  return data.secure_url;
}
