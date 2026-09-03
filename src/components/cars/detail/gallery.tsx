"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster?: string };

/**
 * Detail gallery.
 *
 * The previous page showed a fixed maximum of five images with no lightbox,
 * no zoom and no way to reach the rest, and ignored `videoUrl` entirely.
 *
 * The strip is a scroll-snap container, so swiping works with no JavaScript
 * at all and every photo is in the initial HTML. The lightbox, the arrows and
 * the click-to-play video are enhancements on top of that.
 */
export default function Gallery({
  images,
  videoUrl,
  title,
}: {
  images: string[];
  videoUrl: string | null;
  title: string;
}) {
  const slides: Slide[] = [
    ...images.map((src) => ({ kind: "image" as const, src })),
    ...(videoUrl
      ? [{ kind: "video" as const, src: videoUrl, poster: images[0] }]
      : []),
  ];

  const stripRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const scrollTo = useCallback((index: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const child = strip.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, []);

  // Track which slide is centred so the counter and thumbnails stay honest
  // when the strip is swiped rather than driven by the arrows.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) setActive(index);
          }
        }
      },
      { root: strip, threshold: 0.6 }
    );
    for (const child of Array.from(strip.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-card border border-line bg-surface-2 text-ink-3">
        No photos for this listing
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <ul
          ref={stripRef}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-card border border-line bg-surface-2"
        >
          {slides.map((slide, i) => (
            <li
              key={`${slide.kind}-${slide.src}`}
              data-index={i}
              className="relative aspect-[16/10] w-full shrink-0 snap-start"
            >
              {slide.kind === "image" ? (
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={`Open photo ${i + 1} of ${images.length} full size`}
                  className="group absolute inset-0 block cursor-zoom-in"
                >
                  <Image
                    src={slide.src}
                    alt={`${title} — photo ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                  <span className="pointer-events-none absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-inverse-ink opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              ) : playing ? (
                <video
                  src={slide.src}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full bg-ink object-contain"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play video of the ${title}`}
                  className="absolute inset-0 block"
                >
                  {slide.poster && (
                    <Image
                      src={slide.poster}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover opacity-70"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/70 text-inverse-ink">
                      <Play className="ms-1 h-7 w-7 fill-current" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollTo(Math.max(0, active - 1))}
              disabled={active === 0}
              aria-label="Previous photo"
              className="absolute start-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card transition-opacity hover:bg-surface disabled:opacity-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(Math.min(slides.length - 1, active + 1))}
              disabled={active === slides.length - 1}
              aria-label="Next photo"
              className="absolute end-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card transition-opacity hover:bg-surface disabled:opacity-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p
              aria-live="polite"
              className="absolute bottom-3 end-3 rounded-full bg-ink/70 px-2.5 py-1 text-caption font-semibold text-inverse-ink tabular-nums"
            >
              {active + 1} / {slides.length}
            </p>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <ul className="scrollbar-none flex gap-2 overflow-x-auto">
          {slides.map((slide, i) => (
            <li key={`thumb-${i}`}>
              <button
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to ${slide.kind === "video" ? "video" : `photo ${i + 1}`}`}
                aria-current={active === i}
                className={cn(
                  "relative block h-16 w-24 shrink-0 overflow-hidden rounded-control border-2 bg-surface-2",
                  active === i ? "border-brand" : "border-transparent"
                )}
              >
                {(slide.kind === "image" ? slide.src : slide.poster) && (
                  <Image
                    src={slide.kind === "image" ? slide.src : slide.poster!}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
                {slide.kind === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/40 text-inverse-ink">
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightbox !== null && (
        <Lightbox
          images={images}
          index={lightbox}
          title={title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

/** Full-screen viewer. Escape and arrow keys work; focus is trapped. */
function Lightbox({
  images,
  index,
  title,
  onClose,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setCurrent((c) => Math.min(images.length - 1, c + 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95"
    >
      <div className="flex items-center justify-between p-4">
        <p className="text-body-sm font-medium text-inverse-ink tabular-nums">
          {current + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full text-inverse-ink hover:bg-inverse-ink/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1">
        <Image
          src={images[current]}
          alt={`${title} — photo ${current + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 p-4">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            aria-label="Previous photo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-inverse-ink/30 text-inverse-ink disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrent((c) => Math.min(images.length - 1, c + 1))
            }
            disabled={current === images.length - 1}
            aria-label="Next photo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-inverse-ink/30 text-inverse-ink disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
