"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Share control. Uses the Web Share sheet where the browser has one (which is
 * every phone this site is built for), and falls back to copying the link.
 */
export default function ShareButton({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Dismissed, or unavailable — fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked; nothing useful left to try. */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Share this ${title} listing`}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line-control bg-surface text-ink-2 transition-colors hover:bg-surface-2",
        className
      )}
    >
      {copied ? (
        <Check className="h-5 w-5 text-trust" aria-hidden="true" />
      ) : (
        <Share2 className="h-5 w-5" aria-hidden="true" />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}
