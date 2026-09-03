"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { formatPriceJOD } from "@/lib/vehicle-format";

const STORAGE_KEY = "royal-cars:recently-viewed";
const MAX = 6;

export type RecentVehicle = {
  id: string;
  title: string;
  price: number;
};

const EMPTY: RecentVehicle[] = [];

/** Called from a detail page to record a visit. */
export function recordRecentlyViewed(vehicle: RecentVehicle) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing: RecentVehicle[] = raw ? JSON.parse(raw) : [];
    const next = [vehicle, ...existing.filter((v) => v.id !== vehicle.id)].slice(
      0,
      MAX
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Same-tab listeners do not receive the `storage` event.
    window.dispatchEvent(new Event(STORAGE_KEY));
  } catch {
    /* Private mode or blocked storage: browsing history is a convenience. */
  }
}

/* localStorage is an external store, so it is read through
   useSyncExternalStore rather than an effect. The snapshot is memoised
   against the raw string because getSnapshot must return a stable
   reference between changes. */
let cache: { raw: string | null; value: RecentVehicle[] } = {
  raw: null,
  value: EMPTY,
};

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORAGE_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORAGE_KEY, onChange);
  };
}

function getSnapshot(): RecentVehicle[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cache.raw) {
    let value: RecentVehicle[] = EMPTY;
    try {
      value = raw ? JSON.parse(raw) : EMPTY;
    } catch {
      value = EMPTY;
    }
    cache = { raw, value: Array.isArray(value) ? value : EMPTY };
  }
  return cache.value;
}

function getServerSnapshot(): RecentVehicle[] {
  return EMPTY;
}

/**
 * Cars this visitor has already opened.
 *
 * Renders nothing at all until there is something to show, so a first-time
 * visitor never sees an empty shelf. Stored per browser only — the site does
 * not need an account to remember what someone looked at.
 */
export default function RecentlyViewed() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-5 flex items-center gap-2 font-display text-h2 text-ink">
        <History className="h-5 w-5 text-ink-3" aria-hidden="true" />
        Recently viewed
      </h2>
      <ul className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <Link
              href={`/cars/${item.id}`}
              className="flex min-h-11 flex-col justify-center rounded-card border border-line bg-surface px-4 py-2.5 transition-colors hover:border-line-control"
            >
              <span className="text-body-sm font-medium text-ink">
                {item.title}
              </span>
              <span className="text-caption text-ink-3 tabular-nums">
                {formatPriceJOD(item.price)} JOD
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
