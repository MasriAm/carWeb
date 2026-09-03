"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The hero's search entry point.
 *
 * A plain form that navigates to /cars with the query, so it works before
 * hydration and a submitted search is a shareable URL like any other filter
 * state.
 */
export default function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      action="/cars"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/cars?q=${encodeURIComponent(q)}` : "/cars");
      }}
      className={cn("flex flex-col gap-2 sm:flex-row", className)}
    >
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3"
        />
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search for a car"
          placeholder="Try “Prado 2019” or “Elantra”"
          className="h-13 w-full rounded-control border border-transparent bg-surface ps-11 pe-4 text-body text-ink shadow-lift placeholder:text-ink-3"
        />
      </div>
      <Button type="submit" size="lg" className="h-13 px-7 text-body font-semibold">
        Search
      </Button>
    </form>
  );
}
