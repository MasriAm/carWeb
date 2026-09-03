"use client";

import { useCallback, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { resetPage } from "@/lib/filter-params";

/**
 * Applies filter changes to the URL.
 *
 * `isPending` is surfaced to callers and actually rendered — the previous
 * implementation computed a pending flag and never used it, so a filter tap
 * on a slow connection looked like the site had frozen.
 *
 * `commit` pushes immediately (chips, toggles); `commitDebounced` waits for a
 * pause (text input, slider drags) so dragging a range does not fire a server
 * round trip per pixel.
 */
export function useFilterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router]
  );

  /** Mutate a copy of the current params, then navigate. */
  const commit = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      resetPage(params);
      if (timer.current) clearTimeout(timer.current);
      push(params);
    },
    [searchParams, push]
  );

  const commitDebounced = useCallback(
    (mutate: (params: URLSearchParams) => void, delay = 350) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      resetPage(params);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => push(params), delay);
    },
    [searchParams, push]
  );

  return { searchParams, commit, commitDebounced, isPending };
}
