"use client";

import { useRef, useState } from "react";
import { AlertCircle, Film, Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ACCEPT_ATTR,
  MAX_UPLOAD_BYTES,
  formatBytes,
  uploadToCloudinary,
} from "@/lib/cloudinary-upload";

/**
 * The listing video field: paste a link or upload a file, both landing in the
 * same named input so the form reads one value either way.
 *
 * A dealer with an MP4 on their phone previously had nowhere to put it. The
 * field accepted a URL only, and the uploader beside it took images — so the
 * documented way to add a video was to upload it to Cloudinary yourself and
 * paste the result back.
 */
export default function VideoField({
  id = "videoUrl",
  name = "videoUrl",
  defaultValue = "",
  inputClassName,
}: {
  id?: string;
  name?: string;
  defaultValue?: string | null;
  inputClassName?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      setUrl(await uploadToCloudinary(file, "video"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      // Let the same file be re-picked after a failure.
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          name={name}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={inputClassName}
        />
        {url && !uploading && (
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove video"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-line-control text-ink-3 transition-colors hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT_ATTR.video}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="inline-flex min-h-9 items-center gap-2 rounded-control border border-line-control bg-surface-2 px-3 text-body-sm text-ink-2 transition-colors hover:text-ink disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload a video
          </>
        )}
      </button>

      <p className="text-caption text-ink-3">
        MP4, WebM or MOV, up to {formatBytes(MAX_UPLOAD_BYTES.video)}. A YouTube
        or Instagram page link will not play here — use the Instagram field for
        reels.
      </p>

      {url && !uploading && (
        <p className="flex items-center gap-1.5 text-caption text-ink-3">
          <Film className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Video attached to this listing.
        </p>
      )}

      {error && (
        <p className="flex items-center gap-2 rounded-lg border border-danger/25 bg-danger-soft px-3 py-2 text-body-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
