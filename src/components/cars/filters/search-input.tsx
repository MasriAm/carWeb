"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { setOrDelete } from "@/lib/filter-params";
import { useFilterNav } from "./use-filter-nav";

/**
 * Keyword search.
 *
 * The site previously had no search box at all: someone looking for
 * "Prado 2019" had no way to type it. Debounced so a slow connection is not
 * asked for a round trip per keystroke, and wrapped in a form so pressing
 * Enter searches immediately.
 */
export default function SearchInput({
  className,
  placeholder = "Search make, model or keyword",
  autoFocus = false,
}: {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const { searchParams, commit, commitDebounced, isPending } = useFilterNav();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);

  // Follow the URL when it changes from elsewhere (a cleared chip, the back
  // button) without clobbering what the visitor is currently typing. Adjusting
  // state during render is React's documented alternative to a sync effect.
  if (lastUrlQuery !== urlQuery) {
    setLastUrlQuery(urlQuery);
    setValue(urlQuery);
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        commit((p) => setOrDelete(p, "q", value.trim()));
      }}
      className={className}
    >
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
        />
        <input
          type="search"
          name="q"
          value={value}
          autoFocus={autoFocus}
          aria-label="Search cars"
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            commitDebounced((p) => setOrDelete(p, "q", e.target.value.trim()));
          }}
          className="h-11 w-full rounded-control border border-line-control bg-surface ps-9 pe-9 text-body-sm text-ink placeholder:text-ink-3"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              commit((p) => setOrDelete(p, "q", null));
            }}
            className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <span aria-live="polite" className="sr-only">
        {isPending ? "Updating results" : ""}
      </span>
    </form>
  );
}
