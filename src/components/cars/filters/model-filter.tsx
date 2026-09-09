"use client";

import { readList, toggleInList } from "@/lib/filter-params";
import Chip from "./filter-chip";
import FilterSection from "./filter-section";
import { useFilterNav } from "./use-filter-nav";

/**
 * Model chips for whichever brands are currently selected.
 *
 * This is the only part of the sidebar that depends on the request, so it
 * renders in its own streamed slot. The rest of the panel is identical for
 * every visitor and ships in the prerendered shell instead of being rebuilt
 * and re-sent on each filter change.
 */
export default function ModelFilter({
  models,
}: {
  models: { model: string; count: number }[];
}) {
  const { searchParams, commit } = useFilterNav();
  const selected = readList(searchParams, "model");

  if (models.length === 0) return null;

  return (
    <FilterSection title="Model" count={selected.length}>
      <div className="scrollbar-thin flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
        {models.map((m) => (
          <Chip
            key={m.model}
            label={m.model}
            count={m.count}
            active={selected.includes(m.model)}
            onToggle={() => commit((p) => toggleInList(p, "model", m.model))}
          />
        ))}
      </div>
    </FilterSection>
  );
}
