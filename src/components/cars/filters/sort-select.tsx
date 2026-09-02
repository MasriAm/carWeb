"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/validations/vehicle";
import { setOrDelete } from "@/lib/filter-params";
import { useFilterNav } from "./use-filter-nav";

export default function SortSelect() {
  const { searchParams, commit } = useFilterNav();
  const current = searchParams.get("sortBy") ?? "newest";

  return (
    <Select
      value={current}
      onValueChange={(next) =>
        commit((p) => setOrDelete(p, "sortBy", next === "newest" ? null : next))
      }
    >
      <SelectTrigger
        aria-label="Sort results"
        className="h-10 w-full min-w-44 border-line-control bg-surface text-body-sm sm:w-auto"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
