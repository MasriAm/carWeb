"use client";

import { useCallback, useMemo, useOptimistic, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { resetPage } from "@/lib/filter-params";

/**
 * Applies filter changes to the URL.
 *
 * The params returned here are optimistic: they carry the change as soon as it
 * is made rather than after the server round trip. Reading committed
 * `useSearchParams()` directly left a tapped chip visually unselected until new
 * results arrived, so on a slow connection every filter looked like a dead
 * button — the change had registered, but nothing on screen said so.
 *
 * `commit` pushes immediately (chips, toggles); `commitDebounced` waits for a
 * pause (text input, slider drags) so dragging a range does not fire a server
 * round trip per pixel.
 */
export function useFilterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const committed = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useOptimistic(committed.toString());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback(
    (params: URLSearchParams) => {
      const next = params.toString();
      startTransition(() => {
        setQuery(next);
        router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
      });
    },
    [pathname, router, setQuery]
  );

  /**
   * Mutate a copy of the pending params, then navigate. Building on the
   * optimistic params rather than the committed ones is what lets two quick
   * taps accumulate instead of the second overwriting the first.
   */
  const apply = useCallback(
    (mutate: (params: URLSearchParams) => void, delay?: number) => {
      const params = new URLSearchParams(query);
      mutate(params);
      resetPage(params);
      if (timer.current) clearTimeout(timer.current);
      if (delay == null) push(params);
      else timer.current = setTimeout(() => push(params), delay);
    },
    [query, push]
  );

  const commit = useCallback(
    (mutate: (params: URLSearchParams) => void) => apply(mutate),
    [apply]
  );

  const commitDebounced = useCallback(
    (mutate: (params: URLSearchParams) => void, delay = 350) =>
      apply(mutate, delay),
    [apply]
  );

  const searchParams = useMemo(() => new URLSearchParams(query), [query]);

  return { searchParams, commit, commitDebounced, isPending };
}
