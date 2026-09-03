"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";

/**
 * Click-to-load Instagram reel.
 *
 * The embed was previously rendered eagerly: a 600px third-party iframe with
 * its own scripts on first paint of every detail page that had one. Now
 * nothing from Instagram is requested until the visitor asks for it.
 */
export default function InstagramEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = `${url.replace(/\/$/, "")}/embed`;

  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <h2 className="mb-3 text-body font-semibold text-ink">Video reel</h2>

      {loaded ? (
        <div className="overflow-hidden rounded-control" style={{ maxWidth: 540 }}>
          <iframe
            src={embedSrc}
            title="Instagram reel for this vehicle"
            className="w-full border-0"
            height={600}
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="flex w-full max-w-[540px] items-center gap-3 rounded-control border border-line-control bg-canvas p-4 text-start transition-colors hover:bg-surface-2"
        >
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong"
          >
            <Play className="ms-0.5 h-5 w-5 fill-current" />
          </span>
          <span>
            <span className="block text-body font-medium text-ink">
              Load the Instagram reel
            </span>
            <span className="flex items-center gap-1.5 text-body-sm text-ink-3">
              <InstagramIcon className="h-3.5 w-3.5" />
              Loads content from instagram.com
            </span>
          </span>
        </button>
      )}
    </section>
  );
}
