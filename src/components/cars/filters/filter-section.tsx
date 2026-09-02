"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Collapsible filter group.
 *
 * A real button with `aria-expanded` and `aria-controls`, so a screen reader
 * announces the group's state instead of reading a decorative chevron.
 */
export default function FilterSection({
  title,
  children,
  defaultOpen = true,
  count,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-11 w-full items-center justify-between gap-2 py-3 text-body-sm font-semibold text-ink"
        >
          <span className="flex items-center gap-2">
            {title}
            {count ? (
              <span className="rounded-full bg-brand px-1.5 py-0.5 text-caption font-bold leading-none text-brand-ink">
                {count}
              </span>
            ) : null}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-4">
        {children}
      </div>
    </div>
  );
}
