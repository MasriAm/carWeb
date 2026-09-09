"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Multi-select chip. Toggles a value inside a comma list in the URL. */
export default function Chip({
  label,
  active,
  count,
  onToggle,
}: {
  label: string;
  active: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-body-sm transition-colors",
        active
          ? "border-brand bg-brand-soft font-semibold text-ink"
          : "border-line-control bg-surface text-ink-2 hover:border-ink-3 hover:text-ink"
      )}
    >
      {active && (
        <Check className="h-3.5 w-3.5 text-brand-strong" aria-hidden="true" />
      )}
      {label}
      {count != null && (
        <span className="text-caption text-ink-3 tabular-nums">{count}</span>
      )}
    </button>
  );
}
