"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/actions/upload";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageDropzone({
  images,
  onChange,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const valid: File[] = [];

      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError(`${file.name}: only JPEG, PNG, and WebP allowed.`);
          return;
        }
        if (file.size > MAX_SIZE) {
          setError(`${file.name}: exceeds 5MB limit.`);
          return;
        }
        valid.push(file);
      }

      if (valid.length === 0) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of valid) {
        const form = new FormData();
        form.append("file", file);
        const result = await uploadImage(form);
        if (result.success) {
          newUrls.push(result.url);
        } else {
          setError(result.error);
          break;
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
      setUploading(false);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
          dragOver
            ? "border-amber-500 bg-amber-500/5"
            : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />

        {uploading ? (
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
        ) : (
          <Upload className="h-8 w-8 text-zinc-500 mb-2" />
        )}

        <p className="text-sm text-zinc-400">
          {uploading ? "Uploading..." : "Drop images here or click to browse"}
        </p>
        <p className="text-xs text-zinc-600 mt-1">
          JPEG, PNG, WebP &middot; Max 5MB each
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-700 group">
              <Image
                src={url}
                alt={`Upload ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] uppercase font-bold bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
